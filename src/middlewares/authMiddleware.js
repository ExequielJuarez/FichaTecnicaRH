// src/middlewares/authMiddleware.js

function authMiddleware(req, res, next) {
  // Preguntamos: ¿Existe una sesión y hay un usuario logueado en ella?
  if (req.session && req.session.usuarioLogueado) {
    // Tiene la credencial, lo dejamos pasar a la vista que pidió
    return next();
  } else {
    // No tiene credencial, lo mandamos directo al Inicio de Sesión
    return res.redirect("/InicioSesion");
  }
}

module.exports = authMiddleware;
