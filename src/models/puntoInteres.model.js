import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const PuntoInteres = sequelize.define('PuntoInteres', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 7),
  },
  longitud: {
    type: DataTypes.DECIMAL(10, 7),
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'puntos_interes',
  timestamps: true,
})

export default PuntoInteres