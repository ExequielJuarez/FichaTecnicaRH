const path = require('path');
const fs = require('fs');

const vehicleService = require('../data/vehicleService');
const alertaGeneradorService = require('../data/alertaGeneradorService');

const vehicleController = {
    
    ListVehicles: async (req, res) => {
        try {
            let vehiculos = await vehicleService.getAll();
            res.render("listadoVehiculos", {
                vehiculos,
                vehiculoSeleccionado: null,
                ultimosMantenimientos: [],
                ultimasAsignaciones:   [],
                asignacionActiva: null,
                alertasVehiculo:       []
            });
        } catch (error) {
            console.log(error);
            res.send("Error");
        }
    },

    /* =========================================================
       VISTA CARGA MANTENIMIENTO
    ========================================================= */

    CargaVMantenimiento: async (req, res) => {
        try {
            const data = await vehicleService.getCreateData();
    
            res.render("cargaMantenimiento", {
                vehiculos: data.vehiculos,
                repuestos: data.repuestos,
                id_vehiculo_preseleccionado: req.params.id_vehiculo || null
            });
        } catch (error) {
            console.log(error);
            res.send("Error");
        }
    },

    /* =========================================================
       GUARDAR MANTENIMIENTO
    ========================================================= */

    processMaintenance: async (req, res) => {
        try {
            const mantenimiento = await vehicleService.createMaintenance(req.body);

            // Resolver alertas de mantenimiento pendiente para este vehículo
            if (req.body.id_vehiculo) {
                await require('../model/database/models').Alerta.update(
                    { resuelta: true },
                    {
                        where: {
                            tipo:       'mantenimiento_pendiente',
                            entidad_id: req.body.id_vehiculo,
                            resuelta:   false
                        }
                    }
                );
            }

            res.redirect('/Mantenimientos');

        } catch (error) {
            console.log(error);
            res.send("Error al guardar mantenimiento");
        }
    },

    getVehicleById: async (req, res) => {
        try {
            const id       = req.params.id;
            const vehiculo = await vehicleService.getOne(id);
            const vehiculos = await vehicleService.getAll();
            const ultimosMantenimientos = await vehicleService.getLastMantenimientos(id);
            const ultimasAsignaciones   = await vehicleService.getLastAsignaciones(id);
            const asignacionActiva      = await vehicleService.getAsignacionActiva(id);

            // Alertas activas (no resueltas) del vehículo seleccionado
            const alertasVehiculo = await require('../model/database/models').Alerta.findAll({
                where: {
                    entidad_tipo: 'Vehiculo',
                    entidad_id:   id,
                    resuelta:     false
                },
                order: [['createdAt', 'DESC']]
            });

            res.render("listadoVehiculos", {
                vehiculos,
                vehiculoSeleccionado:  vehiculo,
                ultimosMantenimientos,
                ultimasAsignaciones,
                asignacionActiva:      asignacionActiva || null,
                alertasVehiculo        // nuevo
            });
        } catch (error) {
            console.log(error);
            res.send("Error al obtener el vehículo");
        }
    },
    CargaVehiculo : async (req,res) => {

        try {

            res.render('CargaFichaVehiculo')

        } catch (error) {      

            console.log(error);

        }
        
    },

    Mantenimientos: async (req, res) => {

    try {

        const mantenimientos = await vehicleService.getAllMantenimientos();

        res.render("Mantenimientos", {
            mantenimientos
        });

    } catch (error) {

        console.log(error);

    }

},

processVehicle: async (req, res) => {
    try {
        const { patente, id_tipo, marca, modelo, anio, chasis, num_motor,
                estado_actual, km_actual, fecha_alta, fecha_baja } = req.body;

        const errores = [];
        const anioNum    = parseInt(anio);
        const anioActual = new Date().getFullYear();

        if (!patente?.trim())      errores.push('La patente es obligatoria.');
        if (!id_tipo)              errores.push('El tipo de vehículo es obligatorio.');
        if (!marca?.trim())        errores.push('La marca es obligatoria.');
        if (!modelo?.trim())       errores.push('El modelo es obligatorio.');
        if (!anio || anioNum < 1900 || anioNum > anioActual)
                                   errores.push(`El año debe estar entre 1900 y ${anioActual}.`);
        if (!chasis?.trim())       errores.push('El número de chasis es obligatorio.');
        if (!num_motor?.trim())    errores.push('El número de motor es obligatorio.');
        if (!estado_actual)        errores.push('El estado es obligatorio.');
        if (km_actual === '' || km_actual === undefined || Number(km_actual) < 0)
                                   errores.push('El kilometraje es obligatorio y no puede ser negativo.');
        if (!fecha_alta)           errores.push('La fecha de alta es obligatoria.');

        // Fecha de alta no puede ser anterior al año del vehículo
        if (fecha_alta && anioNum) {
            const anioAlta = new Date(fecha_alta).getFullYear();
            if (anioAlta < anioNum) {
                errores.push('La fecha de alta no puede ser anterior al año del vehículo.');
            }
        }

        // Fecha de baja posterior a fecha de alta
        if (fecha_baja && fecha_alta && fecha_baja <= fecha_alta) {
            errores.push('La fecha de baja debe ser posterior a la de alta.');
        }

        if (errores.length > 0) {
            return res.status(400).send(
                `<h3>Errores de validación:</h3><ul>${errores.map(e => `<li>${e}</li>`).join('')}</ul>
                 <a href="javascript:history.back()">Volver</a>`
            );
        }

        await vehicleService.create(req);
        res.redirect('/Vehicles');

    } catch (error) {
        console.log(error);
        res.send("Error al guardar el vehículo");
    }
},
    EditVehiculo: async (req, res) => {
        try {
            const vehiculo = await vehicleService.getOne(req.params.id);
            res.render('EditarFichaVehiculo', { vehiculo });
        } catch (error) {
            console.log(error);
            res.send("Error");
        }
    },
    
    processEditVehiculo: async (req, res) => {
        try {
            const vehiculo = await vehicleService.getOne(req.params.id);
            if (!vehiculo) return res.status(404).send('Vehículo no encontrado.');

            const { estado_actual, km_actual, fecha_baja } = req.body;
            const errores = [];
            const anio      = vehiculo.anio;
            const fechaAlta = vehiculo.fecha_alta
                ? new Date(vehiculo.fecha_alta).toISOString().split('T')[0]
                : null;

            if (!estado_actual)
                errores.push('El estado es obligatorio.');
            if (km_actual === '' || km_actual === undefined || Number(km_actual) < 0)
                errores.push('El kilometraje no puede ser negativo.');
            if (fecha_baja && fechaAlta && fecha_baja <= fechaAlta)
                errores.push('La fecha de baja debe ser posterior a la de alta.');
            if (fecha_baja && anio && new Date(fecha_baja).getFullYear() < anio)
                errores.push(`La fecha de baja no puede ser anterior al año del vehículo (${anio}).`);

            if (errores.length > 0) {
                return res.status(400).send(
                    `<h3>Errores:</h3><ul>${errores.map(e => `<li>${e}</li>`).join('')}</ul>
                    <a href="javascript:history.back()">Volver</a>`
                );
            }

            const estadoAnterior = vehiculo.estado_actual;

            await vehicleService.update(req.params.id, req.body);

            // ── Disparar alertas según el nuevo estado ──────────────
            if (estadoAnterior !== estado_actual) {

                if (estado_actual === 'Baja') {
                    // Generar alerta inmediata de baja
                    await alertaGeneradorService.generarAlertasVehiculosBaja();
                }

                if (estado_actual === 'En mantenimiento') {
                    // Generar alerta inmediata de mantenimiento
                    const patente = vehiculo.patente;
                    const existente = await require('../model/database/models').Alerta.findOne({
                        where: {
                            tipo:       'vehiculo_en_mantenimiento',
                            entidad_id: vehiculo.id_vehiculo,
                            resuelta:   false
                        }
                    });
                    if (!existente) {
                        await require('../model/database/models').Alerta.create({
                            tipo:                     'mantenimiento_pendiente',
                            prioridad:                'media',
                            mensaje:                  `Vehículo ${patente} puesto en mantenimiento`,
                            entidad_tipo:             'Vehiculo',
                            entidad_id:               vehiculo.id_vehiculo,
                            entidad_nombre:           patente,
                            generada_automaticamente: false
                        });
                    }
                }

                // Si vuelve a Disponible → resolver alertas activas de ese vehículo
                if (estado_actual === 'Disponible') {
                    await require('../model/database/models').Alerta.update(
                        { resuelta: true },
                        {
                            where: {
                                tipo:       [
                                    'documentacion_vencida',
                                     'mantenimiento_pendiente',
                                    'vehiculo_fuera_servicio',
                                    'vehiculo_en_mantenimiento'
                                ],
                                entidad_id: vehiculo.id_vehiculo,
                                resuelta:   false
                            }
                        }
                    );
                }
            }

            res.redirect(`/Vehicles/${req.params.id}`);

        } catch (error) {
            console.log(error);
            res.send("Error al actualizar");
        }
    },

    CargaActualizarKm: async (req, res) => {
        try {
            const asignaciones          = await vehicleService.getVehiculosAsignados();
            const historial             = await vehicleService.getHistorialKm();
            const vehiculosConHistorial = await vehicleService.getVehiculosConHistorial();
            res.render('ActualizarKm', { asignaciones, historial, vehiculosConHistorial });
        } catch (error) {
            console.log(error);
            res.send("Error al cargar la vista");
        }
    },
    
    processActualizarKm: async (req, res) => {
        try {
            const { id_vehiculo, km_nuevo, fecha_actualizacion, observaciones } = req.body;
    
            const errores = [];
    
            if (!id_vehiculo)
                errores.push('Seleccioná un vehículo asignado.');
            if (km_nuevo === '' || km_nuevo === undefined || Number(km_nuevo) < 0)
                errores.push('Ingresá un kilometraje válido (mayor o igual a 0).');
            if (!fecha_actualizacion)
                errores.push('La fecha de actualización es obligatoria.');
    
            if (errores.length > 0) {
                return res.status(400).send(
                    `<h3>Errores de validación:</h3><ul>${errores.map(e => `<li>${e}</li>`).join('')}</ul>
                     <a href="javascript:history.back()">Volver</a>`
                );
            }
    
            await vehicleService.actualizarKm(id_vehiculo, Number(km_nuevo), observaciones);
            res.redirect('/Vehicles');
    
        } catch (error) {
            console.log(error);
            res.send("Error al actualizar el kilometraje");
        }
    }

    

}

module.exports = vehicleController;
