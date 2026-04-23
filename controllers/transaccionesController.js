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

// GET ALL (API)
const obtenerTransacciones = (req, res) => {
    const transacciones = leerTransacciones();
    res.json(transacciones);
};

// GET ALL (VISTA)
const obtenerTransaccionesVista = (req, res) => {
    const transacciones = leerTransacciones();
    res.render("transacciones/listar", { transacciones });
};

// GET BY ID (API)
const obtenerTransaccionPorId = (req, res) => {
    const transacciones = leerTransacciones();
    const id = parseInt(req.params.id);
    const transaccion = transacciones.find(t => t.id === id);
    if (!transaccion) {
        return res.status(404).json({
            mensaje: "Transacción no encontrada"
        });
    }
    res.json(transaccion);
};

// GET BY ID (VISTA)
const obtenerTransaccionPorIdVista = (req, res) => {
    const transacciones = leerTransacciones();
    const id = parseInt(req.params.id);
    const transaccion = transacciones.find(t => t.id === id);
    if (!transaccion) {
        return res.status(404).render("transacciones/ver", { error: "Transacción no encontrada" });
    }
    res.render("transacciones/ver", { transaccion });
};

// CREATE
const crearTransaccion = (req, res) => {
    const transacciones = leerTransacciones();
    const { tiendaId, usuarioId, monto, metodoPago, estado, items, referencia } = req.body;

    if (!tiendaId || !usuarioId || !monto || !metodoPago) {
        return res.status(400).json({
            mensaje: "Faltan datos requeridos: tiendaId, usuarioId, monto, metodoPago"
        });
    }

    const nuevoId = transacciones.length > 0 ? Math.max(...transacciones.map(t => t.id)) + 1 : 1;
    const nuevaTransaccion = new Transaccion(
        nuevoId,
        tiendaId,
        usuarioId,
        monto,
        metodoPago,
        estado || "pendiente",
        "" // descripcion vacia
    );
    nuevaTransaccion.referencia = referencia || null;

    transacciones.push(nuevaTransaccion);
    guardarTransacciones(transacciones);
    res.status(201).json(nuevaTransaccion);
};

// Formulario para crear transacción
const formularioNuevaTransaccion = (req, res) => {
    res.render("transacciones/crear");
};

// POST (formulario)
const crearTransaccionFormulario = (req, res) => {
    const transacciones = leerTransacciones();
    const { tiendaId, usuarioId, monto, metodoPago, estado, referencia } = req.body;

    if (!tiendaId || !usuarioId || !monto || !metodoPago) {
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
        "" // descripcion vacia
    );
    nuevaTransaccion.referencia = referencia || null;

    transacciones.push(nuevaTransaccion);
    guardarTransacciones(transacciones);
    res.redirect(`/transacciones/vista/${nuevoId}`);
};

// UPDATE
const actualizarTransaccion = (req, res) => {
    const transacciones = leerTransacciones();
    const id = parseInt(req.params.id);
    const transaccionIndex = transacciones.findIndex(t => t.id === id);

    if (transaccionIndex === -1) {
        return res.status(404).json({
            mensaje: "Transacción no encontrada"
        });
    }

    const { usuarioId, montoTotal, metodoPago, estado, items, referencia, activo } = req.body;
    const transaccionActualizada = {
        ...transacciones[transaccionIndex],
        ...(usuarioId && { usuarioId }),
        ...(montoTotal && { montoTotal }),
        ...(metodoPago && { metodoPago }),
        ...(estado && { estado }),
        ...(items && { items }),
        ...(referencia && { referencia }),
        ...(activo !== undefined && { activo })
    };

    transacciones[transaccionIndex] = transaccionActualizada;
    guardarTransacciones(transacciones);
    res.json(transaccionActualizada);
};

// DELETE
const eliminarTransaccion = (req, res) => {
    const transacciones = leerTransacciones();
    const id = parseInt(req.params.id);
    const transaccionIndex = transacciones.findIndex(t => t.id === id);

    if (transaccionIndex === -1) {
        return res.status(404).json({
            mensaje: "Transacción no encontrada"
        });
    }

    const transaccionEliminada = transacciones.splice(transaccionIndex, 1);
    guardarTransacciones(transacciones);
    res.json({
        mensaje: "Transacción eliminada correctamente",
        transaccion: transaccionEliminada[0]
    });
};

// GET por usuario
const obtenerTransaccionesPorUsuario = (req, res) => {
    const transacciones = leerTransacciones();
    const usuarioId = parseInt(req.params.usuarioId);
    const transaccionesUsuario = transacciones.filter(t => t.usuarioId === usuarioId);

    if (transaccionesUsuario.length === 0) {
        return res.status(404).json({
            mensaje: "No hay transacciones para este usuario"
        });
    }

    res.json(transaccionesUsuario);
};

// GET por tienda
const obtenerTransaccionesPorTienda = (req, res) => {
    const transacciones = leerTransacciones();
    const tiendaId = parseInt(req.params.tiendaId);
    const transaccionesTienda = transacciones.filter(t => t.tiendaId === tiendaId);

    if (transaccionesTienda.length === 0) {
        return res.status(404).json({
            mensaje: "No hay transacciones para esta tienda"
        });
    }

    res.json(transaccionesTienda);
};

module.exports = {
    obtenerTransacciones,
    obtenerTransaccionesVista,
    obtenerTransaccionPorId,
    obtenerTransaccionPorIdVista,
    crearTransaccion,
    formularioNuevaTransaccion,
    crearTransaccionFormulario,
    actualizarTransaccion,
    eliminarTransaccion,
    obtenerTransaccionesPorUsuario,
    obtenerTransaccionesPorTienda
};
