import { Router } from 'express'
import authController from '../../controllers/api/auth.controller.js'
import { verifyToken } from '../../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', verifyToken, authController.me)

export default router