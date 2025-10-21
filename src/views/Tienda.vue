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
            />

            <div class="producto-info">
              <h3 class="producto-nombre">{{ producto.nombre }}</h3>
              <p class="producto-marca">{{ producto.marca }}</p>
              <p class="producto-talla">Talla: {{ producto.talla }}</p>
              <p class="producto-precio">
                ${{ producto.precio.toLocaleString() }}
              </p>
              <button class="btn btn--primary" @click="agregarAlCarrito(producto)">
                Agregar al carrito
              </button>
            </div>
          </li>
        </ul>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { obtenerMarcas } from "@/Services/marcas";
import { obtenerTipos } from "@/Services/tipos";
import { obtenerProductos } from "@/Services/producto";
import { useCarritoStore } from '@/store/carrito';
import Swal from "sweetalert2";

// URL base del servidor
const BASE_URL = 'http://localhost:3000';

const filtroMarca = ref("");
const filtroTipo = ref("");
const filtroContinente = ref("");
const marcas = ref([]);
const tipos = ref([]);
const productos = ref([]);
const carritoStore = useCarritoStore();

// Manejar errores de carga de imágenes
const handleImageError = (event) => {
  console.error('Error al cargar imagen:', event.target.src);
  event.target.src = `${BASE_URL}/images/placeholder.jpg`; // Imagen por defecto
};

// Cargar datos
async function cargarDatos() {
  try {
    const [marcasData, tiposData, productosData] = await Promise.all([
      obtenerMarcas(),
      obtenerTipos(),
      obtenerProductos()
    ]);
    console.log('Productos:', productosData);

    productos.value = productosData.map(producto => ({
      ...producto,
      imagen: `${BASE_URL}${producto.imagen}`, // Prefijar con la URL del servidor
      continente: producto.tipo === 'Camiseta' ? (producto.continente || 'Sudamérica') : null
    }));
    marcas.value = marcasData;
    tipos.value = tiposData;
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

// Agregar al carrito
function agregarAlCarrito(producto) {
  carritoStore.agregarProducto({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    marca: producto.marca,
    talla: producto.talla
  });
}

// Filtrado
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
};
</script>

<style scoped>
/* ===== Estilos generales ===== */
.tienda {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
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

/* 💠 Botón degradado azul eléctrico + negro */
.btn--primary {
  background: linear-gradient(135deg, #000000, #0077ff);
  color: #fff;
  border: none;
  box-shadow: 0 0 8px rgba(0, 119, 255, 0.5);
}

.btn--primary:hover {
  background: linear-gradient(135deg, #0a0a0a, #0099ff);
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0, 119, 255, 0.7);
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

/* 🟦 Tarjeta cuadrada moderna */
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

.producto-talla,
.producto-precio {
  font-size: 0.9rem;
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
</style>