const { obtenerProductos } = require("../Models/productos.models");

// ✅ Obtener todos los productos
async function getProductos(req, res) {
  try {
    const productos = await obtenerProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error en getProductos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
}

module.exports = {
  getProductos
};