import API from "@/services/axios";

// Obtener todas las facturas
export async function obtenerFacturas() {
  try {
    const res = await API.get("/perfiladmin/mostrar-facturas");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Obtener detalle de una factura
export async function obtenerDetalleFactura(id_factura) {
  try {
    const res = await API.get(`/perfiladmin/detalle/${id_factura}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

