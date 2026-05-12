const path = require("path");
const fs = require("fs");

const vehicleService = require("../data/vehicleService");

const vehicleController = {
  // =========================
  // HOME
  // =========================
  Home: async (req, res) => {
    try {
      res.render("index");
    } catch (error) {
      console.log(error);
      res.send("Error al cargar la página principal");
    }
  },

  // =========================
  // LISTAR VEHÍCULOS
  // =========================
  ListVehicles: async (req, res) => {
    try {
      const vehiculos = await vehicleService.getAll();

      console.log(vehiculos);

      res.render("listadoVehiculos", {
        vehiculos,
        vehiculoSeleccionado: null,
      });
    } catch (error) {
      console.log(error);
      res.send("Error al obtener vehículos");
    }
  },

  // =========================
  // OBTENER VEHÍCULO POR ID
  // =========================
  getVehicleById: async (req, res) => {
    try {
      const id = req.params.id;

      const vehiculo = await vehicleService.getOne(id);

      const vehiculos = await vehicleService.getAll();

      res.render("listadoVehiculos", {
        vehiculos,
        vehiculoSeleccionado: vehiculo,
      });
    } catch (error) {
      console.log(error);
      res.send("Error al obtener el vehículo");
    }
  },

  // =========================
  // FORMULARIO CARGA VEHÍCULO
  // =========================
  CargaVehiculo: async (req, res) => {
    try {
      res.render("CargaFichaVehiculo");
    } catch (error) {
      console.log(error);
      res.send("Error al cargar formulario");
    }
  },

  // =========================
  // MANTENIMIENTOS
  // =========================
  Mantenimientos: async (req, res) => {
    try {
      res.render("Mantenimientos");
    } catch (error) {
      console.log(error);
      res.send("Error al cargar mantenimientos");
    }
  },

  // =========================
  // PROCESAR NUEVO VEHÍCULO
  // =========================
  processVehicle: async (req, res) => {
    try {
      const newVehicle = await vehicleService.create(req);

      console.log(req.body);
      console.log(newVehicle);

      res.redirect("/Vehicles");
    } catch (error) {
      console.log(error);
      res.send("Error al guardar vehículo");
    }
  },
};

module.exports = vehicleController;
