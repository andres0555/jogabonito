<template>
  <main class="registro">
    <!-- ENCABEZADO -->
    <section class="registro__header">
      <h1>Crear Cuenta</h1>
      <p>Regístrate y sé parte de la comunidad Joga Bonito ⚽</p>
    </section>

    <!-- FORMULARIO -->
    <section class="registro__contenido">
      <form class="registro__form" @submit.prevent="registrarNuevoUsuario">

        <!-- CÉDULA -->
        <div class="form__grupo">
          <label for="cedula">Cédula</label>
          <input
            type="text"
            id="cedula"
            v-model="form.id_usuario"
            placeholder="Ej: 1023456789"
            required
          />
        </div>

        <!-- NOMBRE -->
        <div class="form__grupo">
          <label for="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            placeholder="Tu nombre"
            required
          />
        </div>

        <!-- APELLIDO -->
        <div class="form__grupo">
          <label for="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            v-model="form.apellido"
            placeholder="Tu apellido"
            required
          />
        </div>

        <!-- DIRECCIÓN -->
        <div class="form__grupo">
          <label for="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            v-model="form.direccion"
            placeholder="Calle 123, Ciudad"
            required
          />
        </div>

        <!-- CORREO -->
        <div class="form__grupo">
          <label for="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            v-model="form.correo"
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <!-- TELÉFONO -->
        <div class="form__grupo">
          <label for="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            v-model="form.telefono"
            placeholder="Ej: +57 300 123 4567"
            required
          />
        </div>

        <!-- CONTRASEÑA -->
        <div class="form__grupo">
          <label for="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            v-model="form.contraseña"
            placeholder="Crea una contraseña segura"
            required
          />
        </div>

        <!-- BOTÓN -->
        <button type="submit" class="btn-registro">Registrarme</button>

        <p class="texto-login">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="link">Inicia sesión aquí</router-link>
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { registrarUsuario } from "@/services/usuario"; // ✅ corregido a minúsculas

const router = useRouter();

const form = ref({
  id_usuario: "", // ← Cédula
  nombre: "",
  apellido: "",
  direccion: "",
  correo: "",
  telefono: "",
  contraseña: "", // ← coincide con backend (contraseña_hash en BD)
});

async function registrarNuevoUsuario() {
  try {
    // Validar campos vacíos
    for (const [key, value] of Object.entries(form.value)) {
      if (!value.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor, completa todos los campos antes de continuar.",
        });
        return;
      }
    }

    // Enviar datos al backend
    await registrarUsuario(form.value);

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu cuenta ha sido creada correctamente. ¡Bienvenido a Joga Bonito! ⚽",
      timer: 2500,
      showConfirmButton: false,
    });

    router.push("/login");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al registrar",
      text:
        error?.response?.data?.message ||
        error?.message ||
        "Ocurrió un error al registrar el usuario.",
    });
  }
}
</script>

<style scoped>
.registro {
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

.registro__header {
  text-align: center;
  margin-bottom: 2rem;
}

.registro__header h1 {
  font-size: 2.3rem;
  color: #fff;
}

.registro__header p {
  color: #ccc;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.registro__contenido {
  width: 100%;
  max-width: 500px;
}

.registro__form {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(0, 119, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

label {
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
}

input {
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 0.5rem;
  padding: 0.8rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  width: 100%;
}

input:focus {
  border-color: #0077ff;
  outline: none;
}

.btn-registro {
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

.btn-registro:hover {
  background: #0099ff;
  transform: scale(1.05);
}

.texto-login {
  text-align: center;
  margin-top: 1rem;
  color: #ddd;
}

.link {
  color: #0099ff;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #fff;
}
</style>
