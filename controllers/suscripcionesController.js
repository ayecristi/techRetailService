const Suscripcion = require('../models/Suscripcion');
const { PLANES_SUSCRIPCION, ESTADOS_SUSCRIPCION, DETALLES_PLANES } = require('../constants/enums');

const PRECIOS_PLAN = {
    [PLANES_SUSCRIPCION.BASICO]: 5000,
    [PLANES_SUSCRIPCION.PROFESIONAL]: 12000,
    [PLANES_SUSCRIPCION.ENTERPRISE]: 30000
};

// GET ALL / PLANES VIEW
const obtenerSuscripciones = async (req, res) => {
    try {
        // Si el cliente acepta HTML y no es una llamada AJAX/Fetch directa, renderizamos la vista de planes
        if (req.accepts('html') && !req.xhr) {
            return res.render('suscripciones/planes', { planes: DETALLES_PLANES });
        }

        const suscripciones = await Suscripcion.find()
            .populate('tiendaId', 'nombre');
        res.json(suscripciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET BY ID
const obtenerSuscripcionPorId = async (req, res) => {
    try {
        const suscripcion = await Suscripcion.findById(req.params.id)
            .populate('tiendaId', 'nombre');
        if (!suscripcion) {
            return res.status(404).json({ mensaje: 'Suscripción no encontrada' });
        }
        res.json(suscripcion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET BY TIENDA
const obtenerSuscripcionPorTienda = async (req, res) => {
    try {
        const suscripcion = await Suscripcion.findOne({ tiendaId: req.params.tiendaId })
            .populate('tiendaId', 'nombre');
        if (!suscripcion) {
            return res.status(404).json({ mensaje: 'Suscripción no encontrada' });
        }
        res.json(suscripcion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// CREATE
const crearSuscripcion = async (req, res) => {
    try {
        const { tiendaId, plan, fechaVencimiento } = req.body;

        if (!tiendaId || !plan) {
            return res.status(400).json({ mensaje: 'Tienda y plan son obligatorios' });
        }

        const precioMensual = PRECIOS_PLAN[plan];
        if (!precioMensual) {
            return res.status(400).json({ mensaje: 'Plan inválido' });
        }

        const nuevaSuscripcion = new Suscripcion({
            tiendaId, plan, precioMensual, fechaVencimiento
        });
        await nuevaSuscripcion.save();

        res.status(201).json(nuevaSuscripcion);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: 'La tienda ya tiene una suscripción' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// UPDATE - cambiar plan
const actualizarSuscripcion = async (req, res) => {
    try {
        const { plan, estado, fechaVencimiento } = req.body;

        const updateData = { estado, fechaVencimiento };

        if (plan) {
            const precioMensual = PRECIOS_PLAN[plan];
            if (!precioMensual) {
                return res.status(400).json({ mensaje: 'Plan inválido' });
            }
            updateData.plan = plan;
            updateData.precioMensual = precioMensual;
        }

        const suscripcion = await Suscripcion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('tiendaId', 'nombre');

        if (!suscripcion) {
            return res.status(404).json({ mensaje: 'Suscripción no encontrada' });
        }

        res.status(200).json({ mensaje: 'Suscripción actualizada', suscripcion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// DELETE
const cancelarSuscripcion = async (req, res) => {
    try {
        const suscripcion = await Suscripcion.findByIdAndUpdate(
            req.params.id,
            { estado: ESTADOS_SUSCRIPCION.CANCELADO },
            { new: true }
        );

        if (!suscripcion) {
            return res.status(404).json({ mensaje: 'Suscripción no encontrada' });
        }

        res.status(200).json({ mensaje: 'Suscripción cancelada', suscripcion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerSuscripciones,
    obtenerSuscripcionPorId,
    obtenerSuscripcionPorTienda,
    crearSuscripcion,
    actualizarSuscripcion,
    cancelarSuscripcion
};