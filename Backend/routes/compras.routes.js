const express = require('express');
const router = express.Router();
const { postCompra } = require('../Controllers/compras.controller');

// Ruta para finalizar compra
router.post('/compras-carrito', postCompra);

module.exports = router;