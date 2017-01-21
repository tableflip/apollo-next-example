const authFactory = require('../auth')
const getRaw = require('../lib/get-raw')
const { pubsub } = require('./subscriptions')

module.exports = (db) => {
  const auth = authFactory(db)

  return {
    Query: {
      players (_, { _id }) {
        if (_id) return db.collections.players.find({ _id }).exec().then(getRaw)
        return db.collections.players.find().exec().then(getRaw)
      },

      teams (_, { _id }) {
        if (_id) return db.collections.teams.find({ _id }).exec().then(getRaw)
        return db.collections.teams.find().exec().then(getRaw)
      },

      getUser (_, __, user) {
        return user || {}
      }
    },

    Mutation: {
      updatePlayer (_, data, user) {
        if (!user) throw new Error('Only a logged in user can update a player')
        const _id = data._id
        return db.collections.players.findOne({ _id }).exec()
          .then((player) => {
            if (!player) throw new Error(`Cannot find player with _id ${_id}`)
            Object.keys(data).forEach((key) => {
              if (key === '_id') return
              player.set(key, data[key])
            })
            return player.save().then(() => player.rawData)
          })
      },

      updateTeam (_, data, user) {
        const _id = data._id
        db.collections.teams.findOne({ _id }).exec()
          .then((team) => {
            if (!team) throw new Error(`Cannot find team with _id ${_id}`)
            Object.keys(data).forEach((key) => {
              if (key === '_id') return
              team.set(key, data[key])
            })
            return team.save().then(() => team.rawData)
          })
      },

      requestToken (_, data, ctx) {
        return new Promise((resolve, reject) => {
          auth.checkPassword({}, data.username, data.password, (err, isValid, user) => {
            if (err) return reject(err)
            if (!isValid) return reject(new Error('Invalid username/password'))

            resolve(auth.makeToken(user))
          })
        })
      },

      dumpCollection (_, { collection }, ctx) {
        const dbCollection = db.collections[collection]
        if (!dbCollection) return false
        return dbCollection.dump()
          .then((json) => {
            console.dir(json)
            return true
          })
      }
    },

    Team: {
      players (team) {
        return db.collections.players.find({ team: team._id }).exec().then(getRaw)
      }
    },

    Player: {
      team (player) {
        return db.collections.teams.findOne({ _id: player.team }).exec().then(getRaw)
      }
    },

    Subscription: {
      playerUpdated ({ _id }) {
        return db.collections.players.find({ _id }).exec().then(getRaw).then((players) => players[0])
      },
      teamUpdated ({ _id }) {
        return db.collections.teams.find({ _id }).exec().then(getRaw).then((teams) => teams[0])
      }
    }
  }
}
