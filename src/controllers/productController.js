const path = require('path');
const fs = require('fs');

const productController = {
    index:(req,res) => {
        res.render('CargaDeFicha')
    }
}

module.exports = productController;