const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

// 1. Importar la base de datos (esto llama al index.js de models)
const db = require('./model/database/models');

const app = express();

// Importar rutas
const indexRouter = require('./routes/index.Routes');

// Puerto
const puerto = 3000;

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Procesar formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Agregado: buena práctica por si en el futuro envías datos en formato JSON

// Permitir métodos PUT y DELETE
app.use(methodOverride('_method'));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', indexRouter);

// 2. Autenticar la conexión a la base de datos y luego iniciar el servidor
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
    
    // Opcional: Si quieres que Sequelize cree las tablas por ti si no existen, descomenta la siguiente línea:
    //db.sequelize.sync({ force: false });

    // Iniciar servidor
    app.listen(puerto, () => {
        console.log(`🚀 Servidor Express corriendo en el puerto ${puerto}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });
