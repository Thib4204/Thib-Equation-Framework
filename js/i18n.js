/**
 * ThibEquation Framework - Multi-language System (FR/EN)
 * Author: Pascal Thibodeau
 * Version: 5.0
 */

const translations = {
    fr: {
        // Navigation
        'nav-home': 'Accueil',
        'nav-methodology': 'Méthodologie GKSC',
        'nav-calculator': 'Calculateur Détaillé',
        'nav-data': 'Données Sources',
        'nav-tools': 'Outils & Visualisations',
        'nav-collab': 'Collaboration v5.0',
        'nav-framework': 'Framework Scientifique',
        'nav-research': 'Recherche Interstellaire',
        'nav-feedback': 'Feedback',
        
        // Hero Section
        'hero-subtitle': 'Analyse d\'Objets Interstellaires',
        
        // Calculator Page
        'calc-title': '🧮 Calculateur GKSC Interactif',
        'calc-subtitle': 'Calcul du ThibScore pour objets interstellaires avec validation empirique R²=0.85',
        'calc-mode-auto': 'Mode Automatique',
        'calc-mode-manual': 'Mode Manuel',
        'calc-object-search': 'Recherche d\'objet',
        'calc-object-placeholder': 'Ex: 1I/\'Oumuamua, 2I/Borisov, 3I/ATLAS, 67P/Churyumov...',
        'calc-search-btn': '🔍 Rechercher',
        'calc-quick-suggestions': 'Suggestions rapides :',
        'calc-geometric': 'G - Géométrique',
        'calc-kinematic': 'K - Cinématique',
        'calc-spectroscopic': 'S - Spectroscopique',
        'calc-contextual': 'C - Contextuel',
        'calc-calculate': '🧮 Calculer ThibScore',
        'calc-result': 'ThibScore',
        
        // Catalogue Page
        'cat-title': '📚 Catalogue Objets Interstellaires',
        'cat-subtitle': 'Base de données complète de 46 objets du système solaire avec scores ThibEquation validés empiriquement',
        'cat-search-placeholder': '🔍 Rechercher par nom (ex: Oumuamua, Borisov, Halley...)',
        'cat-filter-all-types': 'Tous Types',
        'cat-filter-interstellar': 'Interstellaires',
        'cat-filter-comet': 'Comètes',
        'cat-filter-asteroid': 'Astéroïdes',
        'cat-filter-all-scores': 'Tous Scores',
        'cat-filter-high': 'ThibScore > 7',
        'cat-filter-medium': 'ThibScore 5-7',
        'cat-filter-low': 'ThibScore < 5',
        'cat-stat-total': 'Objets Totaux',
        'cat-stat-interstellar': 'Interstellaires',
        'cat-stat-comets': 'Comètes',
        'cat-stat-asteroids': 'Astéroïdes',
        'cat-type-interstellar': 'INTERSTELLAIRE',
        'cat-type-comet': 'COMÈTE',
        'cat-type-asteroid': 'ASTÉROÏDE',
        'cat-param-eccentricity': 'Excentricité',
        'cat-param-vinf': 'v∞ (km/s)',
        'cat-param-vperi': 'v_périhélie (km/s)',
        'cat-param-discovery': 'Découverte',
        'cat-param-source': 'Source',
        
        // Methodology Page
        'method-title': '📐 Méthodologie GKSC',
        'method-subtitle': 'Cadre mathématique pour quantifier l\'anomalie des objets interstellaires',
        'method-formula': 'Formule ThibScore',
        'method-components': 'Composantes GKSC',
        'method-validation': 'Validation Empirique',
        
        // Trajectories Page
        'traj-title': '🛸 Trajectoires Interstellaires',
        'traj-subtitle': 'Visualisation des trajectoires hyperboliques d\'objets interstellaires confirmés',
        'traj-custom': 'Calculateur de Trajectoire Personnalisé',
        'traj-semi-major': 'Demi-grand axe (a) [UA]',
        'traj-eccentricity': 'Excentricité (e)',
        'traj-inclination': 'Inclinaison (i) [°]',
        'traj-vinf': 'Vitesse hyperbolique v∞ [km/s]',
        'traj-calculate': '📐 Calculer Trajectoire',
        'traj-reset': '🔄 Réinitialiser',
        
        // Validation Page
        'valid-title': '✅ Statut Validation Empirique',
        'valid-subtitle': 'Métriques de validation scientifique du framework ThibEquation sur 46 objets du système solaire',
        'valid-r2': 'Coefficient R²',
        'valid-mae': 'Erreur Absolue Moyenne',
        'valid-rmse': 'Erreur Quadratique',
        'valid-objects': 'Objets Validés',
        'valid-formula': 'Formule ThibScore (Ridge Regression α=0.1)',
        'valid-cross': 'Validation Croisée 5-Fold',
        'valid-metrics': 'Métriques de Performance',
        
        // Common
        'loading': 'Chargement...',
        'error': 'Erreur',
        'calculate': 'Calculer',
        'reset': 'Réinitialiser',
        'search': 'Rechercher',
        'filter': 'Filtrer',
        'results': 'Résultats',
        'details': 'Détails',
        'close': 'Fermer'
    },
    
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-methodology': 'GKSC Methodology',
        'nav-calculator': 'Detailed Calculator',
        'nav-data': 'Data Sources',
        'nav-tools': 'Tools & Visualizations',
        'nav-collab': 'Collaboration v5.0',
        'nav-framework': 'Scientific Framework',
        'nav-research': 'Interstellar Research',
        'nav-feedback': 'Feedback',
        
        // Hero Section
        'hero-subtitle': 'Interstellar Object Analysis',
        
        // Calculator Page
        'calc-title': '🧮 Interactive GKSC Calculator',
        'calc-subtitle': 'ThibScore calculation for interstellar objects with empirical validation R²=0.85',
        'calc-mode-auto': 'Automatic Mode',
        'calc-mode-manual': 'Manual Mode',
        'calc-object-search': 'Object Search',
        'calc-object-placeholder': 'Ex: 1I/\'Oumuamua, 2I/Borisov, 3I/ATLAS, 67P/Churyumov...',
        'calc-search-btn': '🔍 Search',
        'calc-quick-suggestions': 'Quick suggestions:',
        'calc-geometric': 'G - Geometric',
        'calc-kinematic': 'K - Kinematic',
        'calc-spectroscopic': 'S - Spectroscopic',
        'calc-contextual': 'C - Contextual',
        'calc-calculate': '🧮 Calculate ThibScore',
        'calc-result': 'ThibScore',
        
        // Catalogue Page
        'cat-title': '📚 Interstellar Objects Catalogue',
        'cat-subtitle': 'Complete database of 46 solar system objects with empirically validated ThibEquation scores',
        'cat-search-placeholder': '🔍 Search by name (ex: Oumuamua, Borisov, Halley...)',
        'cat-filter-all-types': 'All Types',
        'cat-filter-interstellar': 'Interstellar',
        'cat-filter-comet': 'Comets',
        'cat-filter-asteroid': 'Asteroids',
        'cat-filter-all-scores': 'All Scores',
        'cat-filter-high': 'ThibScore > 7',
        'cat-filter-medium': 'ThibScore 5-7',
        'cat-filter-low': 'ThibScore < 5',
        'cat-stat-total': 'Total Objects',
        'cat-stat-interstellar': 'Interstellar',
        'cat-stat-comets': 'Comets',
        'cat-stat-asteroids': 'Asteroids',
        'cat-type-interstellar': 'INTERSTELLAR',
        'cat-type-comet': 'COMET',
        'cat-type-asteroid': 'ASTEROID',
        'cat-param-eccentricity': 'Eccentricity',
        'cat-param-vinf': 'v∞ (km/s)',
        'cat-param-vperi': 'v_perihelion (km/s)',
        'cat-param-discovery': 'Discovery',
        'cat-param-source': 'Source',
        
        // Methodology Page
        'method-title': '📐 GKSC Methodology',
        'method-subtitle': 'Mathematical framework to quantify interstellar object anomaly',
        'method-formula': 'ThibScore Formula',
        'method-components': 'GKSC Components',
        'method-validation': 'Empirical Validation',
        
        // Trajectories Page
        'traj-title': '🛸 Interstellar Trajectories',
        'traj-subtitle': 'Visualization of hyperbolic trajectories of confirmed interstellar objects',
        'traj-custom': 'Custom Trajectory Calculator',
        'traj-semi-major': 'Semi-major axis (a) [AU]',
        'traj-eccentricity': 'Eccentricity (e)',
        'traj-inclination': 'Inclination (i) [°]',
        'traj-vinf': 'Hyperbolic velocity v∞ [km/s]',
        'traj-calculate': '📐 Calculate Trajectory',
        'traj-reset': '🔄 Reset',
        
        // Validation Page
        'valid-title': '✅ Empirical Validation Status',
        'valid-subtitle': 'Scientific validation metrics of ThibEquation framework on 46 solar system objects',
        'valid-r2': 'R² Coefficient',
        'valid-mae': 'Mean Absolute Error',
        'valid-rmse': 'Root Mean Square Error',
        'valid-objects': 'Validated Objects',
        'valid-formula': 'ThibScore Formula (Ridge Regression α=0.1)',
        'valid-cross': '5-Fold Cross-Validation',
        'valid-metrics': 'Performance Metrics',
        
        // Common
        'loading': 'Loading...',
        'error': 'Error',
        'calculate': 'Calculate',
        'reset': 'Reset',
        'search': 'Search',
        'filter': 'Filter',
        'results': 'Results',
        'details': 'Details',
        'close': 'Close'
    }
};

// Language management functions
function setLanguage(lang) {
    // Save preference
    localStorage.setItem('thibequation-lang', lang);
    
    // Update buttons
    const btnFr = document.getElementById('btn-fr');
    const btnEn = document.getElementById('btn-en');
    if (btnFr && btnEn) {
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');
    }
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Check if element is an input placeholder
            if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Auto-detect browser language or load saved preference
function initLanguage() {
    let lang = localStorage.getItem('thibequation-lang');
    
    // If no saved preference, detect browser language
    if (!lang) {
        const browserLang = navigator.language || navigator.userLanguage;
        lang = browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    
    setLanguage(lang);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}
