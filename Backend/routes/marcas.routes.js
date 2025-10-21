const express = require('express');
const router = express.Router();
const { getMarcas } = require('../controllers/marcas.controller');

// Ruta para obtener todas las marcas
router.get('/mostrar-marcas', getMarcas);

module.exports = router;