<template>
  <main class="tienda">
    <section class="tienda__contenedor">
      <!-- ==== FILTROS ==== -->
      <aside class="filtros">
        <h2>Filtros</h2>

        <!-- Filtro: Marca -->
        <div class="filtro">
          <label>Marca</label>
          <select v-model="filtroMarca">
            <option value="">Todas</option>
            <option v-for="marca in marcas" :key="marca.id_marca" :value="marca.nombre_marca">
              {{ marca.nombre_marca }}
            </option>
          </select>
        </div>

        <!-- Filtro: Tipo -->
        <div class="filtro">
          <label>Tipo</label>
          <select v-model="filtroTipo">
            <option value="">Todos</option>
            <option v-for="tipo in tipos" :key="tipo.id_tipo" :value="tipo.nombre_tipo">
              {{ tipo.nombre_tipo }}
            </option>
          </select>
        </div>

        <!-- Filtro: Continente (solo camisetas) -->
        <div v-if="filtroTipo === 'Camiseta'" class="filtro">
          <label>Continente</label>
          <select v-model="filtroContinente">
            <option value="">Todos</option>
            <option value="Europa">Europa</option>
            <option value="Sudamérica">Sudamérica</option>
            <option value="América del Norte">América del Norte</option>
            <option value="Asia">Asia</option>
            <option value="África">África</option>
          </select>
        </div>

        <button class="btn btn--secondary" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </aside>

      <!-- ==== PRODUCTOS ==== -->
      <section class="productos">
        <header class="section-header">
          <h2>Nuestros Productos</h2>
          <p>Explora nuestra colección exclusiva</p>
        </header>

        <ul class="grid-productos" role="list">
          <li
            v-for="producto in productosFiltrados"
            :key="producto.id"
            class="producto-card"
          >
            <img
              :src="producto.imagen"
              :alt="producto.nombre"
              class="producto-img"
              @error="handleImageError"
              @click="abrirModal(producto)"
            />

            <div class="producto-info">
              <h3 class="producto-nombre">{{ producto.nombre }}</h3>
              <p class="producto-marca">{{ producto.marca }}</p>

              <!-- Selector de tallas -->
              <div class="talla-selector">
                <label>Talla:</label>
                <select v-model="producto.tallaSeleccionada">
                  <option value="" disabled selected>Elige una talla</option>
                  <option
                    v-for="v in producto.variantes"
                    :key="v.id_variante"
                    :value="v.talla"
                    :disabled="v.stock <= 0"
                  >
                    {{ v.talla }} 
                    <span class="stock-status">
                      ({{ v.stock > 0 ? `${v.stock} dis.` : 'Agotado' }})
                    </span>
                  </option>
                </select>
              </div>

              <p class="producto-precio">
                ${{ producto.precio.toLocaleString() }}
              </p>

              <button
                class="btn btn--primary"
                @click="agregarAlCarrito(producto)"
                :disabled="!producto.tallaSeleccionada"
              >
                {{ producto.tallaSeleccionada ? 'Agregar al carrito' : 'Selecciona talla' }}
              </button>
            </div>
          </li>
        </ul>
      </section>
    </section>

    <!-- MODAL DE IMAGEN AMPLIADA -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="modalImagen" class="modal-backdrop" @click="cerrarModal">
          <div class="modal-content" @click.stop>
            <button class="modal-close" @click="cerrarModal" aria-label="Cerrar">
              X
            </button>
            <img
              :src="modalImagen"
              :alt="modalProducto?.nombre"
              class="modal-img"
            />
            <div class="modal-info">
              <h3>{{ modalProducto?.nombre }}</h3>
              <p>{{ modalProducto?.marca }}</p>
              <p v-if="modalProducto?.tallaSeleccionada">
                Talla seleccionada: <strong>{{ modalProducto.tallaSeleccionada }}</strong>
              </p>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { obtenerMarcas } from "@/Services/marcas";
import { obtenerTipos } from "@/Services/tipos";
import { obtenerProductos } from "@/Services/producto";
import { useCarritoStore } from '@/store/carrito';
import Swal from "sweetalert2";

// URL base del servidor
const BASE_URL = 'http://localhost:3000';

// === RUTA Y ROUTER ===
const route = useRoute();
const router = useRouter();

// === ESTADO ===
const filtroMarca = ref("");
const filtroTipo = ref("");
const filtroContinente = ref("");
const marcas = ref([]);
const tipos = ref([]);
const productos = ref([]);
const carritoStore = useCarritoStore();

// Modal
const modalImagen = ref(null);
const modalProducto = ref(null);

// === CARGA DE DATOS ===
const handleImageError = (event) => {
  event.target.src = `${BASE_URL}/images/placeholder.jpg`;
};

async function cargarDatos() {
  try {
    const [marcasData, tiposData, productosData] = await Promise.all([
      obtenerMarcas(),
      obtenerTipos(),
      obtenerProductos()
    ]);

    productos.value = productosData.map(producto => ({
      ...producto,
      imagen: `${BASE_URL}${producto.imagen}`,
      continente: producto.tipo === 'Camiseta' ? (producto.continente || 'Sudamérica') : null,
      tallaSeleccionada: ""
    }));

    marcas.value = marcasData;
    tipos.value = tiposData;

    // === APLICAR FILTRO DESDE URL AL CARGAR ===
    aplicarFiltroDesdeURL();

  } catch (error) {
    console.error("Error al cargar datos:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos. Intenta de nuevo más tarde.'
    });
  }
}

onMounted(cargarDatos);

// === APLICAR FILTRO DESDE URL (al cargar y al cambiar) ===
function aplicarFiltroDesdeURL() {
  const marcaDesdeURL = route.query.marca;
  if (marcaDesdeURL) {
    // Buscar si la marca existe en la lista
    const marcaValida = marcas.value.find(m => 
      m.nombre_marca.toLowerCase() === marcaDesdeURL.toLowerCase()
    );
    if (marcaValida) {
      filtroMarca.value = marcaValida.nombre_marca;
    } else {
      // Si no existe, limpiar
      filtroMarca.value = "";
    }
  } else {
    filtroMarca.value = "";
  }
}

// === ESCUCHAR CAMBIOS EN LA URL ===
watch(
  () => route.query.marca,
  (nuevoValor) => {
    if (nuevoValor) {
      const marcaValida = marcas.value.find(m => 
        m.nombre_marca.toLowerCase() === nuevoValor.toLowerCase()
      );
      filtroMarca.value = marcaValida ? marcaValida.nombre_marca : "";
    } else {
      filtroMarca.value = "";
    }
  }
);

// === SINCRONIZAR SELECT CON URL (cuando cambie manualmente) ===
watch(filtroMarca, (nuevoValor) => {
  const query = { ...route.query };
  if (nuevoValor) {
    query.marca = nuevoValor;
  } else {
    delete query.marca;
  }
  router.replace({ query }).catch(() => {});
});

// === MODAL ===
function abrirModal(producto) {
  modalImagen.value = producto.imagen;
  modalProducto.value = { ...producto };
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalImagen.value = null;
  modalProducto.value = null;
  document.body.style.overflow = '';
}

// === CARRITO ===
function agregarAlCarrito(producto) {
  if (!producto.tallaSeleccionada) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona una talla",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  const variante = producto.variantes.find(v => v.talla === producto.tallaSeleccionada);

  if (!variante || variante.stock <= 0) {
    Swal.fire({
      icon: "error",
      title: "Talla agotada",
      text: "Lo sentimos, esa talla no tiene stock.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  carritoStore.agregarProducto({
    id_variante: variante.id_variante,
    nombre: producto.nombre,
    precio: Number(producto.precio),
    imagen: producto.imagen,
    marca: producto.marca,
    talla: producto.tallaSeleccionada,
  });

  Swal.fire({
    icon: "success",
    title: "¡Agregado!",
    text: `${producto.nombre} (Talla ${producto.tallaSeleccionada})`,
    timer: 1500,
    showConfirmButton: false,
  });

  producto.tallaSeleccionada = "";
}

// === FILTROS ===
const productosFiltrados = computed(() => {
  return productos.value.filter((p) => {
    const coincideMarca = !filtroMarca.value || p.marca === filtroMarca.value;
    const coincideTipo = !filtroTipo.value || p.tipo === filtroTipo.value;
    const coincideContinente =
      filtroTipo.value !== "Camiseta" ||
      !filtroContinente.value ||
      p.continente === filtroContinente.value;
    return coincideMarca && coincideTipo && coincideContinente;
  });
});

const limpiarFiltros = () => {
  filtroMarca.value = "";
  filtroTipo.value = "";
  filtroContinente.value = "";
  router.replace({ query: {} }).catch(() => {});
};
</script>

<style scoped>
/* ===== Estilos generales ===== */
.tienda {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  background: transparent;
}

/* ===== Layout ===== */
.tienda__contenedor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== Filtros ===== */
.filtros {
  background: #111;
  color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.filtros h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.filtro {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.filtro label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.filtro select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background: #222;
  color: #fff;
}

/* ===== Botones ===== */
.btn {
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  display: inline-block;
}

.btn--primary {
  background: linear-gradient(135deg, #000000, #0077ff);
  color: #fff;
  border: none;
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

.btn--secondary {
  background: #333;
  color: #fff;
  width: 100%;
}

.btn--secondary:hover {
  background: #444;
}

/* ===== Productos ===== */
.productos {
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

.grid-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

/* Tarjeta moderna */
.producto-card {
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  text-align: center;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.producto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.producto-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 0.5rem;
  cursor: zoom-in;
  transition: all 0.4s ease;
  border: 2px solid transparent;
}

.producto-img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 119, 255, 0.6);
  border-color: #0077ff;
  z-index: 10;
}

.producto-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: #fff;
}

.producto-nombre {
  font-size: 1rem;
  font-weight: 700;
}

.producto-marca {
  font-size: 0.85rem;
  color: #ccc;
}

.producto-precio {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00ff88;
}

/* Selector de tallas */
.talla-selector {
  margin: 0.5rem 0;
}

.talla-selector label {
  font-size: 0.85rem;
  color: #ccc;
  margin-bottom: 0.25rem;
  display: block;
}

.talla-selector select {
  width: 100%;
  padding: 0.45rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background: #222;
  color: #fff;
  font-size: 0.9rem;
}

.talla-selector select option:disabled {
  color: #666;
  font-style: italic;
}

.stock-status {
  font-size: 0.75rem;
  color: #aaa;
}

/* ====== MODAL AMPLIADO ====== */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
  backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: #111;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 119, 255, 0.5);
  animation: modalPop 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #000;
  color: #fff;
  border: 2px solid #0077ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: 0.3s ease;
}

.modal-close:hover {
  background: #0077ff;
  transform: scale(1.1);
}

.modal-img {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: contain;
  display: block;
}

.modal-info {
  padding: 1.5rem;
  text-align: center;
  color: #fff;
}

.modal-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #00bfff;
}

.modal-info p {
  color: #ccc;
  margin: 0.25rem 0;
}

/* Animaciones */
@keyframes modalPop {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ===== Desktop ===== */
@media (min-width: 1024px) {
  .tienda__contenedor {
    display: grid;
    grid-template-columns: 25% 75%;
    gap: 2rem;
  }

  .filtros {
    position: sticky;
    top: 1rem;
    align-self: start;
  }
}

/* ====== MOBILE ====== */
@media (max-width: 768px) {
  .producto-img {
    cursor: pointer;
  }
  .producto-img:hover {
    transform: none;
  }
}
</style>