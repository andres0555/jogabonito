import API from "@/services/axios";

// ✅ Obtener todas las marcas
export async function obtenerMarcas() {
  try {
    const res = await API.get("/marcas/mostrar-marcas");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}