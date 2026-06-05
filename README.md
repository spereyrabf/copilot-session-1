# Backend + Frontend (React) con autenticación JWT

Este repositorio contiene:

- `backend/`: API en FastAPI con login JWT.
- `frontend/`: aplicación React con:
  - pantalla de login conectada al backend (`POST /token`)
  - pantalla de bienvenida protegida
  - almacenamiento del token en sesión (`sessionStorage`)

## Estructura

- `backend/app/main.py`
- `frontend/src/App.jsx`
- `DESIGN.md`

## Requisitos

- Python 3.11+
- Poetry
- Node.js 18+ y npm

## 1) Levantar backend

```bash
cd backend
poetry install
export JWT_SECRET_KEY="cambia-esta-clave"
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Credenciales de prueba del backend:

- usuario: `admin`
- contraseña: `admin123`

## 2) Levantar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend usa por defecto `http://localhost:8000` como API.
Si necesitas otro endpoint, define:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Flujo de uso

1. Abrir la app frontend (por defecto en `http://localhost:5173`).
2. Iniciar sesión con las credenciales del backend.
3. Al autenticarse, se guarda `access_token` en `sessionStorage`.
4. La ruta de bienvenida (`/welcome`) sólo es accesible con sesión activa.
5. Al cerrar sesión, se elimina el token y se regresa a `/login`.

## Diseño

El frontend aplica el estándar visual definido en:

- `DESIGN.md`

Se usan colores, tipografía y componentes base (tarjeta/superficie y botón primario) alineados con ese documento.
