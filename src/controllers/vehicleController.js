const path = require('path');
const fs = require('fs');

const vehicleService = require('../data/vehicleService');

const vehicleController = {
    
    ListVehicles: async (req, res) => {
        try {
            let vehiculos = await vehicleService.getAll();
            res.render("listadoVehiculos", {
                vehiculos,
                vehiculoSeleccionado: null,
                ultimosMantenimientos: [],
                ultimasAsignaciones:   [],
                asignacionActiva: null
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

    processMaintenance: async (req,res) => {

        try {
            console.log("holaaa")
            console.log(req.body)
            await vehicleService.createMaintenance(req.body);

            res.redirect('/Mantenimientos');

        } catch (error) {

            console.log(error);

            res.send("Error al guardar mantenimiento");

        }

    },

    getVehicleById: async (req, res) => {
        try {
            const id = req.params.id;
            const vehiculo   = await vehicleService.getOne(id);
            const vehiculos  = await vehicleService.getAll();
            const ultimosMantenimientos = await vehicleService.getLastMantenimientos(id);
            const ultimasAsignaciones   = await vehicleService.getLastAsignaciones(id);
    
            // Asignación activa del vehículo
            const asignacionActiva = await vehicleService.getAsignacionActiva(id);
    
            res.render("listadoVehiculos", { 
                vehiculos, 
                vehiculoSeleccionado: vehiculo,
                ultimosMantenimientos,
                ultimasAsignaciones,
                asignacionActiva: asignacionActiva || null
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
            const anio     = vehiculo.anio;
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
    
            await vehicleService.update(req.params.id, req.body);
            res.redirect(`/Vehicles/${req.params.id}`);
    
        } catch (error) {
            console.log(error);
            res.send("Error al actualizar");
        }
    },

    CargaActualizarKm: async (req, res) => {
        try {
            const asignaciones = await vehicleService.getVehiculosAsignados();
            res.render('ActualizarKm', { asignaciones });
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
