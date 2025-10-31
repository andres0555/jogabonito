const express = require('express');
const router = express.Router();
const { enviarCorreo } = require('../Models/contacto.models');

router.post('/enviar', enviarCorreo);

module.exports = router;