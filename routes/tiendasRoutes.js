const express = require("express");
const router = express.Router();
const {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerTiendasVista,
    formularioCrearTienda
} = require("../controllers/tiendasController");

// Rutas para Vistas
router.get("/", obtenerTiendasVista);
router.get("/listar", obtenerTiendasVista);
router.get("/crear", formularioCrearTienda);

// Rutas para API
router.get("/api", obtenerTiendas);
router.get("/api/:id", obtenerTiendaPorId);
router.post("/api", crearTienda);

// Rutas de Acción
router.post("/guardar", crearTienda);

module.exports = router;