import authService from '../../services/auth.service.js'

/**
 * POST /api/auth/register
 * Registra un usuario nuevo y devuelve el usuario + token JWT.
 */
const register = async (req, res, next) => {
  try {
    const resultado = await authService.register(req.body)
    res.status(201).json(resultado)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/auth/login
 * Verifica credenciales y devuelve el usuario + token JWT.
 */
const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/auth/me
 * Devuelve los datos del usuario actualmente autenticado.
 * Requiere un token válido (lo verifica el middleware verifyToken).
 */
const me = async (req, res, next) => {
  try {
    res.json({ usuario: req.usuario })
  } catch (error) {
    next(error)
  }
}

export default { register, login, me }