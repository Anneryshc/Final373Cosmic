// Obtener elementos
const modal = document.getElementById('modal');
const openButtons = document.querySelectorAll('.start-reading-btn, .btn-get-started');
const closeModal = document.getElementById('closeModal');

// Mostrar modal
openButtons.forEach(button => {
    button.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
