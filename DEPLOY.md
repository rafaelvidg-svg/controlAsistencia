# Despliegue en Vercel + Neon

## Vercel

1. Importa el repositorio en Vercel.
2. Conserva la raíz como Root Directory.
3. En Environment Variables añade `DATABASE_URL` para Production, Preview y Development.
4. Usa la cadena de conexión proporcionada por Neon, incluyendo `sslmode=require`.
5. Ejecuta el deploy.

`vercel.json` configura la instalación de dependencias, la compilación de Vite y el fallback de la SPA. Las rutas `/api/*` se reservan para las funciones serverless.

## Neon

1. Crea un proyecto gratuito en Neon.
2. Pulsa **Connect** y copia la cadena PostgreSQL.
3. Configúrala en Vercel como:

```env
DATABASE_URL=postgresql://usuario:password@ep-host.neon.tech/neondb?sslmode=require
```

La API crea `office_attendance` automáticamente si no existe.

## Comprobación

Después del deploy, abre:

```text
https://tu-proyecto.vercel.app/api
```

Debe responder con un JSON cuyo estado sea `ok`. Luego prueba el calendario y los reportes.
