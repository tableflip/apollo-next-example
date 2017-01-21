const bcrypt = require('bcrypt')
const RxDB = require('rxdb')
const faker = require('faker')
const getRaw = require('./lib/get-raw')
const fs = require('fs-extra')

function sample (arr) {
  const len = arr.length
  return arr[Math.floor(Math.random() * len)]
}

const teamSchema = {
  title: 'team schema',
  description: 'describes a team',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  required: ['name']
}

const playerSchema = {
  title: 'player schema',
  description: 'describes a player',
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    team: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    }
  },
  required: ['firstName', 'lastName']
}

const userSchema = {
  title: 'user schema',
  desciption: 'describes a user',
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['username', 'password']
}

let db
let teamList
RxDB.plugin(require('pouchdb-adapter-leveldb'))

fs.mkdirsSync('./.db')
const dbPromise = RxDB.create('.db/nextTest', 'leveldb')
  .then((_db) => {
    db = _db
    return db.collection('teams', teamSchema)
  })
  .then((teams) => {
    return teams.find().exec().then((teamsArray) => {
      if (teamsArray && teamsArray.length) return Promise.resolve(teamsArray)
      const teamsInsert = Array(10).fill(0).map((_, i) => {
        const team = {
          name: `${faker.address.city()} ${faker.name.jobDescriptor()}`
        }
        return teams.insert(team)
      })
      return Promise.all(teamsInsert)
    })
  })
  .then((_teamList) => {
    teamList = getRaw(_teamList)
    return db.collection('players', playerSchema)
  })
  .then((players) => {
    return players.find().exec().then((playersArray) => {
      if (playersArray && playersArray.length) return Promise.resolve(playersArray)
      const playersInsert = Array(120).fill(0).map((_, i) => {
        return players.insert({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          avatar: faker.image.avatar(),
          team: sample(teamList)._id
        })
      })
      return Promise.all(playersInsert)
    })
  })
  .then(() => {
    return db.collection('users', userSchema)
  })
  .then((users) => {
    return users.findOne().exec().then((user) => {
      if (user) return Promise.resolve()
      return bcrypt.hash('password', 10)
        .then((hash) => {
          users.insert({
            username: 'richsilv',
            password: hash
          })
        })
    })
  })
  .then(() => db)

module.exports = dbPromise
