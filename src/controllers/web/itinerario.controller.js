import itinerarioService from '../../services/itinerario.service.js'
import { PROVINCIAS_ESPANA } from '../../constants/provincias.js'

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

/**
 * GET /itinerarios/nuevo
 * Muestra el formulario para crear un itinerario nuevo (solo admin).
 */
const mostrarFormulario = (req, res) => {
  res.render('itinerarios/formulario', {
    titulo: 'Nuevo itinerario',
    rutaActiva: 'itinerarios',
    usuario: req.usuario,
    error: null,
    valores: {},
    provincias: PROVINCIAS_ESPANA,
  })
}

/**
 * POST /itinerarios/nuevo
 * Procesa el formulario. En éxito, redirige al detalle. En error,
 * vuelve a mostrar el formulario con el mensaje y los valores tecleados.
 */
const procesarFormulario = async (req, res, next) => {
  try {
    const itinerario = await itinerarioService.create(req.body, req.usuario.id)
    res.redirect(`/itinerarios/${itinerario.id}`)
  } catch (error) {
    res.status(error.statusCode || 500).render('itinerarios/formulario', {
      titulo: 'Nuevo itinerario',
      rutaActiva: 'itinerarios',
      usuario: req.usuario,
      error: error.message,
      valores: req.body,
      provincias: PROVINCIAS_ESPANA,
    })
  }
}

export default { listar, detalle, mostrarFormulario, procesarFormulario }