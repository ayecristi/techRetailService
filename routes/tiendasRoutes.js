// tiendasRoutes.js
const express = require("express");
const router = express.Router();
const {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    obtenerDashboard
} = require("../controllers/tiendasController");
const { requireAuth } = require('../middlewares/auth');

// Vistas protegidas
router.get("/", requireAuth, obtenerDashboard);
router.get("/dashboard", requireAuth, obtenerDashboard);

// API 
router.get("/api", obtenerTiendas);
router.get("/api/:id", obtenerTiendaPorId);
router.post("/api", crearTienda);

module.exports = router;