document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // *** SELECTORES DE LA MODAL ***
    // ===========================================
    const ariesButton = document.querySelector('.level-emoji.aries');
    const modalContainer = document.getElementById('modal-container');
    const modalExitButton = document.getElementById('modal-exit');
    
    // Mapa de emojis para los artefactos.
    // **NOTA**: Usa el emoji real del artefacto para Aries si es diferente a '🔱'
    const ARTEFACT_EMOJI_MAP = {
        'aries': '🔱',      // Ejemplo: Yelmo de Bronce
        'tauro': '♉',      // Temporal
        'geminis': '♊',    // Temporal
        'cancer': '♋',     // Temporal
        // Añade el resto de los signos aquí.
    };


    // ===========================================
    // *** LÓGICA DE LA VENTANA MODAL ***
    // ===========================================

    // 1. Mostrar la modal al hacer clic en Aries
    if (ariesButton && modalContainer) {
        ariesButton.addEventListener('click', (event) => {
            // Previene que el navegador siga el enlace '#'
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
            // Si el clic fue directamente en el contenedor (no en el contenido de la modal)
            if (event.target === modalContainer) {
                modalContainer.classList.add('hidden');
            }
        });
    }

    // ===========================================
    // *** LÓGICA DEL INVENTARIO DE ARTEFACTOS ***
    // ===========================================
    function loadArtefacts() {
        // Obtiene la lista de artefactos ganados desde localStorage o inicializa un objeto vacío.
        const gainedArtefacts = JSON.parse(localStorage.getItem('gainedArtefacts')) || {};

        // Selecciona todos los slots de artefactos en el HTML
        const slots = document.querySelectorAll('.artefact-slot');

        slots.forEach(slot => {
            // Obtiene la clave del signo zodiacal desde el ID del slot (ej: 'aries-artefact' -> 'aries')
            const artefactKey = slot.id.replace('-artefact', '');

            // Comprueba si el artefacto ha sido marcado como ganado
            if (gainedArtefacts[artefactKey]) {
                // Si el artefacto fue ganado, lo muestra
                slot.classList.add('unlocked');
                slot.textContent = ARTEFACT_EMOJI_MAP[artefactKey] || '✨'; // Muestra el emoji correspondiente
                slot.setAttribute('title', `Artefacto Ganado: ${slot.dataset.artefact}`);

            } else {
                // Si no se ha ganado, asegurar que esté vacío y bloqueado (opaco)
                slot.classList.remove('unlocked');
                slot.textContent = '';
                slot.setAttribute('title', `Bloqueado: ${slot.dataset.artefact}`);
            }
        });
    }

    // Ejecutar la función para mostrar los artefactos al cargar MundoIndex.html
    loadArtefacts();
});