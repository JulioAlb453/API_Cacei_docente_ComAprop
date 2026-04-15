# Documentación técnica — API CACEI Docente

Índice de las guías de este directorio. Cada archivo profundiza en un **recurso HTTP** o en **aspectos transversales** (arquitectura, configuración) del proyecto **API_Cacei_docente_ComAprop**.

## Documentos

| Archivo | Descripción |
|---------|-------------|
| [README-arquitectura-capas.md](./README-arquitectura-capas.md) | Organización en capas, repositorios, controladores y casos de uso. |
| [README-configuracion-entorno.md](./README-configuracion-entorno.md) | `.env`, MySQL, puerto **3002**, CORS y modo `synchronize`. |
| [README-api-estudiantes.md](./README-api-estudiantes.md) | Endpoints bajo `/cacei/students`. |
| [README-api-eventos.md](./README-api-eventos.md) | Endpoints bajo `/cacei/events`. |
| [README-api-asistencia.md](./README-api-asistencia.md) | Endpoints bajo `/cacei/attendance` (incluye seed de desarrollo). |
| [README-api-metricas.md](./README-api-metricas.md) | Endpoints bajo `/cacei/metrics` y query params. |

## Arranque rápido

Desde la raíz del repositorio:

```bash
npm install
npm run dev
```

Servidor por defecto: **`http://localhost:3002`**. Prefijo de recursos CACEI: **`/cacei`**.

