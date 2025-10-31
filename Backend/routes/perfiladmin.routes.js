const express = require("express");
const router = express.Router();
const { getFacturas, getDetalleFactura } = require("../Controllers/perfiladmin.controller");

// Rutas
router.get("/mostrar-facturas", getFacturas);
router.get("/detalle/:id_factura", getDetalleFactura);

module.exports = router;
