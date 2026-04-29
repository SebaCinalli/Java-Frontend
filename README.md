# 🎰 Casino Virtual - Frontend React

Aplicación interactiva de casino con Ruleta Europea y Blackjack construida con React y Vite.

## 🎮 Características

### 1. **Sistema de Login** 🔐

- Interfaz elegante y responsiva
- Credenciales de demostración:
  - Email: `cliente@gmail.com`
  - Contraseña: `cliente123`
- Animaciones suave y efectos visuales

### 2. **Ruleta Europea** 🎡

- Mesa de ruleta con 37 números (0-36)
- Números rojos, negros y verdes
- Apuestas por número individual o por color
- Animación realista de giro
- Control de apuestas con presets ($10, $50, $100, $500)
- Historial de últimas tiradas
- Cálculo automático de ganancias

### 3. **Blackjack** ♠️

- Juego clásico contra el dealer
- Sistema de puntuación automático (Aces tratados correctamente)
- Botones de Pedir Carta y Plantarse
- Pantalla de apuestas antes de jugar
- Historial de manos jugadas
- Saldo en tiempo real

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Login.jsx          # Componente de inicio de sesión
│   ├── Roulette.jsx       # Componente de ruleta
│   └── Blackjack.jsx      # Componente de blackjack
├── styles/
│   ├── App.css            # Estilos del menú principal
│   ├── Login.css          # Estilos del login
│   ├── Roulette.css       # Estilos de la ruleta
│   └── Blackjack.css      # Estilos del blackjack
├── App.jsx                # Componente principal con navegación
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

## 🚀 Instalación y Ejecución

### Requisitos

- Node.js 16+
- npm o yarn

### Pasos

1. **Instalar dependencias**

```bash
npm install
```

2. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

3. **Build para producción**

```bash
npm run build
```

4. **Preview de producción**

```bash
npm run preview
```

## 🎨 Tecnologías Utilizadas

- **React 19.2** - Librería de UI
- **Vite 8** - Bundler y dev server
- **Bootstrap 5.3** - Framework CSS (CDN)
- **CSS3** - Estilos personalizados y animaciones

## 🎯 Flujo de la Aplicación

1. **Login** → Ingresa credenciales
2. **Menú Principal** → Selecciona juego (Ruleta o Blackjack)
3. **Juego** → Juega y aprecia tus resultados
4. **Menú** → Regresa al menú o cierra sesión

## 💡 Características de Diseño

### Tema de Casino

- Colores dorados (#FFD700) y oscuros
- Efectos de brillo y sombras
- Animaciones suaves y realistas
- Interfaz responsiva para dispositivos móviles

### Estados del Juego

- **Ruleta**: Giro animado, visualización de resultado ganador
- **Blackjack**: Reparto animado de cartas, cálculo en tiempo real

### Validaciones

- Control de saldo disponible
- Prevención de apuestas inválidas
- Manejo de casos de busto en Blackjack

## 📊 Datos de Prueba

**Saldo inicial**: $1000
**Juegos disponibles**: Ruleta (RTP: 97.3%), Blackjack (RTP: 99.5%)

## 🔄 Próximas Mejoras

- [ ] Integración con backend Java
- [ ] Autenticación real
- [ ] Persistencia de datos
- [ ] Más juegos (Dados, Póker, etc.)
- [ ] Sistema de puntuación global
- [ ] Historial completo en base de datos

## 📝 Notas de Desarrollo

- Los juegos actualmente utilizan lógica simulada
- Los saldos se reinician al recargar la página
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🎓 Créditos

Desarrollado como aplicación de demostración para Java Frontend.

---

**¡Disfruta jugando en el Casino Virtual!** 🎰
