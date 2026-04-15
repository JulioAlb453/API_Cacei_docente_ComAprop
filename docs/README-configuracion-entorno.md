# Configuración y entorno de ejecución

## Variables de entorno

TypeORM lee la configuración desde **`process.env`** (carga con `dotenv` en `data-source.ts` y en `main.ts`). Variables esperadas:

| Variable | Uso |
|----------|-----|
| `DB_HOST` | Host del servidor MySQL. |
| `DB_PORT` | Puerto numérico (por defecto **3306** si se omite o no es válido). |
| `DB_USER` | Usuario de la base de datos. |
| `DB_PASSWORD` | Contraseña. |
| `DB_NAME` | Nombre de la base de datos. |

Crea un archivo **`.env`** en la raíz del repositorio (no lo subas a control de versiones si contiene secretos; mantén `.gitignore` actualizado).

Ejemplo **ilustrativo** (sustituye valores reales):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=cacei_docente
```

## Puerto del servidor HTTP

Definido en **`main.ts`**: **`3002`**.

La URL base para el cliente es:

```text
http://localhost:3002
```

Los recursos CACEI cuelgan de **`/cacei/...`** (por ejemplo `http://localhost:3002/cacei/students`).

## CORS

En `main.ts` se permite el origen:

- `http://localhost:5173` (típico de **Vite** en el frontend `cacei`).
- `http://localhost:3000` (alternativo).

Métodos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`. Cabeceras permitidas: `Content-Type`, `Authorization`.

Si cambias el puerto del frontend o usas un proxy, actualiza el array `origin` en CORS.

## TypeORM y esquema de base de datos

En **`src/infraestructure/database/data-source.ts`**:

- Motor: **MySQL** (`type: "mysql"`).
- **Entidades** registradas: `EventSchema`, `StudentSchema`, `AttendanceRecordSchema`.
- **`synchronize: true`**: TypeORM intentará **ajustar el esquema** de la base al modelo en tiempo de arranque.

### Advertencia sobre `synchronize: true`

Es cómodo en **desarrollo**, pero en **producción** puede provocar pérdida de datos o migraciones imprevistas. Se recomienda:

- Usar **`synchronize: false`** en entornos estables.
- Gestionar cambios con **migraciones** oficiales de TypeORM.

## Logs

`logging: false` en el `DataSource`. Los controladores usan `console.log` / `console.error` para trazas básicas.

## Compilación y producción

```bash
npm run build   # genera salida en dist/
npm start       # ejecuta dist/main.js
```
