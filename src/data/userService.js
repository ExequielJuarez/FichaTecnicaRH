const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');


const userService = {
    
    getAll: async function () {
    
        try {
          return await db.Usuario.findAll ({
          })
        } catch (error) {
          console.log(error);
          return [];
        }
      }
}

module.exports = userService