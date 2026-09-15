# Despliegue en Netlify + backend externo

## 1) Frontend en Netlify

1. Conecta este repositorio a Netlify.
2. Configura el sitio con estos valores:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. En Netlify > Site settings > Environment variables, añade:
   - `VITE_API_BASE_URL` = `https://tu-backend-deployado.com/api`
4. Haz el deploy.

> El proyecto ya incluye [netlify.toml](netlify.toml) para build y SPA routing.

## 2) Backend en un servicio externo

Netlify no puede ejecutar el backend Java. Debes desplegarlo en un servicio como Render, Railway, Fly.io o Azure App Service.

### Variables de entorno recomendadas

- `SPRING_PROFILES_ACTIVE=prod`
- `DB_HOST=tu-host-postgres`
- `DB_PORT=5432`
- `DB_NAME=office_attendance`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=tu-password`

### Requisitos del backend

- Java 21
- PostgreSQL 16
- Ejecutar `mvn clean package`
- Iniciar `java -jar target/office-attendance-0.0.1-SNAPSHOT.jar`

### URL pública esperada

- API: `https://tu-backend-deployado.com/api`

## 3) Endpoints esperados

- `GET /api/attendance?year=2026&month=9`
- `POST /api/attendance`
- `DELETE /api/attendance/{date}`
- `GET /api/reports/monthly?year=2026&month=9&format=xlsx`
- `GET /api/reports/monthly?year=2026&month=9&format=pdf`

## 4) Verificación final

1. Abre la URL de Netlify.
2. Comprueba que el calendario carga sin errores.
3. Haz una operación de registro o eliminación.
4. Verifica que la API responda con `200` desde tu backend externo.
