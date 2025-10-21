const express = require('express');
const router = express.Router();
const { getProductos } = require('../Controllers/productos.controller');

// Ruta para obtener todos los productos
router.get('/ver-productos', getProductos);

module.exports = router;