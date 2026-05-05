const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const Chofer = require('../model/database/models/Chofer');

const choferService = {

    getAll: async function () {

    try {
      return await db.Chofer.findAll ({
      })
    } catch (error) {
      console.log(error);
      return [];
    }
  },
    getOne: async function (id) {
      try {
          Chofer = await db.Chofer.findByPk(id);
          return Chofer;

      } catch (error) {
        console.log("error");
        return null;

      }

  },

    findByPk: async function (id) {
      try {
          let allChoferes = await this.getAll(); // Aquí se llama a la función
          let OneChofer = allChoferes.find(onechofer => onechofer.id === id);
          return OneChofer;
      } catch (error) {

      }
  },

  create: async function (req) {
        try {
            let newChofer = await db.Chofer.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                dni: req.body.dni,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                estado: req.body.estado,
            })
            return newChofer
        } catch (error) {

        }
    },
    
    update: async function(id, data) {
    try {

        await db.Chofer.update(data, {
            where: {
                id_chofer: id
            }
        });

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
},
    
    


}

module.exports = choferService