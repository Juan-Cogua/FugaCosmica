document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todas las imágenes de nivel
    const levelImages = document.querySelectorAll('.level-image');

    // Asignar la función de navegación a cada imagen
    levelImages.forEach(image => {
        image.addEventListener('click', () => {
            // Obtener la URL del nivel (ej: "Nivel1/Nivel1Index.html")
            const url = image.getAttribute('data-level-url');
            
            // Navegar a la URL
            window.location.href = url;
        });
    });
});