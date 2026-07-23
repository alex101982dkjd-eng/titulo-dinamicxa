-- ============================================================
-- ALQUILADORA DE MOBILIARIO PARA EVENTOS - SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS alquiladora_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alquiladora_db;

-- -----------------------------------------------------------
-- CATEGORÍAS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  icono      VARCHAR(50),
  creado_en  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- PRODUCTOS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id   INT NOT NULL,
  nombre         VARCHAR(150) NOT NULL,
  descripcion    TEXT,
  precio_renta   DECIMAL(10,2) NOT NULL,
  stock_total    INT NOT NULL DEFAULT 0,
  imagen_url     VARCHAR(500),
  activo         TINYINT(1) DEFAULT 1,
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_cat FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

-- -----------------------------------------------------------
-- USUARIOS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  email        VARCHAR(200) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  telefono     VARCHAR(20),
  direccion    TEXT,
  rol          ENUM('cliente','admin') DEFAULT 'cliente',
  creado_en    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- RESERVACIONES
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservaciones (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT NOT NULL,
  fecha_evento      DATE NOT NULL,
  hora_entrega      TIME NOT NULL,
  hora_devolucion   TIME,
  lugar_entrega     VARCHAR(300) NOT NULL,
  estado            ENUM('pendiente','aceptada','cancelada','completada') DEFAULT 'pendiente',
  notas             TEXT,
  total_estimado    DECIMAL(10,2) DEFAULT 0,
  creado_en         DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_res_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- DETALLE DE RESERVACIONES
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservacion_productos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  reservacion_id  INT NOT NULL,
  producto_id     INT NOT NULL,
  cantidad        INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal        DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  CONSTRAINT fk_rp_res FOREIGN KEY (reservacion_id) REFERENCES reservaciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- -----------------------------------------------------------
-- CARRITO (sesión de usuario)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT NOT NULL,
  producto_id  INT NOT NULL,
  cantidad     INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_car_usr  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  CONSTRAINT fk_car_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  UNIQUE KEY uq_carrito (usuario_id, producto_id)
);

-- -----------------------------------------------------------
-- MENSAJES DE CONTACTO
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  email       VARCHAR(200) NOT NULL,
  telefono    VARCHAR(20),
  mensaje     TEXT NOT NULL,
  leido       TINYINT(1) DEFAULT 0,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- SEED - CATEGORÍAS
-- -----------------------------------------------------------
INSERT INTO categorias (nombre, icono) VALUES
  ('Sillas',      'chair'),
  ('Mesas',       'table'),
  ('Manteles',    'mantel'),
  ('Carpas',      'tent'),
  ('Accesorios',  'star');

-- -----------------------------------------------------------
-- SEED - PRODUCTOS DE EJEMPLO
-- -----------------------------------------------------------
INSERT INTO productos (categoria_id, nombre, descripcion, precio_renta, stock_total, imagen_url) VALUES
  (1, 'Silla Tiffany Blanca',   'Elegante silla de acrílico ideal para bodas y eventos formales.',  25.00, 200, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'),
  (1, 'Silla Chiavari Dorada',  'Silla clásica con acabado dorado, perfecta para banquetes.',        30.00, 150, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500'),
  (1, 'Silla Plegable Negra',   'Cómoda y resistente, ideal para eventos casuales o formales.',      15.00, 300, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500'),
  (2, 'Mesa Redonda 1.8m',      'Mesa redonda para 8-10 personas, perfecta para banquetes.',         80.00,  50, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500'),
  (2, 'Mesa Rectangular 2.4m',  'Mesa rectangular resistente, ideal para buffet o recepción.',       70.00,  60, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'),
  (3, 'Mantel Blanco Satinado', 'Mantel satinado blanco, disponible en varios tamaños.',             20.00, 300, 'https://images.unsplash.com/photo-1549488344-cbb6c34a be4e?w=500'),
  (3, 'Mantel Dorado Bordado',  'Mantel con bordado dorado, toque de lujo para tu evento.',          35.00, 100, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500'),
  (4, 'Carpa 6x6m Blanca',     'Carpa resistente al viento, capacidad para 40-50 personas.',       500.00,  10, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500'),
  (4, 'Carpa 10x10m Premium',  'Carpa grande con ventanas laterales, ideal para bodas al aire libre.', 900.00, 5, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500'),
  (5, 'Arco Floral Blanco',    'Hermoso arco decorativo para ceremonias y sesiones fotográficas.',  150.00,  8, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500'),
  (5, 'Candelabro Alto 1.5m',  'Candelabro plateado o dorado, ideal como centro de mesa.',          60.00,  30, 'https://images.unsplash.com/photo-1478547960-3bbcecb2eba0?w=500');

-- -----------------------------------------------------------
-- SEED - ADMIN POR DEFECTO (password: admin123)
-- -----------------------------------------------------------
INSERT INTO usuarios (nombre, email, password, rol) VALUES
  ('Administrador', 'admin@alquiladora.com', '$2a$10$cIYxbVXlPiw5pQQpbD5JSODvF5naPgRbu4PVVBKF.DYb9VIe1VT7y', 'admin');
-- Credenciales: admin@alquiladora.com / admin123
