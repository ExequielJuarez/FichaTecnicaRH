const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const userController = require("../controllers/userController");
const toolController = require("../controllers/toolController");

router.get("/", vehicleController.Home);
router.get("/Vehicles", vehicleController.ListVehicles);
router.get("/CargaVehiculo", vehicleController.CargaVehiculo);
router.post("/CargaVehiculo", vehicleController.processVehicle);
router.get("/Vehicles/:id", vehicleController.getVehicleById);
router.get("/Mantenimientos", vehicleController.Mantenimientos);

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

// Login
router.get("/InicioSesion", userController.InicioSesion);
router.post("/InicioSesion", userController.ProcesoIniciarSesion);

module.exports = router;
