# 🪑 Alquiladora de Mobiliario para Eventos

Sistema web completo para una alquiladora de sillas, mesas, carpas y accesorios para eventos.

## 📁 Estructura del proyecto

```
alquiladora/
├── back/           → API REST con Node.js + Express + MySQL
├── front/          → Sitio público con React + Vite (puerto 5173)
└── dashboard/      → Panel de administración React + Vite (puerto 5174)
```

---

## 🗄 Base de datos (MySQL)

### 1. Crear la base de datos

```sql
-- En tu cliente MySQL (MySQL Workbench, DBeaver, terminal):
SOURCE back/src/config/schema.sql;
```

### Tablas y relaciones

| Tabla                   | Descripción                                 |
|-------------------------|---------------------------------------------|
| `categorias`            | Tipos de producto (Sillas, Mesas, etc.)     |
| `productos`             | Catálogo con imagen, precio, stock          |
| `usuarios`              | Clientes y administradores                  |
| `reservaciones`         | Solicitudes de renta por usuario            |
| `reservacion_productos` | Detalle de productos por reservación        |
| `carrito`               | Carrito de compra por usuario               |
| `mensajes_contacto`     | Mensajes del formulario de contacto         |

---

## ⚙️ Configuración del backend

```bash
cd back
cp .env.example .env
# Edita .env con tus credenciales MySQL
npm install
```

### Variables de entorno (`.env`)

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=alquiladora_db
JWT_SECRET=cambia_este_secreto_jwt_seguro
```

### Crear el usuario administrador

```bash
node src/scripts/crearAdmin.js
# Email:    admin@eleganceevents.com
# Password: admin123
```

### Iniciar el backend

```bash
npm run dev    # desarrollo (nodemon)
npm start      # producción
```

---

## 🌐 Frontend público (Sitio web)

```bash
cd front
npm install
npm run dev
# → http://localhost:5173
```

### Páginas disponibles

| Ruta                  | Descripción                              |
|-----------------------|------------------------------------------|
| `/`                   | Inicio con hero, servicios y paquetes    |
| `/catalogo`           | Catálogo con filtros por categoría       |
| `/reservar`           | Solicitud de renta con carrito           |
| `/calendario`         | Fechas disponibles y ocupadas            |
| `/contacto`           | Formulario + WhatsApp + info             |
| `/login`              | Inicio de sesión de cliente              |
| `/registro`           | Registro de nuevo cliente                |
| `/mis-reservaciones`  | Historial de reservaciones del cliente   |

---

## 🖥 Dashboard de administración

```bash
cd dashboard
npm install
npm run dev
# → http://localhost:5174
```

### Secciones del dashboard

| Sección         | Funcionalidad                                        |
|-----------------|------------------------------------------------------|
| Inicio          | Estadísticas generales + reservaciones pendientes    |
| Productos       | CRUD completo, subir imágenes, precios, stock        |
| Reservaciones   | Ver, aceptar, cancelar y completar solicitudes       |
| Clientes        | Lista de clientes registrados con buscador           |
| Mensajes        | Mensajes de contacto, marcar como leído              |

---

## 🔌 API REST — Endpoints principales

### Autenticación
| Método | Ruta                | Descripción           |
|--------|---------------------|-----------------------|
| POST   | `/api/auth/registro`| Registrar cliente     |
| POST   | `/api/auth/login`   | Iniciar sesión        |
| GET    | `/api/auth/perfil`  | Perfil (token req.)   |

### Productos (público)
| Método | Ruta                                    | Descripción              |
|--------|-----------------------------------------|--------------------------|
| GET    | `/api/productos`                        | Listar (filtros opcionales) |
| GET    | `/api/productos/:id`                    | Detalle de producto      |
| GET    | `/api/productos/check/disponibilidad`   | Stock disponible en fecha |
| GET    | `/api/categorias`                       | Lista de categorías      |

### Productos (admin)
| Método | Ruta                        | Descripción         |
|--------|-----------------------------|---------------------|
| GET    | `/api/admin/productos`      | Todos (incl. inactivos) |
| POST   | `/api/admin/productos`      | Crear + imagen      |
| PUT    | `/api/admin/productos/:id`  | Actualizar          |
| DELETE | `/api/admin/productos/:id`  | Desactivar (soft)   |

### Reservaciones
| Método | Ruta                                        | Descripción            |
|--------|---------------------------------------------|------------------------|
| POST   | `/api/reservaciones`                        | Crear (cliente auth)   |
| GET    | `/api/reservaciones/mias`                   | Mis reservaciones      |
| GET    | `/api/reservaciones-fechas`                 | Fechas ocupadas        |
| GET    | `/api/admin/reservaciones`                  | Todas (admin)          |
| PUT    | `/api/admin/reservaciones/:id/estado`       | Cambiar estado (admin) |

### Carrito
| Método | Ruta                    | Descripción        |
|--------|-------------------------|--------------------|
| GET    | `/api/carrito`          | Ver carrito        |
| POST   | `/api/carrito`          | Agregar/actualizar |
| DELETE | `/api/carrito/:prod_id` | Quitar producto    |
| DELETE | `/api/carrito`          | Vaciar carrito     |

### Contacto
| Método | Ruta                       | Descripción          |
|--------|----------------------------|----------------------|
| POST   | `/api/contacto`            | Enviar mensaje       |
| GET    | `/api/admin/mensajes`      | Listar (admin)       |
| PUT    | `/api/admin/mensajes/:id`  | Marcar leído (admin) |

---

## 🎨 Diseño y paleta

| Color          | Uso                          | Hex       |
|----------------|------------------------------|-----------|
| Blanco         | Fondos y limpieza            | `#FFFFFF` |
| Blanco humo    | Secciones alternas           | `#F8F7F5` |
| Dorado         | Acento principal y CTAs      | `#C9A84C` |
| Gris elegante  | Textos secundarios           | `#4A4A4A` |
| Negro          | Textos y footer              | `#1A1A1A` |

Tipografías: **Cormorant Garamond** (display) + **Inter** (cuerpo)

---

## 📦 Stack tecnológico

| Capa       | Tecnología                             |
|------------|----------------------------------------|
| Backend    | Node.js, Express, MySQL2, JWT, Multer  |
| Frontend   | React 18, Vite, React Router v6, Axios |
| Dashboard  | React 18, Vite, React Router v6, Axios |
| Base datos | MySQL 8+                               |
| Auth       | JWT (JSON Web Tokens) + bcryptjs       |

---

## 🚀 Iniciar todo el proyecto

```bash
# Terminal 1 - Backend
cd back && npm run dev

# Terminal 2 - Sitio público
cd front && npm run dev

# Terminal 3 - Dashboard admin
cd dashboard && npm run dev
```

---

## ⚠️ Personalización antes de producción

1. Cambia el número de WhatsApp en `front/src/pages/Home.jsx`, `Contacto.jsx` y `Footer.jsx`
2. Actualiza el email de contacto
3. Cambia `JWT_SECRET` en `.env` por una cadena segura larga
4. Cambia la contraseña del admin después del primer login
5. Configura CORS en `back/src/index.js` con el dominio de producción
