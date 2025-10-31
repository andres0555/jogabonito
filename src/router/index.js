import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";
import LayoutDefault from "@/layouts/layoutdefault.vue";
import Home from "@/views/Home.vue";
import Contacto from "@/views/Contacto.vue";
import Tienda from "@/views/Tienda.vue";
import Carrito from "@/views/Carrito.vue";
import Login from "@/views/Login.vue";
import Registro from "@/views/Registro.vue";
import PerfilAdministrador from "@/views/PerfilAdministrador.vue";

import Pago from "@/views/Pago.vue";
import Factura from "@/views/Factura.vue";

const routes = [
  {
    path: "/",
    component: LayoutDefault,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "contacto", name: "Contacto", component: Contacto },
      { path: "tienda", name: "Tienda", component: Tienda },
      {
        path: "carrito",
        name: "Carrito",
        component: Carrito,
        meta: { requiresAuth: true },
      },
      {
        path: "pago",
        name: "Pago",
        component: Pago,
        meta: { requiresAuth: true },
      }, // 🧾 Nueva ruta protegida
      {
        path: "factura",
        name: "Factura",
        component: Factura,
        meta: { requiresAuth: true },
      }, // 🧾 Nueva ruta protegida
      {
        path: "perfil-admin",
        name: "PerfilAdministrador",
        component: PerfilAdministrador,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      { path: "login", name: "Login", component: Login },
      { path: "registro", name: "Registro", component: Registro },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 Protección de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin; // ✅ usa el getter

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next("/"); 
  } else {
    next();
  }
});

export default router;
