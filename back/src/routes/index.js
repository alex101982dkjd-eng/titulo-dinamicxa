const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const router   = express.Router();

const { verificarToken, soloAdmin } = require('../middleware/auth');
const authCtrl        = require('../controllers/authController');
const productosCtrl   = require('../controllers/productosController');
const reservCtrl      = require('../controllers/reservacionesController');
const carritoCtrl     = require('../controllers/carritoController');
const contactoCtrl    = require('../controllers/contactoController');
const db              = require('../config/db');

// ── Multer para imágenes ─────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── AUTH ─────────────────────────────────────────────────────
router.post('/auth/registro', authCtrl.registro);
router.post('/auth/login',    authCtrl.login);
router.get ('/auth/perfil',   verificarToken, authCtrl.perfil);

// ── CATEGORÍAS ───────────────────────────────────────────────
router.get('/categorias', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre');
  res.json(rows);
});

// ── PRODUCTOS (público) ───────────────────────────────────────
router.get('/productos',                   productosCtrl.listar);
router.get('/productos/:id',               productosCtrl.detalle);
router.get('/productos/check/disponibilidad', productosCtrl.disponibilidad);

// ── PRODUCTOS (admin) ─────────────────────────────────────────
router.get   ('/admin/productos',        verificarToken, soloAdmin, productosCtrl.listarAdmin);
router.post  ('/admin/productos',        verificarToken, soloAdmin, upload.single('imagen'), productosCtrl.crear);
router.put   ('/admin/productos/:id',    verificarToken, soloAdmin, upload.single('imagen'), productosCtrl.actualizar);
router.delete('/admin/productos/:id',    verificarToken, soloAdmin, productosCtrl.eliminar);

// ── RESERVACIONES (cliente) ───────────────────────────────────
router.post('/reservaciones',       verificarToken, reservCtrl.crear);
router.get ('/reservaciones/mias',  verificarToken, reservCtrl.misReservaciones);
router.get ('/reservaciones/:id',   verificarToken, reservCtrl.detalle);
router.get ('/reservaciones-fechas',               reservCtrl.fechasOcupadas);

// ── RESERVACIONES (admin) ─────────────────────────────────────
router.get ('/admin/reservaciones',          verificarToken, soloAdmin, reservCtrl.listarAdmin);
router.put ('/admin/reservaciones/:id/estado', verificarToken, soloAdmin, reservCtrl.cambiarEstado);

// ── CARRITO ───────────────────────────────────────────────────
router.get   ('/carrito',                  verificarToken, carritoCtrl.verCarrito);
router.post  ('/carrito',                  verificarToken, carritoCtrl.agregar);
router.delete('/carrito/:producto_id',     verificarToken, carritoCtrl.eliminar);
router.delete('/carrito',                  verificarToken, carritoCtrl.vaciar);

// ── CONTACTO ─────────────────────────────────────────────────
router.post('/contacto',              contactoCtrl.enviar);
router.get ('/admin/mensajes',        verificarToken, soloAdmin, contactoCtrl.listarAdmin);
router.put ('/admin/mensajes/:id',    verificarToken, soloAdmin, contactoCtrl.marcarLeido);

// ── ADMIN: CLIENTES ───────────────────────────────────────────
router.get('/admin/clientes', verificarToken, soloAdmin, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, nombre, email, telefono, direccion, creado_en FROM usuarios WHERE rol = "cliente" ORDER BY creado_en DESC'
  );
  res.json(rows);
});

// ── ADMIN: STATS ──────────────────────────────────────────────
router.get('/admin/stats', verificarToken, soloAdmin, async (req, res) => {
  const [[productos]]     = await db.query('SELECT COUNT(*) AS total FROM productos WHERE activo=1');
  const [[clientes]]      = await db.query('SELECT COUNT(*) AS total FROM usuarios WHERE rol="cliente"');
  const [[reservaciones]] = await db.query('SELECT COUNT(*) AS total FROM reservaciones');
  const [[pendientes]]    = await db.query('SELECT COUNT(*) AS total FROM reservaciones WHERE estado="pendiente"');
  const [[ingresos]]      = await db.query('SELECT COALESCE(SUM(total_estimado),0) AS total FROM reservaciones WHERE estado="aceptada"');
  res.json({ productos: productos.total, clientes: clientes.total, reservaciones: reservaciones.total, pendientes: pendientes.total, ingresos: ingresos.total });
});

module.exports = router;
