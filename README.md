# 🎬 API de Películas - Backend Profesional (NestJS, PostgreSQL, TypeORM)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

---

## ⚡ Requisitos para la prueba técnica

- **Variables de entorno:**
  - Copia el archivo `.env.example` a `.env` y completa los valores según tu entorno. Los principales son:
    - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
    - `JWT_SECRET`, `JWT_EXPIRES_IN`
    - Otros según configuración de correo, entorno, etc.
- **Base de datos:**
  - Debes tener PostgreSQL corriendo localmente y crear la base de datos indicada en `.env`.
  - Ejecuta las migraciones y seeds si es necesario.
- **Instalación:**
  - Instala dependencias con `pnpm install`.
  - Levanta el backend con `pnpm run start:dev`.
- **Documentación y pruebas:**
  - Accede a Swagger en `http://localhost:3000/api/docs` para ver y probar los endpoints.
  - Si quieres probar los endpoints desde VS Code, instala la extensión **REST Client** y usa el archivo `api-test.http` incluido en el proyecto.

---

## 🚀 Características principales

- **Arquitectura Clean Architecture**: Separación clara de capas (Dominio, Aplicación, Infraestructura, Presentación)
- **Base de datos relacional**: PostgreSQL con entidades y relaciones modeladas profesionalmente
- **TypeORM**: ORM para gestión de entidades, migraciones y seeds
- **DTOs y validaciones**: Uso intensivo de DTOs, validaciones con class-validator y manejo global de errores
- **Testing profesional**: Cobertura completa con Jest (unitarios, integración, e2e)
- **Documentación Swagger**: Documentación interactiva y ejemplos en `/api/docs`
- **CI/CD y despliegue**: Scripts y configuración para despliegue automatizado

---

## 📦 Estructura del Proyecto

- `src/domain` — Entidades de dominio, lógica de negocio y contratos de repositorios
- `src/application` — Casos de uso, servicios de aplicación y lógica de negocio
- `src/infrastructure` — Implementaciones de repositorios, entidades TypeORM, configuración de base de datos
- `src/presentation` — Controllers, DTOs, validaciones, filtros globales y documentación Swagger
- `test/` — Pruebas unitarias, integración y e2e
- `docs/` — Documentación técnica, progreso y testing
- `api-test.http` — Archivo de pruebas para la extensión REST Client

---

## 🧪 Testing

- **Cobertura:** 100% de los módulos principales cubiertos
- **Framework:** Jest + Supertest
- **Tipos de tests:**
  - Unitarios (servicios, entidades, lógica de negocio)
  - Integración (controllers, endpoints HTTP)
  - End-to-end (flujo completo de la API)
- **Comandos útiles:**
  ```bash
  pnpm run test         # Ejecuta todos los tests
  pnpm run test:watch   # Modo watch
  pnpm run test:cov     # Cobertura
  pnpm run test:e2e     # End-to-end
  ```
- **Resultados:**
  - 8/8 test suites passing
  - 125 tests pasando
  - Cobertura estimada: >90%

---

## 📝 Documentación Swagger

La API cuenta con documentación interactiva y ejemplos en **Swagger**:

- Accede a la documentación en: [`/api/docs`](http://localhost:3000/api/docs)
- Incluye:
  - Descripción de todos los endpoints (usuarios, películas, categorías)
  - Ejemplos de requests y responses
  - Validaciones y errores documentados
  - Schemas y DTOs detallados
- Swagger se genera automáticamente a partir de los decoradores y DTOs en el código fuente.

---

## 🛠️ Instalación y uso

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/api-movies-backend.git
   cd api-movies-backend
   ```
2. **Instala dependencias:**
   ```bash
   pnpm install
   ```
3. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env` y ajusta según tu entorno (DB, JWT, etc.)
4. **Levanta el backend:**
   ```bash
   pnpm run start:dev
   ```
5. **Accede a la API y Swagger:**
   - API: `http://localhost:3000`
   - Swagger: `http://localhost:3000/api/docs`

---

## 🗄️ Migraciones y Seeds

- **Migraciones automáticas:**
  ```bash
  pnpm run typeorm migration:run
  ```
- **Seeds de datos:**
  - Incluidos para categorías y datos de prueba

---

## 🧩 Principales Endpoints

- **Usuarios:**
  - `POST /users` — Crear usuario
  - `GET /users` — Listar usuarios (paginación, búsqueda)
  - `GET /users/:id` — Obtener usuario por ID
  - `PUT /users/:id` — Actualizar usuario
  - `DELETE /users/:id` — Eliminar usuario
  - `GET /users/:userId/movies` — Películas vistas/favoritas por usuario
- **Películas:**
  - `POST /movies` — Crear película
  - `GET /movies` — Listar películas (filtros, paginación)
  - `GET /movies/new-releases` — Novedades
  - `PUT /movies/:id` — Actualizar película
  - `DELETE /movies/:id` — Eliminar película
- **Categorías:**
  - `POST /categories` — Crear categoría
  - `GET /categories` — Listar categorías
  - `PUT /categories/:id` — Actualizar categoría
  - `DELETE /categories/:id` — Eliminar categoría

---

## 🏆 Logros y buenas prácticas

- Arquitectura profesional y escalable
- DTOs y validaciones exhaustivas
- Testing completo y cobertura alta
- Documentación Swagger clara y útil
- Manejo global de errores y validaciones
- Listo para despliegue en producción (Docker, CI/CD)

---

## 📚 Recursos útiles

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Swagger/OpenAPI](https://swagger.io/specification/)
- [Jest Testing](https://jestjs.io/)
