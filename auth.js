const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const config = require('config')
const getRaw = require('./lib/get-raw')

module.exports = function (db) {
  const checkPassword = function validateUser (request, username, password, cb) {
    db.collections.users.findOne({ username }).exec()
      .then((user) => {
        if (!user) {
          return cb(null, false)
        }

        bcrypt.compare(password, user.get('password'), (err, isValid) => {
          cb(err, isValid, { _id: user.rawData._id, username: user.get('username') })
        })
      })
      .catch(() => cb(null, false))
  }

  const verifyUser = function (request, reply) {
    const jwt = request.headers.authorization
    if (!jwt) return reply.continue()
    JWT.verify(jwt, config.JWT_KEY, (_, decoded) => {
      const userId = decoded && decoded.user && decoded.user._id
      if (!userId) return reply.continue()
      db.collections.users.findOne({ _id: userId }).exec()
        .then((user) => {
          request.user = getRaw(user)
          reply.continue()
        })
        .catch((err) => {
          console.error(err)
          reply.continue()
        })
    })
  }

  const makeToken = function (user) {
    const jwt = JWT.sign({ user, exp: Date.now() / 1000 + 1000 }, config.JWT_KEY)
    return jwt
  }

  return {
    checkPassword,
    verifyUser,
    makeToken
  }
}
