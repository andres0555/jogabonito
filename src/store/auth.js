import { defineStore } from 'pinia';
import API from '@/services/axios';
import router from '@/router';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),

  actions: {
    // 🟢 Iniciar sesión
    async login(correo, contraseña) {
      try {
        const response = await API.post('/auth/login', { correo, contraseña });
        console.log('Respuesta del backend:', response.data); // Log para depuración
        const { token, user } = response.data;

        // Guardar en el estado
        this.isAuthenticated = true;
        this.user = user;
        this.token = token;

        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Redirección a la página de inicio
        router.push('/');
        Swal.fire({
          icon: 'success',
          title: `Bienvenido ${user.nombre}`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error en login:', error.response?.data); // Log del error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Usuario o contraseña incorrectos'
        });
        throw error;
      }
    },

    // 🔵 Registrar usuario (cliente)
    async registrar(usuario) {
      try {
        const response = await API.post('/auth/registro', usuario);
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/login');
        return response.data;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al registrar usuario'
        });
        throw error;
      }
    },

    // 🟣 Obtener usuario autenticado
    async obtenerPerfil() {
      try {
        const response = await API.get('/auth/perfil');
        this.user = response.data.user;
        return this.user;
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        this.logout();
      }
    },

    // 🔴 Cerrar sesión
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        timer: 1500,
        showConfirmButton: false
      });

      router.push('/');
    }
  },

  getters: {
    isAdmin: (state) => state.user?.rol?.toLowerCase() === 'administrador',
    isCliente: (state) => state.user?.rol?.toLowerCase() === 'cliente'
  }
});