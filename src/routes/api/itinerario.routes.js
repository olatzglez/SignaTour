import { Router } from 'express'
import itinerarioController from '../../controllers/api/itinerario.controller.js'
import { verifyToken, requireRole } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', itinerarioController.getAll)
router.get('/:id', itinerarioController.getById)

router.post('/', verifyToken, requireRole('admin'), itinerarioController.create)
router.patch('/:id', verifyToken, requireRole('admin'), itinerarioController.update)
router.delete('/:id', verifyToken, requireRole('admin'), itinerarioController.remove)

export default router