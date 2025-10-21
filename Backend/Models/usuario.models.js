const db = require("../config/db");

async function crearUsuario({
  id_usuario,
  nombre,
  apellido,
  telefono,
  correo,
  direccion,
  contraseña_hash,
  id_rol
}) {
  const [result] = await db.query(
    `INSERT INTO usuarios 
    (id_usuario, nombre, apellido, telefono, correo, direccion, contraseña_hash, id_rol)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, nombre, apellido, telefono, correo, direccion, contraseña_hash, id_rol]
  );
  return result.insertId;
}

// ✅ Buscar usuario por correo
async function busquedaxCorreoUsuario(correo) {
  const [rows] = await db.query(
    `SELECT u.*, r.rol 
     FROM usuarios u
     LEFT JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.correo = ?`,
    [correo]
  );
  return rows[0];
}

// ✅ Buscar usuario por ID
async function busquedaxIdUsuario(id_usuario) {
  const [rows] = await db.query(
    `SELECT u.*, r.rol 
     FROM usuarios u
     LEFT JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [id_usuario]
  );
  return rows[0];
}

module.exports = {
  crearUsuario,
  busquedaxCorreoUsuario,
  busquedaxIdUsuario,
};
