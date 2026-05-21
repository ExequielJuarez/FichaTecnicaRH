const path = require("path");
const fs = require("fs");
const userService = require("../data/userService");
const db = require("../model/database/models");
const bcrypt = require("bcryptjs");

const userController = {
  InicioSesion: async (req, res) => {
    try {
      res.render("Inicio_Sesion");
    } catch (error) {
      console.log(error);
      res.send("Error al cargar la vista de inicio de sesión");
    }
  },

  ProcesoIniciarSesion: async (req, res) => {
    try {
      let usuarioIngresado = req.body.usuario || req.body.Usuario;
      let contrasenaIngresada = req.body.contrasena || req.body.Contrasena;

      if (!usuarioIngresado || !contrasenaIngresada) {
        return res.send(
          "Error: Los campos del formulario están llegando vacíos.",
        );
      }

      let UsuarioDB = await db.Usuario.findOne({
        where: { nombre_usuario: usuarioIngresado },
        include: [{ association: "rol" }],
      });

      if (!UsuarioDB) {
        return res.send(
          `Error: El usuario '${usuarioIngresado}' no existe en la base de datos.`,
        );
      }

      if (UsuarioDB.activo === false || UsuarioDB.activo === 0) {
        return res.send("Error: Tu usuario ha sido bloqueado o desactivado.");
      }

      const contrasenaValida = bcrypt.compareSync(
        contrasenaIngresada,
        UsuarioDB.contrasena,
      );

      if (contrasenaValida) {
        req.session.usuarioLogueado = {
          id: UsuarioDB.id_usuario,
          nombre: UsuarioDB.nombre,
          apellido: UsuarioDB.apellido,
          rol: UsuarioDB.rol ? UsuarioDB.rol.nombre : "Usuario",
          permisos:
            UsuarioDB.rol && UsuarioDB.rol.permisos
              ? UsuarioDB.rol.permisos.split(",")
              : [],
        };

        res.redirect("/Vehicles");
      } else {
        res.send("Error: La contraseña es incorrecta.");
      }
    } catch (error) {
      console.log(error);
      res.send("Error interno durante el inicio de sesión");
    }
  },

  CerrarSesion: (req, res) => {
    req.session.destroy();
    res.redirect("/InicioSesion");
  },

  ListarUsuarios: async (req, res) => {
    try {
      let usuariosDB = await db.Usuario.findAll({
        include: [{ association: "rol" }],
      });
      res.render("listadoUsuarios", { usuarios: usuariosDB });
    } catch (error) {
      console.log(error);
      res.send("Error al cargar la lista de usuarios.");
    }
  },

  CargaUsuario: async (req, res) => {
    try {
      let rolesDB = await db.Rol.findAll();
      res.render("CargaUsuario", { roles: rolesDB });
    } catch (error) {
      console.log(error);
      res.send("Error al cargar el formulario de usuarios.");
    }
  },

  ProcesoCargaUsuario: async (req, res) => {
    try {
      const { nombre, apellido, nombre_usuario, contrasena, id_rol } = req.body;
      const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10);

      await db.Usuario.create({
        nombre: nombre,
        apellido: apellido,
        nombre_usuario: nombre_usuario,
        contrasena: contrasenaEncriptada,
        id_rol: id_rol,
        activo: true,
      });

      res.redirect("/Usuarios");
    } catch (error) {
      console.log(error);
      res.send("Error al intentar guardar el usuario en la base de datos.");
    }
  },

  EditarUsuario: async (req, res) => {
    try {
      let idUsuario = req.params.id;
      let usuarioAEditar = await db.Usuario.findByPk(idUsuario);
      let rolesDB = await db.Rol.findAll();

      res.render("EditarUsuario", {
        usuario: usuarioAEditar,
        roles: rolesDB,
      });
    } catch (error) {
      console.log(error);
      res.send("Error al buscar el usuario a editar.");
    }
  },

  ProcesoEditarUsuario: async (req, res) => {
    try {
      let idUsuario = req.params.id;
      const { nombre, apellido, nombre_usuario, id_rol, estado } = req.body;
      let estadoBooleano = estado === "1";

      await db.Usuario.update(
        {
          nombre: nombre,
          apellido: apellido,
          nombre_usuario: nombre_usuario,
          id_rol: id_rol,
          activo: estadoBooleano,
        },
        {
          where: { id_usuario: idUsuario },
        },
      );

      res.redirect("/Usuarios");
    } catch (error) {
      console.log(error);
      res.send("Error al actualizar el usuario.");
    }
  },

  EditarRol: async (req, res) => {
    try {
      let rol = await db.Rol.findByPk(req.params.id);
      let permisosActuales = rol.permisos ? rol.permisos.split(",") : [];
      res.render("EditarRol", { rol, permisosActuales });
    } catch (error) {
      console.log(error);
      res.send("Error al buscar el rol a editar.");
    }
  },

  ProcesoEditarRol: async (req, res) => {
    try {
      let { vistas } = req.body;
      let permisosString = Array.isArray(vistas)
        ? vistas.join(",")
        : vistas || "";

      await db.Rol.update(
        { permisos: permisosString },
        { where: { id_rol: req.params.id } },
      );
      res.redirect("/Usuarios/Roles");
    } catch (error) {
      console.log(error);
      res.send("Error al actualizar los permisos del rol.");
    }
  },

  ListarRoles: async (req, res) => {
    try {
      let roles = await db.Rol.findAll();
      res.render("ListadoRoles", { roles });
    } catch (error) {
      console.log(error);
      res.send("Error al listar roles");
    }
  },
};

module.exports = userController;
