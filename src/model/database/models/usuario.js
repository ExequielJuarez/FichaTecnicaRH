module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'usuario',
    timestamps: false
  });

  return Usuario;
};