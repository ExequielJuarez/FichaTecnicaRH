const path = require('path');
const fs = require('fs');
const vehicleService = require('../data/vehicleService')



const vehicleController = {
    
    ListVehicles: async (req,res) => {
    try {
        let vehiculos = await vehicleService.getAll();
        
        console.log(vehiculos);
        res.render("listadoVehiculos", { vehiculos });
    } catch (error) {      
        console.log(error);
        res.send("Error");
    }
},

    CargaVehiculo : async (req,res) => {
        try {
        res.render('CargaFichaVehiculo')
        } catch (error) {      
        }
        
    },

    Mantenimientos : async (req,res) => {
        try {
        res.render('Mantenimientos')
        } catch (error) {      
        }


    },

    processVehicle : async (req,res) => {
        try {
        let newVehicle = await vehicleService.create(req);
        res.redirect('/Vehicles');
        console.log("hola")
        console.log(req.body)
        console.log(newVehicle)
        } catch (error) {      
        }


    },

}

module.exports = vehicleController;