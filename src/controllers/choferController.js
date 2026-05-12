const path = require('path');
const fs = require('fs');
const choferService = require('../data/choferService')



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

        res.render("cargaChofer");

    },

    processChofer : async (req,res) => {
        try {
        let newChofer = await choferService.create(req);
        res.redirect('/Choferes/Carga');
        console.log("hola")
        console.log(req.body)
        console.log(newChofer)
        console.log(req.query);
        console.log(where);
        } catch (error) {
            console.log("error");
            res.render("Error")      
        }


    },
    

}

module.exports = choferController;