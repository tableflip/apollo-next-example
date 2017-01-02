const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const config = require('config')

module.exports = function (db) {
  const checkPassword = function validateUser (request, username, password, cb) {
    const user = db.get('users').find({ username }).value()
    if (!user) {
      return cb(null, false)
    }

    if (password !== user.password) return cb(null, false)
    cb(null, true, { id: user.id, name: user.name })
    // bcrypt.compare(password, user.password, (err, isValid) => {
    //   cb(err, isValid, { id: user.id, name: user.name })
    // })
  }

  const verifyUser = function (request, reply) {
    const jwt = request.headers.authorization
    if (!jwt) return reply.continue()
    JWT.verify(jwt, config.JWT_KEY, (_, decoded) => {
      request.user = decoded && decoded.user && db.get('users').find({ id: decoded.user.id }).pick(['id', 'username']).value()
      reply.continue()
    })
  }

  const makeToken = function (user) {
    const jwt = JWT.sign({ user, exp: Date.now() / 1000 + 1000 }, config.JWT_KEY)
    db.get('jwts').push(jwt)
    return jwt
  }

  return {
    checkPassword,
    verifyUser,
    makeToken
  }
}
