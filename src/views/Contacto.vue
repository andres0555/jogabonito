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
      <form class="contacto-card" @submit.prevent="enviarFormulario">
        <div class="contacto-card__header">
          <h2>Envíanos un mensaje</h2>
        </div>

        <div class="contacto-card__body">
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

          <button type="submit" class="btn btn--primary" :disabled="enviando">
            {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
          </button>
        </div>
      </form>

      <!-- Información lateral -->
      <aside class="contacto-card contacto-card--info">
        <div class="contacto-card__header">
          <h2>Información de contacto</h2>
        </div>

        <div class="contacto-card__body">
          <p><strong>Dirección:</strong> Calle 10 #25-60, Ibagué, Colombia</p>
          <p><strong>Email:</strong> jogabonito@gmail.com</p>
          <p><strong>Teléfono:</strong> +57 315 574 6380</p>

          <div class="redes">
            <a href="https://www.instagram.com/andrxx_5/" target="_blank" rel="noopener" class="social">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="currentColor"
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7m5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m6.5-.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
              </svg>
            </a>

            <a href="https://www.facebook.com/andres.carvajal.425989" target="_blank" rel="noopener" class="social">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="currentColor"
                  d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9z" />
              </svg>
            </a>

            <a href="https://www.tiktok.com/@andrescr052/" target="_blank" rel="noopener" class="social">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="currentColor"
                  d="M12.5 2h3c.2 1.6 1.1 3 2.5 3.9A6.5 6.5 0 0 0 21 6v3a9 9 0 0 1-3.8-1.1V14a6 6 0 1 1-6-6v3.2a3 3 0 1 0 3 3z" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { enviarContacto } from "@/Services/contacto";
import Swal from "sweetalert2";

const form = ref({
  nombre: "",
  correo: "",
  asunto: "",
  mensaje: "",
});

const enviando = ref(false);

async function enviarFormulario() {
  if (!form.value.nombre || !form.value.correo || !form.value.mensaje) {
    Swal.fire({
      icon: "warning",
      title: "Faltan campos",
      text: "Completa nombre, correo y mensaje.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  enviando.value = true;

  try {
    await enviarContacto({
      nombre: form.value.nombre,
      correo: form.value.correo,
      asunto: form.value.asunto,
      mensaje: form.value.mensaje,
    });

    Swal.fire({
      icon: "success",
      title: "¡Enviado!",
      text: "Gracias por contactarnos. Te responderemos pronto.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar formulario
    form.value = { nombre: "", correo: "", asunto: "", mensaje: "" };
  } catch (error) {
    console.error("Error al enviar:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.error || "No se pudo enviar el mensaje. Intenta más tarde.",
      timer: 3000,
      showConfirmButton: false,
    });
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
/* ===== ESTILOS GENERALES ===== */
.contacto {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background: transparent;
}

/* ===== ENCABEZADO ===== */
.contacto__header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.contacto__header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.contacto__header p {
  color: #ccc;
  font-size: 1rem;
}

/* ===== CONTENIDO ===== */
.contacto__contenido {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* ===== TARJETA DE CONTACTO ===== */
.contacto-card {
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

.contacto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.contacto-card__header {
  margin-bottom: 1rem;
}

.contacto-card__header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.contacto-card__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #fff;
  flex: 1;
}

/* ===== FORMULARIO ===== */
.form__grupo {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form__grupo label {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.form__grupo input,
.form__grupo textarea {
  width: 100%;
  padding: 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background: #222;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form__grupo input:focus,
.form__grupo textarea:focus {
  outline: none;
  border-color: #0077ff;
  box-shadow: 0 0 8px rgba(0, 119, 255, 0.4);
}

.form__grupo textarea {
  resize: vertical;
  min-height: 100px;
}

/* Botón */
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

/* ===== INFO LATERAL ===== */
.contacto-card--info p {
  font-size: 0.95rem;
  margin: 0.5rem 0;
  color: #ddd;
}

.contacto-card--info strong {
  color: #00ff88;
}

/* ===== REDES SOCIALES ===== */
.redes {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.social {
  color: #0077ff;
  transition: all 0.3s ease;
}

.social:hover {
  color: #00ff88;
  transform: scale(1.3) rotate(5deg);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .contacto {
    padding: 1rem;
  }

  .contacto__header h1 {
    font-size: 2rem;
  }

  .contacto__contenido {
    grid-template-columns: 1fr;
  }

  .contacto-card {
    padding: 1.2rem 1rem;
  }

  .form__grupo input,
  .form__grupo textarea {
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .btn--primary {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .contacto__header h1 {
    font-size: 1.8rem;
  }

  .contacto-card__header h2 {
    font-size: 1.1rem;
  }

  .redes {
    gap: 1rem;
  }
}
</style>