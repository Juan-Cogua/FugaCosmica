document.addEventListener('DOMContentLoaded', () => {
    const quitButton = document.getElementById('quit-button');

    if (quitButton) {
        quitButton.addEventListener('click', () => {
            // Lógica para intentar salir del navegador.
            // window.close() es el método estándar, aunque solo funciona si la ventana fue abierta por un script.
            window.close();
            
            // Mensaje de respaldo en caso de que window.close() sea bloqueado por el navegador
            alert('Saliendo de la aplicación. ¡Gracias por jugar!');
        });
    }
});