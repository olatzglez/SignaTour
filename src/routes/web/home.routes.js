import { Router } from 'express'
import { optionalAuth } from '../../middlewares/auth.middleware.js'
import itinerarioService from '../../services/itinerario.service.js'

const router = Router()

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const itinerariosDestacados = await itinerarioService.getAll()
const ciudades = await itinerarioService.getCiudades()

    res.render('home', {
      titulo: 'Inicio',
      rutaActiva: 'inicio',
      usuario: req.usuario || null,
      itinerariosDestacados,
      ciudades,
    })
  } catch (error) {
    next(error)
  }
})

export default router