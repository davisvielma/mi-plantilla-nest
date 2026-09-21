<div align="center">

# Plantilla NestJS con Arquitectura Hexagonal

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js->=22-339933?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-UNLICENSED-ff69b4?style=flat-square)

Plantilla NestJS lista para produccion con arquitectura hexagonal, autenticacion JWT y PostgreSQL.

[Inicio Rapido](#inicio-rapido) &bull; [Arquitectura](#arquitectura) &bull; [API](#referencia-api) &bull; [Docker](#despliegue-con-docker)

</div>

---

## Descripcion

Esta plantilla proporciona una base solida para construir aplicaciones backend escalables con NestJS. Implementa **arquitectura hexagonal** (puertos y adaptadores) para asegurar que la logica de negocio se mantenga independiente de las preocupaciones de infraestructura como bases de datos o frameworks.

### Caracteristicas Principales

- **Arquitectura Hexagonal** - Separacion limpia entre dominio, aplicacion e infraestructura
- **Autenticacion JWT** - Flujo completo con access/refresh tokens y blacklist
- **Perfil del usuario actual** - Endpoint `GET /auth/me` para restaurar la sesion al recargar la pagina
- **Control de Acceso por Roles** - Roles admin y usuario con proteccion de rutas
- **TypeORM** - Entidades, migraciones y seeds de base de datos
- **Swagger** - Documentacion auto-generada en `/api/docs`
- **Docker** - Multi-stage build para produccion
- **Testing** - 129 pruebas unitarias con Jest

## Inicio Rapido

### Requisitos Previos

- [Node.js](https://nodejs.org/) >= 22
- [Yarn](https://yarnpkg.com/) como gestor de paquetes
- [Docker](https://www.docker.com/) (opcional, para la base de datos)

### Instalacion

```bash
# Clonar el repositorio
git clone <tu-url-del-repositorio>
cd mi-plantilla-nest

# Instalar dependencias
yarn install

# Copiar variables de entorno
cp .env.template .env

# Iniciar base de datos PostgreSQL
docker compose up -d postgres

# Ejecutar migraciones y seeders
yarn setup
```

### Iniciar Servidor de Desarrollo

```bash
yarn start:dev
```

La API estara disponible en `http://localhost:3000/api` y la documentacion de Swagger en `http://localhost:3000/api/docs`.

## Arquitectura

Esta plantilla sigue los principios de **arquitectura hexagonal**, organizando el codigo por funcionalidades en lugar de capas tecnicas.

### Estructura del Proyecto

```
src/
  main.ts                          # Punto de entrada
  app/
    app.module.ts                   # Modulo raiz
  modules/
    auth/                           # Modulo de autenticacion
      domain/
        repositories/               # Interfaces (puertos)
      application/
        dtos/                       # Data Transfer Objects
        use-cases/                  # Casos de uso
      infrastructure/
        controllers/                # Adaptadores HTTP
        persistence/
          entities/                 # Entidades TypeORM
          repositories/             # Implementaciones (adaptadores)
          mappers/                  # Mappers dominio <-> persistencia
        modules/                    # Configuracion del modulo NestJS
        strategies/                 # Estrategias Passport (JWT)
    users/                          # Modulo de usuarios
      (misma estructura que auth)
    shared/                         # Modulo compartido
      decorators/                   # Decoradores personalizados
      guards/                       # Guards (JWT, Roles)
      dto/                          # DTOs compartidos
      interfaces/                   # Interfaces comunes
      constants/                    # Constantes
      utils/                        # Utilidades
  infrastructure/
    database/
      migrations/                   # Migraciones de TypeORM
      seeders/                      # Seeds de datos iniciales
      data-source.ts                # Configuracion de TypeORM
```

### Modulos Actuales

| Modulo | Descripcion |
|--------|-------------|
| `auth` | Login, registro, refresh token, logout, perfil del usuario autenticado |
| `users` | CRUD de usuarios con paginacion y filtros |
| `shared` | Guards, decoradores, DTOs, utilidades |

### Principios de Diseno

- **Logica de negocio en capa de dominio** - Entidades y casos de uso sin dependencias del framework
- **Inversion de dependencias** - El dominio define interfaces, la infraestructura las implementa
- **Casos de uso como puntos de entrada** - Cada operacion de negocio es una clase de caso de uso separada
- **Guards globales** - JWT y roles guards aplicados globalmente, con decorador `@Public()` para excepciones

### Como Crear un Nuevo Modulo

1. Crear la carpeta del modulo en `src/modules/<nombre>/`
2. Implementar las capas: `domain/`, `application/`, `infrastructure/`
3. Definir interfaces en `domain/repositories/`
4. Crear casos de uso en `application/use-cases/`
5. Implementar controladores y repositorios en `infrastructure/`
6. Registrar el modulo en `app.module.ts`

## Variables de Entorno

Copia `.env.template` a `.env` y configura:

| Variable | Descripcion | Por Defecto |
|----------|-------------|-------------|
| `STAGE` | Entorno de ejecucion | `dev` |
| `PORT` | Puerto del servidor | `3000` |
| `API_PREFIX` | Prefijo de URL | `api` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USERNAME` | Usuario de la base de datos | - |
| `DB_PASSWORD` | Contrasena de la base de datos | - |
| `DB_DATABASE` | Nombre de la base de datos | - |
| `JWT_SECRET` | Secreto para firmar JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiracion del access token | `1d` |
| `JWT_REFRESH_SECRET` | Secreto para refresh token | - |
| `JWT_REFRESH_EXPIRES_IN` | Tiempo de expiracion del refresh token | `7d` |
| `ADMIN_EMAIL` | Email del usuario administrador | - |
| `ADMIN_PASSWORD` | Contrasena del usuario administrador | - |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:4200` |

## Referencia API

### Autenticacion

| Metodo | Endpoint | Descripcion | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/api/auth/login` | Iniciar sesion | No |
| `POST` | `/api/auth/refresh` | Refrescar tokens | No |
| `POST` | `/api/auth/logout` | Cerrar sesion (blacklist access + refresh opcional, idempotente) | Bearer |
| `GET` | `/api/auth/me` | Obtener perfil actualizado del usuario autenticado | Bearer |

### Usuarios

| Metodo | Endpoint | Descripcion | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users` | Listar usuarios (paginado) | Admin |
| `GET` | `/api/users/:id` | Obtener usuario por ID | Si |
| `POST` | `/api/users` | Crear usuario | Admin |
| `PATCH` | `/api/users/:id` | Actualizar perfil | Si |
| `PATCH` | `/api/users/:id/role` | Actualizar rol de usuario | Admin |
| `DELETE` | `/api/users/:id` | Eliminar usuario (soft delete) | Admin |

### Parametros de Consulta (GET /api/users)

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `page` | number | Numero de pagina |
| `limit` | number | Elementos por pagina |
| `sort` | string | Campo de ordenamiento |
| `order` | string | Direccion del ordenamiento (ASC/DESC) |
| `email` | string | Filtrar por email |
| `roleId` | string | Filtrar por ID de rol |
| `fullName` | string | Filtrar por nombre |

### Flujo de Autenticacion

```
1. Registro/Login -> Retorna access token + refresh token
2. Peticiones autenticadas -> Header: Authorization: Bearer <token>
3. Token expirado -> POST /api/auth/refresh con refresh token
4. Logout -> Blacklist del access token
```

> [!TIP]
> Para restaurar la sesion al recargar la pagina, el frontend debe guardar el `accessToken` y llamar a `GET /api/auth/me` al iniciar, obteniendo el perfil actualizado (el rol y los datos vienen frescos de la base de datos, no del token).

## Despliegue con Docker

### Build de Produccion

```bash
# Construir e iniciar todos los servicios
docker compose up -d

# O reconstruir despues de cambios
docker compose up -d --build
```

### Servicios

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| `app` | 3000 | Aplicacion NestJS |
| `postgres` | 5432 | PostgreSQL 16 |

### Ver Logs

```bash
# Todos los servicios
docker compose logs -f

# Servicio especifico
docker compose logs -f app
```

### Detener Servicios

```bash
docker compose down

# Con volumenes
docker compose down -v
```

## Comandos Disponibles

### Desarrollo

| Comando | Descripcion |
|---------|-------------|
| `yarn start:dev` | Iniciar con modo watch |
| `yarn start:debug` | Iniciar con modo debug |
| `yarn build` | Compilar para produccion |
| `yarn start:prod` | Ejecutar build de produccion |

### Calidad de Codigo

| Comando | Descripcion |
|---------|-------------|
| `yarn lint` | Ejecutar ESLint con auto-fix |
| `yarn format` | Formatear codigo con Prettier |

### Testing

| Comando | Descripcion |
|---------|-------------|
| `yarn test` | Ejecutar pruebas unitarias |
| `yarn test:cov` | Ejecutar pruebas con cobertura |
| `yarn test:e2e` | Ejecutar pruebas end-to-end |

### Base de Datos

| Comando | Descripcion |
|---------|-------------|
| `yarn setup` | Ejecutar migraciones + seeders |
| `yarn migration:generate <nombre>` | Generar migracion desde diff |
| `yarn migration:run` | Aplicar migraciones pendientes |
| `yarn migration:revert` | Revertir ultima migracion |
| `yarn seed:run` | Ejecutar seeders |
| `yarn seed:reset` | Resetear DB (drop + migrate + seed) |

## Aliases de Rutas

Esta plantilla usa `@/` como alias de ruta para `src/`:

```typescript
// En lugar de
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';

// Usar
import { UserRepository } from '@/modules/users/infrastructure/persistence/repositories/user.repository';
```

## Solucion de Problemas

### Errores de Base de Datos

Si la base de datos no conecta, verifica que PostgreSQL este corriendo:

```bash
docker compose ps
```

### Errores de Migraciones

Si las migraciones fallan, intenta resetear la base de datos:

```bash
yarn seed:reset
```

### Puerto en Uso

Si el puerto 3000 esta ocupado, cambia la variable `PORT` en tu archivo `.env`.

## License

Este proyecto es UNLICENSED. Ver el archivo [LICENSE](LICENSE) para mas detalles.
