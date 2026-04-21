const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');

const vehicleService = {

    getData: async function () {
    try {
      return await db.Vehiculo.findAll({
        // include: []  ← solo si tenés relaciones
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
}

module.exports = vehicleService