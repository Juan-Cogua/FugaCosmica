document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones de menú
    const buttons = document.querySelectorAll('.menu-button');

    // Recorrer cada botón y añadir un "event listener" para el clic
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtener el valor del atributo 'data-target'
            const target = button.getAttribute('data-target');

            if (target === 'quit') {
                // Lógica para el botón QUIT
                // window.close() es la forma estándar de cerrar una ventana/pestaña
                // PERO, por razones de seguridad, la mayoría de los navegadores solo permiten
                // cerrar ventanas que fueron abiertas por el mismo script.
                // Como alternativa, podemos redirigir a una página en blanco o mostrar un mensaje.
                
                // Opción 1: Intentar cerrar la ventana (a menudo no funciona)
                window.close(); 
                
                // Opción 2 (más fiable para simular "salir"): Redirigir a Google o una página de despedida
                // window.location.href = 'about:blank';
                alert('Saliendo de la aplicación. ¡Gracias por jugar!');

            } else {
                // Lógica para los botones GAMEPLAY y SETTINGS
                // Redirigir a la URL especificada en 'data-target'
                window.location.href = target;
            }
        });
    });
});