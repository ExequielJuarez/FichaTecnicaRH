// src/model/database/models/Vehiculo.js
module.exports = (sequelize, DataTypes) => {
  const Vehiculo = sequelize.define('Vehiculo', {
    id_vehiculo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patente: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    legajo: {
      type: DataTypes.STRING(30),
      unique: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipo_vehiculo',
        key: 'id_tipo'
      }
    },
    num_chasis: {
      type: DataTypes.STRING(50)
    },
    num_motor: {
      type: DataTypes.STRING(50)
    },
    transmision: {
      type: DataTypes.ENUM('Manual', 'Automatica')
    },
    km_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estado_actual: {
      type: DataTypes.ENUM('Disponible', 'En uso', 'En mantenimiento', 'Baja'),
      allowNull: false,
      defaultValue: 'Disponible'
    },
    distrito: {
      type: DataTypes.STRING(50)
    },
    area: {
      type: DataTypes.STRING(100)
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    imagen_url: {
      type: DataTypes.STRING(255)
    },
    fecha_alta: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_baja: {
      type: DataTypes.DATEONLY
    }
  }, {
    tableName: 'vehiculo',
    timestamps: false
  });

 

  return Vehiculo;
};