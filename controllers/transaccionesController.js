const fs = require("fs");
const path = require("path");
const Transaccion = require("../models/Transaccion");
const rutaArchivo = path.join(__dirname, "../data/transacciones.json");

// leer archivo
const leerTransacciones = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

// guardar archivo
const guardarTransacciones = (transacciones) => {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(transacciones, null, 2)
    );
};

// GET ALL - Unificado para API y Vista
const obtenerTransacciones = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        if (req.originalUrl.includes('/api')) {
            return res.json(transacciones);
        }
        res.render("transacciones/listar", { transacciones });
    } catch (error) {
        console.error("ERROR AL OBTENER TRANSACCIONES:", error);
        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        res.status(500).send("Error interno: " + error.message);
    }
};

// GET BY ID - Unificado para API y Vista
const obtenerTransaccionPorId = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const id = parseInt(req.params.id);
        const transaccion = transacciones.find(t => t.id === id);
        
        if (!transaccion) {
            if (req.originalUrl.includes('/api')) {
                return res.status(404).json({ mensaje: "Transacción no encontrada" });
            }
            return res.status(404).render("transacciones/ver", { error: "Transacción no encontrada" });
        }
        
        if (req.originalUrl.includes('/api')) {
            return res.json(transaccion);
        }
        res.render("transacciones/ver", { transaccion });
    } catch (error) {
        console.error("ERROR AL OBTENER TRANSACCIÓN:", error);
        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        res.status(500).send("Error interno: " + error.message);
    }
};

// CREATE - Unificado para API y Formulario
const crearTransaccion = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const { tiendaId, usuarioId, monto, metodoPago, estado, referencia } = req.body;

        if (!tiendaId || !usuarioId || !monto || !metodoPago) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({
                    mensaje: "Faltan datos requeridos: tiendaId, usuarioId, monto, metodoPago"
                });
            }
            return res.status(400).render("transacciones/crear", {
                error: "Faltan datos requeridos"
            });
        }

        const nuevoId = transacciones.length > 0 ? Math.max(...transacciones.map(t => t.id)) + 1 : 1;
        const nuevaTransaccion = new Transaccion(
            nuevoId,
            parseInt(tiendaId),
            parseInt(usuarioId),
            parseFloat(monto),
            metodoPago,
            estado || "pendiente",
            ""
        );
        nuevaTransaccion.referencia = referencia || null;
        nuevaTransaccion.creadoEn = new Date().toISOString();
        nuevaTransaccion.actualizadoEn = new Date().toISOString();

        transacciones.push(nuevaTransaccion);
        guardarTransacciones(transacciones);

        if (req.originalUrl.includes('/api')) {
            return res.status(201).json(nuevaTransaccion);
        }
        res.redirect(`/transacciones/vista/${nuevoId}`);
    } catch (error) {
        console.error("ERROR AL CREAR TRANSACCIÓN:", error);
        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        res.status(500).render("transacciones/crear", {
            error: "Error al crear la transacción: " + error.message
        });
    }
};

// Formulario para nueva transacción
const formularioNuevaTransaccion = (req, res) => {
    try {
        res.render("transacciones/crear");
    } catch (error) {
        console.error("ERROR AL RENDERIZAR FORMULARIO:", error);
        res.status(500).send("Error interno: " + error.message);
    }
};

// UPDATE - Unificado para API y Formulario
const actualizarTransaccion = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const id = parseInt(req.params.id);
        const transaccionIndex = transacciones.findIndex(t => t.id === id);

        if (transaccionIndex === -1) {
            if (req.originalUrl.includes('/api')) {
                return res.status(404).json({ mensaje: "Transacción no encontrada" });
            }
            return res.status(404).send("Transacción no encontrada");
        }

        const { usuarioId, montoTotal, metodoPago, estado, referencia, activo } = req.body;
        const transaccionActualizada = {
            ...transacciones[transaccionIndex],
            ...(usuarioId && { usuarioId: parseInt(usuarioId) }),
            ...(montoTotal && { montoTotal: parseFloat(montoTotal) }),
            ...(metodoPago && { metodoPago }),
            ...(estado && { estado }),
            ...(referencia !== undefined && { referencia }),
            ...(activo !== undefined && { activo }),
            actualizadoEn: new Date().toISOString()
        };

        transacciones[transaccionIndex] = transaccionActualizada;
        guardarTransacciones(transacciones);

        if (req.originalUrl.includes('/api')) {
            return res.json(transaccionActualizada);
        }
        res.redirect('/transacciones/listar');
    } catch (error) {
        console.error("ERROR AL ACTUALIZAR TRANSACCIÓN:", error);
        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        res.status(500).send("Error interno: " + error.message);
    }
};

// DELETE - Unificado para API y Formulario
const eliminarTransaccion = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const id = parseInt(req.params.id);
        const transaccionIndex = transacciones.findIndex(t => t.id === id);

        if (transaccionIndex === -1) {
            if (req.originalUrl.includes('/api')) {
                return res.status(404).json({ mensaje: "Transacción no encontrada" });
            }
            return res.status(404).send("Transacción no encontrada");
        }

        const transaccionEliminada = transacciones.splice(transaccionIndex, 1);
        guardarTransacciones(transacciones);

        if (req.originalUrl.includes('/api')) {
            return res.json({
                mensaje: "Transacción eliminada correctamente",
                transaccion: transaccionEliminada[0]
            });
        }
        res.redirect('/transacciones/listar');
    } catch (error) {
        console.error("ERROR AL ELIMINAR TRANSACCIÓN:", error);
        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        res.status(500).send("Error interno: " + error.message);
    }
};

// GET por usuario (API)
const obtenerTransaccionesPorUsuario = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const usuarioId = parseInt(req.params.usuarioId);
        const transaccionesUsuario = transacciones.filter(t => t.usuarioId === usuarioId);

        if (transaccionesUsuario.length === 0) {
            return res.status(404).json({
                mensaje: "No hay transacciones para este usuario"
            });
        }

        res.json(transaccionesUsuario);
    } catch (error) {
        console.error("ERROR AL FILTRAR POR USUARIO:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// GET por tienda (API)
const obtenerTransaccionesPorTienda = (req, res) => {
    try {
        const transacciones = leerTransacciones();
        const tiendaId = parseInt(req.params.tiendaId);
        const transaccionesTienda = transacciones.filter(t => t.tiendaId === tiendaId);

        if (transaccionesTienda.length === 0) {
            return res.status(404).json({
                mensaje: "No hay transacciones para esta tienda"
            });
        }

        res.json(transaccionesTienda);
    } catch (error) {
        console.error("ERROR AL FILTRAR POR TIENDA:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

module.exports = {
    obtenerTransacciones,
    obtenerTransaccionPorId,
    crearTransaccion,
    formularioNuevaTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    obtenerTransaccionesPorUsuario,
    obtenerTransaccionesPorTienda
};
