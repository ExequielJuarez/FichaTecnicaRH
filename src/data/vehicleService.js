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
  },
    getOne: async function (id) {
      try {
          Vehicle = await db.User.findByPk(id);
          return Vehicle;

      } catch (error) {

      }

  },

    findByPk: async function (id) {
      try {
          let allVehicles = await this.getAll(); // Aquí se llama a la función
          let OneVehicle = allVehicles.find(onevehicle => onevehicle.id === id);
          return OneVehicle;
      } catch (error) {

      }
  },

  create: async function (req) {
        try {
            let newVehicle = await db.Vehiculo.create({
                patente: req.body.patente,
                id_tipo: req.body.tipo,
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

        }
    },
    


}

module.exports = vehicleService