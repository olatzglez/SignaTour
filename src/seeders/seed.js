import bcrypt from 'bcrypt'
import sequelize from '../config/db.js'
import {
  User,
  Itinerario,
  PuntoInteres,
  RecursoAccesibilidad,
} from '../models/index.js'

/**
 * Seeder principal. Inserta:
 *  - Recursos de accesibilidad (datos permanentes que la app necesita)
 *  - Un usuario admin y un usuario user de prueba
 *  - Itinerarios con puntos de interés y recursos asociados
 *
 * Es idempotente: si los datos ya existen, no los duplica.
 */
const seed = async () => {
  try {
    await sequelize.authenticate()
    console.log('✓ Conectado a la BD')

    // ── 1. Recursos de accesibilidad ────────────────────────
    const recursosBase = [
      { codigo: 'LSE', nombre: 'Lengua de Signos Española',
        descripcion: 'Interpretación o apoyo en LSE.' },
      { codigo: 'SUBTITULOS', nombre: 'Subtítulos',
        descripcion: 'Contenido audiovisual subtitulado.' },
      { codigo: 'SIGNOGUIA', nombre: 'Signoguía',
        descripcion: 'Guía visual accesible en lengua de signos.' },
      { codigo: 'BUCLE_MAGNETICO', nombre: 'Bucle Magnético',
        descripcion: 'Sistema de ayuda auditiva para audífonos.' },
      { codigo: 'LECTURA_FACIL', nombre: 'Lectura Fácil',
        descripcion: 'Textos adaptados para comprensión sencilla.' },
    ]

    for (const r of recursosBase) {
      await RecursoAccesibilidad.findOrCreate({
        where: { codigo: r.codigo },
        defaults: r,
      })
    }
    console.log(`✓ ${recursosBase.length} recursos de accesibilidad listos`)

    // ── 2. Usuarios de prueba ───────────────────────────────
    const passwordHash = await bcrypt.hash('admin1234', 10)

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@itinerarios.local' },
      defaults: {
        nombre: 'Administradora',
        email: 'admin@itinerarios.local',
        password: passwordHash,
        rol: 'admin',
      },
    })

    await User.findOrCreate({
      where: { email: 'usuario@itinerarios.local' },
      defaults: {
        nombre: 'Usuaria de prueba',
        email: 'usuario@itinerarios.local',
        password: passwordHash,
        rol: 'user',
      },
    })
    console.log('✓ Usuarios de prueba listos (contraseña: admin1234)')

    // ── 3. Itinerarios + puntos + recursos ──────────────────
    const lse = await RecursoAccesibilidad.findOne({ where: { codigo: 'LSE' } })
    const subtitulos = await RecursoAccesibilidad.findOne({ where: { codigo: 'SUBTITULOS' } })
    const signoguia = await RecursoAccesibilidad.findOne({ where: { codigo: 'SIGNOGUIA' } })
    const bucle = await RecursoAccesibilidad.findOne({ where: { codigo: 'BUCLE_MAGNETICO' } })
    const lectura = await RecursoAccesibilidad.findOne({ where: { codigo: 'LECTURA_FACIL' } })

    // Itinerario 1
    const [it1, creado1] = await Itinerario.findOrCreate({
      where: { titulo: 'Madrid de los Austrias accesible' },
      defaults: {
        titulo: 'Madrid de los Austrias accesible',
        descripcion: 'Recorrido por el Madrid histórico con paradas accesibles para personas sordas.',
        ciudad: 'Madrid',
        duracionMinutos: 120,
        publico: 'todos',
        creadoPor: admin.id,
      },
    })
    if (creado1) {
      const punto1 = await PuntoInteres.create({
        nombre: 'Plaza Mayor',
        direccion: 'Plaza Mayor, 28012 Madrid',
        descripcion: 'Punto de partida con paneles informativos.',
        latitud: 40.4155, longitud: -3.7074,
        orden: 1,
        itinerarioId: it1.id,
      })
      await punto1.addRecursos([signoguia, lectura])

      const punto2 = await PuntoInteres.create({
        nombre: 'Palacio Real',
        direccion: 'Calle de Bailén, s/n, 28071 Madrid',
        descripcion: 'Visitas guiadas con intérprete de LSE bajo reserva.',
        latitud: 40.4180, longitud: -3.7144,
        orden: 2,
        itinerarioId: it1.id,
      })
      await punto2.addRecursos([lse, signoguia, bucle])
    }

    // Itinerario 2
    const [it2, creado2] = await Itinerario.findOrCreate({
      where: { titulo: 'Bilbao y el Guggenheim' },
      defaults: {
        titulo: 'Bilbao y el Guggenheim',
        descripcion: 'Ruta por el centro de Bilbao con visita accesible al museo.',
        ciudad: 'Bilbao',
        duracionMinutos: 180,
        publico: 'doce_mas',
        creadoPor: admin.id,
      },
    })
    if (creado2) {
      const punto = await PuntoInteres.create({
        nombre: 'Museo Guggenheim',
        direccion: 'Avenida Abandoibarra, 2, 48009 Bilbao',
        descripcion: 'Signoguías disponibles y vídeos subtitulados.',
        latitud: 43.2687, longitud: -2.9340,
        orden: 1,
        itinerarioId: it2.id,
      })
      await punto.addRecursos([signoguia, subtitulos, lse])
    }

    // Itinerario 3
    const [it3, creado3] = await Itinerario.findOrCreate({
      where: { titulo: 'Sevilla nocturna para adultos' },
      defaults: {
        titulo: 'Sevilla nocturna para adultos',
        descripcion: 'Ruta nocturna por el casco antiguo con tapas y flamenco accesible.',
        ciudad: 'Sevilla',
        duracionMinutos: 150,
        publico: 'adultos',
        creadoPor: admin.id,
      },
    })
    if (creado3) {
      const punto = await PuntoInteres.create({
        nombre: 'Tablao El Arenal',
        direccion: 'Calle Rodo, 7, 41001 Sevilla',
        descripcion: 'Espectáculos con bucle magnético en la sala.',
        latitud: 37.3866, longitud: -5.9978,
        orden: 1,
        itinerarioId: it3.id,
      })
      await punto.addRecursos([bucle, subtitulos])
    }

    console.log('✓ Itinerarios de prueba listos')
    console.log('🎉 Seed completado')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error en el seed:', error)
    process.exit(1)
  }
}

seed()