const db = require("../model/database/models");
const fs = require("fs");
const path = require("path");

const vehicleService = {
  // =========================
  // OBTENER TODOS LOS VEHÍCULOS
  // =========================
  getAll: async function () {
    try {
      const vehiculos = await db.Vehiculo.findAll();
      return vehiculos;
    } catch (error) {
      console.log("Error en getAll:", error);
      return [];
    }
  },

  // =========================
  // OBTENER VEHÍCULO POR ID
  // =========================
  getOne: async function (id) {
    try {
      const vehicle = await db.Vehiculo.findByPk(id);
      return vehicle;
    } catch (error) {
      console.log("Error en getOne:", error);
      return null;
    }
  },

  // =========================
  // BUSCAR VEHÍCULO POR PK
  // =========================
  findByPk: async function (id) {
    try {
      const allVehicles = await this.getAll();
      const oneVehicle = allVehicles.find(
        (vehicle) => vehicle.id_vehiculo == id, // Asegúrate de que coincida con tu PK
      );
      return oneVehicle;
    } catch (error) {
      console.log("Error en findByPk:", error);
      return null;
    }
  },

  // =========================
  // CREAR VEHÍCULO
  // =========================
  create: async function (req) {
    try {
      const data = req.body;

      const newVehicle = await db.Vehiculo.create({
        patente: data.patente,
        id_tipo: data.id_tipo, // Corregido: el form envía id_tipo
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
        num_chasis: data.chasis, // Mapeado: el form envía chasis
        num_motor: data.num_motor,
        transmision: data.transmision,
        estado_actual: data.estado_actual,
        km_actual: data.km_actual,
        distrito: data.distrito,
        observaciones: data.observaciones, // Agregado: para guardar las observaciones
        imagen_url: data.imagen, // Mapeado: el form envía imagen
        fecha_alta: new Date(), // Autogenerado: fecha actual
      });

      return newVehicle;
    } catch (error) {
      console.log("Error en create:", error);
      throw error; // Lanzar el error ayuda a que el servidor o la consola lo detallen si falla
    }
  },
};

module.exports = vehicleService;
