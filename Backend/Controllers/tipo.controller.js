const { obtenerTipos } = require("../Models/tipo.models");

// ✅ Obtener todos los tipos
async function getTipos(req, res) {
  try {
    const tipos = await obtenerTipos();
    res.status(200).json(tipos);
  } catch (error) {
    console.error('Error en getTipos:', error);
    res.status(500).json({ error: 'Error al obtener los tipos' });
  }
}

module.exports = {
  getTipos
};