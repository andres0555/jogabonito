const db = require("../config/db");

async function obtenerTipos() {
  try {
    const [rows] = await db.query(
      `SELECT id_tipo, nombre_tipo 
       FROM tipos 
       ORDER BY nombre_tipo ASC`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    throw error;
  }
}

module.exports = {
  obtenerTipos
};