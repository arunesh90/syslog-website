import 'source-map-support/register'
import 'dotenv/config'
// import APM from 'elastic-apm-node'
import { hostname, env } from './utils/constants'
console.log(`Starting in ${env} mode`)

// Add Elastic APM
// APM.start({
//   serviceName: `syslog-website-${env}`,
//   serverUrl  : process.env.APM_HOST
// })

import express from 'express'
import expressWs from 'express-ws'
import expressSession from 'express-session'
import connectRedis from 'connect-redis'
import passport from 'passport'
import { readdirSync, readFileSync } from 'fs'
import sqlConnect from './database/mysql'
import next from 'next'
import chalk from 'chalk'
import { createServer as createSecureServer, Server } from 'https'
import loadDirScripts from './utils/loadDirScripts'
import cookieParser from './utils/cookieParser'
import bodyParser from 'body-parser'

export const server = express()
export const nextApp = next({
  dev: process.env.DEVELOPMENT ? true : false,
  dir: './client'
})

// Setup session store
const RedisStore = connectRedis(expressSession)
export const sessionStore = new RedisStore({
  host: process.env.REDIS_HOST,
  port: 6379,
  logErrors: console.error
})

// Create HTTPS server in advance for WSS support
const directoryList = readdirSync('.')
let httpsServer: Server
if (directoryList.includes('ssl') && process.env.HTTPS_ENABLED) {
  const httpsOptions = {
    key : readFileSync('./ssl/private.key', 'utf8'),
    cert: readFileSync('./ssl/public.crt', 'utf8')
  }

  // Create HTTPS server
  httpsServer = createSecureServer(httpsOptions, server)
}

// Setup websockets
expressWs(server, httpsServer!, {
  wsOptions: {
    verifyClient: (info, cb) => {
      const { cookie } = info.req.headers
      if (!cookie) {
        return cb(false, 403, 'Not logged in')
      }

      const parsedCookies = cookieParser(cookie)
      let   sessionId     = parsedCookies['connect.sid']
      if (!sessionId) {
        return cb(false, 403, 'Not logged in')
      }

      // Parse session ID
      sessionId = sessionId.substring(2).split('.')[0]

      sessionStore.get(sessionId, (err: Error, session) => {
        if (err) {
          console.error('An issue has occured while trying to get a session', err)
          return cb(false, 500, 'Failed trying to get session info')
        } if (!session) {
          return cb(false, 403, 'Not logged in')
        }

        cb(true)
      })
    }
  }
})

const nextHandler = nextApp.getRequestHandler()
nextApp.prepare().then(() => {
  // Connect to database
  sqlConnect().then(() => {
    console.log('Successfully connected to DB')

    server.use(expressSession({
      secret           : process.env.COOKIE_SECRET as string,
      proxy            : true,
      store            : sessionStore,
      saveUninitialized: false,
      resave           : false,
      cookie           : {
        secure: true
      }
    }))
    server.use(passport.initialize()) 
    server.use(passport.session())
    server.use(bodyParser.json())
    
    const routes = loadDirScripts<express.Router>(__dirname, './routes')
    
    // Dev routes
    server.get('/sessionInfo', routes.getSessionInfo)
    
    // Main routes
    server.use('/auth', routes.auth)
    server.use('/api', routes.api)

    // Next.JS routes
    server.get('/app/*', (req, res, next) => {
      if (!req.user) {
        return res.redirect('/')
      }

      next()
    })
    server.get('/app/application/:id/logs', (req, res) => {
      nextApp.render(req, res, '/app/logs', {id: req.params.id})
    })
    server.get('*', (req, res) => {
      nextHandler(req, res)
    })

    // Create HTTP server
    const httpPort = process.env.HTTP_PORT || 80
    server.listen(httpPort, () => {
      console.log(chalk.greenBright(`> Ready on http://${hostname}:${httpPort}`))
    })

    // Listen on HTTPS server if available
    if (httpsServer) {
      const httpsPort = process.env.HTTPS_PORT || 443

      httpsServer.listen(httpsPort, () => {
        console.log(chalk.greenBright(`> Ready on https://${hostname}:${httpsPort}`))
      })
    }
  }).catch(err => console.error('Unable to connect to DB', err))
}).catch(console.error)
