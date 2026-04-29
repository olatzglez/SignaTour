import sequelize from '../config/db.js'
import User from './user.model.js'
import Itinerario from './itinerario.model.js'
import PuntoInteres from './puntoInteres.model.js'
import RecursoAccesibilidad from './recursoAccesibilidad.model.js'

// 1:N — Un itinerario tiene muchos puntos de interés
Itinerario.hasMany(PuntoInteres, {
  foreignKey: 'itinerarioId',
  as: 'puntos',
  onDelete: 'CASCADE',
})
PuntoInteres.belongsTo(Itinerario, {
  foreignKey: 'itinerarioId',
  as: 'itinerario',
})

// N:M — Un punto puede ofrecer varios recursos, y un recurso aparece en varios puntos
PuntoInteres.belongsToMany(RecursoAccesibilidad, {
  through: 'PuntoRecurso',
  foreignKey: 'puntoId',
  otherKey: 'recursoId',
  as: 'recursos',
})
RecursoAccesibilidad.belongsToMany(PuntoInteres, {
  through: 'PuntoRecurso',
  foreignKey: 'recursoId',
  otherKey: 'puntoId',
  as: 'puntos',
})

// 1:N — Un usuario admin crea muchos itinerarios
Itinerario.belongsTo(User, { foreignKey: 'creadoPor', as: 'autor' })
User.hasMany(Itinerario, { foreignKey: 'creadoPor', as: 'itinerariosCreados' })

export {
  sequelize,
  User,
  Itinerario,
  PuntoInteres,
  RecursoAccesibilidad,
}