// ===========================================
// *** SELECTORES DEL JUEGO (DOM) ***
// ===========================================
const gameGrid = document.getElementById('game-grid'); 
const startButton = document.getElementById('start-button'); 
const scoreDisplay = document.getElementById('score'); 
const livesDisplay = document.getElementById('lives'); 
const messageDisplay = document.getElementById('message'); 
const statsContainer = document.getElementById('stats-container'); 
const rewardContainer = document.getElementById('reward-message-container'); 

// ===========================================
// *** VARIABLES DE ESTADO Y CONFIGURACIÓN ***
// ===========================================
let score = 0;
let lives = 3;
let lastCell = -1; // Índice de la última casilla activa
let gameInterval; // Temporizador principal (controla la aparición de Aries)
let currentActiveCell = null; // La casilla activa en este momento
let isGameRunning = false;
let currentDuration = 1000; // Tiempo que el símbolo está visible (ms)
let currentInterval = 1500; // Frecuencia con que aparece un nuevo símbolo (ms)

// Constantes clave del juego
const NUM_CELLS = 9;
const ARIES_SYMBOL = '♈';
const REWARD_SCORE = 10; // Puntaje para ganar el artefacto
const SPEED_LEVELS = [5, 10]; // Puntos clave donde la dificultad aumenta
const BASE_DURATION = 1000; 
const BASE_INTERVAL = 1500;

// ===========================================
// *** LÓGICA DE VELOCIDAD Y DIFICULTAD ***
// ===========================================

// Calcula la nueva duración y frecuencia de aparición basada en los puntos
function updateSpeed() {
    let newDuration = BASE_DURATION;
    let newInterval = BASE_INTERVAL;

    // Aumento de dificultad en los puntos clave (5 y 10)
    if (score >= SPEED_LEVELS[1]) {
        // Nivel 3 (10 puntos o más): El más rápido
        newDuration = 400; 
        newInterval = 700;
    } else if (score >= SPEED_LEVELS[0]) {
        // Nivel 2 (5 a 9 puntos): Velocidad media
        newDuration = 600; 
        newInterval = 900;
    }
    // Nivel 1 (0 a 4 puntos): Velocidad base

    // Si la velocidad cambió, reiniciamos el temporizador principal
    if (newDuration !== currentDuration || newInterval !== currentInterval) {
        currentDuration = newDuration;
        currentInterval = newInterval;
        
        clearInterval(gameInterval);
        gameInterval = setInterval(showAries, currentInterval);
    }

    // Verificar si se ganó la recompensa a los 15 puntos
    if (score === REWARD_SCORE) {
        // Mostrar recompensa solo si no se ha mostrado antes
        if (rewardContainer.innerHTML === '') {
            showReward();
        }
    }
}


// ===========================================
// *** FUNCIONES PRINCIPALES DEL JUEGO ***
// ===========================================

// 1. Crea dinámicamente las 9 casillas en el contenedor de la cuadrícula
function createGrid() {
    gameGrid.innerHTML = ''; 
    for (let i = 0; i < NUM_CELLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        // Evento de clic para interactuar con el juego
        cell.addEventListener('click', handleCellClick);
        gameGrid.appendChild(cell);
    }
}

// 2. Elige una casilla aleatoria diferente a la anterior
function chooseRandomCell() {
    let randomCellIndex;
    do {
        randomCellIndex = Math.floor(Math.random() * NUM_CELLS);
    } while (randomCellIndex === lastCell);
    lastCell = randomCellIndex;
    return gameGrid.children[randomCellIndex];
}

// 3. Muestra el símbolo de Aries
function showAries() {
    // Penalización: Si hay una casilla activa y el tiempo del ciclo terminó, se perdió la vida
    if (currentActiveCell) {
        missAries(); 
    }

    // Activa la nueva casilla
    currentActiveCell = chooseRandomCell();
    currentActiveCell.textContent = ARIES_SYMBOL;
    currentActiveCell.classList.add('active-cell');

    // Temporizador: Si pasa 'currentDuration' sin click, se llama a missAries()
    currentActiveCell.timer = setTimeout(() => {
        missAries(); 
    }, currentDuration);
}

// 4. Se ejecuta al hacer clic en una casilla
function handleCellClick(event) {
    if (!isGameRunning) return;

    const clickedCell = event.target;

    if (clickedCell === currentActiveCell) {
        // ** ACIERTO **: El jugador fue rápido
        clearTimeout(clickedCell.timer); // Cancelar el temporizador de fallo
        score += 1;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = '¡Acierto! Impulso capturado.';
        
        hideAries(clickedCell, true); // Ocultar y limpiar
        updateSpeed(); // Revisa la dificultad y la recompensa
        
    } else {
        // ** FALLO **: Hizo clic en una casilla vacía
        messageDisplay.textContent = '¡Fallo! Debes enfocar el impulso.';
    }
}

// 5. Oculta el símbolo de la casilla
function hideAries(cell, wasHit) {
    cell.textContent = '';
    cell.classList.remove('active-cell');
    
    if (!wasHit) {
        // Efecto visual si fue un fallo de tiempo
        cell.classList.add('missed-cell');
        setTimeout(() => cell.classList.remove('missed-cell'), 300);
    }
    
    currentActiveCell = null;
}

// 6. Maneja la pérdida de una vida
function missAries() {
    if (currentActiveCell) {
        clearTimeout(currentActiveCell.timer); 
        hideAries(currentActiveCell, false); 
    }

    lives -= 1;
    livesDisplay.textContent = lives;
    
    if (lives <= 0) {
        endGame();
        messageDisplay.textContent = `¡El Impulso Falló! Tu puntuación final es ${score}.`;
    } else {
        messageDisplay.textContent = `¡Se fue! Pierdes una vida. Quedan ${lives}.`;
    }
}

// 7. Muestra el "Artefacto de Aries" en su contenedor dedicado
function showReward() {
    rewardContainer.innerHTML = ''; 
    
    const rewardElement = document.createElement('p');
    rewardElement.id = 'reward';
    rewardElement.innerHTML = '¡ARTEFACTO DESBLOQUEADO! El Vellocino de Oro';
    
    rewardContainer.appendChild(rewardElement);
    
    messageDisplay.textContent = "¡Felicitaciones! Has ganado el Vellocino de Oro. ¡Continúa!";
}

// 8. Finaliza el juego
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval); 
    startButton.textContent = 'Jugar de Nuevo';
    startButton.classList.remove('hidden'); 
    
    // Limpiar cualquier casilla que haya quedado activa
    if (currentActiveCell) {
        currentActiveCell.textContent = '';
        currentActiveCell.classList.remove('active-cell');
        currentActiveCell = null;
    }
}

// ===========================================
// *** INICIO DEL JUEGO ***
// ===========================================

// Configura y comienza una nueva partida
function startGame() {
    // Resetear variables de estado
    score = 0;
    lives = 3;
    currentDuration = BASE_DURATION; 
    currentInterval = BASE_INTERVAL;
    isGameRunning = true;
    
    // Actualizar interfaz
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    messageDisplay.textContent = '¡El juego ha comenzado! Busca el símbolo...';
    startButton.classList.add('hidden'); 
    
    // Limpiar el contenedor de la recompensa al reiniciar
    rewardContainer.innerHTML = ''; 
    
    // Iniciar el ciclo de aparición
    gameInterval = setInterval(showAries, currentInterval);
}


// Configuración inicial al cargar la página
createGrid();
startButton.addEventListener('click', startGame);