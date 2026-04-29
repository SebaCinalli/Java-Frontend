import { useState } from 'react';
import Login from './components/Login';
import Roulette from './components/Roulette';
import Blackjack from './components/Blackjack';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentGame('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentGame(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentGame === 'menu') {
    return (
      <div className="menu-container">
        <div className="menu-background"></div>
        <div className="menu-content">
          <div className="menu-header">
            <h1>🎰 CASINO VIRTUAL 🎰</h1>
            <p>Bienvenido, {user.nombre}</p>
            <div className="menu-balance">
              <span>Saldo: $1000.00</span>
            </div>
          </div>

          <div className="games-grid">
            <div
              className="game-card roulette-card"
              onClick={() => setCurrentGame('roulette')}
            >
              <div className="game-icon">🎡</div>
              <h2>RULETA EUROPEA</h2>
              <p>Apuesta a números y colores</p>
              <div className="game-stats">
                <span>RTP: 97.3%</span>
              </div>
              <button className="play-btn">JUGAR AHORA</button>
            </div>

            <div
              className="game-card blackjack-card"
              onClick={() => setCurrentGame('blackjack')}
            >
              <div className="game-icon">♠️</div>
              <h2>BLACKJACK</h2>
              <p>Supera al dealer sin pasarte de 21</p>
              <div className="game-stats">
                <span>RTP: 99.5%</span>
              </div>
              <button className="play-btn">JUGAR AHORA</button>
            </div>
          </div>

          <button
            className="btn btn-danger btn-lg logout-btn"
            onClick={handleLogout}
          >
            🚪 CERRAR SESIÓN
          </button>
        </div>
      </div>
    );
  }

  if (currentGame === 'roulette') {
    return <Roulette user={user} onLogout={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'blackjack') {
    return <Blackjack user={user} onLogout={() => setCurrentGame('menu')} />;
  }
}

export default App;
