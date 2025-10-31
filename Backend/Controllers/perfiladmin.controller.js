const { obtenerFacturas, obtenerDetalleFactura } = require("../Models/perfiladmin.models");

async function getFacturas(req, res) {
  try {
    const facturas = await obtenerFacturas();
    res.status(200).json(facturas);
  } catch (error) {
    console.error("Error en getFacturas:", error);
    res.status(500).json({ error: "Error al obtener las facturas" });
  }
}

async function getDetalleFactura(req, res) {
  const { id_factura } = req.params;
  try {
    const detalle = await obtenerDetalleFactura(id_factura);

    if (!detalle || detalle.length === 0)
      return res.status(404).json({ error: "Factura no encontrada o sin detalles" });

    res.status(200).json(detalle);
  } catch (error) {
    console.error("Error en getDetalleFactura:", error);
    res.status(500).json({ error: "Error al obtener el detalle de la factura" });
  }
}

module.exports = {
  getFacturas,
  getDetalleFactura,
};
