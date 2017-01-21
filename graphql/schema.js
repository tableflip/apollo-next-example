module.exports = `
  type Player {
    _id: String!,
    team: Team,
    firstName: String
    lastName: String
    avatar: String
  }

  type Team {
    _id: String!
    name: String
    players: [Player]
  }

  type User {
    _id: String!
    username: String
  }

  type Query {
    players(_id: String): [Player]
    teams(_id: String): [Team]
    getUser: User
  }

  type Mutation {
    updatePlayer (
      _id: String!
      firstName: String
      lastName: String
      team: String
    ): Player

    updateTeam (
      _id: String!
      name: String
    ): Team

    requestToken (
      username: String!
      password: String!
    ): String

    dumpCollection (
      collection: String!
    ): Boolean
  }

  type Subscription {
    playerUpdated(_id: String!): Player
    teamUpdated(_id: String!): Team
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`
