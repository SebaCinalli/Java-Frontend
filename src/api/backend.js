const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (_error) {
    throw new Error(
      'No se pudo conectar con el backend. Verifica que este levantado.',
    );
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = body?.error || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export function loginUser(email, password) {
  return request('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getUserById(actorId) {
  return request(`/usuarios/${actorId}`, {
    headers: { 'X-Actor-Id': String(actorId) },
  });
}

export function getJuegos() {
  return request('/juegos');
}

export function getMesasByJuego(juegoId) {
  return request(`/mesas/juego/${juegoId}`);
}

export function playRoulette(actorId, payload) {
  return request('/apuestas/ruleta', {
    method: 'POST',
    headers: { 'X-Actor-Id': String(actorId) },
    body: JSON.stringify(payload),
  });
}

export function playBlackjack(actorId, payload) {
  return request('/apuestas/blackjack', {
    method: 'POST',
    headers: { 'X-Actor-Id': String(actorId) },
    body: JSON.stringify(payload),
  });
}
