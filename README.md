# Itinerarios Accesibles

Plataforma web para la exploración de itinerarios culturales adaptados a personas sordas o con discapacidad auditiva. Permite consultar rutas accesibles y gestionar itinerarios mediante un sistema de roles.

---

## 🧩 Descripción

**Itinerarios Accesibles** es una aplicación Full Stack desarrollada como proyecto académico individual. Ofrece itinerarios culturales (museos, calles, monumentos) que incluyen información sobre recursos de accesibilidad como:

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

## 🚀 Tecnologías utilizadas

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
.
├── public/
│ ├── css/
│ ├── js/
│ └── images/ciudades/
├── src/
│ ├── config/
│ ├── constants/
│ ├── controllers/
│ │ ├── api/
│ │ └── web/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ │ ├── api/
│ │ └── web/
│ ├── seeders/
│ ├── services/
│ └── views/
├── docker-compose.yml
├── package.json
└── README.md


---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (v18 o superior recomendado)
- npm
- Docker
- Docker Compose

---

## 📦 Instalación

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
PORT=3000

DB_HOST=localhost
DB_PORT=5434
DB_NAME=itinerarios
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=supersecretkey
```
---

## Bases de datos con Docker
Levantar los contenedores de PostgreSQL y pgAdmin:
```bash
docker-compose up -d
```
Acceso a pgAdmin
* URL: http://localhost:5050
* Email: [DATO A COMPLETAR]
* Password: [DATO A COMPLETAR]

## Seed de datos
Para poblar la base de datos con datos iniciales:

```bash
node src/seeders/seed.js
```
Este script es idempotente (usa findOrCreate).

| Rol   | Email                                                         | Password  |
| ----- | ------------------------------------------------------------- | --------- |
| Admin | [admin@itinerarios.local](mailto:admin@itinerarios.local)     | admin1234 |
| User  | [usuario@itinerarios.local](mailto:usuario@itinerarios.local) | admin1234 |

## Ejecución del proyecto
Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

La aplicación estará disponible en:
-> http://localhost:3000

## Autenticación

El sistema utiliza JWT almacenado en:
* Cookie httpOnly (para SSR)
* Header Authorization (para API)

## Endpoints principales

API REST

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| POST   | /api/auth/register   | Registro            |
| POST   | /api/auth/login      | Login               |
| GET    | /api/auth/me         | Usuario autenticado |
| GET    | /api/itinerarios     | Lista pública       |
| GET    | /api/itinerarios/:id | Detalle             |
| POST   | /api/itinerarios     | Crear (admin)       |
| PATCH  | /api/itinerarios/:id | Actualizar (admin)  |
| DELETE | /api/itinerarios/:id | Eliminar (admin)    |

RUTAS WEB (SSR)
| Método   | Ruta               | Descripción   |
| -------- | ------------------ | ------------- |
| GET      | /                  | Home          |
| GET/POST | /login             | Login         |
| GET/POST | /registro          | Registro      |
| POST     | /logout            | Logout        |
| GET      | /itinerarios       | Lista         |
| GET      | /itinerarios/nuevo | Crear (admin) |
| POST     | /itinerarios/nuevo | Guardar       |
| GET      | /itinerarios/:id   | Detalle       |

## Accesibilidad (WCAG 2.1 AA)

* Contraste mínimo 4.5:1
* Navegación por teclado
* Focus visible (outline 3px)


## Arquitectura
* SSR con PUG + API REST
* Capa de servicios compartida
* Middlewares reutilizables (requireRole)
* Manejo centralizado de errores
* Sequelize con sync({ alter: true }) en desarrollo

## Testing
Se han realizado pruebas manuales:
* Login incorrecto → 401
* Acceso sin permisos → 403
* Validación de formularios
* Navegación con teclado

## Mejoras a futuro
* Subida de imágenes propias
* Filtros y paginación
* Inclusión de mapas
* Traducciones (euskera, catalán, gallego)
* Testing automatizado (Jest)
* Documentación API (Swagger)

## Autoría
Olatz González García https://github.com/olatzglez/




