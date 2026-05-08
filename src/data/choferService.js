const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const Chofer = require('../model/database/models/Chofer');
const { Op } = require('sequelize');

const choferService = {

    getAll: async function (filtros = {}) {

    try {

        const where = {};

        if (filtros.fechaDesde && filtros.fechaHasta) {

            where.createdAt = {
                [Op.gte]: new Date(filtros.fechaDesde),
                [Op.lt]: new Date(
                    new Date(filtros.fechaHasta).setDate(
                        new Date(filtros.fechaHasta).getDate() + 1
                    )
                )
            };

        }

        
        //estado
        if (filtros.estado) {
            where.estado = filtros.estado;
        }
        //licencias
        const includeLicencias = {
            model: db.LicenciaChofer,
            as: 'licencias',
            required: filtros.categoriaLicencia
        };

        if (filtros.categoriaLicencia) {
            includeLicencias.where = {
            categoria: {
                [Op.like]: filtros.categoriaLicencia
            }
            };
        }
        //vehiculos
        const includeAsignaciones = {
            model: db.AsignacionVehiculo,
            as: 'asignaciones',
            required: false,
            include: [
                {
                    model: db.Vehiculo,
                    as: 'vehiculo',
                    required: false
                }
            ]
        };


        return await db.Chofer.findAll({
        where,
        include: [
            includeLicencias,
            includeAsignaciones
        ]
        });
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
            });

            if (req.body.numero_licencia) {
            await db.LicenciaChofer.create({
                id_chofer: newChofer.id_chofer,
                numero: req.body.numero_licencia,
                categoria: req.body.categoria,
                fecha_emision: req.body.fecha_emision,
                fecha_vencimiento: req.body.fecha_vencimiento
            });
            }

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