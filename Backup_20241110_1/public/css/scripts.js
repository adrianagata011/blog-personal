document.addEventListener('DOMContentLoaded', function () {
    // Validación simple para el formulario de comentarios
    const commentForm = document.querySelector('form');
    const authorInput = document.querySelector('input[name="author"]');
    const textInput = document.querySelector('textarea[name="text"]');

    commentForm.addEventListener('submit', function (event) {
        if (!authorInput.value.trim() || !textInput.value.trim()) {
            event.preventDefault();
            alert('Por favor, complete todos los campos antes de enviar.');
        }
    });

    // Ejemplo de una funcionalidad adicional: botón "Volver arriba"
    const backToTopButton = document.createElement('button');
    backToTopButton.innerText = 'Volver arriba';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.display = 'none';
    backToTopButton.style.backgroundColor = '#4CAF50';
    backToTopButton.style.color = 'white';
    backToTopButton.style.padding = '10px';
    backToTopButton.style.border = 'none';
    backToTopButton.style.borderRadius = '5px';
    backToTopButton.style.cursor = 'pointer';

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
