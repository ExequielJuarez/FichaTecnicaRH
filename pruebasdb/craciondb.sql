CREATE DATABASE vehiculos_db;
USE vehiculos_db;

CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_chofer VARCHAR(100) NOT NULL,
    patente VARCHAR(20) NOT NULL UNIQUE,
    kilometraje INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    codigo_motor VARCHAR(50) NOT NULL,
    combustible ENUM('nafta', 'diesel', 'electrico', 'hibrido') NOT NULL,
    tipo ENUM('liviano', 'pesado') NOT NULL
);


