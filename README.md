# Office Attendance

Aplicación web para registrar y controlar los días que asisto presencialmente a la oficina.

## Arquitectura

- Backend: Java 21 + Spring Boot 3 + PostgreSQL
- Frontend: React + TypeScript + Vite
- Reportes: Excel y PDF
- API: Swagger/OpenAPI
- Infraestructura: Docker Compose

## Requisitos

- Java 21
- Maven
- Node.js 20+
- npm
- Docker + Docker Compose (opcional)
- PostgreSQL 16 (opcional si no se usa Docker)

## Estructura

```text
.
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml
├── .env.example
├── README.md
└── .gitignore
```

## Ejecutar backend

```bash
cd backend
mvn spring-boot:run
```

## Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

## Ejecutar con Docker

```bash
docker compose up --build
```

## Swagger

- http://localhost:8080/swagger-ui.html

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
