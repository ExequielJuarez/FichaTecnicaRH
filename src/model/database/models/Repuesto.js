module.exports = (sequelize, DataTypes) => {

    const Repuesto = sequelize.define("Repuesto", {

        id_repuesto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.TEXT
        },

        unidad_medida: {
            type: DataTypes.STRING(30)
        },

        stock_actual: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        stock_minimo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }

    }, {
        tableName: "repuesto",
        timestamps: false
    });

    return Repuesto;
}