import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

/**
 * Genera un token JWT para un usuario.
 * El payload solo lleva id y rol: lo mínimo necesario para autorización.
 * Nunca metemos la contraseña ni datos sensibles en el token.
 */
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
}

/**
 * Registra un usuario nuevo.
 * - Verifica que el email no esté en uso.
 * - Hashea la contraseña antes de guardar.
 * - Devuelve el usuario (sin password) y un token JWT recién firmado.
 *
 * Lanza Error con statusCode si algo falla, para que el middleware
 * de errores sepa qué código HTTP devolver.
 */
const register = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) {
    const error = new Error('Faltan campos obligatorios')
    error.statusCode = 400
    throw error
  }

  if (password.length < 8) {
    const error = new Error('La contraseña debe tener al menos 8 caracteres')
    error.statusCode = 400
    throw error
  }

  const existente = await User.findOne({ where: { email } })
  if (existente) {
    const error = new Error('Ya existe un usuario con ese email')
    error.statusCode = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const usuario = await User.create({
    nombre,
    email,
    password: passwordHash,
    rol: 'user',
  })

  const token = generarToken(usuario)

  return {
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
    token,
  }
}

/**
 * Inicia sesión con email + contraseña.
 * - Busca el usuario por email.
 * - Compara la contraseña en plano con el hash guardado.
 * - Si todo OK, devuelve usuario (sin password) y token JWT.
 */
const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email y contraseña son obligatorios')
    error.statusCode = 400
    throw error
  }

  const usuario = await User.findOne({ where: { email } })
  if (!usuario) {
    const error = new Error('Credenciales inválidas')
    error.statusCode = 401
    throw error
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password)
  if (!passwordCorrecta) {
    const error = new Error('Credenciales inválidas')
    error.statusCode = 401
    throw error
  }

  const token = generarToken(usuario)

  return {
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
    token,
  }
}

export default { register, login, generarToken }