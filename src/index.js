import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import sequelize from './config/db.js'
import './models/index.js'
import path from 'path'


import authRoutes from './routes/api/auth.routes.js'
import itinerarioRoutes from './routes/api/itinerario.routes.js'
import homeRoutes from './routes/web/home.routes.js'
import errorHandler from './middlewares/errorHandler.js'
import { fileURLToPath } from 'url'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Motor de plantillas
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Servir archivos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, '..', 'public')))

// ── Middlewares globales ────────────────────────
app.use(morgan('dev'))                          // logs de cada petición
app.use(express.json())                         // parsea body JSON
app.use(express.urlencoded({ extended: true })) // parsea body de formularios
app.use(cookieParser())                         // parsea cookies de la petición

// ── Rutas de la web ──────────────────────────────
app.use('/', homeRoutes)
app.use('/itinerarios', itinerarioWebRoutes)
import itinerarioWebRoutes from './routes/web/itinerario.routes.js'
import authWebRoutes from './routes/web/auth.routes.js'


// ── Rutas API ───────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/itinerarios', itinerarioRoutes)
app.use('/', authWebRoutes)

// ── 404 ─────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.url}`)
  error.statusCode = 404
  next(error)
})

// ── Manejador de errores (siempre el último) ────
app.use(errorHandler)

// ── Arranque ────────────────────────────────────
const PORT = process.env.PORT || 4567

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✓ Base de datos conectada.')

    await sequelize.sync({ alter: true })
    console.log('✓ Modelos sincronizados.')

    app.listen(PORT, () => {
      console.log(`✓ Servidor escuchando en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('✗ Error al arrancar:', error.message)
    process.exit(1)
  }
}

startServer()