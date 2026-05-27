const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');

const vehicleService = {

    getAll: async function () {

        try {

            return await db.Vehiculo.findAll({
              include: [
                {
                    association: "TipoVehiculo"
                }
            ]
            })
             

        } catch (error) {

            console.log(error);
            return [];

        }

    },

    getOne: async function (id) {
      try {
          let Vehicle = await db.Vehiculo.findByPk(id, {
              include: [
                  {
                      association: "TipoVehiculo"
                  }
              ]
          });
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
    update: async function (id, body) {
        try {
            await db.Vehiculo.update({
                estado_actual: body.estado_actual,
                km_actual:     body.km_actual,
                distrito:      body.distrito,
                observaciones: body.observaciones,
                fecha_baja:    body.fecha_baja || null,
            }, {
                where: { id_vehiculo: id }
            });
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

},
getLastMantenimientos: async function (id_vehiculo, limit = 3) {
    try {
        return await db.Mantenimiento.findAll({
            where: { id_vehiculo },
            order: [['fecha_inicio', 'DESC']],
            limit
        });
    } catch (error) {
        console.log(error);
        return [];
    }
},

getLastAsignaciones: async function (id_vehiculo, limit = 3) {
    try {
        return await db.AsignacionVehiculo.findAll({
            where: { id_vehiculo },
            order: [['fecha_salida', 'DESC']],
            limit,
            include: [{ association: 'Chofer' }]
        });
    } catch (error) {
        console.log(error);
        return [];
    }
},

getVehiculosAsignados: async function () {
    try {
        const asignaciones = await db.AsignacionVehiculo.findAll({
            where: { estado: 'Activo' },
            include: [
                {
                    association: 'vehiculo',  // minúscula, igual que el as del modelo
                    attributes: ['id_vehiculo', 'patente', 'marca', 'modelo', 'anio', 'km_actual']
                },
                {
                    model: db.Chofer,  // sin as porque no tiene alias definido
                    attributes: ['id_chofer', 'nombre', 'apellido']
                }
            ]
        });

        return asignaciones.map(asig => ({
            id_vehiculo:     asig.vehiculo.id_vehiculo,
            patente:         asig.vehiculo.patente,
            marca:           asig.vehiculo.marca,
            modelo:          asig.vehiculo.modelo,
            anio:            asig.vehiculo.anio,
            km_actual:       asig.vehiculo.km_actual,
            chofer_nombre:   asig.Chofer.nombre,
            chofer_apellido: asig.Chofer.apellido,
            destino_area:    asig.destino_area || null,
            fecha_salida:    asig.fecha_salida || null,
            id_asignacion:   asig.id_asignacion
        }));

    } catch (error) {
        console.log(error);
        return [];
    }
},

getAsignacionActiva: async function (id_vehiculo) {
    try {
        return await db.AsignacionVehiculo.findOne({
            where: { 
                id_vehiculo,
                estado: 'Activo'
            },
            include: [{ association: 'Chofer' }]
        });
    } catch (error) {
        console.log(error);
        return null;
    }
},

actualizarKm: async function (id_vehiculo, km_nuevo, observaciones) {
    try {
        const updateData = { km_actual: km_nuevo };

        if (observaciones && observaciones.trim() !== '') {
            updateData.observaciones = observaciones.trim();
        }

        await db.Vehiculo.update(updateData, {
            where: { id_vehiculo }
        });

    } catch (error) {
        console.log(error);
    }
}

}

module.exports = vehicleService;
