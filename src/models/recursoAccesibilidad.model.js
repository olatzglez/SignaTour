import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const RecursoAccesibilidad = sequelize.define('RecursoAccesibilidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'recursos_accesibilidad',
  timestamps: true,
})

export default RecursoAccesibilidad