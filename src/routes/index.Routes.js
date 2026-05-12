const express = require("express");
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const userController = require('../controllers/userController');
const choferController = require('../controllers/choferController');


// ================= VEHICULOS =================

router.get('/Vehicles', vehicleController.ListVehicles);

router.get('/Vehicles/:id', vehicleController.getVehicleById);

router.get('/cargaVehiculo', vehicleController.CargaVehiculo);

router.post('/cargaVehiculo', vehicleController.processVehicle);


// ================= CHOFERES =================

router.get('/Choferes', choferController.ListChoferes);

router.get('/Choferes/Carga', choferController.createChofer);

router.post('/Choferes/Carga', choferController.processChofer);

// ================= MANTENIMIENTOS =================
router.get('/Mantenimientos', vehicleController.Mantenimientos);

// FORMULARIO
router.get('/Mantenimientos/carga', vehicleController.CargaVMantenimiento);

// GUARDAR MANTENIMIENTO
router.post('/CargaMantenimiento', vehicleController.processMaintenance);


// ================= LOGIN =================

router.get('/InicioSesion', userController.InicioSesion);

router.post('/InicioSesion', userController.ProcesoIniciarSesion);


module.exports = router;

