// ThibEquation Framework - Main JavaScript
// Gestion de la navigation et des interactions de base

document.addEventListener('DOMContentLoaded', function() {
    console.log('ThibEquation Framework v5.0 - Initialisation...');
    
    // Charger le header de navigation
    fetch('/components/header-navigation.html')
        .then(response => response.text())
        .then(html => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = html;
                console.log('✓ Header chargé');
            }
        })
        .catch(error => console.error('Erreur chargement header:', error));
    
    // Charger le footer global
    fetch('/components/footer-global.html')
        .then(response => response.text())
        .then(html => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = html;
                console.log('✓ Footer chargé');
            }
        })
        .catch(error => console.error('Erreur chargement footer:', error));
    
    console.log('ThibEquation Framework - JavaScript initialisé');
});
