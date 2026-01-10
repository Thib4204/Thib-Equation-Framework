/**
 * 🚀 ThibEquation Framework - Système de Bandeau BÊTA Spectaculaire
 * Version: 2.0.0-BETA
 * Auteur: Thib4204
 * 
 * Gestion du bandeau de transparence "BÊTA - Sources & Méthodes"
 * avec animations spectaculaires et informations détaillées
 */

class BetaBannerSystem {
    constructor(options = {}) {
        this.options = {
            autoShow: true,
            position: 'top', // 'top' ou 'bottom'
            theme: 'cosmic', // 'cosmic', 'scientific', 'minimal'
            showMethodsLink: true,
            showDisclaimerLink: true,
            collapsible: true,
            persistState: true,
            animationDuration: 600,
            ...options
        };
        
        this.isCollapsed = false;
        this.banner = null;
        
        this.init();
    }
    
    init() {
        this.loadState();
        this.createBanner();
        this.attachEventListeners();
        
        if (this.options.autoShow) {
            this.show();
        }
        
        // Accessibilité clavier
        this.setupKeyboardNavigation();
    }
    
    createBanner() {
        // Création du conteneur principal
        this.banner = document.createElement('div');
        this.banner.id = 'thibequation-beta-banner';
        this.banner.className = `beta-banner beta-banner--${this.options.theme} beta-banner--${this.options.position}`;
        this.banner.setAttribute('role', 'alert');
        this.banner.setAttribute('aria-live', 'polite');
        this.banner.setAttribute('aria-label', 'Avertissement statut BÊTA du framework');
        
        // Contenu du bandeau
        this.banner.innerHTML = `
            <div class="beta-banner__container">
                <div class="beta-banner__content">
                    <!-- Icône et Badge BÊTA -->
                    <div class="beta-banner__badge">
                        <div class="beta-banner__badge-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <span class="beta-banner__badge-text">BÊTA</span>
                    </div>
                    
                    <!-- Message Principal -->
                    <div class="beta-banner__message">
                        <h3 class="beta-banner__title">
                            Framework en Développement Actif – Transparence Scientifique
                        </h3>
                        <p class="beta-banner__text">
                            Le <strong>ThibEquation Framework v2.0</strong> est un cadre méthodologique 
                            <strong>exploratoire</strong> en cours de validation. 
                            Statut <strong>BÊTA</strong> : limitations méthodologiques et absence de peer-review complet.
                        </p>
                    </div>
                    
                    <!-- Liens d'Action -->
                    <div class="beta-banner__actions">
                        ${this.options.showDisclaimerLink ? `
                            <a href="DISCLAIMER_BETA.md" class="beta-banner__link beta-banner__link--primary" 
                               target="_blank" rel="noopener noreferrer"
                               aria-label="Lire l'avertissement complet sur les limitations du framework">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                Lire l'Avertissement Complet
                            </a>
                        ` : ''}
                        
                        ${this.options.showMethodsLink ? `
                            <a href="METHODS_TEMPLATE.md" class="beta-banner__link beta-banner__link--secondary"
                               target="_blank" rel="noopener noreferrer"
                               aria-label="Consulter la documentation méthodologique détaillée">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                                </svg>
                                Documentation Méthodologique
                            </a>
                        ` : ''}
                    </div>
                    
                    <!-- Bouton de Réduction -->
                    ${this.options.collapsible ? `
                        <button class="beta-banner__collapse-btn" 
                                aria-label="Réduire le bandeau BÊTA"
                                aria-expanded="true"
                                title="Réduire / Restaurer le bandeau">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="18 15 12 9 6 15"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                <!-- Version et Informations Additionnelles (quand réduit) -->
                <div class="beta-banner__collapsed-info">
                    <span class="beta-banner__version">v2.0.0-BETA</span>
                    <span class="beta-banner__status-dot" title="Statut: En développement"></span>
                    <button class="beta-banner__expand-btn" 
                            aria-label="Développer le bandeau BÊTA"
                            aria-expanded="false"
                            title="Afficher les informations complètes">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Insertion dans le DOM
        if (this.options.position === 'top') {
            document.body.insertBefore(this.banner, document.body.firstChild);
        } else {
            document.body.appendChild(this.banner);
        }
        
        // Application de l'état sauvegardé
        if (this.isCollapsed) {
            this.banner.classList.add('beta-banner--collapsed');
        }
    }
    
    attachEventListeners() {
        // Bouton de réduction
        const collapseBtn = this.banner.querySelector('.beta-banner__collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => this.collapse());
        }
        
        // Bouton d'expansion
        const expandBtn = this.banner.querySelector('.beta-banner__expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.expand());
        }
        
        // Animation de pulsation pour attirer l'attention (une seule fois)
        setTimeout(() => {
            this.banner.classList.add('beta-banner--attention');
            setTimeout(() => {
                this.banner.classList.remove('beta-banner--attention');
            }, 3000);
        }, 1000);
    }
    
    setupKeyboardNavigation() {
        // Support des raccourcis clavier
        document.addEventListener('keydown', (e) => {
            // Alt + B pour toggle le bandeau
            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    show() {
        this.banner.style.display = 'block';
        setTimeout(() => {
            this.banner.classList.add('beta-banner--visible');
        }, 10);
    }
    
    hide() {
        this.banner.classList.remove('beta-banner--visible');
        setTimeout(() => {
            this.banner.style.display = 'none';
        }, this.options.animationDuration);
    }
    
    collapse() {
        this.isCollapsed = true;
        this.banner.classList.add('beta-banner--collapsed');
        
        // Mise à jour des attributs ARIA
        const collapseBtn = this.banner.querySelector('.beta-banner__collapse-btn');
        if (collapseBtn) {
            collapseBtn.setAttribute('aria-expanded', 'false');
        }
        
        const expandBtn = this.banner.querySelector('.beta-banner__expand-btn');
        if (expandBtn) {
            expandBtn.setAttribute('aria-expanded', 'true');
        }
        
        this.saveState();
        this.announceChange('Bandeau BÊTA réduit');
    }
    
    expand() {
        this.isCollapsed = false;
        this.banner.classList.remove('beta-banner--collapsed');
        
        // Mise à jour des attributs ARIA
        const collapseBtn = this.banner.querySelector('.beta-banner__collapse-btn');
        if (collapseBtn) {
            collapseBtn.setAttribute('aria-expanded', 'true');
        }
        
        const expandBtn = this.banner.querySelector('.beta-banner__expand-btn');
        if (expandBtn) {
            expandBtn.setAttribute('aria-expanded', 'false');
        }
        
        this.saveState();
        this.announceChange('Bandeau BÊTA développé');
    }
    
    toggle() {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }
    
    saveState() {
        if (this.options.persistState) {
            localStorage.setItem('thibequation-beta-banner-collapsed', this.isCollapsed);
        }
    }
    
    loadState() {
        if (this.options.persistState) {
            const saved = localStorage.getItem('thibequation-beta-banner-collapsed');
            this.isCollapsed = saved === 'true';
        }
    }
    
    announceChange(message) {
        // Annonce pour les lecteurs d'écran
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    destroy() {
        if (this.banner && this.banner.parentNode) {
            this.banner.parentNode.removeChild(this.banner);
        }
    }
}

// Auto-initialisation si la page contient l'attribut data-beta-banner
document.addEventListener('DOMContentLoaded', () => {
    const autoBanner = document.querySelector('[data-beta-banner]');
    if (autoBanner) {
        const options = {
            theme: autoBanner.dataset.betaBannerTheme || 'cosmic',
            position: autoBanner.dataset.betaBannerPosition || 'top',
            collapsible: autoBanner.dataset.betaBannerCollapsible !== 'false',
        };
        
        window.thibBetaBanner = new BetaBannerSystem(options);
    }
});

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BetaBannerSystem;
}