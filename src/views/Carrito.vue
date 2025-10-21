<template>
  <main class="carrito">
    <!-- ENCABEZADO -->
    <section class="carrito__header">
      <h1>🛒 Tu carrito</h1>
      <p v-if="carritoStore.productos.length === 0" class="vacio">Tu carrito está vacío.</p>
    </section>

    <!-- LISTA DE PRODUCTOS -->
    <section v-if="carritoStore.productos.length > 0" class="carrito__lista">
      <article
        v-for="producto in carritoStore.productos"
        :key="producto.id"
        class="carrito__item"
      >
        <img
          :src="producto.imagen"
          :alt="producto.nombre"
          class="item__img"
          @error="handleImageError"
        />

        <div class="item__info">
          <h3>{{ producto.nombre }}</h3>
          <p class="marca">{{ producto.marca }}</p>
          <p class="talla">Talla: {{ producto.talla }}</p>
          <p class="precio">
            Precio:
            {{
              producto.precio
                .toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                })
                .replace('COP', '')
                .trim()
            }}
          </p>

          <div class="cantidad">
            <label>Cantidad:</label>
            <input
              type="number"
              v-model="producto.cantidad"
              min="1"
              @input="actualizarCantidad(producto.id, producto.cantidad)"
            />
          </div>

          <p class="subtotal">
            Subtotal:
            {{
              (producto.precio * producto.cantidad)
                .toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                })
                .replace('COP', '')
                .trim()
            }}
          </p>
        </div>

        <button class="btn-eliminar" @click="eliminarProducto(producto.id)">
          Eliminar
        </button>
      </article>
    </section>

    <!-- RESUMEN -->
    <section v-if="carritoStore.productos.length > 0" class="carrito__resumen">
      <h2>Resumen del pedido</h2>
      <p>Total de productos: {{ carritoStore.contador }}</p>
      <p class="carrito__total">
        Total a pagar:
        {{
          carritoStore.total
            .toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP'
            })
            .replace('COP', '')
            .trim()
        }}
      </p>
      <button class="btn-finalizar" @click="irAPago">Proceder al pago</button>
    </section>
  </main>
</template>

<script setup>
import { useCarritoStore } from '@/store/carrito';
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const BASE_URL = 'http://localhost:3000';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const router = useRouter();

// Manejar errores de imágenes
const handleImageError = (event) => {
  console.error('Error al cargar imagen:', event.target.src);
  if (!event.target.dataset.errorHandled) {
    event.target.src = `${BASE_URL}/images/placeholder.jpg`;
    event.target.dataset.errorHandled = 'true';
  }
};

// Actualizar cantidad
function actualizarCantidad(id, cantidad) {
  carritoStore.actualizarCantidad(id, cantidad);
}

// Eliminar producto
function eliminarProducto(id) {
  carritoStore.quitarProducto(id);
}

// 🔁 Nuevo flujo: redirige al formulario de pago
function irAPago() {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para proceder al pago',
      confirmButtonText: 'Ir a login'
    }).then(() => {
      router.push('/login');
    });
    return;
  }

  // Si está autenticado y hay productos
  if (carritoStore.productos.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Tu carrito está vacío',
      text: 'Agrega productos antes de continuar',
    });
    return;
  }

  // Redirigir a formulario de pago
  router.push('/pago');
}
</script>

<style scoped>
.carrito {
  min-height: 100vh;
  background: #000000c2;
  color: #fff;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carrito__header {
  text-align: center;
  margin-bottom: 2rem;
}

.carrito__header h1 {
  font-size: 2.5rem;
  color: #fff;
}

.vacio {
  color: #888;
  font-size: 1.1rem;
}

/* === LISTA === */
.carrito__lista {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.carrito__item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 10px rgba(0, 119, 255, 0.2);
  transition: transform 0.3s ease;
}

.carrito__item:hover {
  transform: scale(1.02);
}

.item__img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 1rem;
  background: #111;
  padding: 10px;
}

.item__info {
  flex: 1;
}

.item__info h3 {
  margin-bottom: 0.3rem;
  font-size: 1.2rem;
}

.marca {
  color: #0077ff;
  font-weight: bold;
}

.talla,
.precio,
.subtotal {
  font-size: 1.1rem;
  color: #fff;
  margin-top: 0.3rem;
}

.cantidad {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cantidad input {
  width: 60px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background: #222;
  color: #fff;
}

.btn-eliminar {
  background: transparent;
  border: 1px solid #0077ff;
  color: #0077ff;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-eliminar:hover {
  background: #0077ff;
  color: #fff;
}

/* === RESUMEN === */
.carrito__resumen {
  margin-top: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0, 119, 255, 0.2);
}

.carrito__resumen h2 {
  margin-bottom: 1rem;
}

.carrito__total {
  font-size: 1.4rem;
  font-weight: bold;
  color: #0077ff;
  margin: 1rem 0;
}

.btn-finalizar {
  width: 100%;
  padding: 1rem;
  background: #0077ff;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-finalizar:hover {
  background: #0099ff;
  transform: scale(1.05);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .carrito__item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .item__img {
    width: 150px;
    height: 150px;
  }

  .btn-eliminar {
    margin-top: 1rem;
  }
}
</style>
