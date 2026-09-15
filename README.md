# Office Attendance

Aplicación web para registrar y controlar los días que asisto presencialmente a la oficina.

## Arquitectura

- Backend: Java 21 + Spring Boot 3 + PostgreSQL
- Frontend: React + TypeScript + Vite
- Reportes: Excel y PDF
- API: Swagger/OpenAPI
- Publicación: Vercel para el frontend y un servicio externo para la API

## Publicación en Vercel

1. Importa este repositorio en Vercel.
2. Mantén la raíz del repositorio como Root Directory.
3. Define `VITE_API_BASE_URL` con la URL pública del backend y el sufijo `/api`.
4. Publica el proyecto. `vercel.json` configura el build de `frontend` y el routing de la SPA.

## Estructura

```text
.
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── vercel.json
├── README.md
└── .gitignore
```

## Swagger

- `https://tu-backend-publico.com/swagger-ui.html`

## Endpoints principales

- `POST /api/attendance`
- `DELETE /api/attendance/{date}`
- `GET /api/attendance?year=2026&month=9`
- `GET /api/attendance/summary?year=2026&month=9`
- `GET /api/reports/monthly?year=2026&month=9&format=xlsx`
- `GET /api/reports/monthly?year=2026&month=9&format=pdf`

## Tests

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm test
```
