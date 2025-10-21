const { obtenerMarcas } = require("../Models/marcas.models");

// ✅ Obtener todas las marcas
async function getMarcas(req, res) {
  try {
    const marcas = await obtenerMarcas();
    res.status(200).json(marcas);
  } catch (error) {
    console.error('Error en getMarcas:', error);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
}

module.exports = {
  getMarcas
};