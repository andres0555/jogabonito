const db = require("../config/db");
const { crearCompra } = require("../Models/compras.models");

async function postCompra(req, res) {
  try {
    console.log('Body recibido:', req.body);

    const { id_usuario, total, detalle, metodo_pago } = req.body;

    if (!id_usuario || !total || !detalle || !metodo_pago) {
      console.log('Error: Faltan datos requeridos');
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    if (!Array.isArray(detalle) || detalle.length === 0) {
      return res.status(400).json({ error: 'El detalle de la compra es inválido' });
    }

    // Validar que el usuario existe
    const [userRows] = await db.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id_usuario]);
    if (userRows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Validar stock
    // Validar cada ítem
for (const item of detalle) {
  if (
    !item.id_variante || 
    !Number.isInteger(item.cantidad) || 
    item.cantidad <= 0 ||
    typeof item.precio_unitario !== 'number' ||
    !item.nombre
  ) {
    return res.status(400).json({ 
      error: `Item inválido: ${JSON.stringify(item)}` 
    });
  }

  const [rows] = await db.query(
    `SELECT stock FROM variantes_producto WHERE id_variante = ?`,
    [item.id_variante]
  );
  if (!rows[0] || rows[0].stock < item.cantidad) {
    return res.status(400).json({ 
      error: `Stock insuficiente para variante ID ${item.id_variante}` 
    });
  }
}

    const id_factura = await crearCompra(id_usuario, total, detalle, metodo_pago);
    console.log('Compra creada con ID:', id_factura);
    res.status(201).json({ id_factura, message: 'Compra finalizada' });
  } catch (error) {
    console.error('Error en postCompra:', error);
    res.status(500).json({ error: 'Error al finalizar la compra: ' + error.message });
  }
}

module.exports = { postCompra };