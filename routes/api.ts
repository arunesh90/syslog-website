import { Router } from 'express'
import loadDirScripts from "../utils/loadDirScripts"

const router = Router()

const apiRoutes = loadDirScripts<Router>(__dirname, '../api')

router.use('/applications', apiRoutes.applications)
router.use('/session', apiRoutes.session)

export default router
