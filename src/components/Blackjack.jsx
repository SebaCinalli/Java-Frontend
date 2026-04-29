import { useState } from 'react';
import '../styles/Blackjack.css';

export default function Blackjack({ user, onLogout }) {
  const [gameState, setGameState] = useState('betting'); // betting, playing, finished
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [result, setResult] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];

  const createDeck = () => {
    const newDeck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        newDeck.push({ suit, rank });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (card) => {
    if (card.rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.rank)) return 10;
    return parseInt(card.rank);
  };

  const calculateScore = (cards) => {
    let score = cards.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = cards.filter((c) => c.rank === 'A').length;

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const startGame = (betAmount) => {
    if (betAmount <= 0 || betAmount > balance) {
      alert('Apuesta inválida');
      return;
    }

    const newDeck = createDeck();
    const playerInitial = [newDeck.pop(), newDeck.pop()];
    const dealerInitial = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerCards(playerInitial);
    setDealerCards([dealerInitial[0]]); // Solo mostrar primera carta
    setBet(betAmount);
    setBalance(balance - betAmount);
    setGameState('playing');
    setResult(null);

    const pScore = calculateScore(playerInitial);
    setPlayerScore(pScore);
    setDealerScore(calculateScore([dealerInitial[0]]));

    // Verificar blackjack inmediato
    if (pScore === 21) {
      setTimeout(() => finishGame(playerInitial, dealerInitial, newDeck), 500);
    }
  };

  const hit = () => {
    if (deck.length === 0) return;

    const newCard = deck.pop();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const newScore = calculateScore(newPlayerCards);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setTimeout(
        () => finishGame(newPlayerCards, dealerCards, deck, true),
        500,
      );
    }
  };

  const stand = () => {
    dealerTurn(playerCards, dealerCards, deck);
  };

  const dealerTurn = (pCards, dCards, currentDeck) => {
    let dealerHand = [...dCards, currentDeck.pop()];
    let newDeck = currentDeck;

    while (calculateScore(dealerHand) < 17) {
      dealerHand.push(newDeck.pop());
    }

    finishGame(pCards, dealerHand, newDeck);
  };

  const finishGame = (pCards, dCards, currentDeck, playerBusted = false) => {
    setDealerCards(dCards);

    const pScore = calculateScore(pCards);
    const dScore = calculateScore(dCards);
    setDealerScore(dScore);

    let gameResult = '';
    let winAmount = 0;

    if (playerBusted) {
      gameResult = 'PERDISTE - ¡Te pasaste de 21!';
    } else if (dScore > 21) {
      gameResult = '¡GANASTE! - Dealer se pasó';
      winAmount = bet * 2;
    } else if (pScore > dScore) {
      gameResult = '¡GANASTE! - Tienes mejor mano';
      winAmount = bet * 2;
    } else if (pScore === dScore) {
      gameResult = 'EMPATE';
      winAmount = bet;
    } else {
      gameResult = 'PERDISTE - Dealer tiene mejor mano';
    }

    const newBalance = balance + winAmount;
    setBalance(newBalance);
    setResult({
      gameResult,
      winAmount,
      playerScore: pScore,
      dealerScore: dScore,
    });

    setHistory([
      {
        playerScore: pScore,
        dealerScore: dScore,
        bet,
        result: gameResult.includes('GANASTE')
          ? `+${winAmount}`
          : gameResult.includes('EMPATE')
            ? `${bet}`
            : `-${bet}`,
      },
      ...history.slice(0, 4),
    ]);

    setGameState('finished');
  };

  const playAgain = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameState('betting');
    setBet(0);
    setResult(null);
  };

  return (
    <div className="blackjack-container">
      {/* Header */}
      <div className="bj-header">
        <div>
          <h2>♠️ BLACKJACK ♠️</h2>
          <p className="user-info">Jugador: {user.nombre}</p>
        </div>
        <div className="bj-header-right">
          <div className="bj-balance">
            <span>Saldo</span>
            <span className="balance-amount">${balance.toFixed(2)}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            Salir
          </button>
        </div>
      </div>

      <div className="blackjack-content">
        {gameState === 'betting' ? (
          // Pantalla de Apuestas
          <div className="betting-screen">
            <div className="betting-card">
              <h3>🎰 Coloca tu Apuesta</h3>
              <p className="saldo-disponible">
                Saldo disponible: ${balance.toFixed(2)}
              </p>

              <div className="bet-input-group">
                <input
                  type="number"
                  min="1"
                  max={balance}
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="bet-input"
                  placeholder="Ingresa tu apuesta"
                />
              </div>

              <div className="preset-buttons">
                {[10, 25, 50, 100, 250].map((amount) => (
                  <button
                    key={amount}
                    className="preset-btn"
                    onClick={() => setBet(Math.min(amount, balance))}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-success btn-lg deal-btn"
                onClick={() => startGame(bet)}
                disabled={bet <= 0 || bet > balance}
              >
                🎯 REPARTIR CARTAS
              </button>
            </div>
          </div>
        ) : (
          // Pantalla de Juego
          <div className="game-screen">
            <div className="dealer-section">
              <h4>🃏 Dealer</h4>
              <div className="cards-display">
                {dealerCards.map((card, idx) => (
                  <div key={idx} className="card">
                    <span
                      className={`card-suit ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`}
                    >
                      {card.suit}
                    </span>
                    <span className="card-rank">{card.rank}</span>
                  </div>
                ))}
              </div>
              {gameState === 'finished' && (
                <p className="score">
                  Puntuación Dealer: <strong>{dealerScore}</strong>
                </p>
              )}
            </div>

            <div className="table-separator"></div>

            <div className="player-section">
              <h4>👤 Tú</h4>
              <div className="cards-display">
                {playerCards.map((card, idx) => (
                  <div key={idx} className="card">
                    <span
                      className={`card-suit ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`}
                    >
                      {card.suit}
                    </span>
                    <span className="card-rank">{card.rank}</span>
                  </div>
                ))}
              </div>
              <p className="score">
                Tu Puntuación:{' '}
                <strong className={playerScore > 21 ? 'bust' : ''}>
                  {playerScore}
                </strong>
              </p>
            </div>

            {gameState === 'playing' && (
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={hit}
                  disabled={playerScore === 21}
                >
                  🎴 PEDIR CARTA
                </button>
                <button className="btn btn-warning" onClick={stand}>
                  ✋ PLANTARSE
                </button>
              </div>
            )}

            {gameState === 'finished' && result && (
              <div
                className={`result-box ${result.gameResult.includes('GANASTE') ? 'win' : result.gameResult.includes('EMPATE') ? 'tie' : 'lose'}`}
              >
                <h3>{result.gameResult}</h3>
                <p>Tu puntuación: {result.playerScore}</p>
                <p>Puntuación Dealer: {result.dealerScore}</p>
                {result.winAmount > 0 && (
                  <p className="win-amount">+${result.winAmount}</p>
                )}
                <button className="btn btn-success btn-lg" onClick={playAgain}>
                  🔄 JUGAR DE NUEVO
                </button>
              </div>
            )}
          </div>
        )}

        {/* Historial */}
        <div className="bj-history">
          <h4>📊 Últimas Manos</h4>
          {history.length > 0 ? (
            <div className="history-list">
              {history.map((h, idx) => (
                <div key={idx} className="history-item">
                  <span>Tú: {h.playerScore}</span>
                  <span>Dealer: {h.dealerScore}</span>
                  <span
                    className={`result ${h.result.includes('-') && h.result !== h.bet ? 'loss' : 'win'}`}
                  >
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
