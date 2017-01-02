const low = require('lowdb')
const bcrypt = require('bcrypt')
const faker = require('faker')
const JWT = require('jsonwebtoken')
const moment = require('moment')
const config = require('config')
const db = low('_db.json', { storage: require('lowdb/lib/file-sync') })

db.defaults({ players: [], teams: [] })
  .value()

if (!db.get('teams').size().value()) {
  db.set('teams', [])
  Array(5).fill(0).forEach((_, i) => {
    const team = {
      id: i,
      name: `${faker.address.city()} ${faker.name.jobDescriptor()}`
    }
    db.get('teams').push(team).value()
  })
}

if (!db.get('players').size().value()) {
  const teams = db.get('teams').value()
  db.set('players', [])
  Array(50).fill(0).forEach((_, i) => {
    const player = {
      id: i,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      team: db._.sample(teams).id
    }
    db.get('players').push(player).value()
  })
}

if (!db.get('users').size().value()) {
  const user = {
    id: 1,
    username: 'hello'
  }
  const jwt = {
    token: JWT.sign(user, config.JWT_KEY),
    expires: moment().add(1, 'weeks')
  }
  const password = 'hello'

  db.set('users', [])
  db.set('jwts', [])

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return console.error(err)
    user.password = hash

    db.get('users').push(user).value()
    db.get('jwts').push(jwt)
  })
}

module.exports = db
