# SignaTour

Plataforma web para la exploración de itinerarios culturales adaptados a personas sordas o con discapacidad auditiva. Permite consultar rutas accesibles y gestionar itinerarios mediante un sistema de roles.

---

## 📖 Descripción

**SignaTour** es una aplicación Full Stack desarrollada como proyecto académico individual. Ofrece itinerarios culturales (museos, calles, monumentos) que incluyen información sobre recursos de accesibilidad como:

- Lengua de Signos Española (LSE)
- Subtítulos
- Signoguías
- Bucle magnético
- Lectura fácil

La aplicación cuenta con:

- Interfaz web SSR (Server-Side Rendering) con PUG
- API REST en formato JSON
- Sistema de autenticación con JWT
- Roles de usuario (`user`, `admin`)

---

## 🛠️ Tecnologías utilizadas

### Backend
- Node.js
- Express

### Base de datos
- PostgreSQL 16 (Docker)
- Sequelize 6 (ORM)

### Autenticación
- JWT (cookie httpOnly + header Authorization)
- bcrypt

### Otros
- PUG (motor de plantillas SSR)
- Docker & Docker Compose
- pgAdmin
- dotenv, cors, cookie-parser, nodemon

---

## 📁 Estructura del proyecto

```
SignaTour/
├── db/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── services/
│   └── views/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── memoria_SignaTour.pdf
├── package-lock.json
├── package.json
└── README.md
```

---

## ✅ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (v18 o superior recomendado)
- npm
- Docker
- Docker Compose

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/olatzglez/SignaTour.git
cd SignaTour
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:
```bash
PORT=4567

DB_HOST=localhost
DB_PORT=5434
DB_NAME=itinerarios
DB_USER=itinerarios
DB_PASSWORD=tu_contraseña_de_postgres

JWT_SECRET=tu_cadena_secreta_aleatoria
```

> Los valores reales que esperan los contenedores de Docker (definidos en `docker-compose.yml`) son `itinerarios_pass` para la BD. Para producción, generar valores propios y nunca commitearlos.

---

## 🐳 Bases de datos con Docker
Levantar los contenedores de PostgreSQL y pgAdmin:
```bash
docker compose up -d
```

### Acceso a pgAdmin

- URL: http://localhost:5050
- Email: `admin@itinerarios.local`
- Password: `admin`

> **Para registrar el servidor en pgAdmin**, usar como host `itinerarios_db` (nombre del contenedor en la red Docker), puerto `5432` (puerto interno), y las credenciales de la BD del paso anterior.

---

## 🌱 Seed de datos
Para poblar la base de datos con datos iniciales:

```bash
npm run seed
```
El script es idempotente (usa `findOrCreate`) y crea:

- 5 recursos de accesibilidad (LSE, subtítulos, signoguía, bucle magnético, lectura fácil).
- 6 itinerarios de ejemplo en Madrid, Bilbao, Sevilla, Barcelona, Donostia y Granada.
- Dos usuarios de prueba:

| Rol   | Email                       | Password    |
|-------|-----------------------------|-------------|
| Admin | admin@itinerarios.local     | admin1234   |
| User  | usuario@itinerarios.local   | admin1234   |

---

## ▶️ Ejecución del proyecto
Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

La aplicación estará disponible en:
-> http://localhost:4567

---

## 🔑 Autenticación
El sistema utiliza JWT almacenado en:

* Cookie httpOnly (para SSR)
* Header Authorization (para API)

---

## 📡 Endpoints principales

API REST

| Método | Endpoint             | Descripción         | Auth   |
|--------|----------------------|---------------------|--------|
| POST   | /api/auth/register   | Registro            | No     |
| POST   | /api/auth/login      | Login               | No     |
| GET    | /api/auth/me         | Usuario autenticado | Sí     |
| GET    | /api/itinerarios     | Lista pública       | No     |
| GET    | /api/itinerarios/:id | Detalle             | No     |
| POST   | /api/itinerarios     | Crear               | Admin  |
| PATCH  | /api/itinerarios/:id | Actualizar          | Admin  |
| DELETE | /api/itinerarios/:id | Eliminar            | Admin  |


RUTAS WEB (SSR)
| Método   | Ruta                       | Descripción              |
|----------|----------------------------|--------------------------|
| GET      | /                          | Home                     |
| GET/POST | /login                     | Login                    |
| GET/POST | /registro                  | Registro                 |
| POST     | /logout                    | Logout                   |
| GET      | /itinerarios               | Lista                    |
| GET      | /itinerarios/nuevo         | Crear (admin)            |
| POST     | /itinerarios/nuevo         | Guardar nuevo (admin)    |
| GET      | /itinerarios/:id           | Detalle                  |
| POST     | /itinerarios/:id/eliminar  | Eliminar (admin)         |

---

## ♿ Accesibilidad (WCAG 2.1 AA)
- Contraste mínimo 4.5:1 en todo el texto.
- Navegación completa por teclado.
- Focus visible (outline 3px).
- Tamaño mínimo de toque 44x44 px.
- Soporte de `prefers-reduced-motion`.
- Mobile-first con tres breakpoints (480, 768, 1024).
- Menú lateral móvil con atributos ARIA y cierre por Escape.

---

## 🏗️ Arquitectura
- SSR con PUG + API REST con Express.
- Capa de servicios compartida entre la API y las vistas.
- Middlewares reutilizables (`verifyToken`, `requireRole`).
- Manejo centralizado de errores con `statusCode` propagado.
- Sequelize con `sync({ alter: true })` en desarrollo.

---

## 🧪 Testing
Se han realizado pruebas manuales sobre los flujos críticos:

- Login con credenciales correctas e incorrectas (401).
- Acceso a rutas admin sin permisos (403).
- Validación de campos obligatorios en el formulario.
- Eliminación con confirmación previa.
- Navegación completa con teclado.
- Reflujo a 320 px sin scroll horizontal.

---

## 🔮 Mejoras a futuro
- Subida de imágenes propias por itinerario.
- Filtros y paginación en la lista.
- Guardar itinerarios a Favoritos.
- Mapas interactivos e integración con Google Maps.
- Traducciones a euskera, catalá y galego.
- Testing automatizado (Jest + Supertest).
- Documentación API con Swagger / OpenAPI.

---

## 🤖 Uso de IA en el desarrollo

Se ha utilizado **Claude (Anthropic)** como herramienta de apoyo durante el desarrollo: resolución de dudas técnicas, depuración de errores y apoyo en la redacción de la documentación.

Las decisiones de arquitectura, diseño funcional y UX se han mantenido bajo criterio propio. La autoría intelectual del proyecto es plenamente personal.

Detalles ampliados en la sección 9 de la memoria técnica.

---

## 👩‍💻 Autoría
Olatz González García — [@olatzglez](https://github.com/olatzglez)

Proyecto Full Stack individual · Mayo 2026

