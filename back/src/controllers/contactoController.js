const db       = require('../config/db');
const nodemailer = require('nodemailer');

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Plantilla HTML del correo
const plantillaCorreo = ({ nombre, email, telefono, mensaje }) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 580px; margin: 32px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #1A1A1A; padding: 28px 32px; text-align: center; }
    .header h1 { color: #C9A84C; margin: 0; font-size: 1.4rem; letter-spacing: 0.04em; }
    .header p { color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 0.85rem; }
    .body { padding: 32px; }
    .body h2 { font-size: 1rem; color: #1A1A1A; margin: 0 0 20px; }
    .campo { margin-bottom: 18px; }
    .campo label { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9B9B9B; margin-bottom: 4px; }
    .campo span { display: block; font-size: 0.95rem; color: #1A1A1A; }
    .mensaje-box { background: #F8F7F5; border-left: 3px solid #C9A84C; padding: 14px 16px; border-radius: 4px; font-size: 0.95rem; color: #4A4A4A; line-height: 1.7; white-space: pre-line; }
    .footer { background: #F8F7F5; padding: 18px 32px; text-align: center; font-size: 0.78rem; color: #9B9B9B; border-top: 1px solid #E8E6E1; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 24px; background: #C9A84C; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 0.85rem; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>EleganceEvents</h1>
      <p>Nuevo mensaje de contacto</p>
    </div>
    <div class="body">
      <h2>Tienes un nuevo mensaje desde el sitio web</h2>

      <div class="campo">
        <label>Nombre</label>
        <span>${nombre}</span>
      </div>

      <div class="campo">
        <label>Correo electronico</label>
        <span>${email}</span>
      </div>

      <div class="campo">
        <label>Telefono</label>
        <span>${telefono || 'No proporcionado'}</span>
      </div>

      <div class="campo">
        <label>Mensaje</label>
        <div class="mensaje-box">${mensaje}</div>
      </div>

      <a href="mailto:${email}" class="btn">Responder a ${nombre}</a>
    </div>
    <div class="footer">
      Este correo fue generado automaticamente desde el formulario de contacto de EleganceEvents.<br/>
      No respondas directamente a este correo.
    </div>
  </div>
</body>
</html>
`;

/* ── ENVIAR MENSAJE ── */
exports.enviar = async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  if (!nombre || !email || !mensaje)
    return res.status(400).json({ mensaje: 'Nombre, email y mensaje son requeridos' });

  try {
    // 1. Guardar en la base de datos
    await db.query(
      'INSERT INTO mensajes_contacto (nombre, email, telefono, mensaje) VALUES (?,?,?,?)',
      [nombre, email, telefono || null, mensaje]
    );

    // 2. Enviar correo al dueno del negocio
    await transporter.sendMail({
      from:    `"EleganceEvents Web" <${process.env.MAIL_USER}>`,
      to:      process.env.MAIL_TO || process.env.MAIL_USER,
      subject: `[Formulario Web] Nuevo mensaje de ${nombre}`,
      html:    plantillaCorreo({ nombre, email, telefono, mensaje }),
    });

    // 3. Enviar correo de confirmacion al cliente
    await transporter.sendMail({
      from:    `"EleganceEvents" <${process.env.MAIL_USER}>`,
      to:      email,
      subject: 'Recibimos tu mensaje - EleganceEvents',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .wrapper { max-width: 580px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
          .header { background: #1A1A1A; padding: 28px 32px; text-align: center; }
          .header h1 { color: #C9A84C; margin: 0; font-size: 1.4rem; }
          .body { padding: 32px; color: #4A4A4A; line-height: 1.7; }
          .body h2 { color: #1A1A1A; font-size: 1.1rem; margin: 0 0 16px; }
          .footer { background: #F8F7F5; padding: 18px 32px; text-align: center; font-size: 0.78rem; color: #9B9B9B; border-top: 1px solid #E8E6E1; }
        </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header"><h1>EleganceEvents</h1></div>
            <div class="body">
              <h2>Hola ${nombre}, recibimos tu mensaje.</h2>
              <p>Gracias por contactarnos. Hemos recibido tu solicitud correctamente y nos pondremos en contacto contigo en un plazo maximo de <strong>24 horas</strong> en horario de atencion (Lun-Sab 9AM-7PM).</p>
              <p>Si necesitas una respuesta urgente, puedes escribirnos directamente por WhatsApp.</p>
            </div>
            <div class="footer">EleganceEvents &mdash; Jilotepec, Estado de México</div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(201).json({ mensaje: 'Mensaje enviado exitosamente' });

  } catch (err) {
    console.error('Error en contacto:', err.message);
    // Si falla el correo pero se guardo en BD, no es error critico
    if (err.code === 'EAUTH' || err.responseCode === 535) {
      return res.status(500).json({ mensaje: 'Error de autenticacion de correo. Revisa MAIL_USER y MAIL_PASS en .env' });
    }
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: LISTAR ── */
exports.listarAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mensajes_contacto ORDER BY creado_en DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: MARCAR LEIDO ── */
exports.marcarLeido = async (req, res) => {
  try {
    await db.query('UPDATE mensajes_contacto SET leido = 1 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Marcado como leido' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};
