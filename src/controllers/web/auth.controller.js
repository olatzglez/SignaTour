import authService from '../../services/auth.service.js'

/**
 * GET /login
 * Muestra el formulario de inicio de sesión.
 */
const mostrarLogin = (req, res) => {
  res.render('auth/login', {
    titulo: 'Iniciar sesión',
    rutaActiva: 'login',
    usuario: req.usuario || null,
    error: null,
    valores: {},
  })
}

/**
 * POST /login
 * Procesa el formulario de inicio de sesión.
 * En éxito, guarda el JWT en una cookie httpOnly y redirige a /itinerarios.
 * En error, vuelve a mostrar el formulario con el mensaje.
 */
const procesarLogin = async (req, res, next) => {
  try {
    const { token } = await authService.login(req.body)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24h
    })
    res.redirect('/itinerarios')
  } catch (error) {
    res.status(error.statusCode || 500).render('auth/login', {
      titulo: 'Iniciar sesión',
      rutaActiva: 'login',
      usuario: null,
      error: error.message,
      valores: { email: req.body.email || '' },
    })
  }
}

/**
 * GET /registro
 * Muestra el formulario de registro.
 */
const mostrarRegistro = (req, res) => {
  res.render('auth/registro', {
    titulo: 'Crear cuenta',
    rutaActiva: 'registro',
    usuario: req.usuario || null,
    error: null,
    valores: {},
  })
}

/**
 * POST /registro
 * Procesa el formulario de alta y guarda la cookie como en login.
 */
const procesarRegistro = async (req, res, next) => {
  try {
    const { token } = await authService.register(req.body)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.redirect('/itinerarios')
  } catch (error) {
    res.status(error.statusCode || 500).render('auth/registro', {
      titulo: 'Crear cuenta',
      rutaActiva: 'registro',
      usuario: null,
      error: error.message,
      valores: {
        nombre: req.body.nombre || '',
        email: req.body.email || '',
      },
    })
  }
}

/**
 * POST /logout
 * Borra la cookie y redirige a la home.
 */
const logout = (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
}

export default { mostrarLogin, procesarLogin, mostrarRegistro, procesarRegistro, logout }