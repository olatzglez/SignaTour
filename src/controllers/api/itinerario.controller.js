import itinerarioService from '../../services/itinerario.service.js'

const getAll = async (req, res, next) => {
  try {
    const itinerarios = await itinerarioService.getAll()
    res.json(itinerarios)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const itinerario = await itinerarioService.getById(req.params.id)
    res.json(itinerario)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const itinerario = await itinerarioService.create(req.body, req.usuario.id)
    res.status(201).json(itinerario)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const itinerario = await itinerarioService.update(req.params.id, req.body)
    res.json(itinerario)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await itinerarioService.remove(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export default { getAll, getById, create, update, remove }