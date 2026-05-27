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
            allowNull: true,
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
            allowNull: false
        },

        num_chasis: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        num_motor: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        transmision: {
            type: DataTypes.STRING(30),
            allowNull: true
        },

        km_actual: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        estado_actual: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Disponible'
        },

        distrito: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        area: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        imagen_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        fecha_alta: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        fecha_baja: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }

    }, {

        tableName: 'vehiculo',

        timestamps: false,

        freezeTableName: true,

        underscored: true

    });

    // =========================
    // RELACIONES
    // =========================
    Vehiculo.associate = function(models) {

        // Ejemplo:
        // Vehiculo.belongsTo(models.TipoVehiculo, {
        //     foreignKey: 'id_tipo',
        //     as: 'tipo'
        // });

    };

    return Vehiculo;

};