import { useState, useEffect } from 'react';
import '../styles/Roulette.css';

export default function Roulette({ user, onLogout }) {
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
  ];

  const spinWheel = () => {
    if (!selectedNumber && !selectedColor) {
      alert('Selecciona un número o color para apostar');
      return;
    }

    if (bet > balance) {
      alert('Saldo insuficiente');
      return;
    }

    setSpinning(true);
    setResult(null);

    // Simular giro de ruleta
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      const winningColor = redNumbers.includes(winningNumber)
        ? 'red'
        : blackNumbers.includes(winningNumber)
          ? 'black'
          : 'green';

      let won = false;
      let winAmount = 0;

      if (selectedNumber === winningNumber) {
        won = true;
        winAmount = bet * 36;
      } else if (selectedColor === winningColor) {
        won = true;
        winAmount = bet * 2;
      }

      const newBalance = won ? balance + winAmount : balance - bet;
      setBalance(newBalance);
      setResult({
        number: winningNumber,
        color: winningColor,
        won,
        winAmount,
      });

      setHistory([
        {
          number: winningNumber,
          bet: selectedNumber
            ? `Número ${selectedNumber}`
            : `Color ${selectedColor}`,
          amount: bet,
          result: won ? `+${winAmount}` : `-${bet}`,
        },
        ...history.slice(0, 4),
      ]);

      setSpinning(false);
    }, 2000);
  };

  const resetBet = () => {
    setSelectedNumber(null);
    setSelectedColor(null);
    setResult(null);
  };

  return (
    <div className="roulette-container">
      {/* Header */}
      <div className="casino-header">
        <div className="header-left">
          <h2>🎡 RULETA EUROPEA</h2>
          <p className="user-info">Jugador: {user.nombre}</p>
        </div>
        <div className="header-right">
          <div className="balance-display">
            <span className="balance-label">Saldo</span>
            <span className="balance-amount">${balance.toFixed(2)}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            Salir
          </button>
        </div>
      </div>

      <div className="roulette-content">
        {/* Mesa de Ruleta */}
        <div className="roulette-table">
          <div className="wheel-section">
            <div className={`roulette-wheel ${spinning ? 'spinning' : ''}`}>
              <div className="wheel-center">
                <div className="pointer"></div>
                {result && (
                  <div
                    className={`result-badge ${result.won ? 'won' : 'lost'}`}
                  >
                    {result.won ? '✓ GANASTE' : '✗ PERDISTE'}
                  </div>
                )}
              </div>
              {numbers.map((num) => {
                const isRed = redNumbers.includes(num);
                const isBlack = blackNumbers.includes(num);
                const isGreen = num === 0;
                return (
                  <div
                    key={num}
                    className={`wheel-number ${isRed ? 'red' : isBlack ? 'black' : 'green'} ${
                      result?.number === num ? 'winning-number' : ''
                    }`}
                    style={{
                      transform: `rotate(${(num * 360) / 37}deg) translateY(-120px)`,
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla de Apuestas */}
          <div className="betting-table">
            <h3>Mesa de Apuestas</h3>

            {/* Números */}
            <div className="numbers-grid">
              {numbers.map((num) => {
                const isRed = redNumbers.includes(num);
                const isBlack = blackNumbers.includes(num);
                return (
                  <button
                    key={num}
                    className={`bet-button ${isRed ? 'red' : isBlack ? 'black' : 'green'} ${
                      selectedNumber === num ? 'selected' : ''
                    }`}
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

            {/* Apuestas por Color */}
            <div className="color-bets">
              <button
                className={`color-bet-btn red ${selectedColor === 'red' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedColor(selectedColor === 'red' ? null : 'red');
                  setSelectedNumber(null);
                }}
                disabled={spinning}
              >
                🔴 Rojo (2:1)
              </button>
              <button
                className={`color-bet-btn black ${selectedColor === 'black' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedColor(selectedColor === 'black' ? null : 'black');
                  setSelectedNumber(null);
                }}
                disabled={spinning}
              >
                ⚫ Negro (2:1)
              </button>
              <button
                className={`color-bet-btn green ${selectedColor === 'green' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedColor(selectedColor === 'green' ? null : 'green');
                  setSelectedNumber(null);
                }}
                disabled={spinning}
              >
                🟢 Verde (36:1)
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="control-panel">
          <div className="bet-control">
            <label>Monto a Apostar: ${bet}</label>
            <input
              type="range"
              min="10"
              max={balance}
              step="10"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={spinning}
              className="bet-slider"
            />
            <div className="bet-presets">
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  className="preset-btn"
                  onClick={() => setBet(Math.min(amount, balance))}
                  disabled={spinning}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {selectedNumber !== null || selectedColor !== null ? (
            <div className="selection-info">
              <p>
                Apuesta seleccionada:{' '}
                {selectedNumber !== null
                  ? `Número ${selectedNumber}`
                  : `Color ${selectedColor}`}
              </p>
              <p>Monto: ${bet}</p>
            </div>
          ) : null}

          <button
            className="btn btn-success btn-lg spin-btn"
            onClick={spinWheel}
            disabled={spinning || (!selectedNumber && !selectedColor)}
          >
            {spinning ? '🎡 Girando...' : '🎯 GIRAR RULETA'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={resetBet}
            disabled={spinning}
          >
            Limpiar Apuesta
          </button>

          {result && (
            <div className={`result-section ${result.won ? 'won' : 'lost'}`}>
              <h4>{result.won ? '🎉 ¡GANASTE!' : '😞 Perdiste esta'}</h4>
              <p>
                Número ganador: <strong>{result.number}</strong>
              </p>
              <p>
                Color: <strong>{result.color}</strong>
              </p>
              {result.won && <p className="win-amount">+${result.winAmount}</p>}
            </div>
          )}
        </div>

        {/* Historial */}
        <div className="history-panel">
          <h4>📊 Últimas Tiradas</h4>
          <div className="history-list">
            {history.length > 0 ? (
              history.map((h, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-number">#{h.number}</span>
                  <span className="history-bet">{h.bet}</span>
                  <span
                    className={`history-result ${h.result.includes('-') ? 'loss' : 'win'}`}
                  >
                    {h.result}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted">Sin historial aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
