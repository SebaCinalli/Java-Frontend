import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styles/Roulette.css';

const BASE_URL = 'http://localhost:8080/api';

async function getJuegos() {
  const r = await axios.get(`${BASE_URL}/juegos`);
  return r.data;
}

async function getMesasByJuego(juegoId) {
  const r = await axios.get(`${BASE_URL}/mesas/juego/${juegoId}`);
  return r.data;
}

async function getUserById(actorId) {
  const r = await axios.get(`${BASE_URL}/usuarios/${actorId}`);
  return r.data;
}

async function playRoulette(actorId, payload) {
  const r = await axios.post(`${BASE_URL}/apuestas/ruleta`, payload, { headers: { 'X-Actor-Id': String(actorId) } });
  return r.data;
}

export default function Roulette({ user, onUserUpdate, onLogout }) {
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [mesaId, setMesaId] = useState(null);
  const [loadingMesa, setLoadingMesa] = useState(true);

  const numbers = useMemo(() => Array.from({ length: 37 }, (_, i) => i), []);
  const redNumbers = useMemo(() => [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], []);
  const blackNumbers = useMemo(() => [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35], []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const juegos = await getJuegos();
        const ruleta = juegos.data.find((j) => /ruleta|roulette/i.test(j.nombre));
        if (!ruleta) throw new Error('No se encontró un juego de ruleta en el backend');
        const mesas = await getMesasByJuego(ruleta.id);
        const mesa = mesas.data?.[0] ?? mesas[0];
        if (!mesa?.id) throw new Error('No se encontró una mesa para ruleta');
        if (active) setMesaId(mesa.id);
      } catch (err) {
        if (active) setError(err.message || 'No se pudo cargar la ruleta');
      } finally {
        if (active) setLoadingMesa(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const spinWheel = async () => {
    if (!selectedNumber && !selectedColor) {
      setError('Selecciona un número o color para apostar');
      return;
    }

    setSpinning(true);
    setError(null);

    try {
      const payload = {
        usuarioId: user.id,
        mesaId,
        monto: String(bet),
      };

      if (selectedNumber !== null) payload.numero = selectedNumber;
      if (selectedColor) payload.color = selectedColor;

      const response = await playRoulette(user.id, payload);
      setResult(response);
      setHistory((prev) => [
        {
          number: response.number,
          bet: response.selectedNumber !== null && response.selectedNumber !== undefined ? `Número ${response.selectedNumber}` : `Color ${response.selectedColor}`,
          amount: bet,
          result: response.won ? `+${response.winAmount}` : `-${bet}`,
        },
        ...prev.slice(0, 4),
      ]);

      const updatedUser = await getUserById(user.id);
      onUserUpdate?.(updatedUser);
    } catch (err) {
      setError(err.message || 'Error al jugar ruleta');
    } finally {
      setSpinning(false);
    }
  };

  const resetBet = () => {
    setSelectedNumber(null);
    setSelectedColor(null);
    setResult(null);
    setError(null);
  };

  const currentBalance = Number(user.saldo ?? 0);

  if (loadingMesa) {
    return <div className="roulette-container"><p>Cargando ruleta...</p></div>;
  }

  if (!mesaId) {
    return <div className="roulette-container"><p>{error || 'No se pudo inicializar la ruleta'}</p></div>;
  }

  return (
    <div className="roulette-container">
      <div className="casino-header">
        <div className="header-left">
          <h2>🎡 RULETA EUROPEA</h2>
          <p className="user-info">Jugador: {user.nombre}</p>
        </div>
        <div className="header-right">
          <div className="balance-display">
            <span className="balance-label">Saldo</span>
            <span className="balance-amount">${currentBalance.toFixed(2)}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>Salir</button>
        </div>
      </div>

      <div className="roulette-content">
        <div className="roulette-table">
          <div className="wheel-section">
            <div className={`roulette-wheel ${spinning ? 'spinning' : ''}`}>
              <div className="wheel-center">
                <div className="pointer"></div>
                {result && (
                  <div className={`result-badge ${result.won ? 'won' : 'lost'}`}>
                    {result.won ? '✓ GANASTE' : '✗ PERDISTE'}
                  </div>
                )}
              </div>
              {numbers.map((num) => {
                const isRed = redNumbers.includes(num);
                const isBlack = blackNumbers.includes(num);
                return (
                  <div
                    key={num}
                    className={`wheel-number ${isRed ? 'red' : isBlack ? 'black' : 'green'} ${result?.number === num ? 'winning-number' : ''}`}
                    style={{ transform: `rotate(${(num * 360) / 37}deg) translateY(-120px)` }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="betting-table">
            <h3>Mesa de Apuestas</h3>
            <div className="numbers-grid">
              {numbers.map((num) => {
                const isRed = redNumbers.includes(num);
                const isBlack = blackNumbers.includes(num);
                return (
                  <button
                    key={num}
                    className={`bet-button ${isRed ? 'red' : isBlack ? 'black' : 'green'} ${selectedNumber === num ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedNumber(selectedNumber === num ? null : num);
                      setSelectedColor(null);
                    }}
                    disabled={spinning}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="color-bets">
              <button className={`color-bet-btn red ${selectedColor === 'red' ? 'selected' : ''}`} onClick={() => { setSelectedColor(selectedColor === 'red' ? null : 'red'); setSelectedNumber(null); }} disabled={spinning}>🔴 Rojo (2:1)</button>
              <button className={`color-bet-btn black ${selectedColor === 'black' ? 'selected' : ''}`} onClick={() => { setSelectedColor(selectedColor === 'black' ? null : 'black'); setSelectedNumber(null); }} disabled={spinning}>⚫ Negro (2:1)</button>
              <button className={`color-bet-btn green ${selectedColor === 'green' ? 'selected' : ''}`} onClick={() => { setSelectedColor(selectedColor === 'green' ? null : 'green'); setSelectedNumber(null); }} disabled={spinning}>🟢 Verde (36:1)</button>
            </div>
          </div>
        </div>

        <div className="control-panel">
          <div className="bet-control">
            <label>Monto a Apostar: ${bet}</label>
            <input
              type="range"
              min="10"
              max={Math.max(currentBalance, 10)}
              step="10"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={spinning}
              className="bet-slider"
            />
            <div className="bet-presets">
              {[10, 50, 100, 500].map((amount) => (
                <button key={amount} className="preset-btn" onClick={() => setBet(Math.min(amount, currentBalance || amount))} disabled={spinning}>${amount}</button>
              ))}
            </div>
          </div>

          {selectedNumber !== null || selectedColor !== null ? (
            <div className="selection-info">
              <p>Apuesta seleccionada: {selectedNumber !== null ? `Número ${selectedNumber}` : `Color ${selectedColor}`}</p>
              <p>Monto: ${bet}</p>
            </div>
          ) : null}

          <button className="btn btn-success btn-lg spin-btn" onClick={spinWheel} disabled={spinning || (!selectedNumber && !selectedColor)}>
            {spinning ? '🎡 Girando...' : '🎯 GIRAR RULETA'}
          </button>

          <button className="btn btn-secondary" onClick={resetBet} disabled={spinning}>Limpiar Apuesta</button>

          {error && (
            <div className="result-section lost">
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className={`result-section ${result.won ? 'won' : 'lost'}`}>
              <h4>{result.won ? '🎉 ¡GANASTE!' : '😞 Perdiste esta'}</h4>
              <p>Número ganador: <strong>{result.number}</strong></p>
              <p>Color: <strong>{result.color}</strong></p>
              {result.won && <p className="win-amount">+${result.winAmount}</p>}
            </div>
          )}
        </div>

        <div className="history-panel">
          <h4>📊 Últimas Tiradas</h4>
          <div className="history-list">
            {history.length > 0 ? history.map((h, idx) => (
              <div key={idx} className="history-item">
                <span className="history-number">#{h.number}</span>
                <span className="history-bet">{h.bet}</span>
                <span className={`history-result ${h.result.includes('-') ? 'loss' : 'win'}`}>{h.result}</span>
              </div>
            )) : <p className="text-muted">Sin historial aún</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
