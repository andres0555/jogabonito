const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  crearUsuario,
  busquedaxCorreoUsuario,
  busquedaxIdUsuario,
} = require("../models/usuario.models");

require("dotenv").config();

// 🟢 LOGIN
async function login(req, res) {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await busquedaxCorreoUsuario(correo);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Comparar contra la columna contraseña_hash
    const esValido = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!esValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        id_rol: usuario.id_rol,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

// 🟡 REGISTRO
async function registrar(req, res) {
  try {
    const {
      id_usuario,
      nombre,
      apellido,
      telefono,
      correo,
      direccion,
      contraseña,
    } = req.body;

    if (
      !id_usuario ||
      !nombre ||
      !apellido ||
      !correo ||
      !direccion ||
      !contraseña
    ) {
      return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    const usuarioExistente = await busquedaxIdUsuario(id_usuario);
    if (usuarioExistente) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    const existeCorreo = await busquedaxCorreoUsuario(correo);
    if (existeCorreo) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const id_rol = 2; // Cliente
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    await crearUsuario({
      id_usuario,
      nombre,
      apellido,
      telefono,
      correo,
      direccion,
      contraseña_hash,
      id_rol,
    });

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

// 🧩 PERFIL
async function obtenerUsuario(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const usuario = await busquedaxIdUsuario(id_usuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        correo: usuario.correo,
        direccion: usuario.direccion,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
}

module.exports = { login, registrar, obtenerUsuario };
