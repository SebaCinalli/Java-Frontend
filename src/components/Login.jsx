import { useState } from 'react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación básica
    if (email === 'cliente@gmail.com' && password === 'cliente123') {
      setError(null);
      setTimeout(() => {
        onLogin({ email, nombre: 'Lucio' });
        setLoading(false);
      }, 500);
    } else {
      setError(
        'Credenciales incorrectas. Intenta con cliente@gmail.com / cliente123',
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="stars"></div>
      <div className="login-card">
        <div className="login-header">
          <h1 className="casino-title">🎰 CASINO VIRTUAL 🎰</h1>
          <p className="casino-subtitle">Bienvenido al mejor casino online</p>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              📧 Email
            </label>
            <input
              type="email"
              className="form-control login-input"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              🔐 Contraseña
            </label>
            <input
              type="password"
              className="form-control login-input"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-lg w-100 login-btn"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : '🎯 ENTRAR AL CASINO'}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-muted">Demo: cliente@gmail.com / cliente123</p>
          <div className="games-preview">
            <span className="badge badge-game">🎡 Ruleta</span>
            <span className="badge badge-game">♠️ Blackjack</span>
          </div>
        </div>
      </div>
    </div>
  );
}
