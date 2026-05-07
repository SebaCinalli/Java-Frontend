import { useEffect, useMemo, useState } from 'react';
import '../styles/Blackjack.css';
import { getJuegos, getMesasByJuego, getUserById, playBlackjack } from '../api/backend';

export default function Blackjack({ user, onUserUpdate, onLogout }) {
  const [gameState, setGameState] = useState('betting');
  const [bet, setBet] = useState(10);
  const [decisions, setDecisions] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mesaId, setMesaId] = useState(null);
  const [loadingMesa, setLoadingMesa] = useState(true);

  const currentBalance = Number(user.saldo ?? 0);
  const canBet = bet > 0 && bet <= currentBalance;
  const decisionLabel = useMemo(() => decisions.join(' → '), [decisions]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const juegos = await getJuegos();
        const blackjack = juegos.data.find((j) => /blackjack/i.test(j.nombre));
        if (!blackjack) throw new Error('No se encontró un juego de blackjack en el backend');
        const mesas = await getMesasByJuego(blackjack.id);
        const mesa = mesas.data?.[0] ?? mesas[0];
        if (!mesa?.id) throw new Error('No se encontró una mesa para blackjack');
        if (active) setMesaId(mesa.id);
      } catch (err) {
        if (active) setError(err.message || 'No se pudo cargar blackjack');
      } finally {
        if (active) setLoadingMesa(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const startGame = () => {
    if (!canBet) {
      setError('Apuesta inválida');
      return;
    }
    setError(null);
    setResult(null);
    setDecisions([]);
    setGameState('playing');
  };

  const askCard = () => {
    if (loading || gameState !== 'playing') return;
    setDecisions((prev) => [...prev, 'PEDIR']);
  };

  const stand = async () => {
    if (loading || gameState !== 'playing') return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        usuarioId: user.id,
        mesaId,
        monto: String(bet),
        decisiones: [...decisions, 'PLANTARSE'],
      };

      const response = await playBlackjack(user.id, payload);
      setResult(response);
      setHistory((prev) => [
        {
          playerScore: response.playerScore,
          dealerScore: response.dealerScore,
          bet,
          result: response.gameResult,
        },
        ...prev.slice(0, 4),
      ]);

      const updatedUser = await getUserById(user.id);
      onUserUpdate?.(updatedUser);
      setGameState('finished');
    } catch (err) {
      setError(err.message || 'Error al jugar blackjack');
    } finally {
      setLoading(false);
    }
  };

  const resetRound = () => {
    setGameState('betting');
    setDecisions([]);
    setResult(null);
    setError(null);
  };

  if (loadingMesa) {
    return <div className="blackjack-container"><p>Cargando blackjack...</p></div>;
  }

  if (!mesaId) {
    return <div className="blackjack-container"><p>{error || 'No se pudo inicializar blackjack'}</p></div>;
  }

  return (
    <div className="blackjack-container">
      <div className="bj-header">
        <div>
          <h2>♠️ BLACKJACK ♠️</h2>
          <p className="user-info">Jugador: {user.nombre}</p>
        </div>
        <div className="bj-header-right">
          <div className="bj-balance">
            <span>Saldo</span>
            <span className="balance-amount">${currentBalance.toFixed(2)}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>Salir</button>
        </div>
      </div>

      <div className="blackjack-content">
        {gameState === 'betting' ? (
          <div className="betting-screen">
            <div className="betting-card">
              <h3>🎰 Coloca tu Apuesta</h3>
              <p className="saldo-disponible">Saldo disponible: ${currentBalance.toFixed(2)}</p>

              <div className="bet-input-group">
                <input
                  type="number"
                  min="1"
                  max={currentBalance}
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="bet-input"
                  placeholder="Ingresa tu apuesta"
                />
              </div>

              <div className="preset-buttons">
                {[10, 25, 50, 100, 250].map((amount) => (
                  <button key={amount} className="preset-btn" onClick={() => setBet(Math.min(amount, currentBalance))}>${amount}</button>
                ))}
              </div>

              <button className="btn btn-success btn-lg deal-btn" onClick={startGame} disabled={!canBet}>🎯 INICIAR MANO</button>
            </div>
          </div>
        ) : (
          <div className="game-screen">
            <div className="dealer-section">
              <h4>🃏 Dealer</h4>
              <p className="text-muted">Las cartas reales las resuelve el backend al plantar.</p>
            </div>

            <div className="table-separator"></div>

            <div className="player-section">
              <h4>👤 Tú</h4>
              <p className="score"><strong>{decisionLabel || 'Sin decisiones aún'}</strong></p>
              <p>Monto apostado: ${bet}</p>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={askCard} disabled={loading}>🎴 PEDIR CARTA</button>
              <button className="btn btn-warning" onClick={stand} disabled={loading}>✋ PLANTARSE</button>
            </div>

            {error && (
              <div className="result-box lose">
                <h3>{error}</h3>
              </div>
            )}

            {result && (
              <div className={`result-box ${result.playerScore > result.dealerScore ? 'win' : result.playerScore === result.dealerScore ? 'tie' : 'lose'}`}>
                <h3>{result.gameResult}</h3>
                <p>Cartas jugador: {result.playerCards.join(', ')}</p>
                <p>Cartas dealer: {result.dealerCards.join(', ')}</p>
                <p>Tu puntuación: {result.playerScore}</p>
                <p>Puntuación Dealer: {result.dealerScore}</p>
                {result.winAmount > 0 && <p className="win-amount">+${result.winAmount}</p>}
              </div>
            )}

            {gameState === 'finished' && (
              <button className="btn btn-success btn-lg" onClick={resetRound}>🔄 JUGAR DE NUEVO</button>
            )}
          </div>
        )}

        <div className="bj-history">
          <h4>📊 Últimas Manos</h4>
          {history.length > 0 ? (
            <div className="history-list">
              {history.map((h, idx) => (
                <div key={idx} className="history-item">
                  <span>Tú: {h.playerScore}</span>
                  <span>Dealer: {h.dealerScore}</span>
                  <span className={`result ${String(h.result).includes('GANASTE') ? 'win' : String(h.result).includes('EMPATE') ? 'tie' : 'loss'}`}>
                    {h.result}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Sin historial aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
