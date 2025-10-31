const db = require("../config/db");
const { obtenerProductos } = require("../Models/productos.models");

// ✅ Obtener todos los productos con variantes
async function getProductos(req, res) {
  try {
    const productos = await obtenerProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
}

async function actualizarEstadoProductos() {
  try {
    const [productosAgotados] = await db.query(`
      SELECT p.id_producto
      FROM productos p
      LEFT JOIN variantes_producto v ON p.id_producto = v.id_producto
      GROUP BY p.id_producto
      HAVING SUM(v.stock) = 0 OR SUM(v.stock) IS NULL;
    `);

    // Actualizar a no disponible
    for (const prod of productosAgotados) {
      await db.query(
        `UPDATE variantes_producto SET estado = 'agotado' WHERE id_producto = ?`,
        [prod.id_producto]
      );
    }
  } catch (error) {
    console.error("Error al actualizar estados:", error);
  }
}

module.exports = {
  getProductos,
  actualizarEstadoProductos
};
