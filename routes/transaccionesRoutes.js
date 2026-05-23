// transaccionesRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');

const {
    obtenerTransacciones,
    obtenerTransaccionesVista,
    obtenerTransaccionPorId,
    obtenerTransaccionVista,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    procesarVenta,
    reembolsarTransaccion,
    formularioCrearTransaccion,
    formularioEditarTransaccion,
    actualizarTransaccionVista,
    eliminarTransaccionVista
} = require("../controllers/transaccionesController");

// Vistas protegidas
router.get("/", requireAuth, obtenerTransaccionesVista);
router.get("/listar", requireAuth, obtenerTransaccionesVista);
router.get("/crear", requireAuth, formularioCrearTransaccion);
router.get("/ver/:id", requireAuth, obtenerTransaccionVista);
router.get("/editar/:id", requireAuth, formularioEditarTransaccion);

// API libre
router.get("/api", obtenerTransacciones);
router.get("/api/:id", obtenerTransaccionPorId);
router.post("/api", crearTransaccion);
router.put("/api/:id", actualizarTransaccion);
router.delete("/api/:id", eliminarTransaccion);

// Acciones
router.post("/guardar", requireAuth, crearTransaccion);
router.post("/actualizar/:id", requireAuth, actualizarTransaccionVista);
router.post("/eliminar/:id", requireAuth, eliminarTransaccionVista);
router.post("/procesar/:id", requireAuth, procesarVenta);
router.post("/reembolsar/:id", requireAuth, reembolsarTransaccion);

module.exports = router;