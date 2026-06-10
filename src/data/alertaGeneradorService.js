// src/data/alertaGeneradorService.js
const db  = require('../model/database/models');
const { Op } = require('sequelize');

// Utilidad: evitar duplicados — no crea la alerta si ya existe
// una no leída del mismo tipo para la misma entidad
async function existeAlerta(tipo, entidad_id) {
    const existe = await db.Alerta.findOne({
        where: {
            tipo,
            entidad_id,
            resuelta: false
        }
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

            // Licencias que vencen en 30 días o ya vencieron
            const licencias = await db.LicenciaChofer.findAll({
                include: [{ model: db.Chofer, as: 'Chofer' }],
                where: { fecha_vencimiento: { [Op.lte]: en30dias } }
            });

            for (const lic of licencias) {
                const venc     = new Date(lic.fecha_vencimiento);
                const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
                const nombre   = `${lic.Chofer.nombre} ${lic.Chofer.apellido}`;
                const vencida  = diffDias < 0;
                const tipo     = vencida ? 'licencia_vencida' : 'licencia_proxima';
                const prioridad = vencida
                    ? 'alta'
                    : diffDias <= 7 ? 'alta' : 'media';
                const mensaje  = vencida
                    ? `Licencia de ${nombre} vencida hace ${Math.abs(diffDias)} día/s`
                    : `Licencia de ${nombre} vence en ${diffDias} día/s`;

                // Buscar alerta existente no resuelta para esta licencia
                const existente = await db.Alerta.findOne({
                    where: {
                        tipo:       { [Op.in]: ['licencia_vencida', 'licencia_proxima'] },
                        entidad_id: lic.id_chofer,
                        resuelta:   false
                    }
                });

                if (existente) {
                    // Actualizar mensaje, tipo y prioridad
                    await existente.update({ tipo, prioridad, mensaje });
                } else {
                    await db.Alerta.create({
                        tipo, prioridad, mensaje,
                        entidad_tipo:             'Chofer',
                        entidad_id:               lic.id_chofer,
                        entidad_nombre:           nombre,
                        generada_automaticamente: true
                    });
                }
            }

            console.log('✅ Alertas de licencias generadas/actualizadas');
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

            const mantenimientos = await db.Mantenimiento.findAll({
                where: {
                    proxima_fecha: { [Op.lte]: en15dias, [Op.ne]: null }
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

                const yaRealizado = await db.Mantenimiento.findOne({
                    where: {
                        id_vehiculo:  mant.id_vehiculo,
                        fecha_inicio: { [Op.gt]: mant.proxima_fecha }
                    }
                });
                if (yaRealizado) continue;

                const prioridad = vencido ? 'alta' : diffDias <= 5 ? 'alta' : 'media';
                const mensaje   = vencido
                    ? `Mantenimiento de ${patente} (${mant.tipo_servicio}) vencido hace ${Math.abs(diffDias)} día/s`
                    : `Mantenimiento de ${patente} (${mant.tipo_servicio}) vence en ${diffDias} día/s`;

                const existente = await db.Alerta.findOne({
                    where: {
                        tipo:       'mantenimiento_pendiente',
                        entidad_id: mant.id_vehiculo,
                        resuelta:   false
                    }
                });

                if (existente) {
                    await existente.update({ prioridad, mensaje });
                } else {
                    await db.Alerta.create({
                        tipo:                     'mantenimiento_pendiente',
                        prioridad, mensaje,
                        entidad_tipo:             'Vehiculo',
                        entidad_id:               mant.id_vehiculo,
                        entidad_nombre:           patente,
                        generada_automaticamente: true
                    });
                }
            }
            console.log('✅ Alertas de mantenimientos generadas/actualizadas');
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
    // Resolver alertas de vehículos que ya no están en Baja
    resolverAlertasVehiculosBaja: async function () {
        try {
            // Traer IDs de vehículos que YA NO están en Baja
            const vehiculosActivos = await db.Vehiculo.findAll({
                where: { estado_actual: { [Op.ne]: 'Baja' } },
                attributes: ['id_vehiculo']
            });
            const ids = vehiculosActivos.map(v => v.id_vehiculo);

            // Marcar como leídas las alertas de esos vehículos
            await db.Alerta.update(
                { resuelta: true },
                {
                    where: {
                        tipo:        'documentacion_vencida',
                        entidad_id:  { [Op.in]: ids },
                        resuelta:       false
                    }
                }
            );
            console.log('✅ Alertas de vehículos en baja resueltas');
        } catch (error) {
            console.error('❌ Error resolviendo alertas de vehículos en baja:', error);
        }
    },

    // Resolver alertas de licencias que ya no vencen pronto o ya fueron renovadas
    resolverAlertasLicencias: async function () {
        try {
            const hoy      = new Date();
            hoy.setHours(0, 0, 0, 0);
            const en30dias = new Date(hoy);
            en30dias.setDate(hoy.getDate() + 30);

            // Licencias que YA NO están próximas ni vencidas
            const licenciasOk = await db.LicenciaChofer.findAll({
                where: { fecha_vencimiento: { [Op.gt]: en30dias } },
                attributes: ['id_chofer']
            });
            const choferIds = licenciasOk.map(l => l.id_chofer);

            if (choferIds.length > 0) {
                await db.Alerta.update(
                    { resuelta: true },
                    {
                        where: {
                            tipo:       { [Op.in]: ['licencia_vencida', 'licencia_proxima'] },
                            entidad_id: { [Op.in]: choferIds },
                            resuelta:   false
                        }
                    }
                );
            }
            console.log('✅ Alertas de licencias resueltas');
        } catch (error) {
            console.error('❌ Error resolviendo alertas de licencias:', error);
        }
    },

    // Resolver préstamos que ya fueron devueltos
    resolverAlertasPrestamos: async function () {
        try {
            const prestamosDevueltos = await db.Prestamo.findAll({
                where: { fecha_devolucion_real: { [Op.ne]: null } },
                attributes: ['id_prestamo', 'id_herramienta']
            });
            const herramientaIds = prestamosDevueltos.map(p => p.id_herramienta);

            await db.Alerta.update(
                { resuelta: true },
                {
                    where: {
                        tipo:       'prestamo_vencido',
                        entidad_id: { [Op.in]: herramientaIds },
                        resuelta:      false
                    }
                }
            );
            console.log('✅ Alertas de préstamos resueltas');
        } catch (error) {
            console.error('❌ Error resolviendo alertas de préstamos:', error);
        }
    },

    // Resolver asignaciones que ya fueron devueltas
    resolverAlertasAsignaciones: async function () {
        try {
            const asignacionesDevueltas = await db.AsignacionVehiculo.findAll({
                where: { fecha_devolucion: { [Op.ne]: null } },
                attributes: ['id_asignacion', 'id_vehiculo']
            });
            const vehiculoIds = asignacionesDevueltas.map(a => a.id_vehiculo);

            await db.Alerta.update(
                { resuelta: true },
                {
                    where: {
                        tipo:       'vehiculo_fuera_servicio',
                        entidad_id: { [Op.in]: vehiculoIds },
                        resuelta:      false
                    }
                }
            );
            console.log('✅ Alertas de asignaciones resueltas');
        } catch (error) {
            console.error('❌ Error resolviendo alertas de asignaciones:', error);
        }
    },

    // ── EJECUTAR TODAS ───────────────────────────────────────────
    generarTodas: async function () {
        console.log('🔄 Iniciando ciclo de alertas...');
        await Promise.all([
            // Resolver primero — antes de generar nuevas
            this.resolverAlertasVehiculosBaja(),
            this.resolverAlertasLicencias(),
            this.resolverAlertasPrestamos(),
            this.resolverAlertasAsignaciones(),
        ]);
        await Promise.all([
            // Generar después
            this.generarAlertasLicencias(),
            this.generarAlertasMantenimientos(),
            this.generarAlertasPrestamos(),
            this.generarAlertasAsignaciones(),
            this.generarAlertasVehiculosBaja(),
        ]);
        console.log('✅ Ciclo de alertas completado');
    }
};

module.exports = alertaGeneradorService;