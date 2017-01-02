const authFactory = require('../auth')

module.exports = (db) => {
  const auth = authFactory(db)

  return {
    Query: {
      players (_, { id }) {
        if (id) return db.get('players').filter({ id }).value()
        return db.get('players').value()
      },

      teams (_, { id }) {
        if (id) return db.get('teams').filter({ id }).value()
        return db.get('teams').value()
      },

      getUser (_, __, user) {
        return user || {}
      }
    },

    Mutation: {
      updatePlayer (_, data, ctx) {
        const id = data.id
        const player = db.get('players').find({ id }).value()
        if (!player) throw new Error(`Cannot find player with id ${id}`)
        db.get('players').find({ id }).assign(data).value()
        return player
      },

      updateTeam (_, data, ctx) {
        const id = data.id
        const team = db.get('teams').find({ id }).value()
        if (!team) throw new Error(`Cannot find team with id ${id}`)
        db.get('teams').find({ id }).assign(data).value()
        return team
      },

      requestToken (_, data, ctx) {
        return new Promise((resolve, reject) => {
          auth.checkPassword({}, data.username, data.password, (err, isValid, user) => {
            if (err) return reject(err)
            if (!isValid) return reject(new Error('Invalid username/password'))

            resolve(auth.makeToken(user))
          })
        })
      }
    },

    Team: {
      players (team) {
        return db.get('players').filter((player) => player.team === team.id).value()
      }
    },

    Player: {
      team (player) {
        return db.get('teams').find((team) => team.id === player.team).value()
      }
    }
  }
}
