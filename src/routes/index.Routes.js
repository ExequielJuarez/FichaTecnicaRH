
const express = require("express");
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const userController = require('../controllers/userController');


router.get('/Vehicles', vehicleController.ListVehicles);

router.get('/Mantenimientos', vehicleController.Mantenimientos);

router.get('/cargaVehiculo', vehicleController.CargaVehiculo);

router.post('/cargaVehiculo', vehicleController.processVehicle);

router.get('/InicioSesion',userController.InicioSesion);

router.post('/InicioSesion',userController.ProcesoIniciarSesion);

module.exports=router;