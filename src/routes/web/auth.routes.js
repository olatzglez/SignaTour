import { Router } from 'express'
import authController from '../../controllers/web/auth.controller.js'
import { optionalAuth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/login', optionalAuth, authController.mostrarLogin)
router.post('/login', authController.procesarLogin)

router.get('/registro', optionalAuth, authController.mostrarRegistro)
router.post('/registro', authController.procesarRegistro)

router.post('/logout', authController.logout)

export default router