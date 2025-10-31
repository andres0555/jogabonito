const express = require("express");
const cors = require("cors");
const cron = require("node-cron"); // Importar node-cron
require("dotenv").config();
process.env.TZ = "America/Bogota";
const moment = require("moment-timezone");

const authRoutes = require("./routes/auth.routes");
const marcasRoutes = require("./routes/marcas.routes");
const tiposRoutes = require("./routes/tipo.routes");
const productosRoutes = require("./routes/producto.routes");
const comprasRoutes = require("./routes/compras.routes")
const pefiladmin = require("./routes/perfiladmin.routes");
const contactoRoutes = require("./routes/contacto.routes");

const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json()); // Parsear cuerpos JSON antes de las rutas

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/tipos", tiposRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/perfiladmin", pefiladmin);
app.use("/api/contacto", contactoRoutes);
app.use('/images', express.static('public/images')); // Servir imágenes estáticas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});