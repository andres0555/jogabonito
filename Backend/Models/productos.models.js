const db = require("../config/db");

// ✅ Obtener todos los productos disponibles
async function obtenerProductos() {
  try {
    const [rows] = await db.query(
      `SELECT p.id_producto AS id, p.nombre_producto AS nombre, p.precio, p.talla, p.estado, p.imagen_ruta AS imagen,
              m.nombre_marca AS marca, t.nombre_tipo AS tipo
       FROM productos p
       LEFT JOIN marcas m ON p.id_marca = m.id_marca
       LEFT JOIN tipos t ON p.id_tipo = t.id_tipo
       WHERE p.estado = 'disponible'
       ORDER BY p.nombre_producto ASC`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

module.exports = {
  obtenerProductos
};