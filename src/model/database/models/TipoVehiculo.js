module.exports = (sequelize, DataTypes) => {

    const TipoVehiculo = sequelize.define("TipoVehiculo", {

        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        descripcion: {
            type: DataTypes.STRING(100),
            allowNull: false
        }

    }, {

        tableName: "tipo_vehiculo",
        timestamps: false

    });

    TipoVehiculo.associate = function(models){

        TipoVehiculo.hasMany(models.Vehiculo, {
            foreignKey: "id_tipo",
            as: "vehiculos"
        });

    }

    return TipoVehiculo;

}