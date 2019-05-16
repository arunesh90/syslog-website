import { RequestHandler } from 'express'

const middleware: RequestHandler = (req, res, next) => {
  const { user } = req
  
  if (!user) {
    return res.status(403).send('Not logged in.')
  }

  next()
}

export default middleware
