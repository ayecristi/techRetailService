const Tienda = require("../models/Tienda");
const Producto = require("../models/Producto");
const Transaccion = require("../models/Transaccion");
const Suscripcion = require("../models/Suscripcion");

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
        if (!tiendaId) return res.redirect('/auth/login');

        // Inicio y fin del día actual
        const hoy = new Date();
        const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
        const finDia = new Date(hoy.setHours(23, 59, 59, 999));

        const [tienda, productos, suscripcion, transaccionesHoy, pendientes, productosStockBajo, ultimasTransacciones] = await Promise.all([
            Tienda.findById(tiendaId),
            Producto.countDocuments({ tiendaId, activo: true }),
            Suscripcion.findOne({ tiendaId }),
            Transaccion.find({ tiendaId, estado: 'completado', createdAt: { $gte: inicioDia, $lte: finDia } }),
            Transaccion.countDocuments({ tiendaId, estado: 'pendiente' }),
            Producto.find({ tiendaId, stock: { $lte: 5 }, activo: true }).sort({ stock: 1 }).limit(5),
            Transaccion.find({ tiendaId }).sort({ createdAt: -1 }).limit(5)
        ]);

        const totalVentasHoy = transaccionesHoy.reduce((sum, t) => sum + t.monto, 0);

        res.render("tiendas/dashboard", {
            tienda,
            totalProductos: productos,
            suscripcion,
            ventasHoy: transaccionesHoy.length,
            totalVentasHoy,
            pendientes,
            productosStockBajo,
            ultimasTransacciones
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).send("Error interno del servidor");
    }
};

module.exports = {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerDashboard
};