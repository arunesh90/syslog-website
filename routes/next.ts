import { Router } from 'express'
import { nextApp } from '../main'

const router = Router()
const nextHandler = nextApp.getRequestHandler()

router.get('/app/*', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/')
  }

  next()
})

router.get('/app/application/:id/logs', (req, res) => {
  nextApp.render(req, res, '/app/logs', {id: req.params.id})
})

// Teams
router.get('/app/dashboard/teams/:teamId', (req, res) => {
  nextApp.render(req, res, '/app/dashboard', {
    id     : req.params.teamId,
    item   : 'teams',
    subItem: 'info'
  })
})

router.get('/app/dashboard/:item', (req, res) => {
    nextApp.render(req, res, '/app/dashboard', {
    item: req.params.item
  })
})

router.get('/app/dashboard/:item/:subItem', (req, res) => {
  nextApp.render(req, res, '/app/dashboard', {
    item   : req.params.item,
    subItem: req.params.subItem
  })
})

router.get('*', (req, res) => {
  nextHandler(req, res)
})

export default router
