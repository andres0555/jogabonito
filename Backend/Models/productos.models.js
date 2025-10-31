const db = require("../config/db");

// ✅ Obtener productos junto con sus variantes disponibles
async function obtenerProductos() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto AS id,
        p.nombre_producto AS nombre,
        p.precio,
        p.imagen_ruta AS imagen,
        m.nombre_marca AS marca,
        t.nombre_tipo AS tipo,
        v.id_variante,
        v.talla,
        v.stock,
        v.estado
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN tipos t ON p.id_tipo = t.id_tipo
      LEFT JOIN variantes_producto v ON p.id_producto = v.id_producto
      WHERE v.estado = 'disponible' AND v.stock > 0
      ORDER BY p.nombre_producto ASC;
    `);

    // Agrupar por producto
    const productosMap = {};
    for (const row of rows) {
      if (!productosMap[row.id]) {
        productosMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          precio: row.precio,
          imagen: row.imagen,
          marca: row.marca,
          tipo: row.tipo,
          variantes: []
        };
      }

      productosMap[row.id].variantes.push({
        id_variante: row.id_variante,
        talla: row.talla,
        stock: row.stock,
        estado: row.estado
      });
    }

    const productos = Object.values(productosMap);
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

module.exports = { obtenerProductos };
