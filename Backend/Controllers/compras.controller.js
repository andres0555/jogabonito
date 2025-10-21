const { crearCompra } = require("../Models/compras.models");

// ✅ Crear compra
async function postCompra(req, res) {
  try {
    const { id_usuario, total, detalle, metodo_pago } = req.body;

    // Validaciones básicas
    if (!id_usuario || !total || !detalle || !metodo_pago) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    if (!Array.isArray(detalle) || detalle.length === 0) {
      return res.status(400).json({ error: 'El detalle de la compra es inválido' });
    }

    const id_factura = await crearCompra(id_usuario, total, detalle, metodo_pago);
    res.status(201).json({ id_factura, message: 'Compra finalizada' });
  } catch (error) {
    console.error('Error en postCompra:', error);
    res.status(500).json({ error: 'Error al finalizar la compra' });
  }
}

module.exports = {
  postCompra
};