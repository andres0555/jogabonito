const express = require('express');
const router = express.Router();
const { getTipos } = require('../controllers/tipo.controller');

// Ruta para obtener todos los tipos
router.get('/mostrar-tipos', getTipos);

module.exports = router;