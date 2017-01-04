const RxDB = require('rxdb')
// const jsondown = require('jsondown')
const memdown = require('memdown')
const faker = require('faker')
const getRaw = require('./lib/get-raw')

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
const dbPromise = RxDB.create('nextTest', memdown)
  .then((_db) => {
    db = _db
    return db.collection('teams', teamSchema)
  })
  .then((teams) => {
    const teamsInsert = Array(5).fill(0).map((_, i) => {
      const team = {
        name: `${faker.address.city()} ${faker.name.jobDescriptor()}`
      }
      return teams.insert(team)
    })
    return Promise.all(teamsInsert)
  })
  .then((_teamList) => {
    teamList = getRaw(_teamList)
    return db.collection('players', playerSchema)
  })
  .then((players) => {
    const playersInsert = Array(50).fill(0).map((_, i) => {
      return players.insert({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatar: faker.image.avatar(),
        team: sample(teamList)._id
      })
    })
    return Promise.all(playersInsert)
  })
  .then(() => {
    return db.collection('users', userSchema)
  })
  .then((users) => {
    return users.insert({
      username: 'richsilv',
      password: 'password'
    })
  })
  .then(() => db)

module.exports = dbPromise
