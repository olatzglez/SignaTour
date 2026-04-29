import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import sequelize from './config/db.js'
import './models/index.js'

import authRoutes from './routes/api/auth.routes.js'
import errorHandler from './middlewares/errorHandler.js'

dotenv.config()

const app = express()

// ── Middlewares globales ────────────────────────
app.use(morgan('dev'))                          // logs de cada petición
app.use(express.json())                         // parsea body JSON
app.use(express.urlencoded({ extended: true })) // parsea body de formularios
app.use(cookieParser())                         // parsea cookies de la petición

// ── Ruta de prueba ──────────────────────────────
app.get('/', (req, res) => {
  res.send('Hola mundo desde Express')
})

// ── Rutas API ───────────────────────────────────
app.use('/api/auth', authRoutes)

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