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
            through: { attributes: [] }, // no devolvemos campos de la tabla puente
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
  if (!datos.titulo || !datos.ciudad) {
    const error = new Error('Título y ciudad son obligatorios')
    error.statusCode = 400
    throw error
  }

  const itinerario = await Itinerario.create({
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    ciudad: datos.ciudad,
    duracionMinutos: datos.duracionMinutos,
    publico: datos.publico || 'todos',
    creadoPor,
  })

  return itinerario
}

/**
 * Actualiza parcialmente un itinerario existente.
 * Solo modifica los campos que vienen en `datos`.
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
 * Elimina un itinerario.
 * Por la relación CASCADE definida en los modelos, también se eliminan
 * sus puntos de interés y las relaciones N:M con recursos.
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