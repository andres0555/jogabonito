<template>
  <div class="layout">
    <header>
      <Navbar />
    </header>

    <main class="contenido">
      <RouterView />
    </main>

    <footer>
      <Footers />
    </footer>
  </div>
</template>

<script setup>
import Navbar from "../components/navbar.vue";
import Footers from "../components/footer.vue";
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  width: 100%;
}

.contenido {
  flex: 1;
  padding: 1rem;
}

footer {
  width: 100%;
}
</style>