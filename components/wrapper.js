import fetch from 'isomorphic-fetch'
import React from 'react'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import Head from 'next/head'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Client as WSClient } from 'subscriptions-transport-ws'
import { middleware as reduxPack } from 'redux-pack'
import jwtDecode from 'jwt-decode'
import config from '../config/public'
import * as reducers from '../redux/reducers'
import Layout from '../pages/layout'
import { setUser } from '../redux/actions'
import addGraphQLSubscriptions from './add-gql-subscriptions'

Error.stackTraceLimit = 100

const noop = (state = null) => state

function initialise (props) {
  let client, wsClient, store

  const networkInterface = createNetworkInterface({ uri: config.apiUrl, credentials: 'same-origin' })

  networkInterface.use([{
    applyMiddleware (req, next) {
      if (typeof window === 'undefined') return next()

      const jwt = window.localStorage.getItem('jwt')
      if (!jwt) return next()

      const decoded = jwtDecode(jwt)
      if (!decoded || !decoded.exp || decoded.exp < Date.now() / 1000) {
        window.localStorage.removeItem('jwt')
        window.localStorage.removeItem('user')
        return next()
      }

      if (!req.options.headers) {
        req.options.headers = {}
      }
      req.options.headers['authorization'] = jwt
      next()
    }
  }])

  if (typeof window !== 'undefined') {
    if (!window.wsClient) {
      window.wsClient = new WSClient(config.wsUrl)
    }
    wsClient = window.wsClient
    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient)

    if (!window.client) {
      window.client = new ApolloClient({
        networkInterface: networkInterfaceWithSubscriptions,
        initialState: window.__APOLLO_STATE__
      })
    }
    client = window.client

    if (!window.store) {
      window.store = createStore(
        combineReducers(
          Object.assign(
            reducers,
            {
              apollo: client.reducer()
            }
          )
        ),
        {}, // initial state
        compose(
          applyMiddleware(reduxPack),
          window.devToolsExtension ? window.devToolsExtension() : f => f
        )
      )
    }
    store = window.store
  } else {
    client = new ApolloClient({
      ssrMode: true,
      networkInterface
    })
    store = createStore(
      combineReducers(
        Object.assign(
          reducers,
          {
            client: noop,
            apollo: client.reducer()
          }
        )
      )
    )
  }

  client.initStore()
  return { client, store }
}

export default (Component, injector) => {
  const { client, store } = initialise()

  return class Extended extends Component {
    constructor (props) {
      super(props, { client, store })
      this.client = client
      this.store = store
    }

    static getInitialProps (params) {
      Object.assign(params, { client })
      return super.getInitialProps ? super.getInitialProps(params) : {}
    }

    componentDidMount () {
      const user = window.localStorage.getItem('user')
      user && store.dispatch(setUser(JSON.parse(user)))
    }

    render () {
      const WrappedComponent = injector ? injector(Component) : Component
      return (
        <ApolloProvider store={this.store} client={this.client}>
          <div>
            <Head>
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <link rel='stylesheet' type='text/css' href='/static/styles.css' />
              <link rel='stylesheet' type='text/css' href='/static/tachyons/tachyons.min.css' />
              <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet' />
            </Head>
            <Layout>
              <WrappedComponent {...this.props} />
            </Layout>
          </div>
        </ApolloProvider>
      )
    }
  }
}
