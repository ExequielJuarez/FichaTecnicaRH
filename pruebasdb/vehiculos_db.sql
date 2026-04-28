
CREATE DATABASE IF NOT EXISTS vehiculos_db;

USE vehiculos_db;

CREATE TABLE rol (
  id_rol       INT          NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(50)  NOT NULL,
  descripcion  VARCHAR(255),
  PRIMARY KEY (id_rol)
);

CREATE TABLE usuario (
  id_usuario      INT          NOT NULL AUTO_INCREMENT,
  nombre_usuario  VARCHAR(50)  NOT NULL UNIQUE,
  contrasena      VARCHAR(255) NOT NULL,   -- guardar hash (bcrypt)
  nombre          VARCHAR(50)  NOT NULL,
  apellido        VARCHAR(50)  NOT NULL,
  activo          BOOLEAN      NOT NULL DEFAULT TRUE,
  id_rol          INT          NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
);

--  TIPOS DE VEHÍCULO

CREATE TABLE tipo_vehiculo (
  id_tipo      INT          NOT NULL AUTO_INCREMENT,
  descripcion  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_tipo)
);

--  VEHÍCULOS

CREATE TABLE vehiculo (
  id_vehiculo    INT          NOT NULL AUTO_INCREMENT,
  patente        VARCHAR(20)  NOT NULL UNIQUE,
  legajo         VARCHAR(30)  UNIQUE,
  marca          VARCHAR(50)  NOT NULL,
  modelo         VARCHAR(50)  NOT NULL,
  anio           INT          NOT NULL,
  id_tipo        INT          NOT NULL,
  num_chasis     VARCHAR(50),
  num_motor      VARCHAR(50),
  transmision    VARCHAR(20),               -- Manual, Automática
  km_actual      INT          NOT NULL DEFAULT 0,
  estado_actual  VARCHAR(30)  NOT NULL DEFAULT 'Disponible',
  distrito       VARCHAR(50),
  area           VARCHAR(100),
  observaciones  TEXT,
  imagen_url     VARCHAR(255),
  fecha_alta     DATE         NOT NULL,
  fecha_baja     DATE,
  PRIMARY KEY (id_vehiculo),
  CONSTRAINT fk_vehiculo_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_vehiculo (id_tipo)
);

--  CHOFERES

CREATE TABLE chofer (
  id_chofer  INT          NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(50)  NOT NULL,
  apellido   VARCHAR(50)  NOT NULL,
  dni        VARCHAR(20)  NOT NULL UNIQUE,
  telefono   VARCHAR(20),
  direccion  VARCHAR(150),
  estado     VARCHAR(20)  NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (id_chofer)
);

CREATE TABLE licencia_chofer (
  id_licencia       INT         NOT NULL AUTO_INCREMENT,
  id_chofer         INT         NOT NULL,
  numero            VARCHAR(50) NOT NULL,
  categoria         VARCHAR(20) NOT NULL,
  fecha_emision     DATE        NOT NULL,
  fecha_vencimiento DATE        NOT NULL,
  PRIMARY KEY (id_licencia),
  CONSTRAINT fk_licencia_chofer FOREIGN KEY (id_chofer) REFERENCES chofer (id_chofer)
);

--  ASIGNACIÓN DE VEHÍCULOS A CHOFERES

CREATE TABLE asignacion_vehiculo (
  id_asignacion              INT          NOT NULL AUTO_INCREMENT,
  id_vehiculo                INT          NOT NULL,
  id_chofer                  INT          NOT NULL,
  fecha_salida               DATETIME     NOT NULL,
  fecha_estimada_devolucion  DATETIME,
  fecha_devolucion           DATETIME,
  destino_area               VARCHAR(100),
  observaciones              TEXT,
  estado                     VARCHAR(20)  NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (id_asignacion),
  CONSTRAINT fk_asig_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id_vehiculo),
  CONSTRAINT fk_asig_chofer   FOREIGN KEY (id_chofer)   REFERENCES chofer   (id_chofer)
);

--  DOCUMENTACIÓN DEL VEHÍCULO

CREATE TABLE documentacion (
  id_documentacion  INT          NOT NULL AUTO_INCREMENT,
  id_vehiculo       INT          NOT NULL,
  tipo_documento    VARCHAR(100) NOT NULL,  -- Seguro, Cédula, Título, Oblea GNC, Revisión
  fecha_emision     DATE,
  fecha_vencimiento DATE,
  archivo           VARCHAR(255),
  estado            VARCHAR(20)  NOT NULL DEFAULT 'Vigente',
  PRIMARY KEY (id_documentacion),
  CONSTRAINT fk_doc_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id_vehiculo)
);

--  REPUESTOS / STOCK

CREATE TABLE repuesto (
  id_repuesto   INT          NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  descripcion   TEXT,
  unidad_medida VARCHAR(30),
  stock_actual  INT          NOT NULL DEFAULT 0,
  stock_minimo  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id_repuesto)
);

CREATE TABLE movimiento_stock (
  id_movimiento   INT         NOT NULL AUTO_INCREMENT,
  id_repuesto     INT         NOT NULL,
  id_usuario      INT         NOT NULL,
  tipo_movimiento VARCHAR(20) NOT NULL,     -- Entrada, Salida
  cantidad        INT         NOT NULL,
  fecha           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion     TEXT,
  PRIMARY KEY (id_movimiento),
  CONSTRAINT fk_mov_repuesto FOREIGN KEY (id_repuesto) REFERENCES repuesto (id_repuesto),
  CONSTRAINT fk_mov_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuario  (id_usuario)
);

--  MANTENIMIENTOS

CREATE TABLE mantenimiento (
  id_mantenimiento  INT             NOT NULL AUTO_INCREMENT,
  id_vehiculo       INT             NOT NULL,
  id_usuario        INT             NOT NULL,
  tipo_servicio     VARCHAR(100)    NOT NULL,
  fecha_inicio      DATE            NOT NULL,
  fecha_fin         DATE,
  km_servicio       INT             NOT NULL,
  costo_total       DECIMAL(12,2),
  descripcion       TEXT,
  proximo_km        INT,
  proxima_fecha     DATE,
  estado            VARCHAR(20)     NOT NULL DEFAULT 'Realizado',
  PRIMARY KEY (id_mantenimiento),
  CONSTRAINT fk_mant_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id_vehiculo),
  CONSTRAINT fk_mant_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuario  (id_usuario)
);

CREATE TABLE detalle_mantenimiento (
  id_detalle        INT           NOT NULL AUTO_INCREMENT,
  id_mantenimiento  INT           NOT NULL,
  id_repuesto       INT           NOT NULL,
  cantidad          INT           NOT NULL,
  costo_unitario    DECIMAL(12,2),
  PRIMARY KEY (id_detalle),
  CONSTRAINT fk_det_mant     FOREIGN KEY (id_mantenimiento) REFERENCES mantenimiento (id_mantenimiento),
  CONSTRAINT fk_det_repuesto FOREIGN KEY (id_repuesto)      REFERENCES repuesto      (id_repuesto)
);

--  HERRAMIENTAS / EQUIPOS DEL TALLER

CREATE TABLE herramienta (
  id_herramienta  INT          NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(100) NOT NULL,
  descripcion     TEXT,
  estado          VARCHAR(30)  NOT NULL DEFAULT 'Disponible',
  PRIMARY KEY (id_herramienta)
);

CREATE TABLE prestamo_herramienta (
  id_prestamo               INT         NOT NULL AUTO_INCREMENT,
  id_herramienta            INT         NOT NULL,
  id_usuario                INT         NOT NULL,
  fecha_salida              DATETIME    NOT NULL,
  fecha_estimada_devolucion DATETIME,
  fecha_devolucion          DATETIME,
  observaciones             TEXT,
  estado                    VARCHAR(20) NOT NULL DEFAULT 'Prestado',
  PRIMARY KEY (id_prestamo),
  CONSTRAINT fk_prest_herramienta FOREIGN KEY (id_herramienta) REFERENCES herramienta (id_herramienta),
  CONSTRAINT fk_prest_usuario     FOREIGN KEY (id_usuario)     REFERENCES usuario     (id_usuario)
);

--  AUDITORÍA GENERAL DEL SISTEMA

CREATE TABLE auditoria (
  id_auditoria         INT          NOT NULL AUTO_INCREMENT,
  id_usuario           INT          NOT NULL,
  tabla_afectada       VARCHAR(100) NOT NULL,
  id_registro_afectado INT,
  accion               VARCHAR(20)  NOT NULL,   -- INSERT, UPDATE, DELETE (lógico)
  fecha                DATE         NOT NULL,
  hora                 TIME         NOT NULL,
  valor_anterior       TEXT,
  valor_nuevo          TEXT,
  descripcion          TEXT,
  PRIMARY KEY (id_auditoria),
  CONSTRAINT fk_audit_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

--  DATOS INICIALES

INSERT INTO rol (nombre, descripcion) VALUES
  ('Administrador',  'Acceso total al sistema'),
  ('Jefe de Taller', 'Acceso a mantenimientos, repuestos y herramientas'),
  ('Principal',      'Acceso de supervisión general y reportes');

INSERT INTO tipo_vehiculo (descripcion) VALUES
  ('Camioneta'),
  ('Camión'),
  ('Maquinaria pesada'),
  ('Utilitario'),
  ('Auto'),
  ('Motocicleta');

-- Usuario administrador por defecto (reemplazar hash antes de producción)
INSERT INTO usuario (nombre_usuario, contrasena, nombre, apellido, id_rol) VALUES
  ('admin', '$2b$10$PLACEHOLDER_HASH', 'Administrador', 'Sistema', 1);

--  ÍNDICES PARA RENDIMIENTO

CREATE INDEX idx_vehiculo_patente ON vehiculo            (patente);
CREATE INDEX idx_vehiculo_estado  ON vehiculo            (estado_actual);
CREATE INDEX idx_asig_vehiculo    ON asignacion_vehiculo (id_vehiculo);
CREATE INDEX idx_asig_chofer      ON asignacion_vehiculo (id_chofer);
CREATE INDEX idx_mant_vehiculo    ON mantenimiento       (id_vehiculo);
CREATE INDEX idx_mant_fecha       ON mantenimiento       (fecha_inicio);
CREATE INDEX idx_doc_vencimiento  ON documentacion       (id_vehiculo, fecha_vencimiento);
CREATE INDEX idx_stock_repuesto   ON repuesto            (stock_actual);
CREATE INDEX idx_audit_usuario    ON auditoria           (id_usuario);
CREATE INDEX idx_audit_fecha      ON auditoria           (fecha);


