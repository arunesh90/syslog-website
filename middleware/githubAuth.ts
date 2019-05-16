import { Strategy } from 'passport-github' 
import { protocol, hostname } from '../utils/constants'
import { getConnection } from 'typeorm'
import applicationUser from '../entities/applicationUser'

const middleware = new Strategy({
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  callbackURL: `${protocol}${hostname}/auth/github/callback`
}, async (_, __, profile, cb) => {
  const sqlConn  = getConnection()
  const userRepo = sqlConn.getRepository(applicationUser)

  let user = await userRepo.findOne({githubId: profile.id})

  // Create user if it isn't available
  if (!user) {
    user = new applicationUser()

    user.githubId       = profile.id
    user.githubUsername = profile.username!
    await user.save()
    console.log(`Created new user for ${profile.username}`)
  }

  return cb(false, Object.assign(user, {profile}))
})

export default middleware
