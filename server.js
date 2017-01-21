const hapi = require('hapi')
const { graphqlHapi, graphiqlHapi } = require('graphql-server-hapi')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { subscriptionManagerFactory } = require('./graphql/subscriptions')
const { createServer } = require('http')
const config = require('config')

require('./db')
  .then((db) => {
    const schema = require('./graphql')(db)
    const subscriptionManager = subscriptionManagerFactory({ schema, db })
    const auth = require('./auth')(db)

    const server = new hapi.Server()

    server.connection({
      host: config.HOST,
      port: config.PORT,
      routes: { cors: true, cache: false }
    })

    server.register({
      register: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: (req) => {
          return {
            schema,
            context: req.user
          }
        },
        route: {
          cors: true
        }
      }
    })

    server.register({
      register: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql'
        }
      }
    })

    server.ext({
      type: 'onRequest',
      method: auth.verifyUser
    })

    server.register({
      register: require('good'),
      options: {
        reporters: {
          console: [{ module: 'good-console' }, 'stdout']
        }
      }
    })

    server.start((err) => {
      if (err) throw err

      console.log(`Apollo Server running at ${config.HOST}:${config.PORT}`)
    })

    // WebSocket server for subscriptions
    const websocketServer = createServer((request, response) => {
      response.writeHead(404)
      response.end()
    })

    websocketServer.listen(config.WS_PORT, () => console.log(`Apollo Websocket Server running at ${config.HOST}:${config.WS_PORT}`))

    websocketServer.subscriptionService = new SubscriptionServer({
      subscriptionManager,
      // the obSubscribe function is called for every new subscription
      // and we use it to set the GraphQL context for this subscription.
      onSubscribe: (msg, params) => {
        return Object.assign({}, params, {
          context: {
            foo: 'bar'
          }
        })
      }
    }, websocketServer)
  })
