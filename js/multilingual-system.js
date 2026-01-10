/**
 * ThibEquation Multilingual System
 * Advanced i18n support for French/English with dynamic content switching
 */

class MultilingualSystem {
    constructor() {
        this.currentLanguage = 'fr';
        this.fallbackLanguage = 'fr';
        this.translations = {};
        this.observers = [];
        
        this.loadTranslations();
        this.detectLanguage();
        this.initializeLanguageSwitcher();
    }
    
    loadTranslations() {
        this.translations = {
            fr: {
                // Navigation
                'nav.home': 'Accueil',
                'nav.simulator': 'Simulateur',
                'nav.calculator': 'Calculateur', 
                'nav.variables': 'Variables GKSC',
                'nav.about': 'À Propos',
                'nav.language': 'Language',
                
                // Hero Section
                'hero.title': 'ThibEquation Framework V1.0',
                'hero.subtitle': 'Méthodologie GKSC pour l\'Analyse Quantitative des Objets Interstellaires',
                'hero.description': 'Framework expérimental transformant les observations qualitatives en métriques quantifiables à travers une approche scientifique innovante.',
                'hero.cta.simulator': 'Lancer le Simulateur',
                'hero.cta.learn': 'Apprendre GKSC',
                'hero.cta.calculate': 'Calculer ThibScore',
                
                // Formula Section
                'formula.title': 'Formule GKSC V1.0',
                'formula.equation': 'ThibScore = 0.30×G + 0.30×K + 0.25×S + 0.15×C',
                'formula.description': 'Chaque composante est normalisée sur l\'échelle [0-10] avec pondération scientifiquement justifiée',
                
                // GKSC Components
                'gksc.geometric.title': 'Géométrique (G)',
                'gksc.geometric.description': 'Paramètres de forme et structure morphologique',
                'gksc.geometric.weight': 'Poids: 30%',
                
                'gksc.kinematic.title': 'Cinématique (K)', 
                'gksc.kinematic.description': 'Mouvement et dynamique orbitale',
                'gksc.kinematic.weight': 'Poids: 30%',
                
                'gksc.spectroscopic.title': 'Spectroscopique (S)',
                'gksc.spectroscopic.description': 'Composition et propriétés énergétiques',
                'gksc.spectroscopic.weight': 'Poids: 25%',
                
                'gksc.contextual.title': 'Contextuel (C)',
                'gksc.contextual.description': 'Origine et circonstances temporelles',
                'gksc.contextual.weight': 'Poids: 15%',
                
                // Variables Detail
                'var.g1.title': 'G1 - Taille Apparente',
                'var.g1.description': 'Évaluation de la dimension apparente de l\'objet depuis le point d\'observation',
                'var.g2.title': 'G2 - Forme Géométrique',
                'var.g2.description': 'Analyse de la morphologie et régularité structurelle',
                'var.g3.title': 'G3 - Ratio d\'Aspect',
                'var.g3.description': 'Rapport dimensionnel longueur/largeur observé',
                
                'var.k1.title': 'K1 - Vitesse de Déplacement',
                'var.k1.description': 'Magnitude de la vélocité de translation observée',
                'var.k2.title': 'K2 - Accélération Observée',
                'var.k2.description': 'Changements de vitesse détectés et mesurés',
                'var.k3.title': 'K3 - Changement de Trajectoire',
                'var.k3.description': 'Déviations par rapport à une trajectoire linéaire prédite',
                
                'var.s1.title': 'S1 - Signature Spectrale',
                'var.s1.description': 'Caractéristiques du spectre électromagnétique émis/réfléchi',
                'var.s2.title': 'S2 - Réflectance/Albédo',
                'var.s2.description': 'Coefficient de réflexion de la lumière incidente',
                'var.s3.title': 'S3 - Émissions Détectées',
                'var.s3.description': 'Signaux énergétiques propres émis par l\'objet',
                
                'var.c1.title': 'C1 - Localisation Système',
                'var.c1.description': 'Position relative dans le système d\'observation',
                'var.c2.title': 'C2 - Interaction Gravitationnelle',
                'var.c2.description': 'Effets gravitationnels mesurables sur l\'environnement',
                'var.c3.title': 'C3 - Conditions d\'Observation',
                'var.c3.description': 'Qualité et circonstances de l\'acquisition des données',
                
                // Calculator Interface
                'calc.title': 'Calculateur ThibScore',
                'calc.subtitle': 'Saisissez les valeurs GKSC pour obtenir le score quantitatif',
                'calc.input.placeholder': 'Valeur 0-10',
                'calc.button.calculate': 'Calculer ThibScore',
                'calc.button.reset': 'Réinitialiser',
                'calc.button.export': 'Exporter Résultats',
                
                // Results
                'result.score': 'Score',
                'result.interpretation': 'Interprétation',
                'result.priority.low': 'Objet standard - Priorité d\'investigation faible',
                'result.priority.medium': 'Caractéristiques intéressantes - Suivi recommandé',
                'result.priority.high': 'Objet remarquable - Investigation prioritaire',
                'result.priority.critical': 'Anomalie majeure - Investigation urgente requise',
                
                // Tutorial System
                'tutorial.welcome.title': 'Bienvenue dans ThibEquation',
                'tutorial.welcome.description': 'Ce tutoriel vous guide pas-à-pas dans l\'utilisation du calculateur GKSC',
                'tutorial.step1.title': 'Étape 1: Paramètres Géométriques',
                'tutorial.step1.description': 'Commencez par saisir les valeurs G1, G2 et G3 basées sur vos observations visuelles',
                'tutorial.step2.title': 'Étape 2: Paramètres Cinématiques',
                'tutorial.step2.description': 'Entrez les données de mouvement K1, K2 et K3 selon vos mesures temporelles',
                'tutorial.step3.title': 'Étape 3: Paramètres Spectroscopiques',
                'tutorial.step3.description': 'Renseignez S1, S2 et S3 d\'après vos analyses spectrales',
                'tutorial.step4.title': 'Étape 4: Paramètres Contextuels',
                'tutorial.step4.description': 'Complétez avec C1, C2 et C3 pour le contexte d\'observation',
                'tutorial.step5.title': 'Étape 5: Calcul et Résultats',
                'tutorial.step5.description': 'Lancez le calcul pour obtenir votre ThibScore et son interprétation',
                'tutorial.button.next': 'Suivant',
                'tutorial.button.previous': 'Précédent',
                'tutorial.button.finish': 'Terminer',
                'tutorial.button.skip': 'Passer le tutoriel',
                
                // Glossary
                'glossary.title': 'Glossaire Scientifique GKSC',
                'glossary.search.placeholder': 'Rechercher un terme...',
                
                // Accessibility
                'a11y.skip.content': 'Aller au contenu principal',
                'a11y.language.switcher': 'Sélecteur de langue',
                'a11y.menu.toggle': 'Basculer le menu de navigation',
                'a11y.tutorial.close': 'Fermer le tutoriel',
                'a11y.visualization.description': 'Visualisation 3D interactive des paramètres GKSC',
                
                // Status Messages
                'status.calculating': 'Calcul en cours...',
                'status.error.invalid.input': 'Erreur: Toutes les valeurs doivent être entre 0 et 10',
                'status.success.calculated': 'ThibScore calculé avec succès',
                'status.export.success': 'Résultats exportés avec succès',
                
                // Footer
                'footer.disclaimer': 'Framework expérimental nécessitant validation académique',
                'footer.version': 'Version 1.0.0',
                'footer.author': 'Développé par Thib',
                'footer.license': 'Licence MIT'
            },
            
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.simulator': 'Simulator', 
                'nav.calculator': 'Calculator',
                'nav.variables': 'GKSC Variables',
                'nav.about': 'About',
                'nav.language': 'Langue',
                
                // Hero Section
                'hero.title': 'ThibEquation Framework V1.0',
                'hero.subtitle': 'GKSC Methodology for Quantitative Analysis of Interstellar Objects',
                'hero.description': 'Experimental framework transforming qualitative observations into quantifiable metrics through an innovative scientific approach.',
                'hero.cta.simulator': 'Launch Simulator',
                'hero.cta.learn': 'Learn GKSC',
                'hero.cta.calculate': 'Calculate ThibScore',
                
                // Formula Section  
                'formula.title': 'GKSC V1.0 Formula',
                'formula.equation': 'ThibScore = 0.30×G + 0.30×K + 0.25×S + 0.15×C',
                'formula.description': 'Each component is normalized on [0-10] scale with scientifically justified weighting',
                
                // GKSC Components
                'gksc.geometric.title': 'Geometric (G)',
                'gksc.geometric.description': 'Shape and morphological structure parameters',
                'gksc.geometric.weight': 'Weight: 30%',
                
                'gksc.kinematic.title': 'Kinematic (K)',
                'gksc.kinematic.description': 'Movement and orbital dynamics',
                'gksc.kinematic.weight': 'Weight: 30%',
                
                'gksc.spectroscopic.title': 'Spectroscopic (S)',
                'gksc.spectroscopic.description': 'Composition and energetic properties',
                'gksc.spectroscopic.weight': 'Weight: 25%',
                
                'gksc.contextual.title': 'Contextual (C)',
                'gksc.contextual.description': 'Origin and temporal circumstances',
                'gksc.contextual.weight': 'Weight: 15%',
                
                // Variables Detail
                'var.g1.title': 'G1 - Apparent Size',
                'var.g1.description': 'Assessment of object\'s apparent dimension from observation point',
                'var.g2.title': 'G2 - Geometric Shape',
                'var.g2.description': 'Analysis of morphology and structural regularity',
                'var.g3.title': 'G3 - Aspect Ratio',
                'var.g3.description': 'Observed dimensional length/width relationship',
                
                'var.k1.title': 'K1 - Displacement Velocity',
                'var.k1.description': 'Magnitude of observed translational velocity',
                'var.k2.title': 'K2 - Observed Acceleration',
                'var.k2.description': 'Detected and measured velocity changes',
                'var.k3.title': 'K3 - Trajectory Change',
                'var.k3.description': 'Deviations from predicted linear trajectory',
                
                'var.s1.title': 'S1 - Spectral Signature',
                'var.s1.description': 'Characteristics of emitted/reflected electromagnetic spectrum',
                'var.s2.title': 'S2 - Reflectance/Albedo',
                'var.s2.description': 'Incident light reflection coefficient',
                'var.s3.title': 'S3 - Detected Emissions',
                'var.s3.description': 'Intrinsic energetic signals emitted by object',
                
                'var.c1.title': 'C1 - System Location',
                'var.c1.description': 'Relative position in observation system',
                'var.c2.title': 'C2 - Gravitational Interaction',
                'var.c2.description': 'Measurable gravitational effects on environment',
                'var.c3.title': 'C3 - Observation Conditions',
                'var.c3.description': 'Quality and circumstances of data acquisition',
                
                // Calculator Interface
                'calc.title': 'ThibScore Calculator',
                'calc.subtitle': 'Enter GKSC values to obtain quantitative score',
                'calc.input.placeholder': 'Value 0-10',
                'calc.button.calculate': 'Calculate ThibScore',
                'calc.button.reset': 'Reset',
                'calc.button.export': 'Export Results',
                
                // Results
                'result.score': 'Score',
                'result.interpretation': 'Interpretation',
                'result.priority.low': 'Standard object - Low investigation priority',
                'result.priority.medium': 'Interesting characteristics - Follow-up recommended',
                'result.priority.high': 'Remarkable object - Priority investigation',
                'result.priority.critical': 'Major anomaly - Urgent investigation required',
                
                // Tutorial System
                'tutorial.welcome.title': 'Welcome to ThibEquation',
                'tutorial.welcome.description': 'This tutorial guides you step-by-step through using the GKSC calculator',
                'tutorial.step1.title': 'Step 1: Geometric Parameters',
                'tutorial.step1.description': 'Start by entering G1, G2 and G3 values based on your visual observations',
                'tutorial.step2.title': 'Step 2: Kinematic Parameters',
                'tutorial.step2.description': 'Enter motion data K1, K2 and K3 according to your temporal measurements',
                'tutorial.step3.title': 'Step 3: Spectroscopic Parameters',
                'tutorial.step3.description': 'Fill in S1, S2 and S3 from your spectral analyses',
                'tutorial.step4.title': 'Step 4: Contextual Parameters',
                'tutorial.step4.description': 'Complete with C1, C2 and C3 for observation context',
                'tutorial.step5.title': 'Step 5: Calculation and Results',
                'tutorial.step5.description': 'Run calculation to get your ThibScore and interpretation',
                'tutorial.button.next': 'Next',
                'tutorial.button.previous': 'Previous', 
                'tutorial.button.finish': 'Finish',
                'tutorial.button.skip': 'Skip Tutorial',
                
                // Glossary
                'glossary.title': 'GKSC Scientific Glossary',
                'glossary.search.placeholder': 'Search term...',
                
                // Accessibility
                'a11y.skip.content': 'Skip to main content',
                'a11y.language.switcher': 'Language switcher',
                'a11y.menu.toggle': 'Toggle navigation menu',
                'a11y.tutorial.close': 'Close tutorial',
                'a11y.visualization.description': 'Interactive 3D visualization of GKSC parameters',
                
                // Status Messages
                'status.calculating': 'Calculating...',
                'status.error.invalid.input': 'Error: All values must be between 0 and 10',
                'status.success.calculated': 'ThibScore calculated successfully',
                'status.export.success': 'Results exported successfully',
                
                // Footer
                'footer.disclaimer': 'Experimental framework requiring academic validation',
                'footer.version': 'Version 1.0.0',
                'footer.author': 'Developed by Thib',
                'footer.license': 'MIT License'
            }
        };
    }
    
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('thibequation-language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
            return;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) {
            this.currentLanguage = 'en';
        } else {
            this.currentLanguage = 'fr'; // Default to French
        }
        
        this.saveLanguage();
    }
    
    initializeLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        let switcher = document.getElementById('language-switcher');
        if (!switcher) {
            switcher = this.createLanguageSwitcher();
        }
        
        this.updateLanguageSwitcher(switcher);
        this.translatePage();
    }
    
    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.id = 'language-switcher';
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button id="lang-fr" class="lang-btn ${this.currentLanguage === 'fr' ? 'active' : ''}" 
                    data-lang="fr" aria-label="${this.t('a11y.language.switcher')} - Français">
                FR
            </button>
            <button id="lang-en" class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" 
                    data-lang="en" aria-label="${this.t('a11y.language.switcher')} - English">
                EN
            </button>
        `;
        
        // Add to page (try multiple locations)
        const nav = document.querySelector('nav') || document.querySelector('.navbar');
        const header = document.querySelector('header');
        const body = document.body;
        
        if (nav) {
            nav.appendChild(switcher);
        } else if (header) {
            header.appendChild(switcher);
        } else {
            // Create floating switcher
            switcher.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                padding: 5px;
                display: flex;
                gap: 5px;
            `;
            body.appendChild(switcher);
        }
        
        // Add event listeners
        switcher.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                this.switchLanguage(e.target.dataset.lang);
            }
        });
        
        return switcher;
    }
    
    updateLanguageSwitcher(switcher) {
        const buttons = switcher.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }
    
    switchLanguage(newLang) {
        if (this.translations[newLang] && newLang !== this.currentLanguage) {
            this.currentLanguage = newLang;
            this.saveLanguage();
            this.translatePage();
            this.updateLanguageSwitcher(document.getElementById('language-switcher'));
            
            // Notify observers
            this.observers.forEach(callback => callback(newLang));
        }
    }
    
    saveLanguage() {
        localStorage.setItem('thibequation-language', this.currentLanguage);
    }
    
    t(key, variables = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations[this.fallbackLanguage]?.[key] || 
                          key;
        
        // Replace variables in translation
        return Object.keys(variables).reduce((text, variable) => {
            return text.replace(`{{${variable}}}`, variables[variable]);
        }, translation);
    }
    
    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = translation;
            } else if (element.hasAttribute('aria-label')) {
                element.setAttribute('aria-label', translation);
            } else {
                element.textContent = translation;
            }
        });
        
        // Translate elements with data-i18n-html attribute (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });
        
        // Update page title and meta
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.getAttribute('data-i18n')) {
            titleElement.textContent = this.t(titleElement.getAttribute('data-i18n'));
        }
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    }
    
    // Observer pattern for language change notifications
    onLanguageChange(callback) {
        this.observers.push(callback);
    }
    
    offLanguageChange(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}

// Initialize global instance
window.i18n = new MultilingualSystem();

// CSS for language switcher
const switcherStyles = `
<style>
.language-switcher {
    display: flex;
    gap: 5px;
    align-items: center;
}

.lang-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.8);
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-transform: uppercase;
}

.lang-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: scale(1.05);
}

.lang-btn.active {
    background: rgba(59, 130, 246, 0.8);
    border-color: #3b82f6;
    color: white;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.lang-btn:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}
</style>`;

document.head.insertAdjacentHTML('beforeend', switcherStyles);