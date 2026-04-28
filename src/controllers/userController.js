const path = require('path');
const fs = require('fs');
const userService = require('../data/userService');



const userController = {

    InicioSesion : async (req,res) =>{
            try {
                let usuario = await userService.getAll();
                console.log("hola")
                console.log(usuario);
                res.render('Inicio_Sesion');
            } catch (error) {
                res.send("Error");
                }
            },

    ProcesoIniciarSesion : async (req,res) => {
        let usuario = req.body.Usuario;
        let contrasena = req.body.Contrasena;
        let UsuarioDB = await userService.findByField('nombre_usuario','mail',usuario);
        if(UsuarioDB){
            res.redirect('/Vehicles')
        }else{
            res.send('problema al iniciar')
        }
        
    }

}

module.exports = userController