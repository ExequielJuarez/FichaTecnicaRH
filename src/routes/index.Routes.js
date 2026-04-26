
const express = require("express");
const router = express.Router();
const vehicleController = require('../controllers/vehicleController')


router.get('/Vehicles', vehicleController.List)

module.exports=router;