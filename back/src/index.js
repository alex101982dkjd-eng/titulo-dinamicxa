require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Crear carpeta uploads si no existe ───────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Middlewares ───────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api', require('./routes/index'));

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ mensaje: 'API Alquiladora funcionando ✅', version: '1.0.0' }));

// ── Manejo de errores ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
