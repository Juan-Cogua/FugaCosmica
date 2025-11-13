document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // *** SELECTORES DOM ***
    // ===========================================
    const ariesButton = document.querySelector('.level-emoji.aries');
    const modalContainer = document.getElementById('modal-container');
    const modalExitButton = document.getElementById('modal-exit');
    const aresEventButton = document.getElementById('ares-event-button'); 
    
    // Si el botón no existe (aunque ya lo agregaste al HTML, es una buena práctica)
    if (!aresEventButton) {
        console.error("Error: El botón de evento de Ares (#ares-event-button) no se encontró en el DOM.");
        return;
    }

    // ===========================================
    // *** CONFIGURACIÓN DEL JUEGO Y ARTEFACTOS ***
    // ===========================================
    
    // Mapa de emojis para los artefactos.
    const ARTEFACT_EMOJI_MAP = {
        'aries': '🔱',      // Yelmo de Bronce
        'tauro': '♉',      
        'geminis': '♊',    
        'cancer': '♋',     
        // Añade el resto de los signos aquí.
    };

    // Ares Evento de Lógica
    const SPAWN_INTERVAL = 5 * 60 * 1000; // 5 minutos en milisegundos
    const MOVE_INTERVAL = 800;           // El botón se mueve cada 0.8 segundos
    const DECAY_TIME = 10 * 1000;          // 10 segundos para hacer clic

    let aresSpawnTimer; // Para el temporizador de 5 minutos
    let aresDecayTimer; // Para el temporizador de 10 segundos
    let aresMoveInterval; // Para el temporizador de movimiento

    // ===========================================
    // *** LÓGICA DE VENTANA MODAL ***
    // ===========================================

    // 1. Mostrar la modal al hacer clic en Aries
    if (ariesButton && modalContainer) {
        ariesButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            modalContainer.classList.remove('hidden');
        });
    }

    // 2. Ocultar la modal al hacer clic en 'Salir'
    if (modalExitButton && modalContainer) {
        modalExitButton.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
        });
    }
    
    // 3. Opcional: Ocultar la modal al hacer clic fuera del contenido
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                modalContainer.classList.add('hidden');
            }
        });
    }

    // ===========================================
    // *** LÓGICA DEL INVENTARIO Y ARTEFACTOS ***
    // ===========================================
    
    function loadArtefacts() {
        // Obtiene la lista de artefactos ganados desde localStorage
        const gainedArtefacts = JSON.parse(localStorage.getItem('gainedArtefacts')) || {};
        const slots = document.querySelectorAll('.artefact-slot');

        slots.forEach(slot => {
            const artefactKey = slot.id.replace('-artefact', '');

            if (gainedArtefacts[artefactKey]) {
                slot.classList.add('unlocked');
                slot.textContent = ARTEFACT_EMOJI_MAP[artefactKey] || '✨';
                slot.setAttribute('title', `Artefacto Ganado: ${slot.dataset.artefact}`);
            } else {
                slot.classList.remove('unlocked');
                slot.textContent = '';
                slot.setAttribute('title', `Bloqueado: ${slot.dataset.artefact}`);
            }
        });
    }

    // ===========================================
    // *** LÓGICA DEL EVENTO DE ARES (NUEVO) ***
    // ===========================================

    /**
     * Mueve el botón de Ares a una posición aleatoria en la pantalla.
     */
    function moveAresButton() {
        const buttonWidth = aresEventButton.offsetWidth;
        const buttonHeight = aresEventButton.offsetHeight;
        
        // Excluir un área cerca del inventario (por ejemplo, el 15% inferior de la pantalla)
        const exclusionHeight = window.innerHeight * 0.15;
        
        // Rango máximo donde se puede mover el centro del botón
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight - exclusionHeight;

        // Si la pantalla es demasiado pequeña, no hacer nada
        if (maxX <= 0 || maxY <= 0) return;
        
        // Generamos posiciones aleatorias
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // Aplicamos la posición
        aresEventButton.style.left = `${randomX}px`;
        aresEventButton.style.top = `${randomY}px`;
    }

    /**
     * Inicia el evento de Ares (aparece y comienza a moverse).
     */
    function startAresEvent() {
        // Limpiar cualquier temporizador anterior por si acaso
        endAresEvent(false); 

        // 1. Mostrar el botón
        // ⚠️ CORRECCIÓN CLAVE: Asegurar display: block antes de mostrar
        aresEventButton.style.display = 'block'; // Forzar la visualización
        aresEventButton.classList.remove('hidden'); 
        aresEventButton.style.opacity = '1';
        
        moveAresButton();
        
        // 2. Temporizador de movimiento constante
        aresMoveInterval = setInterval(moveAresButton, MOVE_INTERVAL);
        
        // 3. Temporizador de Decadencia (si no se hace clic en 10 segundos)
        aresDecayTimer = setTimeout(() => {
            console.log("¡Tiempo de Ares expirado!");
            loseArtefact(); // Se ejecuta si expira el tiempo
            endAresEvent();
        }, DECAY_TIME);
        
        // 4. Asignar el listener de clic para que el jugador lo detenga
        aresEventButton.onclick = () => {
            cancelAresEvent(); // Si se hace clic
        };
        
        alert("¡Alerta! Ares ha aparecido. Haz clic en su imagen antes de 10 segundos para proteger tus artefactos.");
    }

    /**
     * Termina el evento, limpia temporizadores y oculta el botón.
     * @param {boolean} shouldRestartTimer - Si debe reiniciar el temporizador de 5 minutos. Por defecto: true.
     */
    function endAresEvent(shouldRestartTimer = true) {
        clearTimeout(aresDecayTimer);
        clearInterval(aresMoveInterval);
        
        // 1. Ocultar el botón
        aresEventButton.style.opacity = '0';
        
        // Ocultar completamente después de la transición (0.5s en CSS)
        setTimeout(() => {
            aresEventButton.style.display = 'none'; // Usar display: none para ocultar por completo
            aresEventButton.onclick = null; // Limpiar listener
        }, 500); 
        
        // 2. Reiniciar el temporizador de 5 minutos para el próximo evento
        if (shouldRestartTimer) {
            aresSpawnTimer = setTimeout(startAresEvent, SPAWN_INTERVAL);
        }
    }
    
    /**
     * Función si el jugador hace clic a tiempo.
     */
    function cancelAresEvent() {
        alert("¡Has evitado el ataque de Ares y protegido tus artefactos!");
        endAresEvent(); // Terminar y reiniciar el temporizador de 5 minutos
    }

    /**
     * Lógica para la pérdida de un artefacto.
     */
    function loseArtefact() {
        let gainedArtefacts = JSON.parse(localStorage.getItem('gainedArtefacts')) || {};
        
        // Obtener solo las claves de los artefactos que SÍ han sido ganados
        const keys = Object.keys(gainedArtefacts).filter(key => gainedArtefacts[key]);

        if (keys.length > 0) {
            // Elegir un artefacto ganado al azar
            const lostKey = keys[Math.floor(Math.random() * keys.length)];
            const lostArtefactName = document.getElementById(`${lostKey}-artefact`).dataset.artefact;
            
            // Eliminarlo del localStorage y actualizar
            delete gainedArtefacts[lostKey]; 
            localStorage.setItem('gainedArtefacts', JSON.stringify(gainedArtefacts));
            
            alert(`¡FRACASO! Ares ha robado el artefacto: **${lostArtefactName}**! Debes ganarlo de nuevo.`);
            loadArtefacts(); // Actualizar el inventario visual
        } else {
            alert("¡Ares apareció pero no tienes artefactos para robar! Tuviste suerte... esta vez.");
        }
    }


    // ===========================================
    // *** INICIALIZACIÓN (CAMBIO AQUÍ) ***
    // ===========================================
    
    // Cargar los artefactos al inicio
    loadArtefacts(); 

    // ⚡ INICIA EL EVENTO INMEDIATAMENTE al cargar la página.
    startAresEvent(); 

});