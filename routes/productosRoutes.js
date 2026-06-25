const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { requireAuth, verificarJWT, verificarJWTAdmin } = require('../middlewares/auth');

// Rutas de Vistas
router.get('/listar', requireAuth, productosController.obtenerProductosVista);
router.get('/nuevo', requireAuth, productosController.formularioNuevoProducto);
router.get('/editar/:id', requireAuth, productosController.formularioEditarProducto);

// Rutas de Acción (formularios)
router.post('/guardar', requireAuth, productosController.crearProductoVista);
router.post('/actualizar/:id', requireAuth, productosController.actualizarProductoVista);
router.post('/eliminar/:id', requireAuth, productosController.eliminarProductoVista);

// API REST con JWT
router.get('/api', verificarJWT, productosController.obtenerProductos);
router.get('/api/tienda/:tiendaId', verificarJWT, productosController.obtenerProductosPorTienda);
router.get('/api/:id', verificarJWT, productosController.obtenerProductoPorId);
router.post('/api', verificarJWT, productosController.crearProducto);
router.put('/api/:id', verificarJWTAdmin, productosController.actualizarProducto);
router.delete('/api/:id', verificarJWTAdmin, productosController.eliminarProducto);

module.exports = router;