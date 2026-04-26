const path = require('path');
const fs = require('fs');
const vehicleService = require('../data/vehicleService')

const vehicleController = {
    
    List: async (req,res) => {
        try {
        let Vehiculos = await vehicleService.getAll();
        console.log(Vehiculos)
        res.render('listadoVehiculos', {vehiculos: Vehiculos})
        } catch (error) {
            
        }
        
    }
}

module.exports = vehicleController;