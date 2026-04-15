# API — Eventos (`/cacei/events`)

## Descripción

Persistencia de **eventos de tutoría** (u otros eventos docentes) en la tabla **`events`**: docente asociado, nombre, fechas, categoría, ubicación, estado, organizador, etc.

## Rutas y métodos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/cacei/events` | Crear evento. |
| `GET` | `/cacei/events/teacher/:teacherId` | Listar eventos de un docente. |
| `PUT` | `/cacei/events/:id` | Actualizar evento por id numérico. |
| `DELETE` | `/cacei/events/:id/cancel` | Cancelar evento (convención REST con verbo DELETE en ruta semántica `cancel`). |

## Creación — `POST /cacei/events`

Validación mínima en **`CreateEventController`**: deben existir **`name`** y **`date`**.

Campos habituales del cuerpo (JSON):

| Campo | Notas |
|-------|--------|
| `name` | Obligatorio. |
| `date` | Obligatorio; se parsea con `new Date(body.date)`. |
| `description` | Opcional; por defecto cadena vacía. |
| `category` | Opcional; por defecto `"general"`. |
| `location` | Opcional. |
| `start_time`, `end_time` | Opcionales; si faltan se usan fechas por defecto en el controlador. |
| `teacher_id` | Opcional; si no viene, se usa **`1`** por defecto (conviene reemplazar por sesión real en producción). |
| Organizador | Se aceptan alias: `organizer`, `eventOrganizer`, `tutor`, `responsable`. |

El estado inicial del evento en creación puede fijarse como **`pending`** según la entidad construida en el controlador (revisar `Event` en `core` y el mapeo en repositorio).

Respuesta típica: **`201`** con `success`, `id` y `data`.

## Listado por docente — `GET /cacei/events/teacher/:teacherId`

`:teacherId` debe ser el identificador numérico del docente. La implementación concreta depende de **`GetTeacherEventsController`** y del repositorio de eventos.

## Actualización — `PUT /cacei/events/:id`

Cuerpo JSON con campos a actualizar según **`UpdateEventUseCase`** / controlador asociado.

## Cancelación — `DELETE /cacei/events/:id/cancel`

Operación de negocio “cancelar” sin borrar físicamente el registro (comportamiento exacto en base de datos: revisar **`CancelEventUseCase`** y `EventRepository`).

## Archivos de código relevantes

```text
src/infraestructure/Routes/eventRoutes.ts
src/infraestructure/http/controllers/events/*.ts
src/infraestructure/database/repositories/EventRepository.ts
src/infraestructure/database/schemas/EventSchema.ts
src/service/use-cases/Events/*.ts
src/core/entities/Event.ts
```

Los controladores y casos de uso de eventos se componen en **`dependencies.ts`**.
