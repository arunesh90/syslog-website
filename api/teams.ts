import { Router } from "express"
import userSession from "../types/session"
import { getRepository, In } from "typeorm"
import applicationTeam from "../entities/applicationTeam"
import applicationTeamSchema from '../schemas/applicationTeam'
import applicationUser from '../entities/applicationUser'

const router = Router()

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
  const teamRepo                  = getRepository(applicationTeam)

  // Fetch all teams that user is a part of
  const teams = await teamRepo.find({
    where: {
      memberIds: In([user!.id])
    }
  })

  res.send(teams)
})

router.param('teamId', async (req, res, next, teamId) => {
  const user: userSession['user'] = req.user
  const teamRepo                  = getRepository(applicationTeam)

  const team = await teamRepo.findOne(teamId)

  if (!team) {
    return res.status(404).send({
      code   : 404,
      message: 'Unknown team'
    })
  }

  if (team.memberIds.includes(user!.id)) {
    return next()
  }

  return res.status(403).send({
    code   : 403,
    message: 'You have no access to this team'
  })
})

router.post('/create', async (req, res) => {
  const user: userSession['user'] = req.user
  const { body } = req

  try {
    await applicationTeamSchema.validate(body)
  } catch (error) {
    return res.status(400).send({
      code   : 400,
      message: error.message
    })
  }

  const newTeam           = new applicationTeam()
        newTeam.name      = body.name
        newTeam.ownerId   = user!.id
        newTeam.memberIds = [user!.id]

  if (body.memberIds) {
    const userRepo = getRepository(applicationUser)

    for (const memberId of body.memberIds) {
      const user = await userRepo.findOne(memberId)

      if (!user) {
        return res.status(400).send({
          code: 400,
          message:  `"memberIds" included a unknown user ID, "${memberId}"`
        })
      }
    }

    newTeam.memberIds = [...new Set(newTeam.memberIds.concat(body.memberIds))]
  }

  await newTeam.save()

  return res.send(newTeam)
})

export default router
