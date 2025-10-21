import API from "@/services/axios";

// 🟢 Registrar usuario (cliente)
export async function registrarUsuario(usuario) {
  try {
    const res = await API.post("/auth/registro", usuario);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🔵 Iniciar sesión
export async function loginUsuario(credenciales) {
  try {
    const res = await API.post("/auth/login", credenciales);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🟣 Obtener datos del usuario autenticado
export async function obtenerUsuario() {
  try {
    const res = await API.get("/auth/perfil");
    return res.data.user;
  } catch (err) {
    throw err.response?.data || { message: "Error al obtener datos del usuario" };
  }
}
