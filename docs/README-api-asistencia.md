# API — Asistencia (`/cacei/attendance`)

## Descripción

Registro de **asistencia** de estudiantes a **eventos**. Los datos persisten en la tabla **`attendance_records`** (definición vía **`AttendanceRecordSchema`** / entidad `Attendance_record`).

### Estados en base de datos

El campo **`status`** es un **enum** SQL mapeado a cuatro valores en **inglés** (deben coincidir con el frontend al enviar/recibir):

| Valor API | Interpretación |
|-----------|----------------|
| `present` | Asistió (presente). |
| `absent` | Ausente (por defecto si no se envía otro). |
| `justified` | Justificado. |
| `late` | Tardío. |

El frontend puede mostrar etiquetas en español, pero el contrato HTTP usa estas cadenas.

## Rutas operativas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/cacei/attendance` | Crear un registro de asistencia. |
| `POST` | `/cacei/attendance/bulk` | Crear muchos registros en una sola petición. |
| `PUT` | `/cacei/attendance/:studentId/:eventId` | Actualizar solo el **status** (y lógica asociada en repositorio). |
| `GET` | `/cacei/attendance/event/:eventId` | Listar participantes / registros del evento. |

## `POST /cacei/attendance` (individual)

Cuerpo JSON mínimo:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `student_id` | Sí | Identificador del estudiante. |
| `event_id` | Sí | Identificador del evento. |
| `register_by` | Sí | Quién registra (cadena: usuario, email o id según convención del cliente). |
| `status` | No | Por defecto `absent`. |
| `observations` | No | Texto libre. |

Antes de crear, el repositorio invoca **`upsertParticipants`** para asegurar la relación estudiante–evento en la tabla de participantes (si aplica el modelo implementado).

## `POST /cacei/attendance/bulk`

Cuerpo JSON:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `event_id` | Sí | Evento común a todos los registros. |
| `register_by` | Sí | Responsable del registro. |
| `records` | Sí | Arreglo de objetos con al menos `student_id`; cada elemento puede traer `status`, `observations`. |

El controlador mapea cada elemento a un registro con `date: new Date()` y llama a **`bulkCreate`** en el repositorio tras **`upsertParticipants`** con todos los `student_id`.

## `PUT /cacei/attendance/:studentId/:eventId`

Cuerpo JSON:

```json
{ "status": "present" }
```

Si `status` no es uno de los cuatro valores permitidos, respuesta **`400`**.

## `GET /cacei/attendance/event/:eventId`

Devuelve colección de registros (implementación: **`findParticipantsWithAttendance`** en el repositorio). Estructura exacta del JSON en la propiedad `data` de la respuesta.

## Rutas de desarrollo — seed

Definidas en **`attendanceRoutes.ts`**:

| Método | Ruta | Uso |
|--------|------|-----|
| `POST` | `/cacei/attendance/seed` | Poblar datos de prueba. |
| `DELETE` | `/cacei/attendance/seed` | Limpiar datos de prueba. |

**No** uses seed en producción ni mezcles con datos reales sin control.

## Archivos de código relevantes

```text
src/infraestructure/Routes/attendanceRoutes.ts
src/infraestructure/http/controllers/attendance/CreateAttendanceController.ts
src/infraestructure/http/controllers/attendance/SeedAttendanceController.ts
src/infraestructure/database/repositories/AttendanceRecordRepository.ts
src/infraestructure/database/schemas/AttendanceRecordSchema.ts
src/core/entities/Attendance_record.ts
```

Las dependencias de este módulo se instancian **en el archivo de rutas**, no en `dependencies.ts`.
