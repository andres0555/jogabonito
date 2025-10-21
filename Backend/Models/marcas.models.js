const db = require("../config/db");

// ✅ Obtener todas las marcas (para buscador o filtro)
async function obtenerMarcas() {
  try {
    const [rows] = await db.query(
      `SELECT id_marca, nombre_marca 
       FROM marcas 
       ORDER BY nombre_marca ASC`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    throw error;
  }
}

module.exports = {
  obtenerMarcas
};