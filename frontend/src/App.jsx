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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

const MS_CERTIFICATIONS = [
  {
    code: 'AI-901',
    name: 'Microsoft Azure AI Fundamentals',
    level: 'Fundamentals',
    description:
      'Nueva certificación 2026 que valida conocimientos conceptuales de soluciones de IA en Azure y habilidades prácticas con Microsoft Foundry.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
    badge: '🤖',
    isNew: true,
  },
  {
    code: 'SC-500',
    name: 'Cloud and AI Security Engineer Associate',
    level: 'Associate',
    description:
      'Nueva certificación 2026 que reemplaza a AZ-500. Valida la capacidad de diseñar e implementar entornos seguros en la nube con protección de modelos de IA.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-500',
    badge: '🔐',
    isNew: true,
  },
  {
    code: 'AZ-104',
    name: 'Microsoft Azure Administrator',
    level: 'Associate',
    description:
      'Certifica habilidades para implementar, administrar y monitorear la infraestructura de Azure, incluyendo identidad, gobernanza, almacenamiento y redes.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
    badge: '⚙️',
    isNew: false,
  },
  {
    code: 'DP-600',
    name: 'Microsoft Fabric Analytics Engineer Associate',
    level: 'Associate',
    description:
      'Valida competencias en el diseño e implementación de soluciones de análisis de datos empresariales con Microsoft Fabric.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-analytics-engineer-associate/',
    badge: '📊',
    isNew: false,
  },
  {
    code: 'PL-900',
    name: 'Microsoft Power Platform Fundamentals',
    level: 'Fundamentals',
    description:
      'Demuestra comprensión de las capacidades clave de Power Platform, incluyendo Power BI, Power Apps, Power Automate y Power Virtual Agents.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/power-platform-fundamentals/',
    badge: '⚡',
    isNew: false,
  },
  {
    code: 'MS-900',
    name: 'Microsoft 365 Fundamentals',
    level: 'Fundamentals',
    description:
      'Certifica conocimientos sobre los servicios de productividad y colaboración en la nube de Microsoft 365, incluyendo Teams y Copilot.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/microsoft-365-fundamentals/',
    badge: '💼',
    isNew: false,
  },
]

function CertificationCard({ cert }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className="cert-card"
    >
      <div className="cert-card-header">
        <span className="cert-badge">{cert.badge}</span>
        {cert.isNew ? <span className="cert-new-tag">Nuevo 2026</span> : null}
      </div>
      <span className="cert-code">{cert.code}</span>
      <h3 className="cert-name">{cert.name}</h3>
      <span className="cert-level">{cert.level}</span>
      <p className="cert-description">{cert.description}</p>
    </a>
  )
}

function WelcomePage({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="page welcome-page">
      <section className="card welcome-card">
        <h1>Bienvenido</h1>
        <p className="subtitle">Tu sesión está activa.</p>
        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>

      <section className="certs-section">
        <h2 className="certs-title">Certificaciones Microsoft 2026</h2>
        <p className="certs-subtitle">
          Últimas certificaciones destacadas de Microsoft para potenciar tu carrera.
        </p>
        <div className="certs-grid">
          {MS_CERTIFICATIONS.map((cert) => (
            <CertificationCard key={cert.code} cert={cert} />
          ))}
        </div>
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
