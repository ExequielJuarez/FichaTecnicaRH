module.exports = (sequelize, DataTypes) => {

    const Mantenimiento = sequelize.define("Mantenimiento", {

        id_mantenimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_vehiculo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        tipo_servicio: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        fecha_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        fecha_fin: {
            type: DataTypes.DATEONLY
        },

        km_servicio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        costo_total: {
            type: DataTypes.DECIMAL(12,2)
        },

        descripcion: {
            type: DataTypes.TEXT
        },

        proximo_km: {
            type: DataTypes.INTEGER
        },

        proxima_fecha: {
            type: DataTypes.DATEONLY
        },

        estado: {
            type: DataTypes.STRING(20),
            defaultValue: "Realizado"
        }

    }, {
        tableName: "mantenimiento",
        timestamps: false
    });

    Mantenimiento.associate = function(models){

        Mantenimiento.belongsTo(models.Vehiculo, {
            foreignKey: "id_vehiculo",
            as: "vehiculo"
        });

        Mantenimiento.belongsTo(models.Usuario, {
            foreignKey: "id_usuario",
            as: "usuario"
        });

        Mantenimiento.hasMany(models.DetalleMantenimiento, {
            foreignKey: "id_mantenimiento",
            as: "detalles"
        });

    }

    return Mantenimiento;
}