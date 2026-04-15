# API CACEI — módulo Docente (ComAprop)

## Descripción general

API REST desarrollada con **Node.js**, **TypeScript**, **Express** y **TypeORM**, orientada al **módulo docente** del ecosistema CACEI: **eventos de tutoría**, **estudiantes** (alta individual y masiva vía Excel), **asistencia** y **métricas** agregadas para dashboards. Expone todos los recursos bajo el prefijo **`/cacei`** y escucha por defecto en el puerto **3002**, alineado con el frontend Vite del proyecto `cacei`.

## Características principales

- **Eventos**: creación, listado por docente, actualización y cancelación lógica.
- **Estudiantes**: CRUD básico, carga masiva con **Multer** + parseo **xlsx**, descarga de **plantilla Excel**.
- **Asistencia**: registro individual y en lote, actualización de estado, consulta por evento; rutas de **seed** para desarrollo.
- **Métricas**: resumen, distribución, series por grado, por grupo y mensual, con **filtros por query string**.
- **Persistencia**: **MySQL** mediante TypeORM; entidades mapeadas a tablas `events`, `students`, `attendance_records` (y tablas auxiliares que use el repositorio de asistencia).

## Estructura del proyecto

| Ruta | Rol |
|------|-----|
| `main.ts` | Arranque: `AppDataSource`, Express, CORS, montaje de routers. |
| `src/core` | Entidades de dominio e **interfaces** de repositorios (`IEventRepository`, `IStudentRepository`, etc.). |
| `src/service/use-cases` | Casos de uso (eventos, estudiantes, métricas). |
| `src/service/parsers` | Servicios transversos (por ejemplo **ExcelParserService**). |
| `src/infraestructure` | Implementación concreta: **schemas** TypeORM, **repositories**, **Routes**, **http/controllers**. |
| `docs/` | Documentación **por módulo** de la API (endpoints, payloads, base de datos y arquitectura). |

> **Nota:** el directorio se escribe `infraestructure` en el código existente (convención heredada del repo).

## Requisitos

- **Node.js** compatible con las versiones declaradas en `package.json`.
- **MySQL** accesible con usuario, contraseña y base de datos configurados por variables de entorno.
- Para desarrollo con el frontend CACEI: origen permitido en CORS (**5173** o **3000**).

## Scripts

```bash
npm run dev    # ts-node-dev: desarrollo con recarga
npm run build  # compilación TypeScript → dist/
npm start      # node dist/main.js (tras build)
```

## Documentación detallada (`docs/`)

La documentación técnica está **fragmentada por área** para facilitar mantenimiento y onboarding. Consulta el índice en **[`docs/README.md`](./docs/README.md)** y, según necesites:

| Documento | Contenido |
|-----------|-----------|
| [`docs/README-arquitectura-capas.md`](./docs/README-arquitectura-capas.md) | Capas del código, wiring de dependencias y observaciones de diseño. |
| [`docs/README-configuracion-entorno.md`](./docs/README-configuracion-entorno.md) | Variables de entorno, puerto, CORS y advertencias de TypeORM (`synchronize`). |
| [`docs/README-api-estudiantes.md`](./docs/README-api-estudiantes.md) | Rutas `/cacei/students`, Excel, plantilla y validaciones. |
| [`docs/README-api-eventos.md`](./docs/README-api-eventos.md) | Rutas `/cacei/events` y cuerpos de solicitud típicos. |
| [`docs/README-api-asistencia.md`](./docs/README-api-asistencia.md) | Rutas `/cacei/attendance`, estados en inglés, bulk y seed. |
| [`docs/README-api-metricas.md`](./docs/README-api-metricas.md) | Rutas `/cacei/metrics` y parámetros de filtro. |
