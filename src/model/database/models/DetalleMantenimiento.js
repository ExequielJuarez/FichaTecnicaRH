module.exports = (sequelize, DataTypes) => {

    const DetalleMantenimiento = sequelize.define("DetalleMantenimiento", {

        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_mantenimiento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_repuesto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        costo_unitario: {
            type: DataTypes.DECIMAL(12,2)
        }

    }, {
        tableName: "detalle_mantenimiento",
        timestamps: false
    });

    return DetalleMantenimiento;
}