# Office Attendance Frontend

Frontend de la aplicación de control de asistencia a oficina.

## Tecnologías

- React
- TypeScript
- Vite
- date-fns
- Vitest
- Testing Library

## Requisitos

- Node.js 20+
- npm

## Despliegue en Vercel

Configura el proyecto de Vercel usando la raíz del repositorio. El archivo `vercel.json` ya define la instalación, compilación, carpeta de salida y el enrutamiento de la SPA.

En Vercel, añade esta variable de entorno para Production, Preview y Development:

```env
VITE_API_BASE_URL=https://tu-backend-publico.com/api
```

La API debe estar desplegada en un servicio externo compatible con Spring Boot.

## Tests

```bash
npm test
```
