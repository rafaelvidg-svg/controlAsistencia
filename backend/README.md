# Office Attendance Backend

Backend de la aplicación de control de asistencia a oficina.

## Tecnologías

- Java 21
- Spring Boot 3.3.x
- Spring Web
- Spring Data JPA
- PostgreSQL
- Flyway
- Springdoc OpenAPI
- Apache POI
- OpenPDF

## Requisitos

- Java 21
- Maven 3.9+
- PostgreSQL 15+

## Swagger

- URL: `https://tu-backend-publico.com/swagger-ui.html`

## Variables de entorno de producción

- `SPRING_PROFILES_ACTIVE=prod`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

## Endpoints principales

- `POST /api/attendance`
- `DELETE /api/attendance/{date}`
- `GET /api/attendance?year=2026&month=9`
- `GET /api/attendance/summary?year=2026&month=9`
- `GET /api/reports/monthly?year=2026&month=9&format=xlsx`
- `GET /api/reports/monthly?year=2026&month=9&format=pdf`
