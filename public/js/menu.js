// Toggle del menú móvil
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Cerrar el menú cuando se hace clic en un enlace
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
    });
});