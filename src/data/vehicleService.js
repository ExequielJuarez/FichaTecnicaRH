const { log } = require('console');
const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const { clearScreenDown } = require('readline');

const vehicleService = {

    getAll: async function () {

        try {

            return await db.Vehiculo.findAll({
            })

        } catch (error) {

            console.log(error);
            return [];

        }

    },

    getOne: async function (id) {

        try {

            let Vehicle = await db.Vehiculo.findByPk(id);

            return Vehicle;

        } catch (error) {

            console.log(error);

        }

    },

    findByPk: async function (id) {

        try {

            let allVehicles = await this.getAll();

            let OneVehicle = allVehicles.find(onevehicle => onevehicle.id === id);

            return OneVehicle;

        } catch (error) {

            console.log(error);

        }

    },

    create: async function (req) {

        try {

            let newVehicle = await db.Vehiculo.create({

                patente: req.body.patente,

                id_tipo: req.body.id_tipo,

                marca: req.body.marca,

                modelo: req.body.modelo,

                anio: req.body.anio,

                num_chasis: req.body.chasis,

                num_motor: req.body.num_motor,

                transmision: req.body.transmision,

                estado_actual: req.body.estado_actual,

                km_actual: req.body.km_actual,

                distrito: req.body.distrito,

                fecha_alta: req.body.fecha_alta,

            })

            return newVehicle

        } catch (error) {

            console.log(error);

        }

    },

    /* =========================================================
       MANTENIMIENTOS
    ========================================================= */

    getCreateData: async function(){

        try {

            const vehiculos = await db.Vehiculo.findAll();

            const repuestos = await db.Repuesto.findAll();

            return {
                vehiculos,
                repuestos
            }

        } catch (error) {

            console.log(error);

        }

    },

    createMaintenance: async function(data){

        try {

            const mantenimiento = await db.Mantenimiento.create({

                id_vehiculo: data.id_vehiculo,

                id_usuario: 1,

                tipo_servicio: data.tipo_servicio,

                fecha_inicio: data.fecha_inicio,

                fecha_fin: data.fecha_fin || null,

                km_servicio: data.km_servicio,

                costo_total: data.costo_total || 0,

                descripcion: data.descripcion,

                proximo_km: data.proximo_km || null,

                proxima_fecha: data.proxima_fecha || null,

                estado: data.estado

            });
            console.log("ubicando")
            console.log(mantenimiento)

            if(data.id_repuesto){

                for(let i = 0; i < data.id_repuesto.length; i++){

                    if(data.id_repuesto[i] !== ""){

                        await db.DetalleMantenimiento.create({

                            id_mantenimiento: mantenimiento.id_mantenimiento,

                            id_repuesto: data.id_repuesto[i],

                            cantidad: data.cantidad[i],

                            costo_unitario: data.costo_unitario[i]

                        });

                    }

                }

            }

            return mantenimiento;

        } catch (error) {

            console.log(error);

        }

    },
    getAllMantenimientos: async () => {

    return await db.Mantenimiento.findAll({

        include: [
            {
                association: "vehiculo"
            }
        ]

    });

}

}

module.exports = vehicleService;