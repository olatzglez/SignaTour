/* ============================================================
   MODELO DE DATOS - PLATAFORMA DE ITINERARIOS ACCESIBLES
   PostgreSQL 16
   Script SQL equivalente al generado mediante Sequelize ORM
   ============================================================ */

"Aunque el modelo de datos lo gestiona Sequelize automáticamente mediante sequelize.sync(), el SQL equivalente que se generaría escribiendo las tablas a mano sería el siguiente. Este script no se ejecuta en el proyecto (lo hace el ORM por mí), pero documenta la estructura física de la BD."

/* ============================================================
   TIPOS ENUM PERSONALIZADOS
   ============================================================ */

/* Rol de usuario dentro del sistema */
CREATE TYPE rol_usuario AS ENUM ('user', 'admin');

/* Público objetivo del itinerario */
CREATE TYPE publico_itinerario AS ENUM ('todos', 'doce_mas', 'adultos');


/* ============================================================
   TABLA: usuarios
   Representa las cuentas de acceso al sistema.
   Puede haber usuarios normales y administradores.
   ============================================================ */

CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol rol_usuario NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL
);


/* ============================================================
   TABLA: itinerarios
   Contiene los itinerarios culturales publicados en la plataforma.
   Cada itinerario puede haber sido creado por un usuario administrador.
   ============================================================ */

CREATE TABLE itinerarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ciudad VARCHAR(255) NOT NULL,
    "duracionMinutos" INTEGER,
    publico publico_itinerario NOT NULL DEFAULT 'todos',
    "creadoPor" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_itinerarios_usuario
        FOREIGN KEY ("creadoPor")
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


/* ============================================================
   TABLA: puntos_interes
   Guarda las paradas o lugares que forman parte de un itinerario.
   ============================================================ */

CREATE TABLE puntos_interes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    descripcion TEXT,
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7),
    orden INTEGER DEFAULT 0,
    "itinerarioId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_puntos_itinerario
        FOREIGN KEY ("itinerarioId")
        REFERENCES itinerarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


/* ============================================================
   TABLA: recursos_accesibilidad
   Catálogo de recursos accesibles disponibles en la aplicación.
   ============================================================ */

CREATE TABLE recursos_accesibilidad (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL
);


/* ============================================================
   TABLA: PuntoRecurso
   Tabla puente para la relación muchos a muchos entre:
   - puntos_interes
   - recursos_accesibilidad
   ============================================================ */

CREATE TABLE "PuntoRecurso" (
    "puntoId" INTEGER NOT NULL,
    "recursoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("puntoId", "recursoId"),

    CONSTRAINT fk_puntorecurso_punto
        FOREIGN KEY ("puntoId")
        REFERENCES puntos_interes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_puntorecurso_recurso
        FOREIGN KEY ("recursoId")
        REFERENCES recursos_accesibilidad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


/* ============================================================
   DATOS INICIALES DEL CATÁLOGO DE ACCESIBILIDAD
   ============================================================ */

INSERT INTO recursos_accesibilidad
(codigo, nombre, descripcion, "createdAt", "updatedAt")
VALUES
('LSE', 'Lengua de Signos Española', 'Interpretación o apoyo en LSE.', NOW(), NOW()),
('SUBTITULOS', 'Subtítulos', 'Contenido audiovisual subtitulado.', NOW(), NOW()),
('SIGNOGUIA', 'Signoguía', 'Guía visual accesible en lengua de signos.', NOW(), NOW()),
('BUCLE_MAGNETICO', 'Bucle Magnético', 'Sistema de ayuda auditiva para audífonos.', NOW(), NOW()),
('LECTURA_FACIL', 'Lectura Fácil', 'Textos adaptados para comprensión sencilla.', NOW(), NOW());


/* ============================================================
   RELACIONES DEL MODELO
   ============================================================

   1:N
   - Un usuario puede crear muchos itinerarios.
   - Un itinerario puede tener muchos puntos de interés.

   N:M
   - Un punto de interés puede tener varios recursos de accesibilidad.
   - Un recurso de accesibilidad puede estar asociado a muchos puntos.
   - Esta relación se resuelve mediante la tabla PuntoRecurso.

   ============================================================ */

   /* ============================================================
   RETOS
   ============================================================

    Reto: autenticación que sirviera tanto a la API REST como a las vistas web
Solución: implementé un middleware verifyToken que busca el JWT en dos sitios distintos: cookie httpOnly (para vistas) y cabecera Authorization: Bearer (para API). Esto permite reutilizar la misma lógica de auth en los dos canales sin duplicar código.
