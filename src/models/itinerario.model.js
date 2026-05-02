import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Itinerario = sequelize.define('Itinerario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duracionMinutos: {
    type: DataTypes.INTEGER,
  },
  publico: {
    type: DataTypes.ENUM('todos', 'doce_mas', 'adultos'),
    defaultValue: 'todos',
    allowNull: false,
  },
}, {
  tableName: 'itinerarios',
  timestamps: true,
})

export default Itinerario