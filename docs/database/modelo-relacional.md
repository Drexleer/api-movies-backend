# 🎬 MODELO RELACIONAL - API DE PELÍCULAS

## 📊 Diagrama de Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    CATEGORIES   │       │     MOVIES      │       │     USERS       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ 🔑 id (PK)      │◄──────┤ 🔑 id (PK)      │       │ 🔑 id (PK)      │
│ 📝 name         │    1:N│ 📝 title        │       │ 👤 name         │
└─────────────────┘       │ 📄 description  │       │ 📧 email        │
                          │ 📅 release_date │       │ 🔒 password     │
                          │ 🔗 category_id  │       │ ⏰ created_at   │
                          │ ⏰ created_at   │       └─────────────────┘
                          └─────────────────┘                │
                                   │                         │
                                   │         N:M             │
                                   │   ┌─────────────────┐   │
                                   └───┤  USER_MOVIES    │───┘
                                       ├─────────────────┤
                                       │ 🔑 id (PK)      │
                                       │ 🔗 user_id (FK) │
                                       │ 🔗 movie_id (FK)│
                                       │ ⏰ viewed_at    │
                                       └─────────────────┘
```

## 🔗 Relaciones

### 1️⃣ CATEGORIES → MOVIES (1:N)

- **Una categoría** puede tener **muchas películas**
- **Una película** pertenece a **una sola categoría**
- Relación: `movies.category_id` → `categories.id`

### 2️⃣ USERS ↔ MOVIES (N:M)

- **Un usuario** puede ver **muchas películas**
- **Una película** puede ser vista por **muchos usuarios**
- Tabla intermedia: `user_movies`
- Relaciones:
  - `user_movies.user_id` → `users.id`
  - `user_movies.movie_id` → `movies.id`

## 📋 Descripción de Tablas

### 🏷️ **CATEGORIES**

| Campo  | Tipo        | Descripción                                               |
| ------ | ----------- | --------------------------------------------------------- |
| `id`   | SERIAL PK   | Identificador único de la categoría                       |
| `name` | VARCHAR(50) | Nombre de la categoría (Terror, Suspenso, Drama, Comedia) |

**Datos precargados:**

- Terror
- Suspenso
- Drama
- Comedia

---

### 👤 **USERS**

| Campo        | Tipo         | Descripción                     |
| ------------ | ------------ | ------------------------------- |
| `id`         | SERIAL PK    | Identificador único del usuario |
| `name`       | VARCHAR(100) | Nombre completo del usuario     |
| `email`      | VARCHAR(100) | Correo electrónico (único)      |
| `password`   | VARCHAR(255) | Contraseña encriptada           |
| `created_at` | TIMESTAMP    | Fecha de creación del registro  |

---

### 🎥 **MOVIES**

| Campo          | Tipo         | Descripción                         |
| -------------- | ------------ | ----------------------------------- |
| `id`           | SERIAL PK    | Identificador único de la película  |
| `title`        | VARCHAR(200) | Título de la película               |
| `description`  | TEXT         | Descripción/sinopsis de la película |
| `release_date` | DATE         | Fecha de estreno                    |
| `category_id`  | INTEGER FK   | Referencia a la categoría           |
| `created_at`   | TIMESTAMP    | Fecha de creación del registro      |

---

### 👁️ **USER_MOVIES**

| Campo       | Tipo       | Descripción                             |
| ----------- | ---------- | --------------------------------------- |
| `id`        | SERIAL PK  | Identificador único del registro        |
| `user_id`   | INTEGER FK | Referencia al usuario                   |
| `movie_id`  | INTEGER FK | Referencia a la película                |
| `viewed_at` | TIMESTAMP  | Fecha y hora en que se marcó como vista |

**Restricciones:**

- `UNIQUE(user_id, movie_id)` - Un usuario no puede marcar la misma película como vista más de una vez

## 🎯 Casos de Uso Principales

1. **Gestión de Usuarios**: Crear y consultar usuarios
2. **Gestión de Películas**: Crear películas y asignarles categorías
3. **Listado con Filtros**: Buscar películas por título y categoría con paginación
4. **Novedades**: Obtener películas con estreno menor a 3 semanas
5. **Marcar como Vista**: Registrar que un usuario vio una película
6. **Historial de Usuario**: Consultar qué películas ha visto cada usuario

## 📝 Notas Importantes

- Las **categorías están precargadas** y no se pueden modificar vía API
- La fecha de estreno permite identificar **novedades** (< 3 semanas)
- La tabla `user_movies` evita duplicados con `UNIQUE(user_id, movie_id)`
- Todos los registros tienen `created_at` para auditoría
