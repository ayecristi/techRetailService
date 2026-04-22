const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/transaccionesController");

// rutas para API
router.get("/api", obtenerTransacciones);
router.get("/api/:id", obtenerTransaccionPorId);
router.post("/api", crearTransaccion);
router.put("/api/:id", actualizarTransaccion);
router.patch("/api/:id", actualizarTransaccion);
router.delete("/api/:id", eliminarTransaccion);
router.get("/api/usuario/:usuarioId", obtenerTransaccionesPorUsuario);
router.get("/api/tienda/:tiendaId", obtenerTransaccionesPorTienda);

// rutas para vistas
router.get("/", obtenerTransaccionesVista);
router.get("/crear", formularioNuevaTransaccion);
router.get("/vista/:id", obtenerTransaccionPorIdVista);
router.post("/", crearTransaccionFormulario);

module.exports = router;
