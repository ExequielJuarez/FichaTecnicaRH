const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session"); // PASO 1: Importamos la librería de sesiones
const alertaService = require('./data/alertaService');

// 1. Importar la base de datos (esto llama al index.js de models)
const db = require("./model/database/models");

const cron                  = require('node-cron');
const alertaGeneradorService = require('./data/alertaGeneradorService');

const app = express();

app.use(async (req, res, next) => {
    try {
        res.locals.noLeidas = await alertaService.contarNoLeidas();
    } catch (e) {
        res.locals.noLeidas = 0;
    }
    next();
});

// Importar rutas
const indexRouter = require("./routes/index.Routes");

// Puerto
const puerto = 3000;

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Procesar formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Permitir métodos PUT y DELETE
app.use(methodOverride("_method"));

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración de Sesiones (PASO 1: Debe ir ANTES de las rutas)
app.use(
  session({
    secret: "Secreto_FichaTecnica_123",
    resave: false,
    saveUninitialized: false,
  }),
);

// Megáfono global: Pasa los datos de la sesión a todas las vistas EJS
app.use((req, res, next) => {
  // Creamos una variable global llamada "usuarioLocal" que el HTML podrá leer
  res.locals.usuarioLocal = req.session.usuarioLogueado || null;
  next();
});

// RUTA DE EMERGENCIA: Borra la sesión actual
app.get("/reset", (req, res) => {
  req.session.destroy();
  res.send("Sesión destruida. Ahora vuelve a /InicioSesion");
});

// Rutas
app.use("/", indexRouter);

// 2. Autenticar la conexión a la base de datos y luego iniciar el servidor
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos MySQL establecida con éxito.");

    // Opcional: Si quieres que Sequelize cree las tablas por ti si no existen, descomenta la siguiente línea:
    db.sequelize.sync({ force: false });

    // Iniciar servidor
    app.listen(puerto, () => {
      console.log(`🚀 Servidor Express corriendo en el puerto ${puerto}`);
      
    });
    // Generar alertas al iniciar el servidor
    alertaGeneradorService.generarTodas();

    // Cron: se ejecuta todos los días a las 7am
    cron.schedule('0 7 * * *', () => {
        console.log('⏰ Cron job: generando alertas automáticas...');
        alertaGeneradorService.generarTodas();
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });
