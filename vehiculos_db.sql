-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vehiculos_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asignacion_vehiculo`
--

DROP TABLE IF EXISTS `asignacion_vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignacion_vehiculo` (
  `id_asignacion` int NOT NULL AUTO_INCREMENT,
  `id_vehiculo` int NOT NULL,
  `id_chofer` int NOT NULL,
  `fecha_salida` datetime NOT NULL,
  `fecha_estimada_devolucion` datetime DEFAULT NULL,
  `fecha_devolucion` datetime DEFAULT NULL,
  `destino_area` varchar(100) DEFAULT NULL,
  `observaciones` text,
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id_asignacion`),
  KEY `idx_asig_vehiculo` (`id_vehiculo`),
  KEY `idx_asig_chofer` (`id_chofer`),
  CONSTRAINT `fk_asig_chofer` FOREIGN KEY (`id_chofer`) REFERENCES `chofer` (`id_chofer`),
  CONSTRAINT `fk_asig_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignacion_vehiculo`
--

LOCK TABLES `asignacion_vehiculo` WRITE;
/*!40000 ALTER TABLE `asignacion_vehiculo` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignacion_vehiculo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `tabla_afectada` varchar(100) NOT NULL,
  `id_registro_afectado` int DEFAULT NULL,
  `accion` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `valor_anterior` text,
  `valor_nuevo` text,
  `descripcion` text,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_audit_usuario` (`id_usuario`),
  KEY `idx_audit_fecha` (`fecha`),
  CONSTRAINT `fk_audit_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chofer`
--

DROP TABLE IF EXISTS `chofer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chofer` (
  `id_chofer` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id_chofer`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chofer`
--

LOCK TABLES `chofer` WRITE;
/*!40000 ALTER TABLE `chofer` DISABLE KEYS */;
/*!40000 ALTER TABLE `chofer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_mantenimiento`
--

DROP TABLE IF EXISTS `detalle_mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_mantenimiento` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_mantenimiento` int NOT NULL,
  `id_repuesto` int NOT NULL,
  `cantidad` int NOT NULL,
  `costo_unitario` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_det_mant` (`id_mantenimiento`),
  KEY `fk_det_repuesto` (`id_repuesto`),
  CONSTRAINT `fk_det_mant` FOREIGN KEY (`id_mantenimiento`) REFERENCES `mantenimiento` (`id_mantenimiento`),
  CONSTRAINT `fk_det_repuesto` FOREIGN KEY (`id_repuesto`) REFERENCES `repuesto` (`id_repuesto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_mantenimiento`
--

LOCK TABLES `detalle_mantenimiento` WRITE;
/*!40000 ALTER TABLE `detalle_mantenimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_mantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentacion`
--

DROP TABLE IF EXISTS `documentacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentacion` (
  `id_documentacion` int NOT NULL AUTO_INCREMENT,
  `id_vehiculo` int NOT NULL,
  `tipo_documento` varchar(100) NOT NULL,
  `fecha_emision` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Vigente',
  PRIMARY KEY (`id_documentacion`),
  KEY `idx_doc_vencimiento` (`id_vehiculo`,`fecha_vencimiento`),
  CONSTRAINT `fk_doc_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentacion`
--

LOCK TABLES `documentacion` WRITE;
/*!40000 ALTER TABLE `documentacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `herramienta`
--

DROP TABLE IF EXISTS `herramienta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `herramienta` (
  `id_herramienta` int NOT NULL AUTO_INCREMENT,
  `codigo_activo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'Disponible',
  `stock` int NOT NULL DEFAULT '1',
  `combustible_energia` varchar(50) DEFAULT NULL,
  `observaciones` text,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_alta` datetime NOT NULL,
  PRIMARY KEY (`id_herramienta`),
  UNIQUE KEY `codigo_activo` (`codigo_activo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `herramienta`
--

LOCK TABLES `herramienta` WRITE;
/*!40000 ALTER TABLE `herramienta` DISABLE KEYS */;
INSERT INTO `herramienta` VALUES (2,'HTI-002','Amoladora','Mantenimiento Elect.','Disponible',2,'Energia','Se encuentran en buen estado','Sin título.jpg','2026-05-11 03:08:56'),(3,'HTI-003','Destornillador percutor','Taller Mecánico','En uso',1,'Energia','Prueba 3','','2026-05-12 00:30:35');
/*!40000 ALTER TABLE `herramienta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licencia_chofer`
--

DROP TABLE IF EXISTS `licencia_chofer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licencia_chofer` (
  `id_licencia` int NOT NULL AUTO_INCREMENT,
  `id_chofer` int NOT NULL,
  `numero` varchar(50) NOT NULL,
  `categoria` varchar(20) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  PRIMARY KEY (`id_licencia`),
  KEY `fk_licencia_chofer` (`id_chofer`),
  CONSTRAINT `fk_licencia_chofer` FOREIGN KEY (`id_chofer`) REFERENCES `chofer` (`id_chofer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licencia_chofer`
--

LOCK TABLES `licencia_chofer` WRITE;
/*!40000 ALTER TABLE `licencia_chofer` DISABLE KEYS */;
/*!40000 ALTER TABLE `licencia_chofer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mantenimiento`
--

DROP TABLE IF EXISTS `mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenimiento` (
  `id_mantenimiento` int NOT NULL AUTO_INCREMENT,
  `id_vehiculo` int NOT NULL,
  `id_usuario` int NOT NULL,
  `tipo_servicio` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `km_servicio` int NOT NULL,
  `costo_total` decimal(12,2) DEFAULT NULL,
  `descripcion` text,
  `proximo_km` int DEFAULT NULL,
  `proxima_fecha` date DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Realizado',
  PRIMARY KEY (`id_mantenimiento`),
  KEY `fk_mant_usuario` (`id_usuario`),
  KEY `idx_mant_vehiculo` (`id_vehiculo`),
  KEY `idx_mant_fecha` (`fecha_inicio`),
  CONSTRAINT `fk_mant_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_mant_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimiento`
--

LOCK TABLES `mantenimiento` WRITE;
/*!40000 ALTER TABLE `mantenimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `mantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento_stock`
--

DROP TABLE IF EXISTS `movimiento_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento_stock` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_repuesto` int NOT NULL,
  `id_usuario` int NOT NULL,
  `tipo_movimiento` varchar(20) NOT NULL,
  `cantidad` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descripcion` text,
  PRIMARY KEY (`id_movimiento`),
  KEY `fk_mov_repuesto` (`id_repuesto`),
  KEY `fk_mov_usuario` (`id_usuario`),
  CONSTRAINT `fk_mov_repuesto` FOREIGN KEY (`id_repuesto`) REFERENCES `repuesto` (`id_repuesto`),
  CONSTRAINT `fk_mov_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento_stock`
--

LOCK TABLES `movimiento_stock` WRITE;
/*!40000 ALTER TABLE `movimiento_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimiento_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operarios`
--

DROP TABLE IF EXISTS `operarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operarios` (
  `id_operario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(50) DEFAULT 'Activo',
  PRIMARY KEY (`id_operario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operarios`
--

LOCK TABLES `operarios` WRITE;
/*!40000 ALTER TABLE `operarios` DISABLE KEYS */;
INSERT INTO `operarios` VALUES (1,'Hernán Quiroga','Activo'),(2,'Marcos Díaz','Activo'),(4,'Gomez Juan','Activo');
/*!40000 ALTER TABLE `operarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_herramienta` int NOT NULL,
  `nombre_operario` varchar(100) NOT NULL,
  `fecha_salida` datetime NOT NULL,
  `fecha_devolucion_estimada` datetime DEFAULT NULL,
  `fecha_devolucion_real` datetime DEFAULT NULL,
  `sector_destino` varchar(100) DEFAULT NULL,
  `estado_prestamo` varchar(50) NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id_prestamo`),
  KEY `fk_prestamo_herramienta` (`id_herramienta`),
  KEY `idx_prestamo_estado` (`estado_prestamo`),
  CONSTRAINT `fk_prestamo_herramienta` FOREIGN KEY (`id_herramienta`) REFERENCES `herramienta` (`id_herramienta`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
INSERT INTO `prestamo` VALUES (3,2,'Gomez Juan','2026-05-11 00:00:00','2026-05-20 00:00:00','2026-05-11 03:10:00','Espacios Verdes','Finalizado'),(4,2,'Juan Pérez','2026-05-12 00:00:00','2026-06-20 00:00:00','2026-05-11 03:10:44','Taller Central','Finalizado'),(5,3,'Gomez Juan','2026-05-11 00:00:00','2026-06-30 00:00:00',NULL,'Construcción A','Activo');
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repuesto`
--

DROP TABLE IF EXISTS `repuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repuesto` (
  `id_repuesto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `unidad_medida` varchar(30) DEFAULT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_repuesto`),
  KEY `idx_stock_repuesto` (`stock_actual`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repuesto`
--

LOCK TABLES `repuesto` WRITE;
/*!40000 ALTER TABLE `repuesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `repuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `permisos` varchar(255) DEFAULT 'Vehicles',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador','Acceso total al sistema','Vehicles'),(2,'Jefe de Taller','Acceso a mantenimientos, repuestos y herramientas','Vehicles'),(3,'Principal','Acceso de supervisión general y reportes','Vehicles,Choferes');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sectores`
--

DROP TABLE IF EXISTS `sectores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sectores` (
  `id_sector` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_sector`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sectores`
--

LOCK TABLES `sectores` WRITE;
/*!40000 ALTER TABLE `sectores` DISABLE KEYS */;
INSERT INTO `sectores` VALUES (2,'Construcción A'),(3,'Taller Mecánico'),(4,'Espacios Verdes');
/*!40000 ALTER TABLE `sectores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_vehiculo`
--

DROP TABLE IF EXISTS `tipo_vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_vehiculo` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_vehiculo`
--

LOCK TABLES `tipo_vehiculo` WRITE;
/*!40000 ALTER TABLE `tipo_vehiculo` DISABLE KEYS */;
INSERT INTO `tipo_vehiculo` VALUES (1,'Camioneta'),(2,'Camión'),(3,'Maquinaria Pesada'),(4,'Utilitario'),(5,'Auto'),(6,'Motocicleta');
/*!40000 ALTER TABLE `tipo_vehiculo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `id_rol` int NOT NULL,
  `permisos` varchar(255) DEFAULT 'Vehicles',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  KEY `fk_usuario_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin','$2b$10$cYJdVMMJKo4tLfwaizHXme8MoDkDrIylzzq/fpn4mPkwuCg6DAr.2','Administrador','Sistema',1,1,'Vehicles,Choferes,Mantenimientos,Tools,Usuarios,Auditoria'),(2,'carlos_oficina','$2b$10$TUCOaKrHUOH6RVJoyK2vsuJvbC2hvni.6A7SxSQ.5A4EXuDPS54bi','Carlos ','Gerez ',1,3,'Vehicles');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculo`
--

DROP TABLE IF EXISTS `vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculo` (
  `id_vehiculo` int NOT NULL AUTO_INCREMENT,
  `patente` varchar(20) NOT NULL,
  `legajo` varchar(30) DEFAULT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `anio` int NOT NULL,
  `id_tipo` int NOT NULL,
  `num_chasis` varchar(50) DEFAULT NULL,
  `num_motor` varchar(50) DEFAULT NULL,
  `combustible` varchar(30) DEFAULT NULL,
  `transmision` varchar(30) DEFAULT NULL,
  `km_actual` int NOT NULL DEFAULT '0',
  `estado_actual` varchar(50) NOT NULL DEFAULT 'Disponible',
  `distrito` varchar(50) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `observaciones` text,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_alta` date NOT NULL,
  `fecha_baja` date DEFAULT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE KEY `patente` (`patente`),
  UNIQUE KEY `legajo` (`legajo`),
  KEY `fk_vehiculo_tipo` (`id_tipo`),
  KEY `idx_vehiculo_patente` (`patente`),
  KEY `idx_vehiculo_estado` (`estado_actual`),
  CONSTRAINT `fk_vehiculo_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_vehiculo` (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculo`
--

LOCK TABLES `vehiculo` WRITE;
/*!40000 ALTER TABLE `vehiculo` DISABLE KEYS */;
INSERT INTO `vehiculo` VALUES (1,'PPP101',NULL,'TOYOTA','HAYLUX',2000,1,'212313545615646531321546','45642132164654654134654',NULL,'Manual',100000,'Disponible','Centro',NULL,'Carga de Prueba','viscosidad-del-agua-1024x683.jpg.jpg','2026-05-10',NULL);
/*!40000 ALTER TABLE `vehiculo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 17:32:19
