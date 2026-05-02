import itinerarioService from '../../services/itinerario.service.js'

/**
 * GET /itinerarios
 * Renderiza la página de lista de itinerarios.
 */
const listar = async (req, res, next) => {
  try {
    const itinerarios = await itinerarioService.getAll()
    res.render('itinerarios/lista', {
      titulo: 'Itinerarios',
      rutaActiva: 'itinerarios',
      usuario: req.usuario || null,
      itinerarios,
    })
  } catch (error) {
    next(error)
  }
}

const detalle = async (req, res, next) => {
  try {
    const itinerario = await itinerarioService.getById(req.params.id)
    res.render('itinerarios/detalle', {
      titulo: itinerario.titulo,
      rutaActiva: 'itinerarios',
      usuario: req.usuario || null,
      itinerario,
    })
  } catch (error) {
    next(error)
  }
}

export default { listar, detalle }