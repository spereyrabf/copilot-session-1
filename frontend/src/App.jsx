import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const SESSION_TOKEN_KEY = 'access_token'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function LoginPage({ onLogin, isAuthenticated }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail ?? 'No se pudo iniciar sesión.')
      }

      const data = await response.json()
      onLogin(data.access_token)
      navigate('/welcome', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Accede con las credenciales del backend.</p>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

function WelcomePage({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Bienvenido</h1>
        <p className="subtitle">Tu sesión está activa.</p>
        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [token, setToken] = useState(
    () => window.sessionStorage.getItem(SESSION_TOKEN_KEY) ?? '',
  )

  const handleLogin = (accessToken) => {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, accessToken)
    setToken(accessToken)
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
    setToken('')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} isAuthenticated={Boolean(token)} />}
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute isAuthenticated={Boolean(token)}>
              <WelcomePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? '/welcome' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
