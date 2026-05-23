const path = require('path');
const fs = require('fs');
const choferService = require('../data/choferService')
const {validationResult} = require('express-validator');



const choferController = {
    
    ListChoferes: async (req,res) => {
    try {

        const filtros = req.query;

        let choferes = await choferService.getAll(filtros);
        
        console.log(choferes);
        res.render("listadoChofer", { choferes });
        

    } catch (error) {      
        console.log(error);
        res.send("Error");
    }
    },
    
    createChofer: (req, res) => {
        
        res.render("cargaChofer",{
            errors:{},
            old : {}
        });


        

    },

    processChofer : async (req,res) => {
         try {

            const errors = validationResult(req);

            if(!errors.isEmpty()){

                return res.render("cargaChofer", {
                    errors: errors.mapped(),
                    old: req.body
                });

            }

            let newChofer = await choferService.create(req);

            console.log(req.body);

            console.log(newChofer);

            return res.redirect('/Choferes/Carga');

        } catch (error) {

            console.log(error);

            return res.send("Error");

        }

    }
}

    

module.exports = choferController;