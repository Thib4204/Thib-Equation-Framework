/**
 * ThibEquation Scientific Glossary System
 * Contextual pop-up glossary for GKSC scientific terminology with multilingual support
 */

class ScientificGlossary {
    constructor() {
        this.glossaryData = {};
        this.popup = null;
        this.isVisible = false;
        this.currentTerm = null;
        this.searchIndex = new Map();
        
        this.loadGlossaryData();
        this.createPopupElement();
        this.initializeTermDetection();
        this.createGlossaryInterface();
    }
    
    loadGlossaryData() {
        this.glossaryData = {
            fr: {
                // GKSC Core Terms
                'gksc': {
                    term: 'GKSC',
                    full: 'Géométrique, Cinématique, Spectroscopique, Contextuel',
                    definition: 'Méthodologie quadri-dimensionnelle pour l\'analyse quantitative des objets interstellaires, basée sur quatre catégories de paramètres observationnels.',
                    category: 'methodology',
                    related: ['thibscore', 'parametres', 'ponderation'],
                    etymology: 'Acronyme créé pour le ThibEquation Framework V1.0'
                },
                
                'thibscore': {
                    term: 'ThibScore',
                    full: 'Score Quantitatif ThibEquation',
                    definition: 'Métrique numérique résultant du calcul GKSC, exprimée sur une échelle de 0 à 10, indiquant le niveau d\'anomalie ou d\'intérêt scientifique d\'un objet interstellaire.',
                    formula: 'ThibScore = 0.30×G + 0.30×K + 0.25×S + 0.15×C',
                    category: 'metric',
                    related: ['gksc', 'ponderation', 'priorite'],
                    interpretation: {
                        '0-3': 'Objet standard - Priorité faible',
                        '3-6': 'Caractéristiques intéressantes - Suivi recommandé', 
                        '6-8': 'Objet remarquable - Investigation prioritaire',
                        '8-10': 'Anomalie majeure - Investigation urgente'
                    }
                },
                
                // Geometric Parameters
                'geometrique': {
                    term: 'Paramètre Géométrique (G)',
                    definition: 'Ensemble de mesures caractérisant la forme, la structure et les dimensions observables d\'un objet interstellaire.',
                    category: 'parameter',
                    weight: '30%',
                    components: ['G1 - Taille Apparente', 'G2 - Forme Géométrique', 'G3 - Ratio d\'Aspect'],
                    related: ['morphologie', 'dimensions', 'observation'],
                    examples: 'Sphère parfaite (G2=1), Cigare allongé (G3=8), Dimension kilométrique (G1=9)'
                },
                
                'taille-apparente': {
                    term: 'Taille Apparente (G1)',
                    definition: 'Dimension angulaire ou linéaire perçue de l\'objet depuis le point d\'observation, normalisée selon l\'échelle de référence.',
                    category: 'geometric',
                    unit: 'Échelle 0-10',
                    related: ['distance', 'magnitude', 'resolution'],
                    measurement: 'Photométrie, astrométrie, radar'
                },
                
                'forme-geometrique': {
                    term: 'Forme Géométrique (G2)', 
                    definition: 'Régularité et caractéristiques morphologiques de la structure observée, évaluant la conformité aux formes géométriques connues.',
                    category: 'geometric',
                    examples: 'Sphérique (2-3), Cylindrique (4-6), Complexe/Irrégulière (7-10)',
                    related: ['morphologie', 'symetrie', 'structure']
                },
                
                'ratio-aspect': {
                    term: 'Ratio d\'Aspect (G3)',
                    definition: 'Rapport dimensionnel entre la longueur et la largeur de l\'objet, caractérisant son élongation.',
                    category: 'geometric', 
                    formula: 'Ratio = Longueur / Largeur',
                    interpretation: 'Valeurs élevées indiquent des objets allongés (type cigare)',
                    related: ['elongation', 'dimensions', 'orientation']
                },
                
                // Kinematic Parameters
                'cinematique': {
                    term: 'Paramètre Cinématique (K)',
                    definition: 'Ensemble de mesures caractérisant le mouvement, la dynamique et les changements de trajectoire d\'un objet dans l\'espace-temps.',
                    category: 'parameter',
                    weight: '30%',
                    components: ['K1 - Vitesse de Déplacement', 'K2 - Accélération Observée', 'K3 - Changement de Trajectoire'],
                    related: ['mouvement', 'dynamique', 'trajectoire']
                },
                
                'vitesse-deplacement': {
                    term: 'Vitesse de Déplacement (K1)',
                    definition: 'Magnitude vectorielle de la vélocité de translation observée, évaluée relativement aux vitesses orbitales classiques.',
                    category: 'kinematic',
                    unit: 'km/s normalisé',
                    related: ['velocite', 'mouvement', 'translation'],
                    reference: 'Vitesses orbitales planétaires comme référence'
                },
                
                'acceleration-observee': {
                    term: 'Accélération Observée (K2)',
                    definition: 'Changements mesurés dans le vecteur vitesse, incluant les accélérations gravitationnelles et non-gravitationnelles.',
                    category: 'kinematic',
                    examples: 'Accélération solaire sur comètes, déviations inexpliquées',
                    related: ['force', 'gravitation', 'propulsion']
                },
                
                'changement-trajectoire': {
                    term: 'Changement de Trajectoire (K3)',
                    definition: 'Déviations par rapport à une orbite képlérienne prédite, quantifiant les manœuvres ou perturbations observées.',
                    category: 'kinematic',
                    measurement: 'Écart RMS par rapport à la trajectoire calculée',
                    related: ['orbite', 'perturbation', 'manoeuvre']
                },
                
                // Spectroscopic Parameters
                'spectroscopique': {
                    term: 'Paramètre Spectroscopique (S)',
                    definition: 'Ensemble de mesures caractérisant la composition, les émissions et les propriétés électromagnétiques de l\'objet.',
                    category: 'parameter',
                    weight: '25%',
                    components: ['S1 - Signature Spectrale', 'S2 - Réflectance/Albédo', 'S3 - Émissions Détectées'],
                    related: ['spectrométrie', 'composition', 'emissions']
                },
                
                'signature-spectrale': {
                    term: 'Signature Spectrale (S1)',
                    definition: 'Profil caractéristique du spectre électromagnétique émis ou réfléchi, révélant la composition chimique et l\'état physique.',
                    category: 'spectroscopic',
                    wavelength: 'Visible, IR, UV, radio',
                    related: ['spectrométrie', 'composition', 'raies'],
                    analysis: 'Comparaison avec spectres de référence'
                },
                
                'reflectance-albedo': {
                    term: 'Réflectance/Albédo (S2)',
                    definition: 'Coefficient de réflexion de la lumière incidente, caractérisant les propriétés de surface et la composition superficielle.',
                    category: 'spectroscopic',
                    range: '0 (absorption totale) à 1 (réflexion parfaite)',
                    related: ['surface', 'photométrie', 'matériaux']
                },
                
                'emissions-detectees': {
                    term: 'Émissions Détectées (S3)',
                    definition: 'Signaux énergétiques propres émis par l\'objet, incluant radiations thermiques, radio, ou autres phénomènes électromagnétiques.',
                    category: 'spectroscopic',
                    types: 'Thermique, radio, X, gamma, cohérente',
                    related: ['radiation', 'energie', 'temperature']
                },
                
                // Contextual Parameters
                'contextuel': {
                    term: 'Paramètre Contextuel (C)',
                    definition: 'Ensemble de mesures caractérisant l\'environnement, l\'origine et les circonstances d\'observation de l\'objet.',
                    category: 'parameter', 
                    weight: '15%',
                    components: ['C1 - Localisation Système', 'C2 - Interaction Gravitationnelle', 'C3 - Conditions d\'Observation'],
                    related: ['environnement', 'contexte', 'observation']
                },
                
                'localisation-systeme': {
                    term: 'Localisation Système (C1)',
                    definition: 'Position relative dans le système d\'observation, incluant coordonnées orbitales et relation aux corps célestes connus.',
                    category: 'contextual',
                    coordinates: 'Héliocentriques, géocentriques, galactiques',
                    related: ['position', 'orbite', 'reference']
                },
                
                'interaction-gravitationnelle': {
                    term: 'Interaction Gravitationnelle (C2)',
                    definition: 'Effets gravitationnels mesurables exercés sur l\'environnement ou subis par l\'objet, révélant masse et densité.',
                    category: 'contextual',
                    effects: 'Perturbations orbitales, déflexion lumineuse, marées',
                    related: ['gravitation', 'masse', 'densité']
                },
                
                'conditions-observation': {
                    term: 'Conditions d\'Observation (C3)',
                    definition: 'Qualité et circonstances de l\'acquisition des données, affectant la fiabilité et précision des mesures.',
                    category: 'contextual',
                    factors: 'Seeing, extinction, bruit instrumental, durée',
                    related: ['qualité', 'précision', 'incertitude']
                },
                
                // General Scientific Terms
                'interstellaire': {
                    term: 'Objet Interstellaire',
                    definition: 'Corps céleste originaire d\'un système stellaire externe au système solaire, caractérisé par une trajectoire hyperbolique.',
                    category: 'astronomy',
                    examples: '1I/\'Oumuamua (2017), 2I/Borisov (2019)',
                    related: ['hyperbolique', 'exosolaire', 'visiteur']
                },
                
                'ponderation': {
                    term: 'Pondération GKSC',
                    definition: 'Système de poids relatifs appliqués aux composantes G, K, S, C selon leur importance scientifique dans l\'analyse.',
                    category: 'methodology',
                    weights: 'G=30%, K=30%, S=25%, C=15%',
                    rationale: 'Basé sur l\'observabilité et la significativité astronomique',
                    related: ['thibscore', 'gksc', 'méthodologie']
                },
                
                'anomalie': {
                    term: 'Anomalie Astronomique',
                    definition: 'Caractéristique ou comportement d\'un objet céleste s\'écartant significativement des modèles théoriques standards.',
                    category: 'analysis',
                    detection: 'Écart statistique > 3σ par rapport aux prédictions',
                    related: ['déviation', 'inexpliqué', 'investigation']
                }
            },
            
            en: {
                // English translations of key terms
                'gksc': {
                    term: 'GKSC',
                    full: 'Geometric, Kinematic, Spectroscopic, Contextual',
                    definition: 'Four-dimensional methodology for quantitative analysis of interstellar objects, based on four categories of observational parameters.',
                    category: 'methodology',
                    related: ['thibscore', 'parameters', 'weighting'],
                    etymology: 'Acronym created for ThibEquation Framework V1.0'
                },
                
                'thibscore': {
                    term: 'ThibScore',
                    full: 'ThibEquation Quantitative Score',
                    definition: 'Numerical metric resulting from GKSC calculation, expressed on a scale of 0 to 10, indicating the level of anomaly or scientific interest of an interstellar object.',
                    formula: 'ThibScore = 0.30×G + 0.30×K + 0.25×S + 0.15×C',
                    category: 'metric',
                    related: ['gksc', 'weighting', 'priority'],
                    interpretation: {
                        '0-3': 'Standard object - Low priority',
                        '3-6': 'Interesting characteristics - Follow-up recommended',
                        '6-8': 'Remarkable object - Priority investigation',
                        '8-10': 'Major anomaly - Urgent investigation'
                    }
                },
                
                'geometric': {
                    term: 'Geometric Parameter (G)',
                    definition: 'Set of measurements characterizing the shape, structure and observable dimensions of an interstellar object.',
                    category: 'parameter',
                    weight: '30%',
                    components: ['G1 - Apparent Size', 'G2 - Geometric Shape', 'G3 - Aspect Ratio'],
                    related: ['morphology', 'dimensions', 'observation']
                },
                
                'kinematic': {
                    term: 'Kinematic Parameter (K)',
                    definition: 'Set of measurements characterizing motion, dynamics and trajectory changes of an object in space-time.',
                    category: 'parameter',
                    weight: '30%',
                    components: ['K1 - Displacement Velocity', 'K2 - Observed Acceleration', 'K3 - Trajectory Change'],
                    related: ['motion', 'dynamics', 'trajectory']
                },
                
                'spectroscopic': {
                    term: 'Spectroscopic Parameter (S)',
                    definition: 'Set of measurements characterizing composition, emissions and electromagnetic properties of the object.',
                    category: 'parameter',
                    weight: '25%',
                    components: ['S1 - Spectral Signature', 'S2 - Reflectance/Albedo', 'S3 - Detected Emissions'],
                    related: ['spectrometry', 'composition', 'emissions']
                },
                
                'contextual': {
                    term: 'Contextual Parameter (C)',
                    definition: 'Set of measurements characterizing environment, origin and observation circumstances of the object.',
                    category: 'parameter',
                    weight: '15%',
                    components: ['C1 - System Location', 'C2 - Gravitational Interaction', 'C3 - Observation Conditions'],
                    related: ['environment', 'context', 'observation']
                }
            }
        };
        
        // Build search index
        this.buildSearchIndex();
    }
    
    buildSearchIndex() {
        const languages = Object.keys(this.glossaryData);
        languages.forEach(lang => {
            const terms = Object.keys(this.glossaryData[lang]);
            terms.forEach(termKey => {
                const termData = this.glossaryData[lang][termKey];
                
                // Index main term
                this.searchIndex.set(termData.term.toLowerCase(), { key: termKey, lang });
                
                // Index alternative names and related terms
                if (termData.full) {
                    this.searchIndex.set(termData.full.toLowerCase(), { key: termKey, lang });
                }
                
                if (termData.related) {
                    termData.related.forEach(related => {
                        this.searchIndex.set(related.toLowerCase(), { key: termKey, lang });
                    });
                }
            });
        });
    }
    
    createPopupElement() {
        this.popup = document.createElement('div');
        this.popup.className = 'glossary-popup';
        this.popup.style.cssText = `
            position: fixed;
            max-width: 450px;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            border-radius: 16px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(59, 130, 246, 0.3);
            z-index: 10000;
            display: none;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(20px);
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        this.popup.innerHTML = `
            <div class="glossary-header" style="padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 class="term-title" style="margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 700; color: #3b82f6;"></h3>
                        <p class="term-full" style="margin: 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); font-style: italic;"></p>
                    </div>
                    <button class="glossary-close" style="
                        background: none;
                        border: none;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 0;
                        line-height: 1;
                        transition: color 0.3s ease;
                    " aria-label="Close glossary">×</button>
                </div>
            </div>
            
            <div class="glossary-content" style="padding: 1.5rem;">
                <div class="term-definition" style="margin-bottom: 1.5rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);"></div>
                
                <div class="term-details" style="display: none;">
                    <div class="term-formula" style="display: none; margin: 1rem 0; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.9rem;"></div>
                    
                    <div class="term-components" style="display: none; margin: 1rem 0;">
                        <h5 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: 600; color: #10b981;">Composants:</h5>
                        <ul class="components-list" style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;"></ul>
                    </div>
                    
                    <div class="term-examples" style="display: none; margin: 1rem 0;">
                        <h5 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: 600; color: #f59e0b;">Exemples:</h5>
                        <p class="examples-text" style="margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 0.9rem; font-style: italic;"></p>
                    </div>
                    
                    <div class="term-interpretation" style="display: none; margin: 1rem 0;">
                        <h5 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: 600; color: #8b5cf6;">Interprétation:</h5>
                        <div class="interpretation-list" style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.8);"></div>
                    </div>
                </div>
                
                <div class="term-metadata" style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                    <span class="term-category" style="
                        padding: 0.25rem 0.75rem;
                        background: rgba(59, 130, 246, 0.2);
                        color: #3b82f6;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 500;
                    "></span>
                    <span class="term-weight" style="
                        padding: 0.25rem 0.75rem;
                        background: rgba(16, 185, 129, 0.2);
                        color: #10b981;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 500;
                        display: none;
                    "></span>
                </div>
                
                <div class="related-terms" style="margin-top: 1.5rem; display: none;">
                    <h5 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; font-weight: 600; color: rgba(255, 255, 255, 0.7);">Termes liés:</h5>
                    <div class="related-list" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.popup.querySelector('.glossary-close').addEventListener('click', () => this.hidePopup());
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.popup.contains(e.target) && !e.target.classList.contains('glossary-term')) {
                this.hidePopup();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hidePopup();
            }
        });
        
        document.body.appendChild(this.popup);
    }
    
    initializeTermDetection() {
        // Auto-detect and enhance terms in page content
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceTermsInContent();
        });
        
        // Re-scan when language changes
        if (window.i18n) {
            window.i18n.onLanguageChange(() => {
                setTimeout(() => this.enhanceTermsInContent(), 100);
            });
        }
    }
    
    enhanceTermsInContent() {
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'fr';
        const termsData = this.glossaryData[currentLang] || this.glossaryData.fr;
        
        // Find text nodes and enhance terms
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style, and already processed content
                    const parent = node.parentElement;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || 
                        parent.classList.contains('glossary-popup') ||
                        parent.classList.contains('glossary-term')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        // Process each text node
        textNodes.forEach(textNode => {
            let text = textNode.textContent;
            let hasChanges = false;
            
            // Check each term
            Object.keys(termsData).forEach(termKey => {
                const termData = termsData[termKey];
                const term = termData.term;
                
                // Create regex for whole word matching (case insensitive)
                const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                
                if (regex.test(text)) {
                    text = text.replace(regex, `<span class="glossary-term" data-term="${termKey}" title="${termData.definition.substring(0, 100)}...">${term}</span>`);
                    hasChanges = true;
                }
            });
            
            // Replace text node with enhanced HTML if changes were made
            if (hasChanges) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                textNode.parentNode.replaceChild(wrapper, textNode);
                
                // Add click listeners to new glossary terms
                wrapper.querySelectorAll('.glossary-term').forEach(termElement => {
                    termElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.showTerm(e.target.dataset.term, e.target);
                    });
                    
                    // Add hover effect
                    termElement.style.cssText = `
                        color: #3b82f6;
                        cursor: pointer;
                        text-decoration: underline;
                        text-decoration-style: dotted;
                        transition: all 0.3s ease;
                    `;
                    
                    termElement.addEventListener('mouseenter', () => {
                        termElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                    });
                    
                    termElement.addEventListener('mouseleave', () => {
                        termElement.style.backgroundColor = 'transparent';
                    });
                });
            }
        });
    }
    
    createGlossaryInterface() {
        // Create floating glossary button
        const glossaryButton = document.createElement('button');
        glossaryButton.id = 'glossary-toggle';
        glossaryButton.innerHTML = '<i class="fas fa-book-open"></i>';
        glossaryButton.title = 'Glossaire Scientifique GKSC';
        glossaryButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        glossaryButton.addEventListener('click', () => this.openGlossaryPanel());
        
        glossaryButton.addEventListener('mouseenter', () => {
            glossaryButton.style.transform = 'scale(1.1)';
            glossaryButton.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
        });
        
        glossaryButton.addEventListener('mouseleave', () => {
            glossaryButton.style.transform = 'scale(1)';
            glossaryButton.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
        });
        
        document.body.appendChild(glossaryButton);
    }
    
    showTerm(termKey, triggerElement) {
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'fr';
        const termData = this.glossaryData[currentLang]?.[termKey] || this.glossaryData.fr[termKey];
        
        if (!termData) {
            console.warn(`Glossary term not found: ${termKey}`);
            return;
        }
        
        this.currentTerm = termKey;
        
        // Populate popup content
        this.popup.querySelector('.term-title').textContent = termData.term;
        this.popup.querySelector('.term-full').textContent = termData.full || '';
        this.popup.querySelector('.term-full').style.display = termData.full ? 'block' : 'none';
        this.popup.querySelector('.term-definition').textContent = termData.definition;
        this.popup.querySelector('.term-category').textContent = termData.category || 'General';
        
        // Show formula if available
        const formulaElement = this.popup.querySelector('.term-formula');
        if (termData.formula) {
            formulaElement.textContent = termData.formula;
            formulaElement.style.display = 'block';
        } else {
            formulaElement.style.display = 'none';
        }
        
        // Show components if available
        const componentsSection = this.popup.querySelector('.term-components');
        if (termData.components) {
            const componentsList = this.popup.querySelector('.components-list');
            componentsList.innerHTML = termData.components.map(comp => `<li>${comp}</li>`).join('');
            componentsSection.style.display = 'block';
        } else {
            componentsSection.style.display = 'none';
        }
        
        // Show examples if available
        const examplesSection = this.popup.querySelector('.term-examples');
        if (termData.examples) {
            this.popup.querySelector('.examples-text').textContent = termData.examples;
            examplesSection.style.display = 'block';
        } else {
            examplesSection.style.display = 'none';
        }
        
        // Show interpretation if available
        const interpretationSection = this.popup.querySelector('.term-interpretation');
        if (termData.interpretation) {
            const interpretationList = this.popup.querySelector('.interpretation-list');
            if (typeof termData.interpretation === 'object') {
                interpretationList.innerHTML = Object.entries(termData.interpretation)
                    .map(([range, desc]) => `<div><strong>${range}:</strong> ${desc}</div>`)
                    .join('');
            } else {
                interpretationList.textContent = termData.interpretation;
            }
            interpretationSection.style.display = 'block';
        } else {
            interpretationSection.style.display = 'none';
        }
        
        // Show weight if available
        const weightElement = this.popup.querySelector('.term-weight');
        if (termData.weight) {
            weightElement.textContent = `Poids: ${termData.weight}`;
            weightElement.style.display = 'inline-block';
        } else {
            weightElement.style.display = 'none';
        }
        
        // Show related terms
        const relatedSection = this.popup.querySelector('.related-terms');
        if (termData.related && termData.related.length > 0) {
            const relatedList = this.popup.querySelector('.related-list');
            relatedList.innerHTML = termData.related.map(related => `
                <span class="related-term" data-term="${related}" style="
                    padding: 0.25rem 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                ">${related}</span>
            `).join('');
            
            // Add click listeners to related terms
            relatedList.querySelectorAll('.related-term').forEach(relatedEl => {
                relatedEl.addEventListener('click', () => {
                    this.showTerm(relatedEl.dataset.term, relatedEl);
                });
            });
            
            relatedSection.style.display = 'block';
        } else {
            relatedSection.style.display = 'none';
        }
        
        // Show details section if any detail is available
        const detailsSection = this.popup.querySelector('.term-details');
        const hasDetails = termData.formula || termData.components || termData.examples || termData.interpretation;
        detailsSection.style.display = hasDetails ? 'block' : 'none';
        
        // Position popup
        this.positionPopup(triggerElement);
        
        // Show popup
        this.isVisible = true;
        this.popup.style.display = 'block';
        
        requestAnimationFrame(() => {
            this.popup.style.opacity = '1';
            this.popup.style.transform = 'scale(1)';
        });
    }
    
    positionPopup(triggerElement) {
        if (triggerElement) {
            const triggerRect = triggerElement.getBoundingClientRect();
            const popupRect = this.popup.getBoundingClientRect();
            
            let top = triggerRect.bottom + 10;
            let left = triggerRect.left;
            
            // Ensure popup stays within viewport
            if (left + popupRect.width > window.innerWidth) {
                left = window.innerWidth - popupRect.width - 20;
            }
            
            if (top + popupRect.height > window.innerHeight) {
                top = triggerRect.top - popupRect.height - 10;
            }
            
            this.popup.style.top = `${Math.max(20, top)}px`;
            this.popup.style.left = `${Math.max(20, left)}px`;
        } else {
            // Center popup
            this.popup.style.top = '50%';
            this.popup.style.left = '50%';
            this.popup.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    hidePopup() {
        this.isVisible = false;
        this.popup.style.opacity = '0';
        this.popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.popup.style.display = 'none';
        }, 300);
    }
    
    openGlossaryPanel() {
        // Create full glossary panel (to be implemented)
        console.log('Opening full glossary panel...');
    }
    
    searchTerms(query) {
        const results = [];
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'fr';
        const termsData = this.glossaryData[currentLang] || this.glossaryData.fr;
        
        query = query.toLowerCase();
        
        Object.keys(termsData).forEach(termKey => {
            const termData = termsData[termKey];
            
            if (termData.term.toLowerCase().includes(query) ||
                termData.definition.toLowerCase().includes(query) ||
                (termData.full && termData.full.toLowerCase().includes(query))) {
                results.push({ key: termKey, data: termData });
            }
        });
        
        return results;
    }
}

// Initialize glossary system
document.addEventListener('DOMContentLoaded', () => {
    window.glossarySystem = new ScientificGlossary();
});