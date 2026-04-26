const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');

const vehicleService = {

    getAll: async function () {

    try {
      return await db.Vehiculo.findAll ({
      })
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

module.exports = vehicleService