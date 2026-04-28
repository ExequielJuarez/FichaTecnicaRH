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
            }
}

module.exports = userController