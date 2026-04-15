# API — Estudiantes (`/cacei/students`)

## Descripción

Gestión de la tabla **`students`**: alta individual, listado, detalle, actualización, carga masiva desde **Excel** y descarga de **plantilla** generada en servidor.

El esquema TypeORM (`StudentSchema`) incluye, entre otros: `name`, `email` (único), `password` (hash), `tuition`, `grade`, `group`, `status`, marcas de tiempo.

## Rutas y métodos

| Método | Ruta completa (host + puerto local) | Descripción |
|--------|--------------------------------------|-------------|
| `POST` | `/cacei/students` | Crear estudiante individual. |
| `POST` | `/cacei/students/bulk` | Carga masiva; cuerpo **multipart** con campo de archivo **`file`**. |
| `GET` | `/cacei/students/template` | Descarga binaria **Excel** (`plantilla_estudiantes.xlsx`). |
| `GET` | `/cacei/students` | Listar todos los estudiantes. |
| `GET` | `/cacei/students/:id` | Obtener por id. |
| `PUT` | `/cacei/students/:id` | Actualizar datos. |

**Orden de registro en Express:** las rutas estáticas `/bulk` y `/template` están declaradas **antes** de `/:id` para que no se interprete `bulk` como identificador.

## Alta individual — `POST /cacei/students`

### Cuerpo JSON esperado

Campos validados en **`CreateStudentController`**:

| Campo | Obligatorio | Notas |
|-------|---------------|--------|
| `name` | Sí | Nombre del estudiante. |
| `tuition` | Sí | Matrícula numérica (se acepta `0`). |
| `grade` | Sí | Grado / cuatrimestre numérico. |
| `group` | Sí | Cadena (ej. `A`, `B`). |
| `email` | No | Si se omite, se genera `"{tuition}@estudiante.edu.mx"`. |
| `password` | No | Si se omite, el caso de uso usa **`tuition` en texto** como material para hash (ver `CreateStudentUseCase`). |

Respuesta típica: **`201`** con el objeto estudiante creado; **`400`** si faltan campos o hay error de negocio (por ejemplo email duplicado).

### Contraseña y seguridad

`CreateStudentUseCase` aplica **bcrypt** (coste 10) sobre la contraseña en claro o derivada. Para entornos reales valora políticas de contraseña y no depender solo de la matrícula.

## Carga masiva — `POST /cacei/students/bulk`

- **Content-Type:** `multipart/form-data`.
- **Nombre del campo de archivo:** **`file`** (configuración Multer en `studentRoutes.ts`).
- Tamaño máximo configurado: **5 MB** (ajustable en el mismo archivo).
- Tipos MIME permitidos: `.xlsx` y `.xls` ( MIME oficiales de Office).

### Formato del Excel

El servicio **`ExcelParserService`** lee la **primera hoja** y espera encabezados mapeables a (sinónimos entre paréntesis):

- **nombre** (`name`, `Nombre`, …)
- **correo / email**
- **matrícula / tuition**
- **grado / grade** (opcional en archivo; filas pueden fallar validación interna)
- **grupo / group** (opcional)

Errores por fila se acumulan en `parseResult.errors`. La respuesta **`201`** incluye resumen (`successful`, `failed`), lista de creados y arrays `errors` / `parseWarnings` según el resultado del caso de uso.

## Plantilla — `GET /cacei/students/template`

Devuelve un **buffer Excel** con cabeceras alineadas al parser. Cabeceras HTTP:

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename=plantilla_estudiantes.xlsx`

## Archivos de código relevantes

```text
src/infraestructure/Routes/studentRoutes.ts
src/infraestructure/http/controllers/students/*.ts
src/infraestructure/database/repositories/StudentRepository.ts
src/infraestructure/database/schemas/StudentSchema.ts
src/service/use-cases/Student/*.ts
src/service/parsers/ExcelParserService.ts
```

La composición de controladores de estudiantes se exporta desde **`dependencies.ts`**.
