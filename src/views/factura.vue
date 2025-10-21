<template>
  <main class="factura" v-if="carritoStore.ultimaCompra">
    <h1>Factura de compra</h1>
    <p>Gracias por tu compra, {{ authStore.user.nombre }}.</p>
    <p><strong>Fecha:</strong> {{ carritoStore.ultimaCompra.fecha }}</p>

    <table>
      <thead>
        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in carritoStore.ultimaCompra.productos" :key="p.id">
          <td>{{ p.nombre }}</td>
          <td>{{ p.cantidad }}</td>
          <td>$ {{ (p.precio * p.cantidad).toLocaleString('es-CO') }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Total: $ {{ carritoStore.ultimaCompra.total.toLocaleString('es-CO') }}</h2>

    <div class="acciones">
      <button class="btn" @click="volverInicio">Volver al inicio</button>
    </div>
  </main>

  <main v-else class="factura">
    <h2>No hay factura disponible.</h2>
    <button class="btn" @click="volverInicio">Volver al inicio</button>
  </main>
</template>

<script setup>
import { useCarritoStore } from '@/store/carrito';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const router = useRouter();

function volverInicio() {
  router.push('/');
}
</script>

<style scoped>
.factura {
  min-height: 100vh;
  background: #000000c2;
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

table {
  width: 80%;
  margin: 2rem 0;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #444;
  padding: 0.8rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #0077ff;
}

h2 {
  margin-top: 2rem;
  color: #00b7ff;
}

.acciones {
  margin-top: 2rem;
}

.btn {
  padding: 0.9rem 2rem;
  background: #0077ff;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #0099ff;
  transform: translateY(-2px);
}
</style>
