const express = require("express");
const router = express.Router();

const auditoriaController = require('../controllers/auditoriaController')
const vehicleController    = require('../controllers/vehicleController');
const userController       = require('../controllers/userController');
const choferController     = require('../controllers/choferController');
const toolController       = require('../controllers/toolController');
const assignmentController = require('../controllers/assignmentController');
const authMiddleware       = require("../middlewares/authMiddleware");
const {
  choferVAlidation,
  choferEditValidation
} = require("../validations/choferValidation");
const alertaController = require('../controllers/alertaController');

// ================= LOGIN Y LOGOUT =================
router.get('/InicioSesion', userController.InicioSesion);
router.post('/InicioSesion', userController.ProcesoIniciarSesion);
router.get('/CerrarSesion', userController.CerrarSesion);

// ================= USUARIOS =================
router.get('/Usuarios',                    authMiddleware, userController.ListarUsuarios);
router.get('/Usuarios/Roles',              authMiddleware, userController.ListarRoles);
router.get('/Usuarios/Carga',              authMiddleware, userController.CargaUsuario);
router.post('/Usuarios/Carga',             authMiddleware, userController.ProcesoCargaUsuario);
router.get('/Usuarios/Editar/:id',         authMiddleware, userController.EditarUsuario);
router.post('/Usuarios/Editar/:id',        authMiddleware, userController.ProcesoEditarUsuario);
router.get('/Usuarios/Roles/Editar/:id',   authMiddleware, userController.EditarRol);
router.post('/Usuarios/Roles/Editar/:id',  authMiddleware, userController.ProcesoEditarRol);


// ================= VEHICULOS =================
router.get('/Vehicles/Editar/:id',  authMiddleware, vehicleController.EditVehiculo);
router.post('/Vehicles/Editar/:id', authMiddleware, vehicleController.processEditVehiculo);
router.get('/Vehicles',             authMiddleware, vehicleController.ListVehicles);
router.get('/Vehicles/:id',         authMiddleware, vehicleController.getVehicleById);
router.get('/CargaVehiculo',        authMiddleware, vehicleController.CargaVehiculo);
router.post('/CargaVehiculo',       authMiddleware, vehicleController.processVehicle);
router.get('/ActualizarKm', vehicleController.CargaActualizarKm);
router.post('/ActualizarKm', vehicleController.processActualizarKm);

// ================= CHOFERES ================= //para editar
router.get('/Choferes',        authMiddleware, choferController.ListChoferes);
router.get('/Choferes/carga',  authMiddleware, choferController.createChofer);
router.post('/Choferes/carga', authMiddleware, choferController.processChofer);

router.get('/Choferes',  choferController.ListChoferes);
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
router.get('/Mantenimientos',                        authMiddleware, vehicleController.Mantenimientos);
router.get('/Mantenimientos/carga/:id_vehiculo',     authMiddleware, vehicleController.CargaVMantenimiento);
router.get('/Mantenimientos/carga',                  authMiddleware, vehicleController.CargaVMantenimiento);
router.post('/CargaMantenimiento',                   authMiddleware, vehicleController.processMaintenance);

// ================= ASIGNACIONES =================
router.get('/asignaciones',              authMiddleware, assignmentController.showForm);
router.post('/asignaciones',             authMiddleware, assignmentController.create);
router.post('/asignaciones/:id/finalizar', authMiddleware, assignmentController.finalize);

// ================= HERRAMIENTAS =================
router.get('/Tools',                            authMiddleware, toolController.ListTools);
router.get('/Tools/Carga',                      authMiddleware, toolController.CargaHerramienta);
router.post('/Tools/ProcessCarga',              authMiddleware, toolController.processTool);
router.get('/Tools/Editar/:id',                 authMiddleware, toolController.EditHerramienta);
router.post('/Tools/Editar/:id',                authMiddleware, toolController.processEditTool);
router.post('/Tools/Eliminar/:id',              authMiddleware, toolController.deleteTool);
router.get('/Tools/Prestamos',                  authMiddleware, toolController.ListPrestamos);
router.get('/Tools/Prestamo/:id',               authMiddleware, toolController.CargaPrestamo);
router.post('/Tools/Prestamo',                  authMiddleware, toolController.processPrestamo);
router.post('/Tools/Devolucion',                authMiddleware, toolController.processDevolucion);
router.get('/Tools/Ajustes',                    authMiddleware, toolController.Ajustes);
router.post('/Tools/Ajustes/Sectores',          authMiddleware, toolController.createSector);
router.post('/Tools/Ajustes/Sectores/Eliminar/:id', authMiddleware, toolController.deleteSector);
router.post('/Tools/Ajustes/Operarios',         authMiddleware, toolController.createOperario);
router.post('/Tools/Ajustes/Operarios/Eliminar/:id', authMiddleware, toolController.deleteOperario);
router.get('/Tools/:id',                        authMiddleware, toolController.getToolById);

// Ruta raíz
router.get("/", (req, res) => res.redirect("/InicioSesion"));

//======================= Alertas =======================
router.get('/Alertas',                alertaController.ListAlertas);
router.get('/Alertas/recientes',      alertaController.getRecientes);   // ANTES de /:id
router.post('/Alertas/leer-todas',    alertaController.marcarTodasLeidas);
router.post('/Alertas/:id/leer',      alertaController.marcarLeida);
router.get('/Alertas/:id',            alertaController.detalleAlerta);  // DESPUÉS

router.get("/Auditoria", authMiddleware, auditoriaController.ListarAuditoria);

module.exports = router;
