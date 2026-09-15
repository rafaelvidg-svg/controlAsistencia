# Office Attendance

Aplicación web para registrar y controlar los días de asistencia a la oficina.

## Arquitectura

- Frontend: React + TypeScript + Vite
- API: funciones serverless de Vercel
- Base de datos: PostgreSQL en Neon
- Reportes: Excel y PDF

Java, Spring Boot, Maven, Docker y Render ya no son necesarios.

## Publicación en Vercel

1. Importa este repositorio en Vercel con la raíz como Root Directory.
2. Vercel instalará las dependencias de la API y del frontend usando `vercel.json`.
3. En Project Settings > Environment Variables añade para todos los entornos:

```env
DATABASE_URL=postgresql://usuario:password@host.neon.tech/neondb?sslmode=require
```

4. Publica el proyecto.

El frontend y la API se sirven desde el mismo dominio. No hace falta configurar `VITE_API_BASE_URL`; por defecto el frontend usa `/api`.

## Base de datos Neon

La API crea automáticamente la tabla `office_attendance` y su índice en el primer request.

## Endpoints

- `GET /api/attendance?year=2026&month=9`
- `GET /api/attendance/summary?year=2026&month=9`
- `POST /api/attendance` con `{ "date": "2026-09-10" }`
- `DELETE /api/attendance/2026-09-10`
- `GET /api/reports/monthly?year=2026&month=9&format=xlsx`
- `GET /api/reports/monthly?year=2026&month=9&format=pdf`

## Desarrollo

```bash
npm install
npm install --prefix frontend
npm run build
npm test --prefix frontend
```
