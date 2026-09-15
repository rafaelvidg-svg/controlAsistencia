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

## Configuración

1. Crear una base de datos llamada `office_attendance`.
2. Ajustar credenciales en `src/main/resources/application.yml`.
3. Ejecutar con perfil `dev` o `prod`.

## Ejecutar

```bash
mvn spring-boot:run
```

## Swagger

- URL: `http://localhost:8080/swagger-ui.html`

## Endpoints principales

- `POST /api/attendance`
- `DELETE /api/attendance/{date}`
- `GET /api/attendance?year=2026&month=9`
- `GET /api/attendance/summary?year=2026&month=9`
- `GET /api/reports/monthly?year=2026&month=9&format=xlsx`
- `GET /api/reports/monthly?year=2026&month=9&format=pdf`

## Tests

```bash
mvn test
```
