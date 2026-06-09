// src/data/alertaGeneradorService.js
const db  = require('../model/database/models');
const { Op } = require('sequelize');

// Utilidad: evitar duplicados — no crea la alerta si ya existe
// una no leída del mismo tipo para la misma entidad
async function existeAlerta(tipo, entidad_id) {
    const existe = await db.Alerta.findOne({
        where: { tipo, entidad_id, leida: false }
    });
    return !!existe;
}

const alertaGeneradorService = {

    // ── LICENCIAS ────────────────────────────────────────────────
    generarAlertasLicencias: async function () {
        try {
            const hoy      = new Date();
            hoy.setHours(0, 0, 0, 0);
            const en30dias = new Date(hoy);
            en30dias.setDate(hoy.getDate() + 30);

            const licencias = await db.LicenciaChofer.findAll({
                include: [{
                    model: db.Chofer,
                    as:    'Chofer'
                }],
                where: {
                    fecha_vencimiento: { [Op.lte]: en30dias }
                }
            });

            for (const lic of licencias) {
                const venc     = new Date(lic.fecha_vencimiento);
                const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
                const nombre   = `${lic.Chofer.nombre} ${lic.Chofer.apellido}`;
                const vencida  = diffDias < 0;
                const tipo     = vencida ? 'licencia_vencida' : 'licencia_proxima';

                if (await existeAlerta(tipo, lic.id_licencia)) continue;

                await db.Alerta.create({
                    tipo,
                    prioridad:                vencida ? 'alta' : 'media',
                    mensaje:                  vencida
                        ? `Licencia de ${nombre} vencida hace ${Math.abs(diffDias)} día/s`
                        : `Licencia de ${nombre} vence en ${diffDias} día/s`,
                    entidad_tipo:             'Chofer',
                    entidad_id:               lic.id_chofer,
                    entidad_nombre:           nombre,
                    generada_automaticamente: true
                });
            }

            console.log('✅ Alertas de licencias generadas');
        } catch (error) {
            console.error('❌ Error generando alertas de licencias:', error);
        }
    },

    // ── MANTENIMIENTOS ───────────────────────────────────────────
    generarAlertasMantenimientos: async function () {
        try {
            const hoy      = new Date();
            hoy.setHours(0, 0, 0, 0);
            const en15dias = new Date(hoy);
            en15dias.setDate(hoy.getDate() + 15);

            // Buscar mantenimientos que tienen proxima_fecha definida
            // y que ya venció o vence en 15 días
            const mantenimientos = await db.Mantenimiento.findAll({
                where: {
                    proxima_fecha: {
                        [Op.lte]: en15dias,
                        [Op.ne]:  null
                    }
                },
                include: [{
                    model: db.Vehiculo,
                    as:    'vehiculo',
                    attributes: ['id_vehiculo', 'patente', 'marca', 'modelo']
                }]
            });

            for (const mant of mantenimientos) {
                const proxima  = new Date(mant.proxima_fecha);
                const diffDias = Math.ceil((proxima - hoy) / (1000 * 60 * 60 * 24));
                const patente  = mant.vehiculo?.patente || `Vehículo #${mant.id_vehiculo}`;
                const vencido  = diffDias < 0;

                // Verificar si ya existe un mantenimiento posterior a la proxima_fecha
                // Si existe, el servicio ya fue hecho — no generar alerta
                const yaRealizado = await db.Mantenimiento.findOne({
                    where: {
                        id_vehiculo:  mant.id_vehiculo,
                        fecha_inicio: { [Op.gt]: mant.proxima_fecha }
                    }
                });
                if (yaRealizado) continue;

                if (await existeAlerta('mantenimiento_pendiente', mant.id_mantenimiento)) continue;

                await db.Alerta.create({
                    tipo:                     'mantenimiento_pendiente',
                    prioridad:                vencido ? 'alta' : 'media',
                    mensaje:                  vencido
                        ? `Mantenimiento de ${patente} (${mant.tipo_servicio}) vencido hace ${Math.abs(diffDias)} día/s`
                        : `Mantenimiento de ${patente} (${mant.tipo_servicio}) vence en ${diffDias} día/s`,
                    entidad_tipo:             'Vehiculo',
                    entidad_id:               mant.id_vehiculo,
                    entidad_nombre:           patente,
                    generada_automaticamente: true
                });
            }

            console.log('✅ Alertas de mantenimientos generadas');
        } catch (error) {
            console.error('❌ Error generando alertas de mantenimientos:', error);
        }
    },

    // ── PRÉSTAMOS VENCIDOS ───────────────────────────────────────
    generarAlertasPrestamos: async function () {
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            // Préstamos activos cuya fecha estimada de devolución ya pasó
            const prestamos = await db.Prestamo.findAll({
                where: {
                    estado_prestamo:           'Activo',
                    fecha_devolucion_real:      null,
                    fecha_devolucion_estimada: { [Op.lt]: hoy }
                },
                include: [{
                    model: db.Herramienta,
                    as:    'herramienta',
                    attributes: ['id_herramienta', 'nombre', 'codigo_activo']
                }]
            });

            for (const prest of prestamos) {
                const venc     = new Date(prest.fecha_devolucion_estimada);
                const diffDias = Math.ceil((hoy - venc) / (1000 * 60 * 60 * 24));
                const nombre   = prest.herramienta?.nombre || `Herramienta #${prest.id_herramienta}`;

                if (await existeAlerta('prestamo_vencido', prest.id_prestamo)) continue;

                await db.Alerta.create({
                    tipo:                     'prestamo_vencido',
                    prioridad:                diffDias > 3 ? 'alta' : 'media',
                    mensaje:                  `Préstamo de "${nombre}" a ${prest.nombre_operario} venció hace ${diffDias} día/s sin devolución`,
                    entidad_tipo:             'Herramienta',
                    entidad_id:               prest.id_herramienta,
                    entidad_nombre:           nombre,
                    generada_automaticamente: true
                });
            }

            console.log('✅ Alertas de préstamos generadas');
        } catch (error) {
            console.error('❌ Error generando alertas de préstamos:', error);
        }
    },

    // ── ASIGNACIONES DE VEHÍCULO VENCIDAS ───────────────────────
    generarAlertasAsignaciones: async function () {
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const asignaciones = await db.AsignacionVehiculo.findAll({
                where: {
                    estado:                    'Activo',
                    fecha_devolucion:           null,
                    fecha_estimada_devolucion: { [Op.lt]: hoy }
                },
                include: [
                    {
                        model: db.Vehiculo,
                        as:    'vehiculo',
                        attributes: ['id_vehiculo', 'patente', 'marca', 'modelo']
                    },
                    {
                        model: db.Chofer,
                        attributes: ['id_chofer', 'nombre', 'apellido']
                    }
                ]
            });

            for (const asig of asignaciones) {
                const venc     = new Date(asig.fecha_estimada_devolucion);
                const diffDias = Math.ceil((hoy - venc) / (1000 * 60 * 60 * 24));
                const patente  = asig.vehiculo?.patente || `Vehículo #${asig.id_vehiculo}`;
                const chofer   = asig.Chofer
                    ? `${asig.Chofer.nombre} ${asig.Chofer.apellido}`
                    : 'chofer desconocido';

                if (await existeAlerta('vehiculo_fuera_servicio', asig.id_asignacion)) continue;

                await db.Alerta.create({
                    tipo:                     'vehiculo_fuera_servicio',
                    prioridad:                diffDias > 2 ? 'alta' : 'media',
                    mensaje:                  `Vehículo ${patente} asignado a ${chofer} no fue devuelto, lleva ${diffDias} día/s de atraso`,
                    entidad_tipo:             'Vehiculo',
                    entidad_id:               asig.id_vehiculo,
                    entidad_nombre:           patente,
                    generada_automaticamente: true
                });
            }

            console.log('✅ Alertas de asignaciones generadas');
        } catch (error) {
            console.error('❌ Error generando alertas de asignaciones:', error);
        }
    },

    // ── VEHÍCULOS EN BAJA ────────────────────────────────────────
    generarAlertasVehiculosBaja: async function () {
        try {
            const vehiculos = await db.Vehiculo.findAll({
                where: { estado_actual: 'Baja' }
            });

            for (const veh of vehiculos) {
                if (await existeAlerta('documentacion_vencida', veh.id_vehiculo)) continue;

                await db.Alerta.create({
                    tipo:                     'documentacion_vencida',
                    prioridad:                'alta',
                    mensaje:                  `Vehículo ${veh.patente} (${veh.marca} ${veh.modelo}) está dado de baja`,
                    entidad_tipo:             'Vehiculo',
                    entidad_id:               veh.id_vehiculo,
                    entidad_nombre:           veh.patente,
                    generada_automaticamente: true
                });
            }

            console.log('✅ Alertas de vehículos en baja generadas');
        } catch (error) {
            console.error('❌ Error generando alertas de vehículos en baja:', error);
        }
    },

    // ── EJECUTAR TODAS ───────────────────────────────────────────
    generarTodas: async function () {
        console.log('🔄 Iniciando generación automática de alertas...');
        await Promise.all([
            this.generarAlertasLicencias(),
            this.generarAlertasMantenimientos(),
            this.generarAlertasPrestamos(),
            this.generarAlertasAsignaciones(),
            this.generarAlertasVehiculosBaja()
        ]);
        console.log('✅ Generación de alertas completada');
    }
};

module.exports = alertaGeneradorService;