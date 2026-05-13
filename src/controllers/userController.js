const path = require('path');
const fs = require('fs');
const userService = require('../data/userService');

const userController = {

    InicioSesion : async (req,res) =>{
            try {
                // Para renderizar el login no es estrictamente necesario traer a todos los usuarios,
                // pero puedes dejarlo si lo estás usando para ver en consola que la DB responde.
                let usuario = await userService.getAll();
                console.log("Usuarios en BD:", usuario);
                
                res.render('Inicio_Sesion');
            } catch (error) {
                console.log(error);
                res.send("Error al cargar la vista de inicio de sesión");
            }
    },

    ProcesoIniciarSesion : async (req,res) => {
        try {
            let usuario = req.body.Usuario;
            let contrasena = req.body.Contrasena;
            
            // Asumo que findByField recibe (campo, valor)
            let UsuarioDB = await userService.findByField('nombre_usuario', usuario);
            
            // Verificamos que el usuario exista Y que la contraseña ingresada coincida con la de la BD
            if(UsuarioDB && UsuarioDB.contrasena === contrasena){
                res.redirect('/Vehicles');
            } else {
                res.send('Credenciales incorrectas. Vuelve a intentarlo.');
            }
            
        } catch (error) {
            console.log(error);
            res.send('Error interno durante el inicio de sesión');
        }
    }

}

module.exports = userController
