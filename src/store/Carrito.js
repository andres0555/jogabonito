import { defineStore } from "pinia";
import Swal from "sweetalert2";
import API from "@/Services/axios";

// Validar datos de localStorage para evitar errores
function validateCarritoData(data) {
  if (!Array.isArray(data)) return [];
  return data.filter((item) => {
    return (
      item &&
      typeof item === "object" &&
      Number.isInteger(item.id_variante) &&
      typeof item.nombre === "string" &&
      typeof item.precio === "number" &&
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0 &&
      typeof item.imagen === "string"
    );
  });
}

export const useCarritoStore = defineStore("carrito", {
  state: () => ({
    productos: validateCarritoData(
      JSON.parse(localStorage.getItem("carrito") || "[]")
    ),
    ultimaCompra: null,
  }),

  actions: {
    // AGREGAR PRODUCTO AL CARRITO
    agregarProducto(producto) {
      if (
        !producto ||
        !Number.isInteger(producto.id_variante) ||
        !producto.nombre ||
        !producto.precio ||
        !producto.imagen
      ) {
        console.error("Producto inválido:", producto);
        return;
      }

      const existente = this.productos.find(
        (p) => p.id_variante === producto.id_variante
      );

      if (existente) {
        existente.cantidad += 1;
      } else {
        this.productos.push({ ...producto, cantidad: 1 });
      }

      this.saveToLocalStorage();

      Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        timer: 1500,
        showConfirmButton: false,
      });
    },

    // QUITAR PRODUCTO
    quitarProducto(id_variante) {
      const index = this.productos.findIndex(
        (p) => p.id_variante === id_variante
      );
      if (index !== -1) {
        this.productos.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    // ACTUALIZAR CANTIDAD
    actualizarCantidad(id_variante, cantidad) {
      const producto = this.productos.find(
        (p) => p.id_variante === id_variante
      );
      if (producto) {
        producto.cantidad = Math.max(1, parseInt(cantidad) || 1);
        this.saveToLocalStorage();
      }
    },

    // LIMPIAR CARRITO
    limpiarCarrito() {
      this.productos = [];
      this.saveToLocalStorage();
    },

    // FINALIZAR COMPRA
    async finalizarCompra(idUsuario) {
      try {
        if (this.productos.length === 0) {
          Swal.fire("Tu carrito está vacío");
          return;
        }

        const total = this.total;

        // MAPEO CORRECTO: incluye id_variante y precio como número
        const detalle = this.productos.map((p) => ({
          id_variante: p.id_variante,           // OBLIGATORIO
          cantidad: p.cantidad,
          precio_unitario: Number(p.precio),    // NÚMERO, no string
          nombre: p.nombre,
          talla: p.talla || "",
        }));

        console.log("Enviando compra:", {
          id_usuario: idUsuario,
          total,
          detalle,
        });

        const response = await API.post("/compras/compras-carrito", {
          id_usuario: idUsuario,
          total,
          detalle,
          metodo_pago: "tarjeta",
        });

        if (!response.data.id_factura) {
          throw new Error("No se recibió ID de factura");
        }

        // Guardar última compra para mostrar en factura.vue
        this.ultimaCompra = {
          productos: [...this.productos],
          total,
          fecha: new Date().toLocaleString("es-CO"),
          id_factura: response.data.id_factura,
        };

        this.limpiarCarrito();

        Swal.fire({
          icon: "success",
          title: "¡Compra exitosa!",
          text: `Factura #${response.data.id_factura}`,
          timer: 2000,
          showConfirmButton: false,
        });

        return this.ultimaCompra;
      } catch (error) {
        console.error("Error en finalizarCompra:", error.response?.data || error);
        Swal.fire({
          icon: "error",
          title: "Error en el pago",
          text: error.response?.data?.error || "Intenta de nuevo o contacta soporte",
        });
        throw error;
      }
    },

    // GUARDAR EN LOCALSTORAGE
    saveToLocalStorage() {
      localStorage.setItem("carrito", JSON.stringify(this.productos));
    },
  },

  getters: {
    // TOTAL DE PRODUCTOS
    contador: (state) =>
      state.productos.reduce((acc, p) => acc + p.cantidad, 0),

    // TOTAL A PAGAR
    total: (state) =>
      state.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
  },
});