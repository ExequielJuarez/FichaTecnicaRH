
const express = require("express");
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const userController = require('../controllers/userController');
const choferController = require('../controllers/choferController');


router.get('/Vehicles', vehicleController.ListVehicles);

router.get('/Vehicles/:id', vehicleController.ListVehicles);

router.get('/Mantenimientos', vehicleController.Mantenimientos);

router.get('/cargaVehiculo', vehicleController.CargaVehiculo);

router.post('/cargaVehiculo', vehicleController.processVehicle);

router.get('/InicioSesion',userController.InicioSesion);

router.post('/InicioSesion',userController.ProcesoIniciarSesion);

router.get('/Choferes', choferController.ListChoferes);

router.get('/Choferes/Carga', choferController.createChofer);

router.post('/Choferes/Carga', choferController.processChofer);

module.exports=router;