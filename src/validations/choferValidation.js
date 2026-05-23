
const db = require('../model/database/models');
const {body} = require ('express-validator');
const choferVAlidation = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio').isLength({min:2}).withMessage('Mínimo 2 caracteres'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),

    body('dni').notEmpty().withMessage('El dni es obligatorio').isNumeric().withMessage('El DNI debe contener solo números.')
    .custom(async(value) => {
        const chofer = await db.Chofer.findOne({
            where : {
                dni : value
            }
        });
        if (chofer){
            throw new Error ('El DNI ya está registrado');
        }
        return true;
    }).isLength({min:8,max:8}).withMessage('DNI inválido'),

    body('telefono').notEmpty().withMessage('El número de teléfono es obligatorio').isNumeric().withMessage('El teléfono debe contener solo números.').isLength({min:8,max:12}).withMessage('Teléfono inválido'),
    body('numero_licencia').notEmpty().withMessage('El número de licencia es obligatorio').optional({checkFalsy: true}).isLength({min:8,max:16}).withMessage('Número de licencia inválido'),
    body('fecha_vencimiento').notEmpty().withMessage('La fecha de vencimiento es obligatoria').optional({checkFalsy : true}).isDate().withMessage('Fecha inválida')
    .custom((value) => {
        const hoy = new date();
        const vencimiento = new date(value);
        if (vencimiento > hoy){
            throw new Error ('La licencia está vencida')
        }
        return true;
    }),

];

module.exports = choferVAlidation;