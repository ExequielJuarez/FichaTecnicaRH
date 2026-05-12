const path = require('path');
const fs = require('fs');

const vehicleService = require('../data/vehicleService');

const vehicleController = {
    
    ListVehicles: async (req,res) => {

        try {

            let vehiculos = await vehicleService.getAll();
        
            console.log(vehiculos);

            res.render("listadoVehiculos", { 
                vehiculos, 
                vehiculoSeleccionado: null 
            });

        } catch (error) {      

            console.log(error);

            res.send("Error");

        }

    },

    /* =========================================================
       VISTA CARGA MANTENIMIENTO
    ========================================================= */

    CargaVMantenimiento: async (req,res) => {

        try {

            const data = await vehicleService.getCreateData();

            res.render("cargaMantenimiento", {

                vehiculos: data.vehiculos,

                repuestos: data.repuestos

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

            const vehiculo = await vehicleService.getOne(id);

            const vehiculos = await vehicleService.getAll();

            res.render("listadoVehiculos", { 
                vehiculos, 
                vehiculoSeleccionado: vehiculo
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

    processVehicle : async (req,res) => {

        try {

            let newVehicle = await vehicleService.create(req);

            res.redirect('/Vehicles');

            console.log("hola");

            console.log(req.body);

            console.log(newVehicle);

        } catch (error) {      

            console.log(error);

        }

    },

}

module.exports = vehicleController;