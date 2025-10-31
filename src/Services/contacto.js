import API from "@/services/axios";

export async function enviarContacto(formData) {
  try {
    const res = await API.post("/contacto/enviar", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}