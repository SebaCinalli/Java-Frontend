import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/usercontext';
import '../styles/App.css';

export default function MenuMain() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="menu-background"></div>
      <div className="menu-content">
        <div className="menu-header">
          <h1>CASINO VIRTUAL</h1>
          <p>Bienvenido, {user?.nombre}</p>
          <div className="menu-balance">
            <span>Saldo: ${Number(user?.saldo ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="games-grid">
          <div className="game-card roulette-card" onClick={() => navigate('/roulette')}>
            <div className="game-icon">Ruleta</div>
            <h2>RULETA EUROPEA</h2>
            <p>Apuesta a numeros y colores</p>
            <div className="game-stats">
              <span>RTP: 97.3%</span>
            </div>
            <button className="play-btn">JUGAR AHORA</button>
          </div>

          <div className="game-card blackjack-card" onClick={() => navigate('/blackjack')}>
            <div className="game-icon">Blackjack</div>
            <h2>BLACKJACK</h2>
            <p>Supera al dealer sin pasarte de 21</p>
            <div className="game-stats">
              <span>RTP: 99.5%</span>
            </div>
            <button className="play-btn">JUGAR AHORA</button>
          </div>
        </div>

        <button className="btn btn-danger btn-lg logout-btn" onClick={logout}>
          CERRAR SESION
        </button>
      </div>
    </div>
  );
}
