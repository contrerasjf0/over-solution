'use strict'

const Hapi = require('hapi')
const handlerbars = require('./lib/helpers')
const inert = require('inert')
const good = require('@hapi/good');
const methods = require('./lib/methods')
const path = require('path')
const routes = require('./routes')
const site = require('./controllers/site')
const vision = require('vision')


const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)
    await server.register(vision)
    await server.register({
      plugin: good,
      options: {
        reporters: {
          console: [
              {
                  module: '@hapi/good-console'
              },
              'stdout'
          ]
      }
      }
  })


    server.method('setAnswerRight', methods.setAnswerRight)


    server.state('user', {
      ttl: 1000 * 60 * 60 * 24 * 7,
      isSecure: process.env.NODE_ENV === 'prod',
      encoding: 'base64json'
    })

    server.views({
      engines: {
        hbs: handlerbars
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.ext('onPreResponse', site.fileNotFound)
    server.route(routes)

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  server.log('info',`Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  server.error('unhandledRejection', 'UnhandledRejection', error)
})

process.on('unhandledException', error => {
  server.error('unhandledException','unhandledException', error)
})

init()

