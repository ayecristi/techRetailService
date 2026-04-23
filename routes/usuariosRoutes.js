const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuariosVista,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    formularioNuevoUsuario,
    formularioEditarUsuario
} = require("../controllers/usuariosController");

// Rutas para Vistas
router.get("/listar", obtenerUsuariosVista); 
router.get("/crear", formularioNuevoUsuario);
router.get("/editar/:id", formularioEditarUsuario);

// Rutas para API
router.get("/api", obtenerUsuarios);
router.get("/api/:id", obtenerUsuarioPorId);
router.post("/api", crearUsuario);
router.put("/api/:id", actualizarUsuario);
router.delete("/api/:id", eliminarUsuario);

// Rutas de Acción
router.post("/guardar", crearUsuario);
router.post("/actualizar/:id", actualizarUsuario);
router.get("/eliminar/:id", eliminarUsuario);

module.exports = router;