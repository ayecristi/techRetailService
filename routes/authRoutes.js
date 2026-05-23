const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/registro', authController.formularioRegistro);
router.post('/registro', authController.registrar);

router.get('/login', authController.formularioLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;