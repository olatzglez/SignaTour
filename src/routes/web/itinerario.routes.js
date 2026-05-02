import { Router } from 'express'
import itinerarioController from '../../controllers/web/itinerario.controller.js'
import { optionalAuth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', optionalAuth, itinerarioController.listar)
router.get('/:id', optionalAuth, itinerarioController.detalle)

export default router