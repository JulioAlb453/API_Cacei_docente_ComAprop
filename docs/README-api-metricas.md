# API — Métricas (`/cacei/metrics`)

## Descripción

Agregaciones sobre **registros de asistencia** (y datos relacionados en el repositorio) para alimentar **dashboards**: resumen numérico, distribución por estado, series por **grado** (cuatrimestre), por **grupo** y **serie mensual**.

La lógica principal vive en **`GetMetricsUseCase`**, que paraleliza consultas con **`Promise.all`**. El **`GetMetricsController`** parsea filtros desde la **query string** y delega en métodos del caso de uso según el endpoint.

## Rutas

| Método | Ruta | Respuesta orientada a |
|--------|------|------------------------|
| `GET` | `/cacei/metrics` | Paquete completo (`summary`, `distribution`, `byGrade`, `byGroup`, `monthly`). |
| `GET` | `/cacei/metrics/summary` | Tarjetas KPI del dashboard. |
| `GET` | `/cacei/metrics/distribution` | Gráfica tipo pastel (present / absent / justified / late). |
| `GET` | `/cacei/metrics/by-grade` | Barras por grado. |
| `GET` | `/cacei/metrics/by-group` | Métricas por grupo. |
| `GET` | `/cacei/metrics/monthly` | Línea o serie por mes; año configurable. |

Formato típico de éxito:

```json
{ "success": true, "data": { ... } }
```

En **`GET /cacei/metrics`**, el controlador puede incluir también el objeto **`filters`** aplicado en la respuesta.

## Filtros (query parameters)

Parseados en **`GetMetricsController.parseFilters`**:

| Parámetro | Tipo / uso | Notas |
|-----------|------------|--------|
| `grade` | Número | Si vale `"all"` o no se envía, no se filtra por grado. |
| `group` | Cadena | Si vale `"all"` o no se envía, no se filtra por grupo. |
| `startDate` | ISO date | Inicio de ventana temporal. |
| `endDate` | ISO date | Fin de ventana temporal. |
| `year` | Número | Usado en endpoint **monthly** (si no se envía, el controlador puede usar el año actual en la respuesta meta). |

Ejemplo:

```http
GET /cacei/metrics/summary?grade=5&group=A&startDate=2025-01-01&endDate=2025-06-30
```

Los nombres exactos de las propiedades dentro de `data` dependen de los métodos del **`AttendanceRecordRepository`** (`getGlobalMetrics`, `getAttendanceDistribution`, etc.).

## Archivos de código relevantes

```text
src/infraestructure/Routes/metricsRoutes.ts
src/infraestructure/http/controllers/metrics/GetMetricsController.ts
src/service/use-cases/Metrics/GetMetricsUseCase.ts
src/infraestructure/database/repositories/AttendanceRecordRepository.ts
```

Instanciación: **router** crea repositorio, caso de uso y controlador (mismo patrón que asistencia).