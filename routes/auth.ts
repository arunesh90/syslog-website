import { Router } from "express"
import passport = require("passport")
import githubStrategy from '../middleware/githubAuth'

const router = Router()

// Load Github strategy
passport.use(githubStrategy)

// (De)serialize users
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

router.use(['/github', '/github/callback'], passport.authenticate('github', {
  failureRedirect: '/github'
}), (_, res) => {

  // TODO: Check if here if state has a link that the user wants to be sent to after auth
  return res.redirect('/app/dashboard')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

export default router
  