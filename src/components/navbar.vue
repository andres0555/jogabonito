<template>
  <header>
    <nav class="barra" aria-label="Barra de navegación">
      <!-- Botón hamburguesa (solo móvil) -->
      <button class="icon-btn hamburger" @click="toggleMenu" v-if="isMobile" aria-label="Abrir menú">
        <img src="@/assets/images/menu.png" alt="Menú" class="icon" />
      </button>

      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <img src="@/assets/Images/Logo.png" alt="Logo JogaBonito" class="logo-img" />
        </router-link>
      </div>

      <!-- Enlaces escritorio -->
      <ul class="links" v-if="!isMobile">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/contacto">Contacto</router-link></li>
        <li><router-link to="/tienda">Tienda</router-link></li>
        <li>
          <router-link v-if="isAuthenticated && authStore.isAdmin" to="/perfil-admin"
            class="boton-perfil-admin" title="Perfil Administrador">
            Registro Facturas
          </router-link>
        </li>
      </ul>

      <!-- Sección derecha -->
      <div class="acciones">
        <!-- Botón iniciar sesión -->
        <router-link v-if="!isAuthenticated" to="/login" class="boton-login" title="Iniciar sesión">
          <img src="@/assets/images/Logousuario.png" alt="Iniciar sesión" class="icono-usuario" />
        </router-link>

        <!-- Botón cerrar sesión -->
        <button v-if="isAuthenticated" class="boton-cerrar" @click="cerrarSesion">
          Cerrar sesión
        </button>

        <!-- Icono carrito -->
        <div class="icono-carrito">
          <router-link to="/carrito" class="boton-carrito" id="boton-carrito">
            <img class="carrito" src="@/assets/images/Carrito de compras.png" alt="Carrito" />
            <span id="contador-carrito" class="contador-carrito">{{ carritoStore.contador }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Sidebar móvil -->
    <transition name="slide">
      <aside v-if="isMobile && menuOpen" class="sidebar">
        <div class="sidebar-header">
          <button class="icon-btn close" @click="toggleMenu" aria-label="Cerrar menú">
            <img src="@/assets/images/cerrar.png" alt="Cerrar" class="icon" />
          </button>
        </div>
        <ul class="side-links">
          <li>
            <router-link to="/" class="side-link" exact-active-class="is-active" @click="closeMenu">Home</router-link>
          </li>
          <li>
            <router-link to="/contacto" class="side-link" exact-active-class="is-active" @click="closeMenu">Contacto</router-link>
          </li>
          <li>
            <router-link to="/tienda" class="side-link" exact-active-class="is-active" @click="closeMenu">Tienda</router-link>
          </li>
          <li>
            <router-link v-if="isAuthenticated && authStore.isAdmin" to="/perfil-admin"
              class="side-link" exact-active-class="is-active"
              @click="closeMenu">
              Registro Facturas
            </router-link>
          </li>
        </ul>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useCarritoStore } from "@/store/carrito";

const router = useRouter();
const authStore = useAuthStore();
const carritoStore = useCarritoStore();

const isMobile = ref(false);
const menuOpen = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);

function checkMobile() {
  isMobile.value = window.innerWidth <= 900;
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function cerrarSesion() {
  authStore.logout();
}
</script>

<style scoped>
/* ====== Navbar principal ====== */
.barra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000;
  padding: 1rem 2rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ====== Logo ====== */
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.logo-img {
  height: 50px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.logo-img:hover {
  transform: scale(1.05);
}

/* ====== Enlaces escritorio ====== */
.links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}
.links a {
  position: relative;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s ease;
}
.links a:hover {
  color: #00bfff;
}
.links a.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 3px;
  background: #00bfff;
  border-radius: 999px;
}

/* ====== Sección derecha ====== */
.acciones {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

/* ====== Icono Usuario ====== */
.boton-login {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}
.icono-usuario {
  height: 40px;
  width: 40px;
  transition: transform 0.3s ease;
}
.icono-usuario:hover {
  transform: scale(1.1);
}

/* ====== Botón Cerrar Sesión ====== */
.boton-cerrar {
  background: #00bfff;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.boton-cerrar:hover {
  background: #0099ff;
  transform: scale(1.05);
}

/* ====== Carrito ====== */
.icono-carrito {
  position: relative;
}
.boton-carrito {
  display: flex;
  align-items: center;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.carrito {
  height: 35px;
}
.contador-carrito {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

/* ====== Botones sin fondo (hamburguesa y cerrar) ====== */
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.icon-btn img {
  display: block;
  width: 35px;
  height: auto;
}

/* ====== Sidebar móvil ====== */
@media (max-width: 900px) {
  .links {
    display: none;
  }

  .logo-img {
    height: 35px; /* logo más pequeño en móvil */
  }

  .icono-usuario {
    height: 30px;
    width: 30px;
  }

  .boton-cerrar {
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
  }

  .carrito {
    height: 25px;
  }

  .contador-carrito {
    top: -5px;
    right: -5px;
    padding: 1px 4px;
    font-size: 10px;
  }
}

.sidebar {
  position: fixed;
  inset: 0 40% 0 0;
  background: #000;
  color: #fff;
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(255, 215, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 9999;
}
.sidebar-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.side-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.side-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 1rem;
  transition: 0.3s ease;
}
.side-link:hover {
  color: #00bfff;
}
.side-link.is-active {
  color: #00bfff;
}

/* ====== Animación sidebar ====== */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
