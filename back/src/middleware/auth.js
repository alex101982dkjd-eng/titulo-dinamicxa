const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token invalido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.usuario = decoded;
    next();
  } catch {
    // Devolver 401 (no 403) para que el frontend pueda limpiar la sesion
    return res.status(401).json({ mensaje: 'Token expirado o invalido' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };
