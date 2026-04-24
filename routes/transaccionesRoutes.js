const express = require("express");
const router = express.Router();

const {
    obtenerTransacciones,
    obtenerTransaccionPorId,
    crearTransaccion,
    formularioNuevaTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    obtenerTransaccionesPorUsuario,
    obtenerTransaccionesPorTienda
} = require("../controllers/transaccionesController");

// Rutas unificadas (detectan si es API o Vista)
router.get("/", obtenerTransacciones);
router.get("/crear", formularioNuevaTransaccion);
router.get("/vista/:id", obtenerTransaccionPorId);
router.post("/", crearTransaccion);

// Rutas para API
router.get("/api", obtenerTransacciones);
router.get("/api/:id", obtenerTransaccionPorId);
router.post("/api", crearTransaccion);
router.put("/api/:id", actualizarTransaccion);
router.patch("/api/:id", actualizarTransaccion);
router.delete("/api/:id", eliminarTransaccion);
router.get("/api/usuario/:usuarioId", obtenerTransaccionesPorUsuario);
router.get("/api/tienda/:tiendaId", obtenerTransaccionesPorTienda);

module.exports = router;
