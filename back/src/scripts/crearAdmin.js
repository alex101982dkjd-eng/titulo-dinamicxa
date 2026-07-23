/**
 * Crea el usuario administrador inicial.
 * Uso: node src/scripts/crearAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const db     = require('../config/db');

async function main() {
  const nombre   = 'Administrador';
  const email    = 'admin@alquiladora.com';
  const password = 'admin123';

  const hash = await bcrypt.hash(password, 10);

  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length) {
      // Actualizar contraseña
      await db.query('UPDATE usuarios SET password = ?, rol = "admin" WHERE email = ?', [hash, email]);
      console.log(`✅ Admin actualizado: ${email} / ${password}`);
    } else {
      await db.query(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)',
        [nombre, email, hash, 'admin']
      );
      console.log(`✅ Admin creado: ${email} / ${password}`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

main();
