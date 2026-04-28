
const express = require("express");
const router = express.Router();
const vehicleController = require('../controllers/vehicleController')


router.get('/Vehicles', vehicleController.ListVehicles);

router.get('/Mantenimientos', vehicleController.Mantenimientos);

router.get('/cargaVehiculo', vehicleController.CargaVehiculo);

router.post('/cargaVehiculo', vehicleController.processVehicle);


module.exports=router;