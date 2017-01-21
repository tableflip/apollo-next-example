const config = Object.assign({},
  require('./default')
)

module.exports = {
  apiUrl: `http://${config.HOST}:${config.PORT}/graphql`,
  wsUrl: `ws://${config.HOST}:${config.WS_PORT}`
}
