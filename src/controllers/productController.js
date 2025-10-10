const path = require('path');
const fs = require('fs');

const productController = {
    index:(req,res) => {
        res.render('index')
    }
}

module.exports = productController;