const db = require('../config/db');

/* ── VER CARRITO ── */
exports.verCarrito = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.cantidad, p.id AS producto_id, p.nombre, p.precio_renta, p.imagen_url,
        (c.cantidad * p.precio_renta) AS subtotal
       FROM carrito c JOIN productos p ON p.id = c.producto_id
       WHERE c.usuario_id = ?`,
      [req.usuario.id]
    );
    const total = rows.reduce((acc, r) => acc + Number(r.subtotal), 0);
    res.json({ items: rows, total });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── AGREGAR / ACTUALIZAR ── */
exports.agregar = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  if (!producto_id || !cantidad || cantidad < 1)
    return res.status(400).json({ mensaje: 'producto_id y cantidad (>=1) requeridos' });

  try {
    await db.query(
      `INSERT INTO carrito (usuario_id, producto_id, cantidad)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE cantidad = ?`,
      [req.usuario.id, producto_id, cantidad, cantidad]
    );
    res.json({ mensaje: 'Carrito actualizado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ELIMINAR ITEM ── */
exports.eliminar = async (req, res) => {
  try {
    await db.query('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?', [req.usuario.id, req.params.producto_id]);
    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── VACIAR CARRITO ── */
exports.vaciar = async (req, res) => {
  try {
    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [req.usuario.id]);
    res.json({ mensaje: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};
