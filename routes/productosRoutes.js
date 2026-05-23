// productosRoutes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { requireAuth } = require('../middlewares/auth');

// Vistas protegidas
router.get('/', requireAuth, productosController.obtenerProductos);
router.get('/tienda/:tiendaId', requireAuth, productosController.obtenerProductosPorTienda);
router.get('/nuevo', requireAuth, (req, res) => res.render('productos/nuevo'));
router.get('/:id', requireAuth, productosController.obtenerProductoPorId);

// API libre
router.post('/', productosController.crearProducto);
router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;