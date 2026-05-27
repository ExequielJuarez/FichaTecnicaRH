// src/controllers/alertaController.js
const alertaService = require('../data/alertaService');
const db = require('../model/database/models');
const alertaController = {

    // GET /Alertas — vista principal del listado
    ListAlertas: async (req, res) => {
        try {
            const filtros = req.query;

            const [resultado, resumen, noLeidas] = await Promise.all([
                alertaService.getAll(filtros),
                alertaService.getResumen(),
                alertaService.contarNoLeidas()
            ]);

            const { alertas, totalRegistros, totalPaginas, paginaActual, limite } = resultado;

            const queryFiltros = { ...req.query };
            delete queryFiltros.pagina;
            const queryString = new URLSearchParams(queryFiltros).toString();

            res.render('listadoAlertas', {
                alertas,
                totalRegistros,
                totalPaginas,
                paginaActual,
                limite,
                queryString,
                resumen,
                noLeidas,
                filtros: req.query
            });

        } catch (error) {
            console.log(error);
            res.send('Error');
        }
    },

    // POST /Alertas/:id/leer — marcar una alerta como leída (llamado por fetch)
    marcarLeida: async (req, res) => {
        try {
            await alertaService.marcarLeida(req.params.id);
            res.json({ ok: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false });
        }
    },

    // POST /Alertas/leer-todas
    marcarTodasLeidas: async (req, res) => {
        try {
            await alertaService.marcarTodasLeidas();
            res.json({ ok: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false });
        }
    },

    // GET /Alertas/recientes — endpoint JSON para el panel del header
    getRecientes: async (req, res) => {
        try {
            const alertas  = await alertaService.getRecientes(8);
            const noLeidas = await alertaService.contarNoLeidas();
            res.json({ alertas, noLeidas });
        } catch (error) {
            console.log(error);
            res.status(500).json({ alertas: [], noLeidas: 0 });
        }
    },
    detalleAlerta: async (req, res) => {
        try {
            const alerta = await db.Alerta.findByPk(req.params.id);

            if (!alerta) return res.send('Alerta no encontrada');

            res.render('DetalleAlerta', { alerta });

        } catch (error) {
            console.log(error);
            res.send('Error');
        }
    }
};

module.exports = alertaController;