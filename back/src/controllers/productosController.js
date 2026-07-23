const db   = require('../config/db');
const path = require('path');

/* ── LISTAR TODOS (público) ── */
exports.listar = async (req, res) => {
  try {
    const { categoria_id, buscar } = req.query;
    let sql = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1`;
    const params = [];

    if (categoria_id) { sql += ' AND p.categoria_id = ?'; params.push(categoria_id); }
    if (buscar)       { sql += ' AND p.nombre LIKE ?';    params.push(`%${buscar}%`); }
    sql += ' ORDER BY p.id ASC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── DETALLE ── */
exports.detalle = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── DISPONIBILIDAD EN FECHA ── */
exports.disponibilidad = async (req, res) => {
  const { fecha, producto_id } = req.query;
  if (!fecha || !producto_id)
    return res.status(400).json({ mensaje: 'fecha y producto_id requeridos' });

  try {
    const [producto] = await db.query('SELECT stock_total FROM productos WHERE id = ?', [producto_id]);
    if (!producto.length) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const [reservado] = await db.query(`
      SELECT COALESCE(SUM(rp.cantidad),0) AS total
      FROM reservacion_productos rp
      JOIN reservaciones r ON r.id = rp.reservacion_id
      WHERE rp.producto_id = ? AND r.fecha_evento = ? AND r.estado IN ('pendiente','aceptada')`,
      [producto_id, fecha]
    );

    const disponible = producto[0].stock_total - reservado[0].total;
    res.json({ disponible: Math.max(0, disponible), stock_total: producto[0].stock_total });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: CREAR ── */
exports.crear = async (req, res) => {
  const { categoria_id, nombre, descripcion, precio_renta, stock_total } = req.body;
  const imagen_url = req.file ? `/uploads/${req.file.filename}` : req.body.imagen_url || null;

  if (!categoria_id || !nombre || !precio_renta)
    return res.status(400).json({ mensaje: 'Categoría, nombre y precio son requeridos' });

  try {
    const [result] = await db.query(
      'INSERT INTO productos (categoria_id, nombre, descripcion, precio_renta, stock_total, imagen_url) VALUES (?,?,?,?,?,?)',
      [categoria_id, nombre, descripcion || null, precio_renta, stock_total || 0, imagen_url]
    );
    res.status(201).json({ mensaje: 'Producto creado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: ACTUALIZAR ── */
exports.actualizar = async (req, res) => {
  const { nombre, descripcion, precio_renta, stock_total, activo, categoria_id } = req.body;
  const imagen_url = req.file ? `/uploads/${req.file.filename}` : req.body.imagen_url;

  try {
    await db.query(
      `UPDATE productos SET
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        precio_renta = COALESCE(?, precio_renta),
        stock_total = COALESCE(?, stock_total),
        activo = COALESCE(?, activo),
        categoria_id = COALESCE(?, categoria_id),
        imagen_url = COALESCE(?, imagen_url)
       WHERE id = ?`,
      [nombre, descripcion, precio_renta, stock_total, activo, categoria_id, imagen_url, req.params.id]
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: ELIMINAR (soft) ── */
exports.eliminar = async (req, res) => {
  try {
    await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto desactivado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: LISTAR TODOS incluyendo inactivos ── */
exports.listarAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p JOIN categorias c ON c.id = p.categoria_id
       ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};
