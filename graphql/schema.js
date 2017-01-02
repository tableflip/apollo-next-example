module.exports = `
  type Player {
    id: Int!,
    team: Team,
    firstName: String
    lastName: String
    avatar: String
  }

  type Team {
    id: Int!
    name: String
    players: [Player]
  }

  type User {
    id: Int!
    username: String
  }

  type Query {
    players(id: Int): [Player]
    teams(id: Int): [Team]
    getUser: User
  }

  type Mutation {
    updatePlayer (
      id: Int!
      firstName: String
      lastName: String
      team: Int
    ): Player

    updateTeam (
      id: Int!
      name: String
    ): Team

    requestToken (
      username: String!
      password: String!
    ): String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
