const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin, verificarJWT, verificarJWTAdmin } = require('../middlewares/auth');
const {
    obtenerUsuarios, obtenerUsuariosVista, obtenerUsuarioPorId,
    crearUsuario, actualizarUsuario, eliminarUsuario,
    formularioNuevoUsuario, formularioEditarUsuario
} = require("../controllers/usuariosController");

// Rutas de Vistas (solo administradores)
router.get("/listar", requireAdmin, obtenerUsuariosVista);
router.get("/nuevo", requireAdmin, formularioNuevoUsuario);
router.get("/editar/:id", requireAdmin, formularioEditarUsuario);

// Rutas de API REST (protegidas con JWT)
router.get("/api", verificarJWT, obtenerUsuarios);
router.get("/api/:id", verificarJWT, obtenerUsuarioPorId);
router.post("/api", verificarJWTAdmin, crearUsuario);
router.put("/api/:id", verificarJWTAdmin, actualizarUsuario);
router.delete("/api/:id", verificarJWTAdmin, eliminarUsuario);

// Rutas de Acción (formularios HTML — POST, no GET)
router.post("/guardar", requireAuth, crearUsuario);
router.post("/actualizar/:id", requireAuth, actualizarUsuario);
router.post("/eliminar/:id", requireAuth, eliminarUsuario);

module.exports = router;