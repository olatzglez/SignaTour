/**
 * Manejador global de errores.
 * Para peticiones a /api/* devuelve JSON.
 * Para peticiones web devuelve texto plano de momento (más adelante,
 * cuando metamos PUG, renderizará una vista de error).
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const mensaje = err.message || 'Error interno del servidor'

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', mensaje)
  }

  if (req.path.startsWith('/api')) {
    return res.status(statusCode).json({ error: mensaje })
  }

  res.status(statusCode).send(`Error ${statusCode}: ${mensaje}`)
}

export default errorHandler