import { RequestHandler } from "express"

const infoRoute: RequestHandler = (req, res) => {
  const { user } = req

  if (!user) {
    return res.status(404).send('Missing session')
  }

  res.send(JSON.stringify(user, null, 2))
}

export default infoRoute
