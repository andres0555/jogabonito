const db = require("../config/db");

// ✅ Crear compra (factura, detalle, pago)
async function crearCompra(id_usuario, total, detalle, metodo_pago) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Crear factura
    const [facturaResult] = await connection.query(
      `INSERT INTO facturas (id_usuario, total) VALUES (?, ?)`,
      [id_usuario, total]
    );
    const id_factura = facturaResult.insertId;

    // Crear detalles de factura
    for (const item of detalle) {
      await connection.query(
        `INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
        [id_factura, item.id_producto, item.cantidad, item.precio_unitario]
      );
    }

    // Crear pago
    await connection.query(
      `INSERT INTO pagos (id_factura, metodo_pago, monto) VALUES (?, ?, ?)`,
      [id_factura, metodo_pago, total]
    );

    await connection.commit();
    return id_factura;
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear compra:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  crearCompra
};