<template>
  <main class="factura">
    <section class="factura__contenedor">
      <header class="factura__header">
        <h1>Factura de Compra</h1>
        <p>Gracias por tu compra en <strong>⚽ Joga Bonito</strong></p>
      </header>

      <div v-if="compra" class="factura__detalle">
        <div class="factura__info">
          <p><strong>Cliente:</strong> {{ authStore.user?.nombre || 'Usuario registrado' }}</p>
          <p><strong>Fecha:</strong> {{ compra.fecha }}</p>
          <p><strong>Método de pago:</strong> Tarjeta</p>
        </div>

        <table class="factura__tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in compra.productos" :key="i">
              <td>{{ p.nombre }}</td>
              <td>{{ p.talla || '-' }}</td>
              <td>{{ p.cantidad }}</td>
              <td>
                {{ p.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP','').trim() }}
              </td>
              <td>
                {{ (p.precio * p.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP','').trim() }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="factura__total">
          <h2>Total</h2>
          <p class="valor">
            {{ compra.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP','').trim() }}
          </p>
        </div>
      </div>

      <div v-else class="factura__vacia">
        <h2>No hay datos de compra</h2>
        <p>Por favor realiza una compra para ver tu factura.</p>
        <router-link to="/tienda" class="btn-volver">Volver a la tienda</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useCarritoStore } from '@/store/Carrito';
import { useAuthStore } from '@/store/auth';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const compra = carritoStore.ultimaCompra;
</script>

<style scoped>
.factura {
  min-height: 100vh;
  background: #0d1117;
  color: #e6edf3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

.factura__contenedor {
  background: #161b22;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 0 25px rgba(0, 119, 255, 0.2);
  width: 100%;
  max-width: 800px;
}

.factura__header {
  text-align: center;
  border-bottom: 1px solid #30363d;
  margin-bottom: 2rem;
}

.factura__header h1 {
  font-size: 2.2rem;
  color: #58a6ff;
  margin-bottom: 0.4rem;
}

.factura__header p {
  color: #8b949e;
}

.factura__info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  color: #c9d1d9;
}

.factura__tabla {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.factura__tabla th,
.factura__tabla td {
  border-bottom: 1px solid #30363d;
  padding: 0.8rem;
  text-align: center;
}

.factura__tabla th {
  background: #21262d;
  color: #58a6ff;
  font-weight: 600;
}

.factura__tabla td {
  color: #c9d1d9;
}

.factura__total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #30363d;
  padding-top: 1rem;
}

.factura__total h2 {
  margin-right: 1rem;
  color: #58a6ff;
}

.valor {
  font-size: 1.8rem;
  font-weight: bold;
}

.factura__vacia {
  text-align: center;
  padding: 2rem;
}

.factura__vacia h2 {
  color: #58a6ff;
  margin-bottom: 0.5rem;
}

.btn-volver {
  display: inline-block;
  margin-top: 1.2rem;
  padding: 0.8rem 1.5rem;
  background: #0077ff;
  color: #fff;
  border-radius: 0.8rem;
  text-decoration: none;
  transition: 0.3s;
}

.btn-volver:hover {
  background: #0099ff;
}
</style>
