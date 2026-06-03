# Backend FastAPI con JWT

Este repositorio incluye una aplicación Web API en Python/FastAPI dentro de la carpeta `backend`.

## Características

- Endpoint `POST /token` para autenticación con:
  - `username`: `admin`
  - `password`: `admin123`
- Retorna `access_token` con expiración de **300 segundos**.
- Retorna también `refresh_token` para solicitar nuevos access tokens.
- Endpoint `POST /refresh` para refrescar el token de acceso.
- Hashing de contraseña con `passlib[bcrypt]`.
- Dependencia `bcrypt` fijada a `>=3.2,<4.0`.
- Gestión de dependencias con **Poetry** y `package-mode = false`.

## Estructura

- `backend/app/main.py`: aplicación FastAPI.
- `backend/pyproject.toml`: configuración de Poetry y dependencias.
- `backend/Dockerfile`: imagen de la aplicación.
- `backend/docker-compose.yml`: despliegue con Docker Compose.

## Ejecución local

```bash
cd backend
poetry install
export JWT_SECRET_KEY="cambia-esta-clave"
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Uso de la API

### 1) Obtener token

```bash
curl -X POST http://localhost:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Respuesta esperada (ejemplo):

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### 2) Refrescar access token

```bash
curl -X POST http://localhost:8000/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<jwt_refresh>"}'
```

Respuesta esperada (ejemplo):

```json
{
  "access_token": "<jwt>",
  "refresh_token": null,
  "token_type": "bearer",
  "expires_in": 300
}
```

## Ejecución con Docker

```bash
cd backend
docker compose up --build
```

API disponible en: `http://localhost:8000`
