<template>
  <div class="facturas-container">
    <h1 class="facturas-title">Facturas Registradas</h1>

    <div class="facturas-list">
      <div
        v-for="factura in facturas"
        :key="factura.id_factura"
        class="factura-card"
        :class="{ expanded: facturaExpandida === factura.id_factura }"
      >
        <div class="factura-header" @click="toggleDetalle(factura.id_factura)">
          <span class="factura-id">#{{ factura.id_factura }}</span>
          <span class="factura-cliente">{{ factura.cliente }}</span>
          <span class="factura-fecha">{{ formatDate(factura.fecha) }}</span>
          <span class="factura-total">$ {{ factura.total.toLocaleString() }}</span>
          <button
            class="toggle-btn"
            @click.stop="toggleDetalle(factura.id_factura)"
          >
            {{ facturaExpandida === factura.id_factura ? "Ocultar" : "Ver Detalle" }}
          </button>
        </div>

        <!-- Detalle con scroll -->
        <transition name="expand">
          <div
            v-if="facturaExpandida === factura.id_factura && detalleFactura.length"
            class="factura-detalle"
          >
            <div class="detalle-scroll">
              <table class="detalle-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Talla</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in detalleFactura" :key="item.id_detalle">
                    <td class="producto-cell">
                      <span>{{ item.nombre_producto }}</span>
                    </td>
                    <td>{{ item.talla || "-" }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>$ {{ item.precio_unitario.toLocaleString() }}</td>
                    <td>$ {{ item.subtotal.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="detalle-total">
              <strong>Total Factura:</strong> $ {{ factura.total.toLocaleString() }}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerFacturas, obtenerDetalleFactura } from "@/Services/perfilAdmin";

const facturas = ref([]);
const detalleFactura = ref([]);
const facturaExpandida = ref(null);

async function cargarFacturas() {
  try {
    facturas.value = await obtenerFacturas();
  } catch (error) {
    console.error("Error al cargar facturas:", error);
  }
}

async function toggleDetalle(id_factura) {
  if (facturaExpandida.value === id_factura) {
    facturaExpandida.value = null;
    detalleFactura.value = [];
  } else {
    facturaExpandida.value = id_factura;
    try {
      detalleFactura.value = await obtenerDetalleFactura(id_factura);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
      detalleFactura.value = [];
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

onMounted(cargarFacturas);
</script>

<style scoped>
.facturas-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1.5rem;
  color: #fff;
}

.facturas-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #00bfff;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.facturas-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.factura-card {
  background: #141414;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #222;
  transition: all 0.3s ease;
}

.factura-card:hover {
  box-shadow: 0 0 18px rgba(0, 191, 255, 0.3);
}

/* ===== HEADER RESPONSIVE ===== */
.factura-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 110px auto;
  align-items: center;
  padding: 1rem;
  background: #1e1e1e;
  cursor: pointer;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.factura-header:hover {
  background: #2a2a2a;
}

.factura-id {
  color: #00bfff;
  font-weight: 700;
  font-size: 0.95rem;
}

.factura-cliente {
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}

.factura-fecha {
  color: #bbb;
  font-size: 0.8rem;
}

.factura-total {
  color: #00ff88;
  font-weight: 700;
  font-size: 0.95rem;
}

.toggle-btn {
  background: #0077ff;
  border: none;
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: 0.3s;
}

.toggle-btn:hover {
  background: #0099ff;
}

/* ===== DETALLE CON SCROLL ===== */
.factura-detalle {
  background: #0f0f0f;
  padding: 1rem;
  border-top: 1px solid #333;
}

.detalle-scroll {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #0077ff #1e1e1e;
}

.detalle-scroll::-webkit-scrollbar {
  width: 6px;
}

.detalle-scroll::-webkit-scrollbar-track {
  background: #1e1e1e;
  border-radius: 3px;
}

.detalle-scroll::-webkit-scrollbar-thumb {
  background: #0077ff;
  border-radius: 3px;
}

.detalle-scroll::-webkit-scrollbar-thumb:hover {
  background: #0099ff;
}

.detalle-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.detalle-table th {
  background: #1e1e1e;
  color: #00bfff;
  padding: 0.6rem 0.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
}

.detalle-table td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #222;
}

.producto-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.producto-img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #333;
}

.detalle-total {
  text-align: right;
  font-size: 1rem;
  color: #00ff88;
  font-weight: 700;
  padding: 0.5rem 0;
}

/* ===== TRANSICIÓN EXPAND ===== */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .factura-header {
    grid-template-columns: 50px 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.4rem;
    padding: 0.8rem;
    font-size: 0.85rem;
  }

  .factura-id {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .factura-cliente {
    grid-column: 2 / 4;
    grid-row: 1 / 2;
    font-size: 0.9rem;
  }

  .factura-fecha {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
    font-size: 0.75rem;
  }

  .factura-total {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    justify-self: end;
    font-size: 0.9rem;
  }

  .toggle-btn {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
    justify-self: end;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .detalle-table {
    font-size: 0.75rem;
  }

  .detalle-table th,
  .detalle-table td {
    padding: 0.4rem 0.3rem;
  }

  .detalle-total {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .facturas-container {
    padding: 1rem;
    margin: 1rem auto;
  }

  .facturas-title {
    font-size: 1.8rem;
  }

  .factura-header {
    grid-template-columns: 45px 1fr auto;
    padding: 0.7rem;
  }

  .factura-cliente {
    font-size: 0.85rem;
  }

  .detalle-scroll {
    max-height: 250px;
  }
}
</style>