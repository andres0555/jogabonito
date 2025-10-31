const db = require("../config/db");

async function crearCompra(id_usuario, total, detalle, metodo_pago) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    console.log('Creando factura para usuario:', id_usuario);

    const [facturaResult] = await connection.query(
      `INSERT INTO facturas (id_usuario, total) VALUES (?, ?)`,
      [id_usuario, total]
    );
    const id_factura = facturaResult.insertId;
    console.log('Factura creada:', id_factura);

    for (const item of detalle) {
      const { id_variante, cantidad, precio_unitario, nombre = 'Producto', talla = '' } = item;

      console.log(`Insertando: ${nombre} (${talla}) x${cantidad}`);

      await connection.query(
        `INSERT INTO detalle_factura (id_factura, id_variante, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
        [id_factura, id_variante, cantidad, precio_unitario]
      );

      const [stockCheck] = await connection.query(
        `SELECT stock FROM variantes_producto WHERE id_variante = ?`,
        [id_variante]
      );
      if (stockCheck[0]?.stock < cantidad) {
        throw new Error(`Stock insuficiente para variante ${id_variante}`);
      }

      await connection.query(
        `UPDATE variantes_producto 
         SET stock = stock - ?, 
             estado = CASE WHEN stock - ? <= 0 THEN 'agotado' ELSE 'disponible' END
         WHERE id_variante = ?`,
        [cantidad, cantidad, id_variante]
      );
    }

    await connection.query(
      `INSERT INTO pagos (id_factura, metodo_pago, monto) VALUES (?, ?, ?)`,
      [id_factura, metodo_pago, total]
    );

    await connection.commit();
    console.log('Transacción completada con éxito');
    return id_factura;
  } catch (error) {
    await connection.rollback();
    console.error('Error en transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { crearCompra };