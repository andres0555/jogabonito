// store/persistCarrito.js
import { useCarritoStore } from './Carrito';

export function initCarritoPersistence() {
  const carrito = useCarritoStore();

  // Al cargar la página, restaurar carrito desde localStorage
  const saved = localStorage.getItem('carrito');
  if (saved) {
    try {
      carrito.productos = JSON.parse(saved);
    } catch (e) {
      console.error('Error al leer carrito del localStorage:', e);
    }
  }

  // Suscribirse a los cambios del carrito
  carrito.$subscribe((_mutation, state) => {
    localStorage.setItem('carrito', JSON.stringify(state.productos));
  });
}
