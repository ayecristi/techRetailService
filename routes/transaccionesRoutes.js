const express = require("express");
const router = express.Router();

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

// Rutas para Vistas
router.get("/", obtenerTransaccionesVista); // Alias para la raíz
router.get("/listar", obtenerTransaccionesVista);
router.get("/crear", formularioCrearTransaccion);
router.get("/ver/:id", obtenerTransaccionVista);
router.get("/editar/:id", formularioEditarTransaccion);

// Rutas para API
router.get("/api", obtenerTransacciones);
router.get("/api/:id", obtenerTransaccionPorId);
router.post("/api", crearTransaccion);
router.put("/api/:id", actualizarTransaccion);
router.delete("/api/:id", eliminarTransaccion);

// Rutas de Acción
router.post("/guardar", crearTransaccion);
router.post("/actualizar/:id", actualizarTransaccionVista);
router.post("/eliminar/:id", eliminarTransaccionVista);
router.post("/procesar/:id", procesarVenta);
router.post("/reembolsar/:id", reembolsarTransaccion);

module.exports = router;
