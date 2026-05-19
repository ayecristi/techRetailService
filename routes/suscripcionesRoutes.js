const express = require('express');
const router = express.Router();
const suscripcionesController = require('../controllers/suscripcionesController');

router.get('/', suscripcionesController.obtenerSuscripciones);
router.get('/tienda/:tiendaId', suscripcionesController.obtenerSuscripcionPorTienda);
router.get('/:id', suscripcionesController.obtenerSuscripcionPorId);
router.post('/', suscripcionesController.crearSuscripcion);
router.put('/:id', suscripcionesController.actualizarSuscripcion);
router.delete('/:id', suscripcionesController.cancelarSuscripcion);

module.exports = router;