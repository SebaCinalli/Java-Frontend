import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Acá iría la llamada al Servlet de Java usando fetch()
    // Por ahora, le metemos una validación trucha para probar
    if (email === 'cliente@gmail.com' && password === 'cliente123') {
      setError(null)
      alert("¡Login exitoso! Bienvenido al Casino, Luu.")
    } else {
      setError("Credenciales incorrectas, rey.")
    }
  }

  return (
      <div className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div className="card p-4 shadow-lg text-white bg-secondary" style={{ width: '25rem' }}>
          <h3 className="text-center mb-4">🎰 Casino Virtual</h3>

          {/* Mensaje de error si le pifia */}
          {error && (
              <div className="alert alert-danger text-center">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button type="submit" className="btn btn-warning w-100 fw-bold">Entrar a Timbar</button>
          </form>
        </div>
      </div>
  )
}

export default App