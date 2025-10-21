import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import API from '@/Services/axios';

// Validar datos de localStorage
function validateCarritoData(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(item => {
    return (
      item &&
      typeof item === 'object' &&
      Number.isInteger(item.id) &&
      typeof item.nombre === 'string' &&
      typeof item.precio === 'number' &&
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0 &&
      typeof item.imagen === 'string'
    );
  });
}

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    productos: validateCarritoData(JSON.parse(localStorage.getItem('carrito') || '[]')),
    ultimaCompra: null // 🧾 Nueva propiedad: almacena la última compra antes de limpiar el carrito
  }),

  actions: {
    // Agregar producto al carrito
    agregarProducto(producto) {
      if (!producto || !Number.isInteger(producto.id) || !producto.nombre || !producto.precio || !producto.imagen) {
        console.error('Producto inválido:', producto);
        return;
      }
      const existente = this.productos.find(p => p.id === producto.id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        this.productos.push({ ...producto, cantidad: 1 });
      }
      this.saveToLocalStorage();
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        timer: 1500,
        showConfirmButton: false
      });
    },

    // Quitar producto del carrito
    quitarProducto(id) {
      const index = this.productos.findIndex(p => p.id === id);
      if (index !== -1) {
        this.productos.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    // Actualizar cantidad
    actualizarCantidad(id, cantidad) {
      const producto = this.productos.find(p => p.id === id);
      if (producto) {
        producto.cantidad = Math.max(1, parseInt(cantidad));
        this.saveToLocalStorage();
      }
    },

    // Limpiar carrito
    limpiarCarrito() {
      this.productos = [];
      this.saveToLocalStorage();
    },

    // 🧾 Finalizar compra (guardar factura antes de vaciar carrito)
    async finalizarCompra(idUsuario) {
      try {
        const total = this.total;
        const detalle = this.productos.map(p => ({
          id_producto: p.id,
          cantidad: p.cantidad,
          precio_unitario: p.precio,
        }));

        // Guardar información antes de limpiar el carrito
        this.ultimaCompra = {
          productos: [...this.productos],
          total,
          fecha: new Date().toLocaleString('es-CO')
        };

        const response = await API.post('/compras/compras-carrito', {
          id_usuario: idUsuario,
          total,
          detalle,
          metodo_pago: 'tarjeta'
        });

        // Vaciar carrito después de guardar la factura
        this.limpiarCarrito();

        Swal.fire({
          icon: 'success',
          title: 'Compra procesada correctamente',
          text: `Total: $${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP', '').trim()}`,
          timer: 2000,
          showConfirmButton: false
        });

        return response.data;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al finalizar la compra'
        });
        throw error;
      }
    },

    // Guardar en localStorage
    saveToLocalStorage() {
      localStorage.setItem('carrito', JSON.stringify(this.productos));
    }
  },

  getters: {
    contador: (state) => state.productos.reduce((acc, p) => acc + p.cantidad, 0),
    total: (state) => state.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
  }
});
