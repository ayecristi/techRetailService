const express = require("express");
const router = express.Router();
const {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerDashboard
} = require("../controllers/tiendasController");

// Vista
router.get("/", obtenerDashboard);

// API
router.get("/api", obtenerTiendas);
router.get("/api/:id", obtenerTiendaPorId);
router.post("/api", crearTienda);

module.exports = router;