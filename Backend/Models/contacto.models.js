// models/contacto.js
const nodemailer = require('nodemailer');
const path = require('path');

// Validación de correo
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const enviarCorreo = async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
  }

  // Transportador Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO,           // jogabonito@gmail.com
      pass: process.env.CORREO_PASSWORD, // Contraseña de app de Google
    },
  });

  // Ruta del logo (dentro del backend)
  const logoPath = path.join(__dirname, '../public/Logo.png');

  // Opciones del correo
  const mailOptions = {
    from: `"Joga Bonito" <${process.env.CORREO}>`,
    to: process.env.CORREO, // Recibe Joga Bonito
    subject: `Nuevo mensaje: ${asunto || 'Sin asunto'} - ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;
                  background-color: #f9f9f9;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
          <img src="cid:logoJogaBonito" alt="Logo Joga Bonito" style="max-width: 160px; margin-bottom: 10px;" />
          <h2 style="color: #0077ff; font-size: 22px; margin: 0;">Nuevo mensaje recibido</h2>
        </header>

        <main style="padding: 20px 0;">
          <p><strong>De:</strong> ${nombre}</p>
          <p><strong>Correo:</strong> <a href="mailto:${correo}" style="color: #0077ff;">${correo}</a></p>
          <p><strong>Asunto:</strong> ${asunto || 'No especificado'}</p>
          <p><strong>Mensaje:</strong><br><br>${mensaje.replace(/\n/g, '<br>')}</p>
        </main>

        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
          <p>Enviado desde <a href="https://jogabonito.com" style="color: #0077ff; text-decoration: none;">Joga Bonito</a></p>
          <p>Contáctanos: 
            <a href="mailto:${process.env.CORREO}" style="color: #0077ff; text-decoration: none;">
              ${process.env.CORREO}
            </a>
          </p>
        </footer>
      </div>
    `,
    attachments: [
      {
        filename: 'LogoConSin.png',
        path: logoPath,
        cid: 'logoJogaBonito',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensaje enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({
      error: 'Error al enviar el mensaje',
      details: error.message || 'Error desconocido',
    });
  }
};

module.exports = { enviarCorreo };