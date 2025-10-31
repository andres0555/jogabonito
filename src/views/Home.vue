<template>
  <main class="home">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero__slide" :style="{ backgroundImage: `url(${hero.src})` }" role="img" :aria-label="hero.alt">
        <div class="hero__overlay">
          <header class="hero__content">
            <h1 class="hero__title">{{ title }}</h1>
            <p class="hero__desc">{{ description }}</p>
            <RouterLink to="/tienda" class="btn btn--primary">
              Explorar Tienda
            </RouterLink>
          </header>
        </div>
      </div>
    </section>

    <!-- ===== JUGADORES CON FILTRO DE MARCA (FUNCIONA) ===== -->
    <section class="jugadores">
      <header class="section-header">
        <h2>Nuestros Embajadores</h2>
        <p>Descubre las estrellas que confían en Joga Bonito</p>
      </header>

      <ul class="grid-jugadores" role="list">
        <li v-for="jugador in jugadores" :key="jugador.nombre" class="jugador-card">
          <!-- Enlace con filtro por marca (usando to con objeto) -->
          <RouterLink :to="{ path: '/tienda', query: { marca: jugador.marca } }" class="jugador-link">
            <img :src="jugador.imagen" :alt="jugador.nombre" class="jugador-img" loading="lazy" />
            <div class="jugador-info">
              <h3 class="jugador-nombre">{{ jugador.nombre }}</h3>
              <p class="jugador-marca">{{ jugador.marca }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- ===== MARCAS (FONDO BLANCO) ===== -->
    <section class="marcas">
      <header class="section-header">
        <h2>Marcas que nos Acompañan</h2>
        <p>Las mejores marcas deportivas en un solo lugar</p>
      </header>

      <div class="marcas__carousel">
        <div class="marcas__track" :style="marcasStyle">
          <img v-for="(marca, i) in marcas.concat(marcas)" :key="i" class="marcas__item" :src="marca.src"
            :alt="marca.alt" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- ===== UBICACIÓN (MAPA CORRECTO) ===== -->
    <section class="ubicacion">
      <header class="section-header">
        <h2>¿Dónde nos Encuentras?</h2>
        <p>Visítanos y vive la experiencia Joga Bonito</p>
      </header>

      <div class="ubicacion-card">
        <div class="info-ubicacion">
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
            </svg>
            <p><strong>Dirección:</strong> Calle 10 #15-23, Ibagué, Tolima</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
            </svg>
            <p><strong>Teléfono:</strong> +57 315 574 6380</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            <p><strong>Correo:</strong> jogabonito@gmail.com</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-2v-2h2v2zm0-4h-2V7h2v4zm-4 4h-2v-2h2v2zm0-4h-2V7h2v4zm-4 4H7v-2h2v2zm0-4H7V7h2v4z" />
            </svg>
            <p><strong>Horario:</strong> Lunes a Sábado, 9:00 a.m. - 7:00 p.m.</p>
          </div>
          <RouterLink to="/contacto" class="btn btn--primary">Contáctanos</RouterLink>
        </div>

        <div class="mapa">
          <!-- MAPA CORRECTO: https://maps.app.goo.gl/EdhN6JnVw9Rbibd77 -->
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.929748363797!2d-75.241979685237!3d4.445000196677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c3d6a5b3f1a7%3A0x9f8e8f8e8f8e8f8e!2sJoga%20Bonito!5e0!3m2!1ses!2sco!4v1742103225494!5m2!1ses!2sco"
            width="100%" height="100%" style="border-radius: 1rem; border: 0;" allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router"; // Necesario para leer query en tienda.vue

const heroImage = new URL("@/assets/Images/maracana.jpg", import.meta.url).href;

const title = "BIENVENIDOS A LA PÁGINA OFICIAL DE JOGA BONITO";
const description = "La mejor tienda de indumentaria deportiva: guayos, uniformes de clubes, camisetas de selecciones y retro.";

const hero = { src: heroImage, alt: "Estadio Maracaná lleno de aficionados" };

// JUGADORES CON MARCA ASIGNADA
const jugadores = reactive([
  { nombre: "Lamine Yamal", imagen: new URL("@/assets/jugadores/lamine-yamal.jpg", import.meta.url).href, marca: "Adidas" },
  { nombre: "Kylian Mbappé", imagen: new URL("@/assets/jugadores/mbappe.jpg", import.meta.url).href, marca: "Nike" },
  { nombre: "Neymar JR", imagen: new URL("@/assets/jugadores/neymar.jpg", import.meta.url).href, marca: "Puma" },
  { nombre: "James Rodríguez", imagen: new URL("@/assets/jugadores/james-rodriguez.jpg", import.meta.url).href, marca: "New Balance" },
]);

const marcas = reactive([
  { src: "https://cdn-icons-png.flaticon.com/512/731/731962.png", alt: "Adidas" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", alt: "Nike" },
  { src: "https://logodownload.org/wp-content/uploads/2014/07/puma-logo-0.png", alt: "Puma" },
  { src: "https://images.seeklogo.com/logo-png/9/2/new-balance-logo-png_seeklogo-98723.png", alt: "New Balance" },
]);

const marcasOffset = ref(0);
const MARCA_SPEED = 0.5;
let animationFrame;

function animate() {
  marcasOffset.value -= MARCA_SPEED;
  const totalWidth = marcas.length * 140;
  if (Math.abs(marcasOffset.value) >= totalWidth) marcasOffset.value = 0;
  animationFrame = requestAnimationFrame(animate);
}

const marcasStyle = computed(() => ({ transform: `translateX(${marcasOffset.value}px)` }));

onMounted(() => animate());
onBeforeUnmount(() => cancelAnimationFrame(animationFrame));
</script>

<style scoped>
/* ===== FONDO TRANSPARENTE ===== */
.home {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: transparent;
  color: #fff;
  min-height: 100vh;
}

/* ===== HERO ===== */
.hero {
  height: 70vh;
  max-height: 500px;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.hero__overlay {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.hero__content {
  text-align: center;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero__title {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

.hero__desc {
  font-size: 0.9rem;
  color: #ddd;
  line-height: 1.4;
}

/* ===== BOTÓN ===== */
.btn--primary {
  align-self: center;
  padding: 0.7rem 1.4rem;
  background: linear-gradient(135deg, #000000, #0077ff);
  color: #fff;
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 0 10px rgba(0, 119, 255, 0.5);
  transition: all 0.3s ease;
}

.btn--primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 119, 255, 0.7);
  background: linear-gradient(135deg, #0a0a0a, #0099ff);
}

/* ===== SECCIÓN HEADER ===== */
.section-header {
  text-align: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
}

.section-header p {
  font-size: 0.85rem;
  color: #ccc;
  margin: 0.3rem 0 0;
}

/* ===== JUGADORES – FILTRO QUE FUNCIONA ===== */
.grid-jugadores {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0;
  list-style: none;
}

.jugador-card {
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  text-align: center;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.jugador-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.jugador-link {
  display: block;
  text-decoration: none;
  color: inherit;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.jugador-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin: 0 auto 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.4s ease;
}

.jugador-img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 119, 255, 0.6);
  border-color: #0077ff;
}

.jugador-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: #fff;
  margin-top: auto;
}

.jugador-nombre {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.jugador-marca {
  font-size: 0.85rem;
  color: #00ff88;
  font-weight: 600;
  margin: 0;
}

/* ===== MARCAS – FONDO BLANCO + TAMAÑO UNIFORME ===== */
.marcas {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.marcas .section-header h2,
.marcas .section-header p {
  color: #000;
}

.marcas .section-header p {
  color: #555;
}

.marcas__carousel {
  overflow: hidden;
  height: 70px;
  background: #f8f8f8;
  border-radius: 1rem;
  margin: 1rem 0 0;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
}

.marcas__track {
  display: flex;
  gap: 2rem;
  align-items: center;
  height: 100%;
}

.marcas__item {
  width: 100px !important;
  height: 50px !important;
  object-fit: contain;
  object-position: center;
  filter: grayscale(0);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.marcas__item:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
}

/* ===== UBICACIÓN ===== */
.ubicacion-card {
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
}

.info-icon {
  width: 22px;
  height: 22px;
  color: #0077ff;
  flex-shrink: 0;
}

.info-ubicacion p {
  margin: 0;
  color: #fff;
}

.info-ubicacion strong {
  color: #00ff88;
}

.mapa {
  height: 200px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ===== RESPONSIVE ===== */
@media (min-width: 768px) {
  .home {
    gap: 2.5rem;
    padding: 1.5rem;
  }

  .hero {
    height: 75vh;
    max-height: 550px;
  }

  .hero__title {
    font-size: 2.2rem;
  }

  .hero__desc {
    font-size: 1rem;
  }

  .grid-jugadores {
    grid-template-columns: repeat(2, 1fr);
  }

  .jugador-img {
    width: 160px;
    height: 160px;
  }

  .marcas__carousel {
    height: 80px;
  }

  .marcas__item {
    width: 110px !important;
    height: 60px !important;
  }

  .ubicacion-card {
    flex-direction: row;
    gap: 2rem;
  }

  .info-ubicacion {
    flex: 1;
  }

  .mapa {
    flex: 1;
    height: auto;
  }
}

@media (min-width: 1024px) {
  .home {
    gap: 3rem;
    padding: 2rem;
  }

  .hero {
    height: 80vh;
    max-height: 600px;
  }

  .hero__title {
    font-size: 2.8rem;
  }

  .hero__desc {
    font-size: 1.1rem;
  }

  .grid-jugadores {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .jugador-img {
    width: 180px;
    height: 180px;
  }

  .marcas__carousel {
    height: 100px;
  }

  .marcas__track {
    gap: 3rem;
  }

  .marcas__item {
    width: 130px !important;
    height: 80px !important;
  }

  .ubicacion-card {
    padding: 2rem;
  }

  .info-item {
    font-size: 1rem;
  }

  .mapa {
    height: 320px;
  }
}
</style>