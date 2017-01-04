const hapi = require('hapi')
const { graphqlHapi, graphiqlHapi } = require('graphql-server-hapi')
const config = require('config')

require('./db2')
  .then((db) => {
    const schema = require('./graphql')(db)
    const auth = require('./auth')(db)

    const server = new hapi.Server()

    server.connection({
      host: config.HOST,
      port: config.PORT,
      routes: { cors: true }
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

      console.log(`Server running at ${config.HOST}:${config.PORT}`)
    })
  })
