// routes/usuarios.routes.js
const express = require("express");
const router = express.Router();

const {
  login,
  registrar,
  obtenerUsuario,
} = require("../Controllers/auth.controller");

const { verificarToken, verificarRoles} = require("../middlewares/auth.middleware");
router.post("/registro", registrar);
router.post("/login", login);
router.get("/perfil", verificarToken, obtenerUsuario);




module.exports = router;
