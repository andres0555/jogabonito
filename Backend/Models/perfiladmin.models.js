const db = require("../config/db");

// ✅ Obtener todas las facturas con información básica del usuario
async function obtenerFacturas() {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id_factura, 
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        f.fecha,
        f.total
      FROM facturas f
      LEFT JOIN usuarios u ON f.id_usuario = u.id_usuario
      ORDER BY f.fecha DESC
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    throw error;
  }
}

// ✅ Obtener el detalle de una factura (usa producto + variante correctamente)
async function obtenerDetalleFactura(id_factura) {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        df.id_detalle,
        p.nombre_producto AS nombre_producto,
        v.talla,
        df.cantidad,
        df.precio_unitario,
        df.subtotal,
        p.imagen_ruta
      FROM detalle_factura df
      LEFT JOIN variantes_producto v ON df.id_variante = v.id_variante
      LEFT JOIN productos p ON v.id_producto = p.id_producto
      WHERE df.id_factura = ?
      `,
      [id_factura]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener detalle de factura:", error.message);
    throw new Error("Error en la consulta SQL de detalle de factura");
  }
}

module.exports = {
  obtenerFacturas,
  obtenerDetalleFactura,
};
