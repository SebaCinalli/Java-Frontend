import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { useUser } from '../context/usercontext';

const API_BASE_URL = 'http://localhost:8080/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await axios.post(
        `${API_BASE_URL}/usuarios/login`,
        { email, password },
        { withCredentials: true }
      );
      const user = resp.data?.user ?? resp.data;
      if (!user) throw new Error('Respuesta inválida del servidor');
      login(user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Credenciales incorrectas');
    } finally {
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
          <p className="text-muted">Autenticación contra backend</p>
          <div className="games-preview">
            <span className="badge badge-game">🎡 Ruleta</span>
            <span className="badge badge-game">♠️ Blackjack</span>
          </div>
        </div>
      </div>
    </div>
  );
}
