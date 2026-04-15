# Arquitectura y capas del código

## Visión general

El proyecto sigue una separación **por capas** inspirada en arquitectura hexagonal / limpia, con variaciones prácticas propias de un equipo pequeño:

1. **Dominio (`src/core`)**  
   Entidades (`Event`, `Student`, `Attendance_record`, …) e **interfaces** de repositorios (`IEventRepository`, `IStudentRepository`, …). Aquí no debe haber dependencias de Express ni de TypeORM.

2. **Aplicación (`src/service`)**  
   **Casos de uso** (`CreateStudentUseCase`, `GetMetricsUseCase`, …) y servicios auxiliares como **`ExcelParserService`**. Orquestan reglas de negocio y delegan persistencia en interfaces.

3. **Infraestructura (`src/infraestructure`)**  
   - **database**: `data-source.ts`, **schemas** TypeORM (`EventSchema`, `StudentSchema`, `AttendanceRecordSchema`), **repositorios** concretos.  
   - **Routes**: definición de rutas Express y verbos HTTP.  
   - **http/controllers**: adaptadores HTTP (validación básica, mapeo `req`/`res`).  
   - **repositories/Teacher**: repositorio o stubs de docente según evolución del código.

4. **Composición**  
   - El archivo **`src/infraestructure/dependencies.ts`** instancia y exporta casos de uso y controladores para **eventos** y **estudiantes**.  
   - **Métricas** y **asistencia** instancian repositorios y controladores **directamente dentro de** `metricsRoutes.ts` y `attendanceRoutes.ts`, sin pasar por `dependencies.ts`.

## Punto de entrada

**`main.ts`** (raíz del repo):

- Carga `reflect-metadata` y variables de entorno.
- Inicializa **`AppDataSource`** (TypeORM).
- Configura **Express**, **CORS**, **`express.json()`**.
- Monta los cuatro routers bajo `/cacei/events`, `/cacei/students`, `/cacei/metrics`, `/cacei/attendance`.
- Escucha en el puerto **3002**.

## Flujo típico de una petición

1. Express recibe la petición en un **router**.
2. El **controlador** valida campos mínimos y construye DTOs o entidades.
3. En muchos flujos se invoca un **caso de uso** que llama al **repositorio** (implementación TypeORM).
4. La respuesta se serializa a JSON con códigos HTTP adecuados (`201`, `400`, `500`, etc.).

## Observaciones de diseño (referencia para evolución)

- **Eventos — creación:** existe `CreateEventUseCase` cableado en `dependencies.ts`, pero **`CreateEventController`** puede persistir usando el repositorio **sin** pasar por ese caso de uso. Conviene unificar criterio (siempre use case o siempre controlador delgado).
- **Inyección de dependencias:** no hay contenedor IoC; la composición es manual. Centralizar métricas y asistencia en `dependencies.ts` (o un módulo equivalente) reduciría duplicación y facilitaría pruebas unitarias.
- **Métricas:** `GetMetricsUseCase` importa tipos desde el repositorio en infraestructura, lo que **acopla** la capa de aplicación a una implementación concreta. A medio plazo, mover DTOs de métricas a `core` o a `service` mejora el desacoplamiento.
- **TypeScript:** `strict` está desactivado en `tsconfig.json`; activarlo de forma gradual mejoraría seguridad de tipos.