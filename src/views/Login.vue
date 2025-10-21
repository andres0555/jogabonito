<template>
  <main class="login">
    <section class="login__header">
      <h1>Iniciar Sesión</h1>
      <p>Accede a tu cuenta para continuar explorando <strong>Joga Bonito ⚽</strong></p>
    </section>

    <section class="login__contenido">
      <form class="login__form" @submit.prevent="iniciarSesion">
        <div class="form__grupo">
          <label for="correo">Correo electrónico</label>
          <div class="input-icono">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5Z"
              />
            </svg>
            <input
              type="email"
              id="correo"
              v-model="form.correo"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div class="form__grupo">
          <label for="password">Contraseña</label>
          <div class="input-icono">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12,17A2,2 0 0,0 14,15V11A2,2 0 0,0 12,9A2,2 0 0,0 10,11V15A2,2 0 0,0 12,17M17,8V7A5,5 0 0,0 7,7V8H5V20H19V8H17M9,8V7A3,3 0 0,1 15,7V8H9Z"
              />
            </svg>
            <input
              type="password"
              id="password"
              v-model="form.contraseña"
              placeholder="Tu contraseña"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-login">Iniciar sesión</button>

        <div class="divider">
          <span>¿No tienes cuenta?</span>
        </div>

        <router-link to="/registro" class="btn-secundario">Crear cuenta</router-link>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const form = ref({
  correo: "",
  contraseña: "",
});

async function iniciarSesion() {
  try {
    await authStore.login(form.value.correo, form.value.contraseña);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}
</script>

<style scoped>
.login {
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
.login__header {
  text-align: center;
  margin-bottom: 2rem;
}
.login__header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}
.login__header p {
  color: #ccc;
  font-size: 1rem;
}
.login__contenido {
  width: 100%;
  max-width: 430px;
}
.login__form {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 0 20px rgba(0, 119, 255, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
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
.btn-login {
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
.btn-login:hover {
  background: #0099ff;
  transform: translateY(-2px);
}
.divider {
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.btn-secundario {
  width: 100%;
  padding: 0.9rem;
  background: transparent;
  border: 1px solid #0077ff;
  color: #0077ff;
  font-size: 1.05rem;
  font-weight: bold;
  border-radius: 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}
.btn-secundario:hover {
  background: #0077ff;
  color: #fff;
  transform: translateY(-2px);
}
</style>
