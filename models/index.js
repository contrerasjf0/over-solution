'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require('../config/over-solution-9ee46-firebase-adminsdk-a3z9h-393a017876.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://over-solution-9ee46.firebaseio.com'
})

const db = firebase.database()

const Users = require('./users')

module.exports = {
  users: new Users(db)
}
