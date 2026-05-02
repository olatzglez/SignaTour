import { Itinerario, PuntoInteres, RecursoAccesibilidad } from '../models/index.js'

/**
 * Lista todos los itinerarios.
 * Por ahora sin filtros ni paginación; se añadirán después.
 */
const getAll = async () => {
  const itinerarios = await Itinerario.findAll({
    order: [['createdAt', 'DESC']],
  })
  return itinerarios
}

/**
 * Devuelve un itinerario con sus puntos de interés y, para cada punto,
 * los recursos de accesibilidad que ofrece.
 *
 * Lanza error 404 si no existe.
 */
const getById = async (id) => {
  const itinerario = await Itinerario.findByPk(id, {
    include: [
      {
        model: PuntoInteres,
        as: 'puntos',
        include: [
          {
            model: RecursoAccesibilidad,
            as: 'recursos',
            through: { attributes: [] },
          },
        ],
      },
    ],
    order: [[{ model: PuntoInteres, as: 'puntos' }, 'orden', 'ASC']],
  })

  if (!itinerario) {
    const error = new Error('Itinerario no encontrado')
    error.statusCode = 404
    throw error
  }

  return itinerario
}

/**
 * Crea un itinerario nuevo, asociado al usuario admin que lo creó.
 */
const create = async (datos, creadoPor) => {
  if (!datos.titulo || !datos.provincia || !datos.ciudad || !datos.duracionMinutos || !datos.publico) {
    const error = new Error('Faltan campos obligatorios')
    error.statusCode = 400
    throw error
  }

  const itinerario = await Itinerario.create({
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    provincia: datos.provincia,
    ciudad: datos.ciudad,
    duracionMinutos: datos.duracionMinutos,
    publico: datos.publico,
    creadoPor,
  })

  return itinerario
}

/**
 * Actualiza parcialmente un itinerario existente.
 */
const update = async (id, datos) => {
  const itinerario = await Itinerario.findByPk(id)
  if (!itinerario) {
    const error = new Error('Itinerario no encontrado')
    error.statusCode = 404
    throw error
  }

  await itinerario.update(datos)
  return itinerario
}

/**
 * Elimina un itinerario (cascada borra sus puntos y relaciones N:M).
 */
const remove = async (id) => {
  const itinerario = await Itinerario.findByPk(id)
  if (!itinerario) {
    const error = new Error('Itinerario no encontrado')
    error.statusCode = 404
    throw error
  }

  await itinerario.destroy()
}

export default { getAll, getById, create, update, remove }