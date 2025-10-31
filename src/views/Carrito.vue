<template>
  <main class="carrito">
    <!-- ENCABEZADO -->
    <section class="carrito__header">
      <h1>Tu carrito</h1>
      <p v-if="carritoStore.productos.length === 0" class="vacio">Tu carrito está vacío.</p>
    </section>

    <!-- LISTA DE PRODUCTOS -->
    <section v-if="carritoStore.productos.length > 0" class="carrito__lista">
      <article
        v-for="producto in carritoStore.productos"
        :key="producto.id_variante"
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
                .toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                .replace('COP','').trim()
            }}
          </p>

          <div class="cantidad">
            <label>Cantidad:</label>
            <input
              type="number"
              v-model.number="producto.cantidad"
              min="1"
              @input="actualizarCantidad(producto.id_variante, $event.target.value)"
            />
          </div>

          <p class="subtotal">
            Subtotal:
            {{
              (producto.precio * producto.cantidad)
                .toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                .replace('COP','').trim()
            }}
          </p>
        </div>

        <button class="btn-eliminar" @click="eliminarProducto(producto.id_variante)">
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
            .toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
            .replace('COP','').trim()
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

// Manejar errores de imagen
const handleImageError = (event) => {
  if (!event.target.dataset.errorHandled) {
    event.target.src = `${BASE_URL}/images/placeholder.jpg`;
    event.target.dataset.errorHandled = 'true';
  }
};

// Actualizar cantidad
function actualizarCantidad(id_variante, cantidad) {
  const num = parseInt(cantidad) || 1;
  carritoStore.actualizarCantidad(id_variante, num);
}

// Eliminar producto
function eliminarProducto(id_variante) {
  carritoStore.quitarProducto(id_variante);
}

// Redirigir a pago
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

  if (carritoStore.productos.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Tu carrito está vacío',
      text: 'Agrega productos antes de continuar',
    });
    return;
  }

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
  border-radius: 2rem;
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

/* LISTA DE PRODUCTOS */
.carrito__lista {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.carrito__item {
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carrito__item:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0,119,255,0.6);
}

.item__img {
  width: 100%;
  max-width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.item__img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0,119,255,0.6);
  border-color: #0077ff;
}

.item__info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #fff;
}

.item__info h3 {
  font-size: 1.2rem;
  font-weight: 700;
}

.marca {
  color: #ccc;
  font-size: 0.9rem;
}

.talla, .precio, .subtotal {
  font-size: 0.95rem;
  color: #00ff88;
}

.cantidad {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  align-self: flex-start;
  background: #0077ff;
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-eliminar:hover {
  background: #0099ff;
  transform: scale(1.05);
}

/* RESUMEN */
.carrito__resumen {
  margin-top: 2rem;
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.carrito__resumen h2 {
  margin-bottom: 1rem;
  color: #00bfff;
}

.carrito__total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #00ff88;
  margin: 1rem 0;
}

.btn-finalizar {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #000000, #0077ff);
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-finalizar:hover {
  background: linear-gradient(135deg, #0a0a0a, #0099ff);
  transform: scale(1.05);
}

/* RESPONSIVE */
@media (min-width: 768px) {
  .carrito__item {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }

  .item__img {
    margin: 0;
  }

  .btn-eliminar {
    margin-left: auto;
  }
}
</style>