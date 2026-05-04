import { Router } from 'express'
import itinerarioController from '../../controllers/web/itinerario.controller.js'
import { optionalAuth, verifyToken, requireRole } from '../../middlewares/auth.middleware.js'

const router = Router()

// Lista (pública)
router.get('/', optionalAuth, itinerarioController.listar)

// Formulario nuevo (solo admin) — IMPORTANTE: antes que /:id
router.get('/nuevo', verifyToken, requireRole('admin'), itinerarioController.mostrarFormulario)
router.post('/nuevo', verifyToken, requireRole('admin'), itinerarioController.procesarFormulario)

// Detalle (pública)
router.get('/:id', optionalAuth, itinerarioController.detalle)

// Eliminar (solo admin)
router.post('/:id/eliminar', verifyToken, requireRole('admin'), itinerarioController.eliminar)

export default router