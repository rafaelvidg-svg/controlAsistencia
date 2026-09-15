# Despliegue en Vercel

## Frontend en Vercel

1. Importa este repositorio en Vercel.
2. Mantén la raíz del repositorio como Root Directory.
3. Vercel usará `vercel.json` para instalar y compilar `frontend`.
4. En Project Settings > Environment Variables, añade:
   - `VITE_API_BASE_URL` = `https://tu-backend-deployado.com/api`
5. Ejecuta el deploy.

El resultado publicado será `frontend/dist` y las rutas de la SPA funcionarán mediante la regla de reescritura incluida.

## Backend en un servicio externo

Vercel no ejecuta este backend Java/Spring Boot como una función. Despliégalo en Render, Railway, Fly.io o Azure App Service.

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

1. Abre la URL de Vercel.
2. Comprueba que el calendario carga sin errores.
3. Haz una operación de registro o eliminación.
4. Verifica que la API responda con `200` desde tu backend externo.
