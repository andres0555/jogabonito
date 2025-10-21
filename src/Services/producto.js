import API from "@/services/axios";

// ✅ Obtener todos los productos
export async function obtenerProductos() {
  try {
    const res = await API.get("/productos/ver-productos");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}