const { PubSub, SubscriptionManager } = require('graphql-subscriptions')

const pubsub = new PubSub()

const subscriptionManagerFactory = ({ schema, db }) => new SubscriptionManager({
  schema,
  pubsub,
  // setupFunctions maps from subscription name to a map of channel names and their filter functions
  setupFunctions: {
    playerUpdated: (options, { _id }) => {
      let teamId
      db.collections.players.findOne({ _id }).$.subscribe((players) => {
        const player = players && players[0]
        let newTeamId
        if (player) {
          pubsub.publish('playerUpdated', player.rawData)
          newTeamId = player.get('team')
          if (teamId !== newTeamId) {
            pubsub.publish('teamUpdated', { _id: newTeamId })
            pubsub.publish('teamUpdated', { _id: teamId })
            teamId = newTeamId
          }
        }
      })
      return {
        playerUpdated: {
          filter: player => player._id === _id
        }
      }
    },
    teamUpdated: (options, { _id }) => {
      return {
        teamUpdated: {
          filter: (team) => team._id === _id
        }
      }
    }
  }
})

module.exports = {
  pubsub,
  subscriptionManagerFactory
}
