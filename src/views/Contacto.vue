<template>
  <main class="contacto">
    <!-- Encabezado -->
    <section class="contacto__header">
      <h1>Contáctanos</h1>
      <p>¿Tienes alguna pregunta o sugerencia? ¡Estamos aquí para ayudarte!</p>
    </section>

    <!-- Contenido principal -->
    <section class="contacto__contenido">
      <!-- Formulario -->
      <form class="contacto__form" @submit.prevent="enviarFormulario">
        <div class="form__grupo">
          <label for="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            placeholder="Tu nombre completo"
            required
          />
        </div>

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

        <div class="form__grupo">
          <label for="asunto">Asunto</label>
          <input
            type="text"
            id="asunto"
            v-model="form.asunto"
            placeholder="Motivo de tu mensaje"
            required
          />
        </div>

        <div class="form__grupo">
          <label for="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            v-model="form.mensaje"
            placeholder="Escribe aquí tu mensaje..."
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" class="btn-enviar">Enviar mensaje</button>
      </form>

      <!-- Información lateral -->
      <aside class="contacto__info">
        <h2>Información de contacto</h2>
        <p>📍 Calle 10 #25-60, Ibague, Colombia</p>
        <p>📧 jogabonito@gmail.com</p>
        <p>📞 +57 315 574 6380</p>

        <div class="redes">
          <!-- Instagram -->
          <a href="https://www.instagram.com/andrxx_5/" target="_blank" rel="noopener" class="social">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor"
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7m5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m6.5-.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
            </svg>
          </a>

          <!-- Facebook -->
          <a href="https://www.facebook.com/andres.carvajal.425989" target="_blank" rel="noopener" class="social">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor"
                d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9z" />
            </svg>
          </a>

          <!-- TikTok -->
          <a href="https://www.tiktok.com/@andrescr052/" target="_blank" rel="noopener" class="social">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor"
                d="M12.5 2h3c.2 1.6 1.1 3 2.5 3.9A6.5 6.5 0 0 0 21 6v3a9 9 0 0 1-3.8-1.1V14a6 6 0 1 1-6-6v3.2a3 3 0 1 0 3 3z" />
            </svg>
          </a>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  nombre: "",
  correo: "",
  asunto: "",
  mensaje: "",
});

function enviarFormulario() {
  if (!form.value.nombre || !form.value.correo || !form.value.mensaje) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  alert("✅ ¡Gracias por contactarnos! Te responderemos pronto.");
  form.value = { nombre: "", correo: "", asunto: "", mensaje: "" };
}
</script>

<style scoped>
.contacto {
  min-height: 100vh;
  background: #000000c2;
  color: #fff;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2rem;
}

.contacto__header {
  text-align: center;
  margin-bottom: 2rem;
}

.contacto__header h1 {
  font-size: 2.5rem;
  color: #fff;
}

.contacto__header p {
  color: #ccc;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.contacto__contenido {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1100px;
}

/* === FORMULARIO === */
.contacto__form {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(0, 119, 255, 0.2);
}

.form__grupo {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #fff;
}

input,
textarea {
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 0.5rem;
  padding: 0.8rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #0077ff;
  outline: none;
}

.btn-enviar {
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

.btn-enviar:hover {
  background: #0099ff;
  transform: scale(1.05);
}

/* === INFO LATERAL === */
.contacto__info {
  flex: 0.6;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(0, 119, 255, 0.2);
  text-align: center;
}

.contacto__info h2 {
  color: #fff;
  margin-bottom: 1rem;
}

.contacto__info p {
  margin-bottom: 0.8rem;
  color: #ddd;
}

.redes {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.social {
  color: #0077ff;
  transition: all 0.3s ease;
}

.social:hover {
  color: #fff;
  transform: scale(1.2);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .contacto__contenido {
    flex-direction: column;
    align-items: center;
  }

  .contacto__form,
  .contacto__info {
    width: 100%;
    max-width: 500px;
  }
}
</style>
