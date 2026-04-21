const path = require('path');
const fs = require('fs');
const vehicleService = require('../data/vehicleService')

const vehicleController = {
    index:(req,res) => {
        res.render('CargaDeFicha')
    }
}

module.exports = vehicleController;