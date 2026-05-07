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

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
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
            <h1>CASINO VIRTUAL</h1>
            <p>Bienvenido, {user.nombre}</p>
            <div className="menu-balance">
              <span>Saldo: ${Number(user.saldo ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="games-grid">
            <div
              className="game-card roulette-card"
              onClick={() => setCurrentGame('roulette')}
            >
              <div className="game-icon">Ruleta</div>
              <h2>RULETA EUROPEA</h2>
              <p>Apuesta a numeros y colores</p>
              <div className="game-stats">
                <span>RTP: 97.3%</span>
              </div>
              <button className="play-btn">JUGAR AHORA</button>
            </div>

            <div
              className="game-card blackjack-card"
              onClick={() => setCurrentGame('blackjack')}
            >
              <div className="game-icon">Blackjack</div>
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
            CERRAR SESION
          </button>
        </div>
      </div>
    );
  }

  if (currentGame === 'roulette') {
    return (
      <Roulette
        user={user}
        onUserUpdate={handleUserUpdate}
        onLogout={() => setCurrentGame('menu')}
      />
    );
  }

  if (currentGame === 'blackjack') {
    return (
      <Blackjack
        user={user}
        onUserUpdate={handleUserUpdate}
        onLogout={() => setCurrentGame('menu')}
      />
    );
  }

  return null;
}

export default App;
