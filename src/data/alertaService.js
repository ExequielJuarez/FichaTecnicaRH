// src/data/alertaService.js
const db = require('../model/database/models');
const { Op } = require('sequelize');

const alertaService = {

    getAll: async function (filtros = {}) {
        try {
            const where = {};

            if (filtros.tipo)      where.tipo      = filtros.tipo;
            if (filtros.prioridad) where.prioridad = filtros.prioridad;

            if (filtros.estado === 'leida')    where.leida = true;
            if (filtros.estado === 'no_leida') where.leida = false;

            if (filtros.buscar) {
                where[Op.or] = [
                    { mensaje:        { [Op.like]: `%${filtros.buscar}%` } },
                    { entidad_nombre: { [Op.like]: `%${filtros.buscar}%` } },
                ];
            }

            if (filtros.fechaDesde && filtros.fechaHasta) {
                where.createdAt = {
                    [Op.gte]: new Date(filtros.fechaDesde),
                    [Op.lt]:  new Date(
                        new Date(filtros.fechaHasta).setDate(
                            new Date(filtros.fechaHasta).getDate() + 1
                        )
                    )
                };
            }

            const limite = parseInt(filtros.limite) || 10;
            const pagina = parseInt(filtros.pagina) || 1;
            const offset = (pagina - 1) * limite;

            const { count, rows } = await db.Alerta.findAndCountAll({
                where,
                order:    [['createdAt', 'DESC']],
                limit:    limite,
                offset:   offset,
                distinct: true
            });

            return {
                alertas:        rows,
                totalRegistros: count,
                totalPaginas:   Math.ceil(count / limite),
                paginaActual:   pagina,
                limite
            };

        } catch (error) {
            console.log(error);
            return { alertas: [], totalRegistros: 0, totalPaginas: 0, paginaActual: 1, limite: 10 };
        }
    },

    // Últimas N alertas no leídas — para el panel del header
    getRecientes: async function (limite = 8) {
        try {
            return await db.Alerta.findAll({
                where: { leida: false },
                order: [['createdAt', 'DESC']],
                limit: limite
            });
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    // Conteo de no leídas — para el badge del header
    contarNoLeidas: async function () {
        try {
            return await db.Alerta.count({ where: { leida: false } });
        } catch (error) {
            console.log(error);
            return 0;
        }
    },

    // Conteos por tipo — para las tarjetas de resumen
    getResumen: async function () {
        try {
            const [licVencidas, licProximas, mantPendientes] = await Promise.all([
                db.Alerta.count({ where: { tipo: 'licencia_vencida'        } }),
                db.Alerta.count({ where: { tipo: 'licencia_proxima'        } }),
                db.Alerta.count({ where: { tipo: 'mantenimiento_pendiente' } }),
            ]);
            return { licVencidas, licProximas, mantPendientes };
        } catch (error) {
            console.log(error);
            return { licVencidas: 0, licProximas: 0, mantPendientes: 0 };
        }
    },

    marcarLeida: async function (id) {
        try {
            await db.Alerta.update({ leida: true }, { where: { id_alerta: id } });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    marcarTodasLeidas: async function () {
        try {
            await db.Alerta.update({ leida: true }, { where: { leida: false } });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // Generación automática de alertas de licencias
    // Llamar desde un cron job o al cargar el sistema
    generarAlertasLicencias: async function () {
        try {
            const hoy      = new Date();
            hoy.setHours(0, 0, 0, 0);
            const en30dias = new Date(hoy); en30dias.setDate(hoy.getDate() + 30);

            const licencias = await db.LicenciaChofer.findAll({
                include: [{ model: db.Chofer, as: 'Chofer' }],
                where: {
                    fecha_vencimiento: { [Op.lte]: en30dias }
                }
            });

            for (const lic of licencias) {
                const venc     = new Date(lic.fecha_vencimiento);
                const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
                const nombre   = `${lic.Chofer.nombre} ${lic.Chofer.apellido}`;
                const vencida  = diffDias < 0;

                // Evitar duplicados: no crear si ya existe una no leída igual
                const existe = await db.Alerta.findOne({
                    where: {
                        tipo:       vencida ? 'licencia_vencida' : 'licencia_proxima',
                        entidad_id: lic.id_licencia,
                        leida:      false
                    }
                });
                if (existe) continue;

                await db.Alerta.create({
                    tipo:                     vencida ? 'licencia_vencida' : 'licencia_proxima',
                    prioridad:                vencida ? 'alta' : 'media',
                    mensaje:                  vencida
                        ? `Licencia de ${nombre} vencida hace ${Math.abs(diffDias)} días`
                        : `Licencia de ${nombre} vence en ${diffDias} días`,
                    entidad_tipo:             'Chofer',
                    entidad_id:               lic.id_chofer,
                    entidad_nombre:           nombre,
                    generada_automaticamente: true
                });
            }
        } catch (error) {
            console.log('Error generando alertas de licencias:', error);
        }
    }
};

module.exports = alertaService;