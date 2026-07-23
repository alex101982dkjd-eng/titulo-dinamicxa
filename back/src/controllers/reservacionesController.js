const db = require('../config/db');

/* ── CREAR RESERVACIÓN ── */
exports.crear = async (req, res) => {
  const { fecha_evento, hora_entrega, hora_devolucion, lugar_entrega, notas, productos } = req.body;
  // productos = [{ producto_id, cantidad }]

  if (!fecha_evento || !hora_entrega || !lugar_entrega || !productos?.length)
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Calcular total
    let total = 0;
    const detalles = [];
    for (const item of productos) {
      const [rows] = await conn.query('SELECT precio_renta, stock_total FROM productos WHERE id = ? AND activo = 1', [item.producto_id]);
      if (!rows.length) throw new Error(`Producto ${item.producto_id} no encontrado`);
      detalles.push({ ...item, precio: rows[0].precio_renta });
      total += rows[0].precio_renta * item.cantidad;
    }

    // Insertar reservación
    const [res1] = await conn.query(
      `INSERT INTO reservaciones (usuario_id, fecha_evento, hora_entrega, hora_devolucion, lugar_entrega, notas, total_estimado)
       VALUES (?,?,?,?,?,?,?)`,
      [req.usuario.id, fecha_evento, hora_entrega, hora_devolucion || null, lugar_entrega, notas || null, total]
    );
    const reservacion_id = res1.insertId;

    // Insertar detalles
    for (const d of detalles) {
      await conn.query(
        'INSERT INTO reservacion_productos (reservacion_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)',
        [reservacion_id, d.producto_id, d.cantidad, d.precio]
      );
    }

    await conn.commit();
    res.status(201).json({ mensaje: 'Reservación creada exitosamente', id: reservacion_id, total_estimado: total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ mensaje: 'Error al crear reservación', error: err.message });
  } finally {
    conn.release();
  }
};

/* ── MIS RESERVACIONES (cliente) ── */
exports.misReservaciones = async (req, res) => {
  try {
    const [reservaciones] = await db.query(
      `SELECT r.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT('producto', p.nombre, 'cantidad', rp.cantidad, 'precio', rp.precio_unitario, 'subtotal', rp.subtotal)
        ) AS productos
       FROM reservaciones r
       JOIN reservacion_productos rp ON rp.reservacion_id = r.id
       JOIN productos p ON p.id = rp.producto_id
       WHERE r.usuario_id = ?
       GROUP BY r.id
       ORDER BY r.creado_en DESC`,
      [req.usuario.id]
    );
    res.json(reservaciones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── DETALLE RESERVACIÓN ── */
exports.detalle = async (req, res) => {
  try {
    const [r] = await db.query('SELECT * FROM reservaciones WHERE id = ? AND usuario_id = ?', [req.params.id, req.usuario.id]);
    if (!r.length) return res.status(404).json({ mensaje: 'Reservación no encontrada' });

    const [productos] = await db.query(
      `SELECT rp.*, p.nombre, p.imagen_url FROM reservacion_productos rp
       JOIN productos p ON p.id = rp.producto_id WHERE rp.reservacion_id = ?`,
      [req.params.id]
    );
    res.json({ ...r[0], productos });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: LISTAR TODAS ── */
exports.listarAdmin = async (req, res) => {
  try {
    const { estado } = req.query;
    let sql = `
      SELECT r.*, u.nombre AS cliente, u.email, u.telefono,
        (SELECT COUNT(*) FROM reservacion_productos rp WHERE rp.reservacion_id = r.id) AS num_productos
      FROM reservaciones r
      JOIN usuarios u ON u.id = r.usuario_id`;
    const params = [];
    if (estado) { sql += ' WHERE r.estado = ?'; params.push(estado); }
    sql += ' ORDER BY r.creado_en DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── ADMIN: CAMBIAR ESTADO ── */
exports.cambiarEstado = async (req, res) => {
  const { estado } = req.body;
  const validos = ['pendiente', 'aceptada', 'cancelada', 'completada'];
  if (!validos.includes(estado))
    return res.status(400).json({ mensaje: 'Estado inválido' });

  try {
    await db.query('UPDATE reservaciones SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ mensaje: `Reservación ${estado}` });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};

/* ── FECHAS OCUPADAS (público) ── */
exports.fechasOcupadas = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT fecha_evento FROM reservaciones WHERE estado IN ('pendiente','aceptada') GROUP BY fecha_evento`
    );
    res.json(rows.map(r => r.fecha_evento));
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err.message });
  }
};
