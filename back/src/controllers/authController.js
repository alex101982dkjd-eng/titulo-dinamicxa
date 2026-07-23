const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const SECRET = process.env.JWT_SECRET || 'secret';

/* ── REGISTRO ── */
exports.registro = async (req, res) => {
  const { nombre, email, password, telefono, direccion } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ mensaje: 'Nombre, email y contraseña son requeridos' });

  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length) return res.status(409).json({ mensaje: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, password, telefono, direccion) VALUES (?,?,?,?,?)',
      [nombre, email, hash, telefono || null, direccion || null]
    );
    res.status(201).json({ mensaje: 'Cuenta creada exitosamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── LOGIN ── */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ mensaje: 'Email y contraseña requeridos' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const usuario = rows[0];
    const valido  = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── PERFIL ── */
exports.perfil = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, telefono, direccion, rol, creado_en FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (!rows.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};
