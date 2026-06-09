const path = require('path');
const fs = require('fs');
const db = require('../model/database/models');
const choferService = require('../data/choferService')
const {validationResult} = require('express-validator');



const choferController = {
    
    ListChoferes: async (req, res) => {
    try {
        const filtros = req.query;

            
            const {
                choferes,
                totalRegistros,
                totalPaginas,
                paginaActual,
                limite
            } = await choferService.getAll(filtros);
        
            const queryFiltros = { ...req.query };
            delete queryFiltros.pagina;
            const queryString = new URLSearchParams(queryFiltros).toString();

            
            res.render("listadoChofer", {
                choferes,        
                totalRegistros,
                totalPaginas,
                paginaActual,
                limite,
                queryString
            });

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

    },
        
    editChofer: async (req, res) => {
        try {
            const chofer = await choferService.getOneConLicencia(req.params.id);

            if (!chofer) return res.send('Chofer no encontrado');

            
            const licencia = chofer.licencias?.[0] || {};

            res.render('EditarChofer', {
                errors: {},

                old: {
                    nombre:            chofer.nombre,
                    apellido:          chofer.apellido,
                    dni:               chofer.dni,
                    fechaNacimiento:   chofer.fechaNacimiento,
                    telefono:          chofer.telefono,
                    email:             chofer.email,
                    direccion:         chofer.direccion,
                    fechaIngreso:      chofer.fechaIngreso,
                    'activo-inactivo': chofer.estado,
                    Turno:             chofer.turno,
                    numero_licencia:   licencia.numero        || '',
                    categoria:         licencia.categoria     || '',
                    fecha_emision: licencia.fecha_emision
                                        ? new Date(licencia.fecha_emision).toISOString().split('T')[0]
                                        : '',
                    fecha_vencimiento: licencia.fecha_vencimiento
                                        ? new Date(licencia.fecha_vencimiento).toISOString().split('T')[0]
                                        : '',
                },
                chofer  
            });
            console.log(chofer.toJSON());

        } catch (error) {
            console.log(error);
            res.send('Error');
        }
    },
    detalleChofer: async (req, res) => {
        try {
            const chofer = await choferService.getOneConLicencia(req.params.id);

            if (!chofer) return res.send('Chofer no encontrado');

            res.render('detalleChofer', { chofer });

        } catch (error) {
            console.log(error);
            res.send('Error');
        }
    },

    
    processEdit: async (req, res) => {
        try {
            const errors = validationResult(req);
            const chofer = await choferService.getOneConLicencia(req.params.id);

            if (!chofer) return res.send('Chofer no encontrado');

            if (!errors.isEmpty()) {
                const licencia = chofer.licencias?.[0] || {};

                return res.render('EditarChofer', {
                    errors: errors.mapped(),
                    chofer,
                    old: {
                        ...req.body, 

                        
                        numero_licencia: licencia.numero || '',
                        categoria: licencia.categoria || '',
                        fecha_emision: licencia.fecha_emision
                            ? new Date(licencia.fecha_emision).toISOString().split('T')[0]
                            : '',
                        fecha_vencimiento: licencia.fecha_vencimiento
                            ? new Date(licencia.fecha_vencimiento).toISOString().split('T')[0]
                            : ''
                    }
                });
            }

            const body = req.body;
            const estadoAnterior = chofer.estado;
            const estadoNuevo    = body['activo-inactivo'];

            // Actualizar datos del chofer
            await choferService.update(req.params.id, {
                nombre:          body.nombre,
                apellido:        body.apellido,
                dni:             body.dni,
                telefono:        body.telefono,
                direccion:       body.direccion,
                estado:          estadoNuevo,
                email:           body.email           || null,
                fechaNacimiento: body.fechaNacimiento || null,
                fechaIngreso:    body.fechaIngreso    || null,
                turno:           body.Turno           || null,
                // Guardar motivo solo si pasa a Inactivo, limpiar si vuelve a Activo
                motivoBaja:      estadoNuevo === 'Inactivo' ? (body.motivoBaja || null) : null,
            });

            // Actualizar o crear licencia
            const licencia = chofer.licencias?.[0];
            if (licencia) {
                await licencia.update({
                    numero:            body.numero_licencia,
                    categoria:         body.categoria,
                    fecha_emision:     body.fecha_emision,
                    fecha_vencimiento: body.fecha_vencimiento
                });
            } else {
                await db.LicenciaChofer.create({
                    id_chofer:         chofer.id_chofer,
                    numero:            body.numero_licencia,
                    categoria:         body.categoria,
                    fecha_emision:     body.fecha_emision,
                    fecha_vencimiento: body.fecha_vencimiento
                });
            }

            // Crear alerta solo cuando cambia de Activo → Inactivo
            if (estadoAnterior === 'Activo' && estadoNuevo === 'Inactivo') {
                await db.Alerta.create({
                    tipo:                     'informativa',
                    prioridad:                'media',
                    mensaje:                  `Chofer ${chofer.nombre} ${chofer.apellido} fue dado de baja. Motivo: ${body.motivoBaja}`,
                    entidad_tipo:             'Chofer',
                    entidad_id:               chofer.id_chofer,
                    entidad_nombre:           `${chofer.nombre} ${chofer.apellido}`,
                    generada_automaticamente: false
                });
            }

            return res.redirect('/Choferes');

        } catch (error) {
            console.log(error);
            return res.send('Error');
        }
    },

    // POST — baja lógica
    desactivarChofer: async (req, res) => {
        try {
            await choferService.update(req.params.id, { estado: 'Inactivo' });
            return res.redirect('/Choferes');
        } catch (error) {
            console.log(error);
            return res.send('Error');
        }
    },
}

    

module.exports = choferController;