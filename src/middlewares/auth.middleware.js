import jwt from 'jsonwebtoken'

/**
 * Extrae el token JWT de la petición. Lo busca primero en la cookie 'token'
 * (uso típico de las vistas web) y si no, en el header Authorization
 * (uso típico de la API: "Authorization: Bearer <token>").
 *
 * Devuelve el token como string, o null si no encuentra ninguno.
 */
const extraerToken = (req) => {
  const tokenFromCookie = req.cookies?.token
  if (tokenFromCookie) return tokenFromCookie

  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7) // quita el prefijo "Bearer "
  }

  return null
}

/**
 * Middleware estricto. Exige que la petición traiga un JWT válido.
 * - Si falta el token, responde 401.
 * - Si el token está caducado o es inválido, responde 401.
 * - Si todo OK, decodifica el payload y lo guarda en req.usuario,
 *   luego llama a next() para continuar.
 */
export const verifyToken = (req, res, next) => {
  const token = extraerToken(req)

  if (!token) {
    const error = new Error('Autenticación requerida')
    error.statusCode = 401
    return next(error)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded // { id, rol, iat, exp }
    next()
  } catch (err) {
    const error = new Error('Token inválido o expirado')
    error.statusCode = 401
    next(error)
  }
}

/**
 * Middleware blando. Si hay token y es válido, rellena req.usuario.
 * Si no hay o es inválido, deja req.usuario sin definir y sigue adelante.
 * Nunca rechaza la petición.
 *
 * Útil para vistas públicas donde la cabecera o el contenido cambia
 * si estás logueada o no, pero no quieres bloquear el acceso.
 */
export const optionalAuth = (req, res, next) => {
  const token = extraerToken(req)
  if (!token) return next()

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
  } catch (_) {
    // token inválido o caducado, seguimos como anónimo
  }
  next()
}

/**
 * Middleware de autorización por rol. Debe usarse SIEMPRE después de
 * verifyToken (o optionalAuth si tiene sentido).
 *
 * Uso: requireRole('admin') o requireRole('admin', 'editor')
 */
export const requireRole = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    const error = new Error('Autenticación requerida')
    error.statusCode = 401
    return next(error)
  }
  if (!rolesPermitidos.includes(req.usuario.rol)) {
    const error = new Error('No tienes permisos para esta acción')
    error.statusCode = 403
    return next(error)
  }
  next()
}