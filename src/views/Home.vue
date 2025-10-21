<template>
  <main class="home">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div
        class="hero__slide"
        role="img"
        :aria-label="hero.alt"
        :style="{ backgroundImage: `url(${hero.src})` }"
      >
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

    <!-- ===== JUGADORES ===== -->
    <section class="jugadores">
      <header class="section-header">
        <h2>Nuestros Embajadores</h2>
        <p>Descubre las estrellas que confían en Joga Bonito</p>
      </header>

      <ul class="contenedor-jugadores" role="list">
        <li v-for="jugador in jugadores" :key="jugador.nombre" class="jugador">
          <RouterLink to="/tienda" class="jugador-link">
            <div class="jugador-card">
              <img
                :src="jugador.imagen"
                :alt="jugador.nombre"
                class="jugador-img"
                loading="lazy"
              />
              <h3 class="jugador-nombre">{{ jugador.nombre }}</h3>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- ===== MARCAS ===== -->
    <section class="marcas">
      <header class="section-header">
        <h2>Marcas que nos Acompañan</h2>
        <p>Las mejores marcas deportivas en un solo lugar</p>
      </header>

      <div class="marcas__carousel" ref="marcasRef">
        <div class="marcas__track" :style="marcasStyle">
          <img
            v-for="(marca, i) in marcas.concat(marcas)"
            :key="i"
            class="marcas__item"
            :src="marca.src"
            :alt="marca.alt"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- ===== UBICACIÓN ===== -->
    <section class="ubicacion">
      <header class="section-header">
        <h2>¿Dónde nos Encuentras?</h2>
        <p>Visítanos y vive la experiencia Joga Bonito</p>
      </header>

      <div class="tarjeta-ubicacion">
        <div class="info-ubicacion">
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
              />
            </svg>
            <p><strong>Dirección:</strong> Calle 10 #15-23, Ibagué, Tolima</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
              />
            </svg>
            <p><strong>Teléfono:</strong> +57 315 574 6380</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
            <p><strong>Correo:</strong> jogabonito@gmail.com</p>
          </div>
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-2v-2h2v2zm0-4h-2V7h2v4zm-4 4h-2v-2h2v2zm0-4h-2V7h2v4zm-4 4H7v-2h2v2zm0-4H7V7h2v4z"
              />
            </svg>
            <p>
              <strong>Horario:</strong> Lunes a Sábado, 9:00 a.m. - 7:00 p.m.
            </p>
          </div>
          <RouterLink to="/contacto" class="btn btn--primary"
            >Contáctanos</RouterLink
          >
        </div>

        <div class="mapa">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d5309.74989495048!2d-75.23979095711023!3d4.445000173331608!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1742103225494!5m2!1ses!2sco"
            width="100%"
            height="300"
            style="border-radius: 1rem"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

// Import the local Maracaná image
const heroImage = new URL("@/assets/Images/maracana.jpg", import.meta.url).href;

const title = "BIENVENIDOS A LA PÁGINA OFICIAL DE JOGA BONITO";
const description =
  "La mejor tienda de indumentaria deportiva: guayos, uniformes de clubes, camisetas de selecciones y retro.";

// Hero with local Maracaná image
const hero = {
  src: heroImage,
  alt: "Estadio Maracaná lleno de aficionados",
};

// Jugadores
const jugadores = reactive([
  {
    nombre: "Lamine Yamal",
    imagen: new URL("@/assets/jugadores/lamine-yamal.jpg", import.meta.url)
      .href,
  },
  {
    nombre: "Kylian Mbappé",
    imagen: new URL("@/assets/jugadores/mbappe.jpg", import.meta.url).href,
  },
  {
    nombre: "Neymar JR",
    imagen: new URL("@/assets/jugadores/neymar.jpg", import.meta.url).href,
  },
  {
    nombre: "James Rodríguez",
    imagen: new URL("@/assets/jugadores/james-rodriguez.jpg", import.meta.url)
      .href,
  },
]);

// Marcas with updated Adidas logo
const marcas = reactive([
  {
    src: "https://cdn-icons-png.flaticon.com/512/731/731962.png",
    alt: "Adidas",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    alt: "Nike",
  },
  {
    src: "https://logodownload.org/wp-content/uploads/2014/07/puma-logo-0.png",
    alt: "Puma",
  },
  {
    src: "https://images.seeklogo.com/logo-png/9/2/new-balance-logo-png_seeklogo-98723.png",
    alt: "New Balance",
  },
]);

const marcasOffset = ref(0);
const MARCA_SPEED = 0.4;
let animationFrame;

function animate() {
  marcasOffset.value -= MARCA_SPEED;
  const totalWidth = marcas.length * 125;
  if (Math.abs(marcasOffset.value) >= totalWidth) {
    marcasOffset.value = 0;
  }
  animationFrame = requestAnimationFrame(animate);
}

const marcasStyle = computed(() => ({
  transform: `translateX(${marcasOffset.value}px)`,
  display: "flex",
  alignItems: "center",
}));

onMounted(() => {
  animate();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  margin: 0;
}

/* ===== Base (Mobile-First: Optimizado para móviles) ===== */
.home {
  display: grid;
  gap: 0.75rem; /* Reducido para menos espaciado */
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0.25rem; /* Reducido para menos espaciado */
}

/* ===== Hero (Mobile) ===== */
.hero {
  position: relative;
  height: 100vh; /* Reducido para menos altura */
  max-height: 580px; /* Reducido para menos altura */
  border-radius: 1rem;
  overflow: hidden;
  width: 70%; /* Asegurar que no desborde */
  max-width: 100%; /* Contener el ancho */
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero__overlay {
  position: relative;
  z-index: 2;
  inset: 0;
  display: grid;
  place-items: center;
  height: 100%;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.488);
  padding: 0.25rem; /* Reducido para menos espaciado */
}

.hero__content {
  text-align: center;
  max-width: 100%;
  padding: 0.25rem; /* Reducido para menos espaciado */
  display: grid;
  gap: 0.5rem; /* Reducido para menos espaciado */
}

.hero__title {
  font-size: clamp(0.9rem, 2.5vw, 1.4rem); /* Reducido para menos tamaño */
  line-height: 1.2;
  margin: 0;
 color: #ffffff;

}

.hero__desc {
  max-width: 90%;
  margin: 0 auto;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem); /* Reducido para menos tamaño */
}

/* ===== Botón (Mobile) ===== */
.btn {
  padding: 0.4rem 0.8rem; /* Reducido para menos espaciado */
  border-radius: 0.5rem;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.75rem; /* Reducido para menos tamaño */
  transition: background 0.2s ease;
  display: inline-block;

}

.btn--primary:hover {
  background: #333333;
}

/* ===== Secciones (Mobile) ===== */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 1.5rem;
  width: 70%; /* Reducido para menos espaciado */
}

.section-header h2 {
  font-size: clamp(1.1rem, 2vw, 1.3rem); /* Reducido para menos tamaño */
  color: #ffffff;
  margin: 0;

}

.section-header p {
  color: #ffffff;
  font-size: clamp(0.7rem, 1vw, 0.8rem); /* Reducido para menos tamaño */
  margin: 0.15rem 0 0;
}

/* ===== Jugadores (Mobile) ===== */
.contenedor-jugadores {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* Reducido para menos espaciado */
  justify-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 70%;
}



.jugador {
  width: 100%;
  max-width: 240px;
  /* Reducido para menos ancho máximo */
}

.jugador-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.jugador-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Reducido para menos sombra */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 250px;
}

.jugador-card:hover {
  transform: translateY(-3px); /* Reducido para menos elevación */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Reducido para menos sombra */
}

.jugador-img {
  width: 100%;
  height: 250px; /* Reducido para menos altura */
  object-fit: cover;
  display: block;
}

.jugador-nombre {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.3rem; /* Reducido para menos espaciado */
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  text-align: center;
  font-size: clamp(0.7rem, 1vw, 0.85rem); /* Reducido para menos tamaño */
}

/* ===== Marcas (Mobile) ===== */
.marcas {
  padding: 0.5rem 0.25rem; /* Reducido para menos espaciado */
  width: 70%;
}

.marcas .section-header{
    width: 100%;
    margin-bottom: 1.2rem;
}

.marcas__carousel {
  overflow: hidden;
  height: 50px; /* Reducido para menos altura */
  width: 100%;
  background: white;
  border-radius: 0.5rem;
}



.marcas__track {
  display: flex;
  gap: 0.75rem; /* Reducido para menos espaciado */
  width: max-content;
}

.marcas__item {
  width: 50px; /* Reducido para menos ancho */
  height: auto;
  object-fit: contain;
  filter: grayscale(0.5);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.marcas__item:hover {
  filter: grayscale(0);
  transform: scale(1.05); /* Reducido para menos escala */
}

/* ===== Ubicación (Mobile) ===== */
.ubicacion {
  padding: 0.8rem 0.25rem; /* Reducido para menos espaciado */
  width: 70%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.ubicacion .section-header{
    width: 100%;
    margin-bottom: 1.2rem;
}

.tarjeta-ubicacion {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Reducido para menos sombra */
  padding: 0.75rem; /* Reducido para menos espaciado */
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reducido para menos espaciado */
  width: 100%;
}

.info-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Reducido para menos espaciado */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem; /* Reducido para menos espaciado */
}

.info-icon {
  color: #000000;
  flex-shrink: 0;
  width: 16px; /* Reducido para menos tamaño */
  height: 16px; /* Reducido para menos tamaño */
}

.info-ubicacion p {
  margin: 0;
  color: #000000;
  font-size: clamp(0.65rem, 1vw, 0.75rem); /* Reducido para menos tamaño */
}

.mapa {
  order: 2;
}

.info-ubicacion {
  order: 1;
}

.mapa iframe {
  width: 100%;
  max-width: 100%;
  border-radius: 1rem;
  display: block;
  height: 150px; /* Reducido para menos altura */
}

/* ===== Breakpoints para Tablets (480px) ===== */
@media (min-width: 480px) {
  .home {
    gap: 1rem;
    padding: 0.5rem;
  }

  .hero {
    height: 35vh;
    max-height: 320px;
  }

  .hero__overlay {
    padding: 0.5rem;
  }

  .hero__content {
    padding: 0.5rem;
    gap: 0.75rem;
  }

  .hero__title {
    font-size: clamp(1rem, 2.8vw, 1.6rem);
  }

  .hero__desc {
    font-size: clamp(0.75rem, 1.3vw, 0.85rem);
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .section-header {
    margin-bottom: 0.75rem;
  }

  .section-header h2 {
    font-size: clamp(1.2rem, 2.3vw, 1.4rem);
  }

  .section-header p {
    font-size: clamp(0.7rem, 1.1vw, 0.8rem);
  }

  .contenedor-jugadores {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .jugador {
    max-width: 260px;
  }

  .jugador-img {
    height: 140px;
  }

  .jugador-nombre {
    font-size: clamp(0.8rem, 1.1vw, 0.9rem);
  }

  .marcas {
    padding: 0.75rem 0.5rem;
  }

  .marcas__carousel {
    height: 60px;
  }

  .marcas__item {
    width: 60px;
  }

  .mapa iframe {
    height: 180px;
  }
}

/* ===== Breakpoints para Tablets Grandes (768px) ===== */
@media (min-width: 768px) {
  .home {
    gap: 1.5rem;
    padding: 0.75rem;
  }

  .hero {
    height: 40vh;
    max-height: 400px;
  }

  .hero__overlay {
    padding: 0.75rem;
  }

  .hero__content {
    padding: 0.75rem;
    gap: 1rem;
  }

  .hero__title {
    font-size: clamp(1.6rem, 4vw, 2.8rem);
  }

  .hero__desc {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .section-header {
    margin-bottom: 1rem;
  }

  .section-header h2 {
    font-size: clamp(1.6rem, 2.5vw, 1.8rem);
  }

  .section-header p {
    font-size: clamp(0.9rem, 1.3vw, 1rem);
  }

  .contenedor-jugadores {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .jugador-img {
    height: 200px;
  }

  .jugador-nombre {
    font-size: clamp(0.9rem, 1.3vw, 1rem);
  }

  .marcas {
    padding: 1rem 0.75rem;
  }

  .marcas__carousel {
    height: 80px;
  }

  .marcas__track {
    gap: 1.5rem;
  }

  .marcas__item {
    width: 90px;
  }

  .ubicacion {
    padding: 1rem 0.75rem;
  }

  .tarjeta-ubicacion {
    padding: 1.5rem;
  }

  .mapa iframe {
    height: 250px;
  }
}

/* ===== Breakpoints para Desktop (1024px): ESTILOS ORIGINALES EXACTOS ===== */
@media (min-width: 1024px) {
  /* ===== Base Desktop (Original) ===== */
  .home {
    gap: 3rem;
    max-width: 1600px;
    padding: 1rem;
  }

  /* ===== Hero Desktop (Original) ===== */
  .hero {
    height: 80vh;
    max-height: 600px;
    border-radius: 1rem;
    width: 100%;
  }

  .hero__content {
    padding: 1rem;
    gap: 1.5rem;
  }

  .hero__title {
    font-size: clamp(1.8rem, 4.5vw, 3.2rem);
  }

  .hero__desc {
    font-size: clamp(1rem, 2vw, 1.2rem);
  }

  /* ===== Botón Desktop (Original) ===== */
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: inherit;
  }

  /* ===== Secciones Desktop (Original) ===== */
  .section-header {
    margin-bottom: 2.5rem;
    width: 100%;
  }

  .section-header h2 {
    font-size: clamp(1.8rem, 3vw, 2.2rem);
  }

  .section-header p {
    font-size: clamp(1rem, 1.5vw, 1.1rem);
  }

  /* ===== Jugadores Desktop (Original) ===== */
  .contenedor-jugadores {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
  }

  .jugador-img {
    height: 280px;
  }

  .jugador-nombre {
    font-size: clamp(1rem, 1.5vw, 1.1rem);
  }

  /* ===== Marcas Desktop (Original) ===== */
  .marcas {
    padding: 2rem 1rem;
    width: 100%;
  }

  .marcas__carousel {
    height: 100px;
  }

  .marcas__track {
    gap: 3rem;
  }

  .marcas__item {
    width: 120px;
  }

  /* ===== Ubicación Desktop (Original) ===== */
  .ubicacion {
    padding: 2rem 1rem;
    width: 100%;
  }

  .tarjeta-ubicacion {
    border-radius: 1rem;
    padding: 2rem;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    display: grid;
  }

  .info-ubicacion {
    gap: 1.2rem;
  }

  .info-item {
    gap: 1rem;
  }

  .info-ubicacion p {
    font-size: clamp(0.95rem, 1.5vw, 1rem);
  }

  .mapa iframe {
    border-radius: 1rem;
    height: 320px;
  }
}
</style>
