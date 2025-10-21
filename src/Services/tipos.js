import API from "@/services/axios";

// ✅ Obtener todos los tipos
export async function obtenerTipos() {
  try {
    const res = await API.get("/tipos/mostrar-tipos");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}