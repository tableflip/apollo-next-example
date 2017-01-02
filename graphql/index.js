const { makeExecutableSchema } = require('graphql-tools')
const Schema = require('./schema')
const Resolvers = require('./resolvers')

module.exports = (db) => makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers(db)
})
