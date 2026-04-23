// src/model/database/models/Vehiculo.js
module.exports = (sequelize, DataTypes) => {
  const Vehiculo = sequelize.define('Vehiculo', {
    nombre_chofer: DataTypes.STRING,
    patente: DataTypes.STRING,
    kilometraje: DataTypes.INTEGER,
    marca: DataTypes.STRING,
    codigo_motor: DataTypes.STRING,
    combustible: DataTypes.ENUM('nafta', 'diesel', 'electrico', 'hibrido'),
    tipo: DataTypes.ENUM('liviano', 'pesado')
  }, {
    tableName: 'vehiculos',
    timestamps: false
  });

  return Vehiculo;
};