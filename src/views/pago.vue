<template>
  <main class="pago">
    <section class="pago__header">
      <h1>Finalizar Compra</h1>
      <p>Completa los datos para procesar tu pago en <strong>Joga Bonito ⚽</strong></p>
    </section>

    <section class="pago__contenido">
      <div class="pago__columnas">
        <!-- Resumen de la compra -->
        <div class="factura">
          <h2>Resumen de tu compra</h2>
          <div v-for="p in carritoStore.productos" :key="p.id" class="factura__producto">
            <p>{{ p.nombre }} x{{ p.cantidad }}</p>
            <span>
              {{ (p.precio * p.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP', '').trim() }}
            </span>
          </div>
          <hr />
          <h3>
            Total: {{ carritoStore.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).replace('COP', '').trim() }}
          </h3>
        </div>

        <!-- Datos de la tarjeta -->
        <div class="tarjeta">
          <h2>Datos de la tarjeta</h2>
          <form class="tarjeta__form" @submit.prevent="procesarPago">
            <!-- Número de tarjeta -->
            <div class="form__grupo">
              <label for="numero">Número de tarjeta</label>
              <div class="input-icono">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input
                  id="numero"
                  v-model="tarjeta.numero"
                  @input="formatearNumero"
                  maxlength="19"
                  placeholder="1234-5678-9012-3456"
                  required
                />
              </div>
            </div>

            <!-- Nombre del titular -->
            <div class="form__grupo">
              <label for="nombre">Nombre del titular</label>
              <div class="input-icono">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input
                  id="nombre"
                  v-model="tarjeta.nombre"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <!-- Expira / CVV -->
            <div class="form__grupo fila">
              <div class="form__columna">
                <label for="expira">Expira</label>
                <div class="input-icono">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z"/>
                  </svg>
                  <input
                    id="expira"
                    v-model="tarjeta.expira"
                    @input="formatearExpira"
                    maxlength="5"
                    placeholder="MM/AA"
                    required
                  />
                </div>
              </div>

              <div class="form__columna">
                <label for="cvv">CVV</label>
                <div class="input-icono">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <input
                    id="cvv"
                    v-model="tarjeta.cvv"
                    @input="validarCVV"
                    maxlength="3"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-pago">Finalizar compra</button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useCarritoStore } from '@/store/carrito';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const router = useRouter();

const tarjeta = ref({
  numero: '',
  nombre: '',
  expira: '',
  cvv: ''
});

// === VALIDACIONES ===
function formatearNumero(e) {
  let valor = e.target.value.replace(/\D/g, ''); // Solo dígitos
  valor = valor.match(/.{1,4}/g)?.join('-') || valor; // Añadir guion cada 4 dígitos
  tarjeta.value.numero = valor.slice(0, 19);
}

function formatearExpira(e) {
  let valor = e.target.value.replace(/\D/g, ''); // Solo dígitos
  if (valor.length >= 3) valor = valor.slice(0, 2) + '/' + valor.slice(2); // Insertar '/'
  tarjeta.value.expira = valor.slice(0, 5);
}

function validarCVV(e) {
  tarjeta.value.cvv = e.target.value.replace(/\D/g, '').slice(0, 3); // Solo 3 dígitos
}

// === PROCESAR PAGO ===
async function procesarPago() {
  if (carritoStore.productos.length === 0) {
    Swal.fire('Tu carrito está vacío');
    router.push('/');
    return;
  }

  Swal.fire({
    icon: 'info',
    title: 'Procesando pago...',
    text: 'Por favor espera unos segundos',
    showConfirmButton: false,
    timer: 1500
  });

  try {
    await carritoStore.finalizarCompra(authStore.user.id_usuario);
    router.push('/factura');
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo procesar el pago. Intenta de nuevo.'
    });
  }
}
</script>

<style scoped>
/* --- estilos idénticos al tuyo anterior, sin cambios --- */
.pago {
  min-height: 100vh;
  background: #000000c2;
  color: #fff;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
}

.pago__header {
  text-align: center;
  margin-bottom: 2rem;
}

.pago__header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.pago__header p {
  color: #ccc;
  font-size: 1rem;
}

.pago__contenido {
  width: 100%;
  max-width: 1000px;
}

.pago__columnas {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.factura, .tarjeta {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 0 20px rgba(0, 119, 255, 0.25);
  flex: 1;
  min-width: 300px;
}

.factura__producto {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.factura hr {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.factura h3 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #0077ff;
  text-align: right;
}

.tarjeta__form {
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
}

.form__grupo {
  display: flex;
  flex-direction: column;
}

.fila {
  display: flex;
  gap: 1.5rem;
}

.form__columna {
  flex: 1;
}

label {
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.4rem;
}

.input-icono {
  display: flex;
  align-items: center;
  background: #111;
  border: 1px solid #444;
  border-radius: 0.6rem;
  padding: 0.6rem 0.8rem;
  transition: all 0.3s ease;
}

.input-icono svg {
  color: #0077ff;
  margin-right: 0.5rem;
}

.input-icono input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  outline: none;
}

.input-icono:focus-within {
  border-color: #0077ff;
  box-shadow: 0 0 6px #0077ff40;
}

.btn-pago {
  width: 100%;
  padding: 0.9rem;
  background: #0077ff;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pago:hover {
  background: #0099ff;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .pago__columnas {
    flex-direction: column;
  }

  .fila {
    flex-direction: column;
  }

  .form__columna {
    width: 100%;
  }
}
</style>