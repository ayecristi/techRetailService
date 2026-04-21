const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuariosVista,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    formularioNuevoUsuario
} = require("../controllers/usuariosController");

router.get("/", obtenerUsuarios);
router.get("/vista", obtenerUsuariosVista);
router.get("/nuevo", formularioNuevoUsuario);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.patch('/:id', actualizarUsuario);
router.delete("/:id", eliminarUsuario);


module.exports = router;