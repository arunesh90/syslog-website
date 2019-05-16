/// <reference path="../types/express.d.ts" />

import { Router } from 'express'
import applicationEntity from '../entities/application'
import { In, getRepository } from 'typeorm'
import userSession from '../types/session'
import applicationTeam from '../entities/applicationTeam'
import loadDirScripts from '../utils/loadDirScripts'
import { WebsocketRequestHandler } from 'express-ws'
import esClient from '../database/elasticsearch'
import { getById } from './utils/applicationCache'
import { searchResult } from '../types/elasticsearch'
import { Search } from '@elastic/elasticsearch/api/requestParams'

const router            = Router()
const applicationRoutes = loadDirScripts<Router | WebsocketRequestHandler>(__dirname, './applications')

router.use('*', (req, res, next) => {
  if (!req.user) {
    return res.status(403).send({
      code: 403,
      message: 'Not logged in'
    })
  }

  next()
})

router.get('/list', async (req, res) => {
  const user: userSession['user'] = req.user
  const applicationRepo           = getRepository(applicationEntity)
  const teamRepo                  = getRepository(applicationTeam)

  let applications: applicationEntity[] = []

  // Fetch all applications owned by user
  const personalApplications = await applicationRepo.find({
    ownerId: user!.id
  })
  applications = applications.concat(personalApplications)
  
  // Fetch all teams that user is a part of
  const teams = await teamRepo.find({
    where: {
      memberIds: In([user!.id])
    }
  })

  // Fetch all applications that the teams own
  await Promise.all(teams.map((team) => {
    return new Promise(async (resolve) => {
      const teamApplications = await applicationRepo.find({
        teamId: team.id
      })
      applications = applications.concat(teamApplications)
      resolve()
    })
  }))

  return res.send(applications.map((application) => {
    return {
      id       : application.id,
      name     : application.name,
      teamId   : application.teamId,
      ownerId  : application.ownerId,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    }
  }))
})

router.param('applicationId', async (req, res, next, applicationId) => {
  const user: userSession['user'] = req.user

  // Fetch application
  const application = await getById(applicationId)

  if (!application) {
    console.timeEnd('applicationParam')
    return res.status(404).send({
      code   : 404,
      message: 'Unknown application'
    })
  }

  // Check if user is owner of the application
  const { ownerId, teamId } = application
  if (ownerId === user!.id) {
    req.application = application
    return next()
  }
  
  const teamRepo = getRepository(applicationTeam)

  // Check if user in the application team
  if (application.teamId) {
    const team = await teamRepo.findOne(teamId)
    
    if (team && team.memberIds.includes(user!.id)) {
      req.application = application
      return next()
    }
  }

  // Return with 403 if user failed checks
  res.status(403).send({
    code   : 403,
    message: 'You have no access to this application'
  })
})

router.get('/:applicationId', (req, res) => {
  const application = req.application!

  res.send({
    id       : application.id,
    name     : application.name,
    teamId   : application.teamId,
    ownerId  : application.ownerId,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt
  })
})

router.get('/:applicationId/logs/search', async (req, res) => {
  const application   = req.application!
  const searchContent = req.query.content

  if (!searchContent) {
    return res.status(400).send({
      code   : 400,
      message: 'Missing "content" parameter'
    })
  }

  const esResult = await esClient.search({
    index: `syslog-${application.id}`,
    sort : 'time:desc',
    size : 50,
    body : {
      query: {
        match: {
          message: {
            query               : decodeURI(searchContent),
            minimum_should_match: '75%'
          }
        }
      }
    } 
  })

  res.send((esResult.body as searchResult).hits.hits.map(result => {
    let message = result._source
    message._id = result._id

    return message
  }))
})

router.get('/:applicationId/logs/recent', async (req, res) => {
  const application = req.application!

  const esResult = await esClient.search({
    index: `syslog-${application.id}`,
    sort : 'time:desc',
    size : 50
  })

  res.send((esResult.body as searchResult).hits.hits.map(result => {
    let message = result._source
    message._id = result._id

    return message
  }))
})

router.get('/:applicationId/logs/history', async (req, res) => {
  const application   = req.application!
  const searchContent = req.query.content
  const { before }    = req.query

  if (!before) {
    return res.status(400).send({
      code   : 400,
      message: 'Missing "before" parameter'
    })
  }

  let query: Search['body'] = {
    bool: {
      filter: {
        range: {
          id: {
            lt: before
          }
        }
      }
    }
  }

  if (searchContent) {
    query.bool.must = {
      match: {
        message: {
          query               : searchContent,
          minimum_should_match: '80%'
        }
      }
    }
  }

  const esResult = await esClient.search({
    index: `syslog-${application.id}`,
    sort : 'time:desc',
    size : 50,
    body : {
      query: query
    }
  })

  res.send((esResult.body as searchResult).hits.hits.map(result => {
    let log = result._source
    log._id = result._id

    return log
  }))
})

router.ws('/:applicationId/trail', applicationRoutes.trail as WebsocketRequestHandler)

export default router
