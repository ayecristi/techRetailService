const Tienda = require("../models/Tienda");
const Producto = require("../models/Producto");

const obtenerTiendas = async (req, res) => {
    try {
        const tiendas = await Tienda.find();
        res.json(tiendas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const obtenerTiendaPorId = async (req, res) => {
    try {
        const tienda = await Tienda.findById(req.params.id);
        if (!tienda) {
            return res.status(404).json({ mensaje: "Tienda no encontrada" });
        }
        res.json(tienda);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const crearTienda = async (req, res) => {
    try {
        const { nombre, categoria, email, activo } = req.body;

        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre de la tienda es obligatorio" });
        }

        const nuevaTienda = new Tienda({
            nombre: nombre.trim(),
            categoria: categoria ? categoria.trim() : "",
            email: email ? email.trim() : "",
            activo: activo !== undefined ? (activo === 'on' || activo === true) : true
        });

        const tiendaGuardada = await nuevaTienda.save();
        res.status(201).json(tiendaGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const obtenerDashboard = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;

        if (!tiendaId) {
            return res.redirect('/auth/login');
        }

        const tienda = await Tienda.findById(tiendaId);
        const productos = await Producto.find({ tiendaId });

        res.render("tiendas/dashboard", { tienda, productos });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};

module.exports = {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerDashboard
};