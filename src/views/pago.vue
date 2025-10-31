<template>
  <main class="pago">
    <!-- Encabezado -->
    <section class="pago__header">
      <h1>Finalizar Compra</h1>
      <p>Completa los datos para procesar tu pago en <strong>Joga Bonito</strong></p>
    </section>

    <!-- Contenido principal -->
    <section class="pago__contenido">
      <!-- Resumen de compra (tarjeta estilo tienda) -->
      <div class="pago-card pago-card--resumen">
        <div class="pago-card__header">
          <h2>Resumen de tu compra</h2>
        </div>

        <div class="pago-card__body">
          <div
            v-for="p in carritoStore.productos"
            :key="p.id_variante"
            class="resumen__producto"
          >
            <p class="producto-nombre">
              {{ p.nombre }}
              <span v-if="p.talla">({{ p.talla }})</span>
              <span class="cantidad">x{{ p.cantidad }}</span>
            </p>
            <p class="producto-precio">
              {{
                (p.precio * p.cantidad)
                  .toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                  .replace('COP', '')
                  .trim()
              }}
            </p>
          </div>

          <hr class="divider" />

          <div class="total">
            <h3>Total a pagar:</h3>
            <p class="total-precio">
              {{
                carritoStore.total
                  .toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                  .replace('COP', '')
                  .trim()
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Formulario de tarjeta (tarjeta estilo tienda) -->
      <div class="pago-card pago-card--form">
        <div class="pago-card__header">
          <h2>Datos de la tarjeta</h2>
        </div>

        <div class="pago-card__body">
          <form class="tarjeta__form" @submit.prevent="procesarPago">
            <div class="form__grupo">
              <label for="numero">Número de tarjeta</label>
              <div class="input-wrapper">
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

            <div class="form__grupo">
              <label for="nombre">Nombre del titular</label>
              <div class="input-wrapper">
                <input
                  id="nombre"
                  v-model="tarjeta.nombre"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div class="form__fila">
              <div class="form__columna">
                <label for="expira">Expira</label>
                <div class="input-wrapper">
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
                <div class="input-wrapper">
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

            <button type="submit" class="btn btn--primary" :disabled="loading">
              {{ loading ? 'Procesando...' : 'Finalizar compra' }}
            </button>
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
const loading = ref(false);
const tarjeta = ref({ numero: '', nombre: '', expira: '', cvv: '' });

function formatearNumero(e) {
  let valor = e.target.value.replace(/\D/g, '');
  valor = valor.match(/.{1,4}/g)?.join('-') || valor;
  tarjeta.value.numero = valor.slice(0, 19);
}
function formatearExpira(e) {
  let valor = e.target.value.replace(/\D/g, '');
  if (valor.length >= 3) valor = valor.slice(0, 2) + '/' + valor.slice(2);
  tarjeta.value.expira = valor.slice(0, 5);
}
function validarCVV(e) {
  tarjeta.value.cvv = e.target.value.replace(/\D/g, '').slice(0, 3);
}

async function procesarPago() {
  if (carritoStore.productos.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Tu carrito está vacío.',
      timer: 2000,
      showConfirmButton: false,
    });
    router.push('/');
    return;
  }

  loading.value = true;
  Swal.fire({
    icon: 'info',
    title: 'Procesando pago...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (!authStore.user?.id_usuario) {
      throw new Error('Debes iniciar sesión');
    }

    const compra = await carritoStore.finalizarCompra(authStore.user.id_usuario);
    router.push({ name: 'Factura', params: { id: String(compra.id_factura) } });
  } catch (error) {
    console.error('Error en procesarPago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error en el pago',
      text: error.response?.data?.error || 'Intenta de nuevo',
      timer: 3000,
      showConfirmButton: true,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ===== ESTILOS GENERALES ===== */
.pago {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
}

/* ===== ENCABEZADO ===== */
.pago__header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.pago__header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.pago__header p {
  color: #ccc;
  font-size: 1rem;
}

/* ===== CONTENIDO ===== */
.pago__contenido {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}

/* ===== TARJETA DE PAGO (IGUAL A producto-card) ===== */
.pago-card {
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  text-align: center;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.pago-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.pago-card__header {
  margin-bottom: 1rem;
}

.pago-card__header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.pago-card__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #fff;
  flex: 1;
}

/* ===== RESUMEN DE COMPRA ===== */
.resumen__producto {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 119, 255, 0.1);
  padding: 0.7rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.95rem;
}

.producto-nombre {
  text-align: left;
  color: #fff;
  font-weight: 600;
}

.cantidad {
  color: #00ff88;
  font-weight: bold;
  margin-left: 0.5rem;
}

.producto-precio {
  color: #00ff88;
  font-weight: 600;
}

.divider {
  border: 0;
  border-top: 1px solid #444;
  margin: 1rem 0;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.total h3 {
  font-size: 1.1rem;
  color: #0077ff;
  margin: 0;
}

.total-precio {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00ff88;
  margin: 0;
}

/* ===== FORMULARIO DE TARJETA ===== */
.tarjeta__form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 0.5rem;
}

.form__grupo {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form__grupo label {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background: #222;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #0077ff;
  box-shadow: 0 0 8px rgba(0, 119, 255, 0.4);
}

.form__fila {
  display: flex;
  gap: 1rem;
}

.form__columna {
  flex: 1;
}

/* Botón reutiliza .btn--primary de tienda */
.btn--primary {
  margin-top: auto;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #000000, #0077ff);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(0, 119, 255, 0.5);
}

.btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0a0a0a, #0099ff);
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0, 119, 255, 0.7);
}

.btn--primary:disabled {
  background: #333;
  color: #777;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .pago {
    padding: 1rem;
  }

  .pago__header h1 {
    font-size: 2rem;
  }

  .pago__contenido {
    grid-template-columns: 1fr;
  }

  .pago-card {
    padding: 1.2rem 1rem;
  }

  .resumen__producto {
    flex-direction: column;
    text-align: center;
    gap: 0.3rem;
  }

  .producto-nombre {
    font-size: 0.9rem;
  }

  .total h3 {
    font-size: 1rem;
  }

  .total-precio {
    font-size: 1.1rem;
  }

  .form__grupo input {
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .btn--primary {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .pago__header h1 {
    font-size: 1.8rem;
  }

  .pago-card__header h2 {
    font-size: 1.1rem;
  }

  .form__fila {
    flex-direction: column;
  }
}
</style>