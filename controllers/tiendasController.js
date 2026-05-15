const Tienda = require("../models/Tienda");

const obtenerTiendas = async (req, res) => {
    try {
        const tiendas = await Tienda.find();
        res.json(tiendas);
    } catch (error) {
        console.error("Error obteniendo tiendas:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const obtenerTiendaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tienda = await Tienda.findById(id);

        if (!tienda) {
            return res.status(404).json({ mensaje: "Tienda no encontrada" });
        }

        res.json(tienda);
    } catch (error) {
        console.error("Error obteniendo tienda por ID:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const crearTienda = async (req, res) => {
    try {
        const { nombre, categoria, email, activo } = req.body;

        if (!nombre) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({ mensaje: "El nombre de la tienda es obligatorio" });
            } else {
                return res.status(400).send("El nombre de la tienda es obligatorio");
            }
        }

        const nuevaTienda = new Tienda({
            nombre: nombre.trim(),
            categoria: categoria ? categoria.trim() : "",
            email: email ? email.trim() : "",
            activo: activo !== undefined ? (activo === 'on' || activo === true) : true
        });

        const tiendaGuardada = await nuevaTienda.save();
        
        if (req.originalUrl.includes('/api')) {
            res.status(201).json(tiendaGuardada);
        } else {
            res.redirect('/tiendas');
        }
    } catch (error) {
        console.error("Error creando tienda:", error);
        if (req.originalUrl.includes('/api')) {
            res.status(500).json({ mensaje: "Error interno del servidor" });
        } else {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }
};


// VISTAS
const obtenerTiendasVista = async (req, res) => {
    try {
        const tiendas = await Tienda.find().sort({ createdAt: -1 });
        res.render("tiendas/listar", { tiendas });
    } catch (error) {
        console.error("Error obteniendo tiendas para vista:", error);
        res.status(500).send("Error interno del servidor");
    }
};

const formularioCrearTienda = (req, res) => {
    res.render("tiendas/crear");
};

module.exports = {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerTiendasVista,
    formularioCrearTienda
};