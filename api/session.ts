import { Router } from 'express'
import userSession, { githubUser } from '../types/session'

const router = Router()

router.get('/info', (req, res) => {
  const user: userSession['user'] = req.user

  let body: userSession = {  
    isAuthenticated: false,
    user           : null
  }

  if (user) {
    const github = user.profile['_json'] as githubUser
    body.isAuthenticated = true

    body.user = {
      id            : user.id,
      githubId      : user.githubId,
      githubUsername: user.githubUsername,
      profile       : user.profile,
      github: {
        login     : github.login,
        id        : github.id,
        avatar_url: github.avatar_url,
        name      : github.name,
        location  : github.location,
        email     : github.email
      }
    }
  }

  res.send(body)
})


export default router
