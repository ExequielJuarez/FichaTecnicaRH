const express = require("express");
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const userController = require('../controllers/userController');
const choferController = require('../controllers/choferController');
const toolController = require('../controllers/toolController')
const assignmentController = require('../controllers/assignmentController');

const {
    choferVAlidation,
    choferEditValidation
} = require("../validations/choferValidation");
const alertaController = require('../controllers/alertaController');

// ================= VEHICULOS =================

// Editar vehículo
router.get('/Vehicles/Editar/:id', vehicleController.EditVehiculo);
router.post('/Vehicles/Editar/:id', vehicleController.processEditVehiculo);

router.get('/Vehicles', vehicleController.ListVehicles);

router.get('/Vehicles/:id', vehicleController.getVehicleById);

router.get('/cargaVehiculo', vehicleController.CargaVehiculo);

router.post('/cargaVehiculo', vehicleController.processVehicle);


// ================= CHOFERES =================

router.get('/Choferes',                choferController.ListChoferes);
router.get('/Choferes/Carga',          choferController.createChofer);
router.post('/Choferes/Carga',         choferVAlidation(), choferController.processChofer);

router.get('/Choferes/:id/editar',     choferController.editChofer);
router.post(
    '/Choferes/:id/editar',
    choferEditValidation(),
    choferController.processEdit
);

router.post('/Choferes/:id/desactivar', choferController.desactivarChofer);


// ================= MANTENIMIENTOS =================
router.get('/Mantenimientos', vehicleController.Mantenimientos);

// FORMULARIO
router.get('/Mantenimientos/carga/:id_vehiculo', vehicleController.CargaVMantenimiento);
router.get('/Mantenimientos/carga', vehicleController.CargaVMantenimiento); 

// GUARDAR MANTENIMIENTO
router.post('/CargaMantenimiento', vehicleController.processMaintenance);


// ASIGNACIONES 
router.get('/Asignaciones',assignmentController.showForm);
router.post('/Asignaciones',assignmentController.create);
router.post('/Asignaciones/:id/finalizar', assignmentController.finalize);


// =========================
// HERRAMIENTAS
// =========================
router.get("/Tools", toolController.ListTools);
router.get("/Tools/Carga", toolController.CargaHerramienta);
router.post("/Tools/ProcessCarga", toolController.processTool);

// Edición y Eliminación
router.get("/Tools/Editar/:id", toolController.EditHerramienta);
router.post("/Tools/Editar/:id", toolController.processEditTool);
router.post("/Tools/Eliminar/:id", toolController.deleteTool);

// Préstamos y Devoluciones
router.get("/Tools/Prestamos", toolController.ListPrestamos);
router.get("/Tools/Prestamo/:id", toolController.CargaPrestamo);
router.post("/Tools/Prestamo", toolController.processPrestamo);
router.post("/Tools/Devolucion", toolController.processDevolucion);

// =========================
// AJUSTES Y CATÁLOGOS
// =========================
router.get("/Tools/Ajustes", toolController.Ajustes);
router.post("/Tools/Ajustes/Sectores", toolController.createSector);
router.post(
  "/Tools/Ajustes/Sectores/Eliminar/:id",
  toolController.deleteSector,
);
router.post("/Tools/Ajustes/Operarios", toolController.createOperario);
router.post(
  "/Tools/Ajustes/Operarios/Eliminar/:id",
  toolController.deleteOperario,
);

// Detalle (Siempre al final)
router.get("/Tools/:id", toolController.getToolById);



// ================= LOGIN =================

router.get('/InicioSesion', userController.InicioSesion);

router.post('/InicioSesion', userController.ProcesoIniciarSesion);


module.exports = router;

//======================= Alertas =======================
router.get('/Alertas',                alertaController.ListAlertas);
router.get('/Alertas/recientes',      alertaController.getRecientes);   // ANTES de /:id
router.post('/Alertas/leer-todas',    alertaController.marcarTodasLeidas);
router.post('/Alertas/:id/leer',      alertaController.marcarLeida);
router.get('/Alertas/:id',            alertaController.detalleAlerta);  // DESPUÉS
