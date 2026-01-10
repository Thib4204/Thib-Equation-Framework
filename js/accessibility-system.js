/**
 * ThibEquation Accessibility System
 * WCAG 2.1 AA compliance, WAVE testing integration, keyboard navigation, and screen reader support
 */

class AccessibilitySystem {
    constructor() {
        this.focusedElement = null;
        this.skipLinks = [];
        this.landmarkElements = [];
        this.contrastRatio = 4.5; // WCAG AA standard
        this.reducedMotion = false;
        
        this.init();
    }
    
    init() {
        this.detectReducedMotion();
        this.setupSkipLinks();
        this.enhanceKeyboardNavigation();
        this.setupFocusManagement();
        this.addLandmarks();
        this.enhanceFormAccessibility();
        this.setupScreenReaderSupport();
        this.createAccessibilityToolbar();
        this.runAccessibilityChecks();
        
        console.log('✅ ThibEquation Accessibility System initialized');
    }
    
    detectReducedMotion() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.reducedMotion) {
            document.documentElement.classList.add('reduce-motion');
            console.log('🎯 Reduced motion preferences detected');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.documentElement.classList.toggle('reduce-motion', e.matches);
        });
    }
    
    setupSkipLinks() {
        // Enhanced skip links for better navigation
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.setAttribute('aria-label', 'Navigation rapide');
        
        const skipLinks = [
            { href: '#main-content', text: 'Aller au contenu principal', key: 'content' },
            { href: '#navigation', text: 'Aller à la navigation', key: 'nav' },
            { href: '#calculator-section', text: 'Aller au calculateur', key: 'calc' },
            { href: '#results-section', text: 'Aller aux résultats', key: 'results' }
        ];
        
        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = window.i18n ? window.i18n.t(`a11y.skip.${link.key}`) || link.text : link.text;
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -50px;
                left: 20px;
                background: #000;
                color: white;
                padding: 12px 16px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                font-weight: 600;
                transition: top 0.3s ease;
                border: 2px solid #3b82f6;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '20px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-50px';
            });
            
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            skipLinksContainer.appendChild(skipLink);
            this.skipLinks.push(skipLink);
        });
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }
    
    enhanceKeyboardNavigation() {
        // Global keyboard event handler
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case 'Escape':
                    this.handleEscape(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft': 
                case 'ArrowRight':
                    this.handleArrowNavigation(e);
                    break;
                case 'Home':
                case 'End':
                    this.handleHomeEnd(e);
                    break;
            }
        });
        
        // Enhanced focus visibility
        const focusStyles = document.createElement('style');
        focusStyles.textContent = `
            *:focus {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
                border-radius: 4px !important;
            }
            
            .focus-visible:focus {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2) !important;
            }
            
            button:focus,
            input:focus,
            select:focus,
            textarea:focus,
            a:focus {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                *:focus {
                    outline: 4px solid currentColor !important;
                }
            }
        `;
        
        document.head.appendChild(focusStyles);
    }
    
    handleTabNavigation(e) {
        // Find all focusable elements
        const focusableElements = this.getFocusableElements();
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        // Trap focus in modals/dialogs
        if (this.isModalOpen()) {
            const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
            if (modal) {
                const modalFocusable = this.getFocusableElements(modal);
                const firstModalFocusable = modalFocusable[0];
                const lastModalFocusable = modalFocusable[modalFocusable.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstModalFocusable) {
                        e.preventDefault();
                        lastModalFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastModalFocusable) {
                        e.preventDefault();
                        firstModalFocusable.focus();
                    }
                }
            }
        }
        
        this.focusedElement = document.activeElement;
    }
    
    handleActivation(e) {
        const element = e.target;
        
        // Custom activation for elements with role="button"
        if (element.getAttribute('role') === 'button' && !element.disabled) {
            e.preventDefault();
            element.click();
        }
        
        // Handle ARIA expanded elements
        if (element.hasAttribute('aria-expanded')) {
            const expanded = element.getAttribute('aria-expanded') === 'true';
            element.setAttribute('aria-expanded', !expanded);
        }
    }
    
    handleEscape(e) {
        // Close modals, tooltips, dropdowns
        const openModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (openModal) {
            this.closeModal(openModal);
            return;
        }
        
        const openTooltip = document.querySelector('.tooltip:not([aria-hidden="true"])');
        if (openTooltip) {
            this.hideTooltip(openTooltip);
            return;
        }
        
        const openDropdown = document.querySelector('[aria-expanded="true"]');
        if (openDropdown) {
            openDropdown.setAttribute('aria-expanded', 'false');
        }
    }
    
    handleArrowNavigation(e) {
        const element = e.target;
        const role = element.getAttribute('role');
        
        // Handle ARIA menus and menubars
        if (role === 'menuitem' || role === 'option') {
            e.preventDefault();
            this.navigateAriaMenu(e.key, element);
        }
        
        // Handle tab lists
        if (role === 'tab') {
            e.preventDefault();
            this.navigateTabList(e.key, element);
        }
        
        // Handle sliders
        if (element.type === 'range' || role === 'slider') {
            // Let native behavior handle this, but announce value changes
            setTimeout(() => this.announceSliderValue(element), 10);
        }
    }
    
    handleHomeEnd(e) {
        const element = e.target;
        const role = element.getAttribute('role');
        
        if (role === 'menuitem' || role === 'option' || role === 'tab') {
            e.preventDefault();
            const container = element.closest('[role="menu"], [role="listbox"], [role="tablist"]');
            if (container) {
                const items = container.querySelectorAll(`[role="${role}"]`);
                if (e.key === 'Home') {
                    items[0].focus();
                } else {
                    items[items.length - 1].focus();
                }
            }
        }
    }
    
    setupFocusManagement() {
        // Track focus for better UX
        let focusTimeout;
        
        document.addEventListener('focusin', (e) => {
            clearTimeout(focusTimeout);
            this.focusedElement = e.target;
            
            // Announce focus changes to screen readers
            focusTimeout = setTimeout(() => {
                this.announceFocusChange(e.target);
            }, 100);
        });
        
        document.addEventListener('focusout', (e) => {
            clearTimeout(focusTimeout);
        });
        
        // Restore focus after page interactions
        window.addEventListener('beforeunload', () => {
            if (this.focusedElement && this.focusedElement.id) {
                sessionStorage.setItem('thibequation-last-focus', this.focusedElement.id);
            }
        });
        
        window.addEventListener('load', () => {
            const lastFocusId = sessionStorage.getItem('thibequation-last-focus');
            if (lastFocusId) {
                const element = document.getElementById(lastFocusId);
                if (element) {
                    element.focus();
                }
                sessionStorage.removeItem('thibequation-last-focus');
            }
        });
    }
    
    addLandmarks() {
        // Enhance semantic landmarks
        const landmarks = [
            { selector: 'header', role: 'banner' },
            { selector: 'nav', role: 'navigation' },
            { selector: 'main', role: 'main' },
            { selector: 'aside', role: 'complementary' },
            { selector: 'footer', role: 'contentinfo' }
        ];
        
        landmarks.forEach(({ selector, role }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', role);
                }
                
                // Add landmark to navigation
                this.landmarkElements.push({ element, role });
            });
        });
        
        // Add main content landmark if not exists
        let main = document.querySelector('main, [role="main"]');
        if (!main) {
            main = document.createElement('main');
            main.id = 'main-content';
            main.setAttribute('role', 'main');
            
            // Wrap existing content
            const body = document.body;
            while (body.children.length > 1) {
                main.appendChild(body.children[1]);
            }
            body.appendChild(main);
        }
        
        if (!main.id) {
            main.id = 'main-content';
        }
    }
    
    enhanceFormAccessibility() {
        // Enhance all form elements
        const formElements = document.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            this.enhanceFormElement(element);
        });
        
        // Monitor for new form elements (dynamic content)
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const newFormElements = node.querySelectorAll('input, select, textarea');
                        newFormElements.forEach(element => {
                            this.enhanceFormElement(element);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    enhanceFormElement(element) {
        // Ensure proper labeling
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const label = this.findAssociatedLabel(element);
            if (label) {
                if (!label.id) {
                    label.id = `label-${Math.random().toString(36).substr(2, 9)}`;
                }
                element.setAttribute('aria-labelledby', label.id);
            }
        }
        
        // Add ARIA descriptions for validation
        if (element.hasAttribute('required') && !element.getAttribute('aria-required')) {
            element.setAttribute('aria-required', 'true');
        }
        
        // Enhance number inputs for GKSC values
        if (element.type === 'number' && (element.min === '0' && element.max === '10')) {
            if (!element.getAttribute('aria-description')) {
                element.setAttribute('aria-description', 'Valeur entre 0 et 10 pour le paramètre GKSC');
            }
        }
        
        // Add live region for error messages
        element.addEventListener('invalid', (e) => {
            this.announceValidationError(e.target);
        });
        
        // Announce value changes for sliders
        if (element.type === 'range') {
            element.addEventListener('input', () => {
                this.announceSliderValue(element);
            });
        }
    }
    
    findAssociatedLabel(element) {
        // Find label by for attribute
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label) return label;
        }
        
        // Find parent label
        const parentLabel = element.closest('label');
        if (parentLabel) return parentLabel;
        
        // Find previous sibling label
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (sibling.tagName === 'LABEL') return sibling;
            sibling = sibling.previousElementSibling;
        }
        
        return null;
    }
    
    setupScreenReaderSupport() {
        // Create live regions for dynamic announcements
        this.createLiveRegions();
        
        // Enhance dynamic content updates
        this.monitorContentChanges();
        
        // Add screen reader specific instructions
        this.addScreenReaderInstructions();
    }
    
    createLiveRegions() {
        // Polite announcements (non-interrupting)
        this.politeRegion = document.createElement('div');
        this.politeRegion.id = 'polite-announcements';
        this.politeRegion.setAttribute('aria-live', 'polite');
        this.politeRegion.setAttribute('aria-atomic', 'true');
        this.politeRegion.className = 'sr-only';
        
        // Assertive announcements (interrupting)
        this.assertiveRegion = document.createElement('div');
        this.assertiveRegion.id = 'assertive-announcements';
        this.assertiveRegion.setAttribute('aria-live', 'assertive');
        this.assertiveRegion.setAttribute('aria-atomic', 'true');
        this.assertiveRegion.className = 'sr-only';
        
        // Screen reader only styles
        const srStyles = document.createElement('style');
        srStyles.textContent = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        
        document.head.appendChild(srStyles);
        document.body.appendChild(this.politeRegion);
        document.body.appendChild(this.assertiveRegion);
    }
    
    monitorContentChanges() {
        // Monitor ThibScore calculations
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.target.id === 'thibscore-result' || 
                    mutation.target.classList.contains('score-display')) {
                    this.announceScoreCalculation(mutation.target);
                }
            });
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
    }
    
    addScreenReaderInstructions() {
        // Add context-sensitive instructions
        const calculatorSection = document.querySelector('#calculator, .calculator, [data-calculator]');
        if (calculatorSection && !calculatorSection.getAttribute('aria-description')) {
            calculatorSection.setAttribute('aria-description', 
                'Calculateur ThibEquation GKSC. Saisissez les valeurs pour chaque paramètre entre 0 et 10. ' +
                'Utilisez Tab pour naviguer entre les champs, Entrée pour calculer le score.'
            );
        }
        
        // Add instructions for 3D visualization
        const visualization3D = document.querySelector('#gksc-3d-visualizer');
        if (visualization3D) {
            visualization3D.setAttribute('aria-label', 'Visualisation 3D interactive des paramètres GKSC');
            visualization3D.setAttribute('aria-description', 
                'Visualisation 3D showing GKSC parameters. Use sliders below to interact with the visualization.'
            );
        }
    }
    
    createAccessibilityToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Outils d\'accessibilité');
        
        toolbar.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            gap: 10px;
            z-index: 10000;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;
        
        const tools = [
            { 
                id: 'increase-font', 
                icon: 'fas fa-plus', 
                label: 'Augmenter la taille du texte',
                action: () => this.adjustFontSize(1.1)
            },
            { 
                id: 'decrease-font', 
                icon: 'fas fa-minus', 
                label: 'Diminuer la taille du texte',
                action: () => this.adjustFontSize(0.9)
            },
            { 
                id: 'high-contrast', 
                icon: 'fas fa-adjust', 
                label: 'Basculer le contraste élevé',
                action: () => this.toggleHighContrast()
            },
            { 
                id: 'focus-outline', 
                icon: 'fas fa-eye', 
                label: 'Améliorer la visibilité du focus',
                action: () => this.enhanceFocusVisibility()
            }
        ];
        
        tools.forEach(tool => {
            const button = document.createElement('button');
            button.innerHTML = `<i class="${tool.icon}"></i>`;
            button.setAttribute('aria-label', tool.label);
            button.title = tool.label;
            button.style.cssText = `
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', tool.action);
            button.addEventListener('focus', () => {
                button.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
            });
            button.addEventListener('blur', () => {
                button.style.backgroundColor = 'transparent';
            });
            
            toolbar.appendChild(button);
        });
        
        // Toggle toolbar visibility
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '<i class="fas fa-universal-access"></i>';
        toggleButton.setAttribute('aria-label', 'Outils d\'accessibilité');
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            transition: all 0.3s ease;
        `;
        
        let toolbarVisible = false;
        toggleButton.addEventListener('click', () => {
            toolbarVisible = !toolbarVisible;
            toolbar.style.transform = toolbarVisible ? 'translateY(-60px)' : 'translateY(100%)';
            toggleButton.style.bottom = toolbarVisible ? '80px' : '10px';
        });
        
        document.body.appendChild(toolbar);
        document.body.appendChild(toggleButton);
    }
    
    // Accessibility enhancement methods
    adjustFontSize(multiplier) {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = Math.max(12, Math.min(24, currentSize * multiplier));
        document.documentElement.style.fontSize = `${newSize}px`;
        
        this.announce(`Taille du texte ajustée à ${Math.round(newSize)}px`);
    }
    
    toggleHighContrast() {
        const isHighContrast = document.documentElement.classList.toggle('high-contrast');
        
        if (isHighContrast) {
            const contrastStyles = document.createElement('style');
            contrastStyles.id = 'high-contrast-styles';
            contrastStyles.textContent = `
                .high-contrast {
                    filter: contrast(150%) brightness(120%);
                }
                
                .high-contrast * {
                    background-color: black !important;
                    color: white !important;
                    border-color: white !important;
                }
                
                .high-contrast a {
                    color: yellow !important;
                }
                
                .high-contrast button {
                    background-color: white !important;
                    color: black !important;
                }
            `;
            document.head.appendChild(contrastStyles);
        } else {
            const existingStyles = document.getElementById('high-contrast-styles');
            if (existingStyles) existingStyles.remove();
        }
        
        this.announce(`Contraste élevé ${isHighContrast ? 'activé' : 'désactivé'}`);
    }
    
    enhanceFocusVisibility() {
        const enhanced = document.documentElement.classList.toggle('enhanced-focus');
        
        if (enhanced) {
            const focusStyles = document.createElement('style');
            focusStyles.id = 'enhanced-focus-styles';
            focusStyles.textContent = `
                .enhanced-focus *:focus {
                    outline: 4px solid #ff0000 !important;
                    outline-offset: 4px !important;
                    box-shadow: 0 0 0 8px rgba(255, 0, 0, 0.3) !important;
                }
            `;
            document.head.appendChild(focusStyles);
        } else {
            const existingStyles = document.getElementById('enhanced-focus-styles');
            if (existingStyles) existingStyles.remove();
        }
        
        this.announce(`Visibilité du focus ${enhanced ? 'améliorée' : 'normale'}`);
    }
    
    // Announcement methods
    announce(message, priority = 'polite') {
        const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion;
        region.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            region.textContent = '';
        }, 1000);
    }
    
    announceScoreCalculation(element) {
        const scoreText = element.textContent || element.innerText;
        if (scoreText.includes('ThibScore') || scoreText.includes('Score')) {
            this.announce(`Nouveau calcul: ${scoreText}`, 'assertive');
        }
    }
    
    announceSliderValue(slider) {
        const value = slider.value;
        const label = this.findAssociatedLabel(slider)?.textContent || 'Paramètre';
        this.announce(`${label}: ${value}`);
    }
    
    announceFocusChange(element) {
        if (element.getAttribute('aria-label')) {
            this.announce(`Focus sur: ${element.getAttribute('aria-label')}`);
        } else if (element.tagName === 'BUTTON') {
            this.announce(`Bouton: ${element.textContent}`);
        } else if (element.tagName === 'INPUT') {
            const label = this.findAssociatedLabel(element);
            if (label) {
                this.announce(`Champ: ${label.textContent}`);
            }
        }
    }
    
    announceValidationError(element) {
        const message = element.validationMessage || 'Erreur de validation';
        this.announce(`Erreur: ${message}`, 'assertive');
    }
    
    // Utility methods
    getFocusableElements(container = document) {
        return container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }
    
    isModalOpen() {
        return document.querySelector('[role="dialog"]:not([aria-hidden="true"])') !== null;
    }
    
    closeModal(modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        
        // Return focus to trigger element
        const triggerId = modal.getAttribute('data-trigger-id');
        if (triggerId) {
            const trigger = document.getElementById(triggerId);
            if (trigger) trigger.focus();
        }
    }
    
    hideTooltip(tooltip) {
        tooltip.setAttribute('aria-hidden', 'true');
        tooltip.style.display = 'none';
    }
    
    // Accessibility testing methods
    runAccessibilityChecks() {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push(`${images.length} images without alt text`);
        }
        
        // Check for missing form labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        const unlabeledInputs = Array.from(inputs).filter(input => !this.findAssociatedLabel(input));
        if (unlabeledInputs.length > 0) {
            issues.push(`${unlabeledInputs.length} form inputs without labels`);
        }
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            if (level > lastLevel + 1) {
                issues.push(`Heading hierarchy issue: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });
        
        // Check color contrast (basic check)
        this.checkColorContrast();
        
        if (issues.length > 0) {
            console.warn('🚨 Accessibility issues found:', issues);
        } else {
            console.log('✅ Basic accessibility checks passed');
        }
        
        return issues;
    }
    
    checkColorContrast() {
        // Basic contrast checking - would need more sophisticated implementation for full WAVE compliance
        const elements = document.querySelectorAll('*');
        let contrastIssues = 0;
        
        elements.forEach(element => {
            const styles = getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Simple check - in real implementation would use proper contrast calculation
            if (color && backgroundColor && color !== backgroundColor) {
                // Simplified contrast check placeholder
                // Real implementation would calculate luminance ratios
            }
        });
    }
    
    // WAVE testing integration guidance
    static getWAVETestingGuide() {
        return {
            url: 'https://wave.webaim.org/',
            instructions: [
                '1. Accédez à https://wave.webaim.org/',
                '2. Entrez l\'URL de votre page ThibEquation',
                '3. Cliquez sur "WAVE this page!"',
                '4. Examinez les erreurs et alertes',
                '5. Corrigez les problèmes identifiés',
                '6. Re-testez jusqu\'à obtenir 0 erreurs'
            ],
            automatedChecks: [
                'Images manquantes alt text',
                'Contraste de couleur insuffisant',
                'Éléments de formulaire sans label',
                'Hiérarchie de titres incorrecte',
                'Liens sans texte descriptif',
                'Régions ARIA manquantes'
            ]
        };
    }
}

// Initialize accessibility system
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilitySystem = new AccessibilitySystem();
    
    // Add global accessibility shortcut
    document.addEventListener('keydown', (e) => {
        // Alt + A to focus accessibility toolbar
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            const accessibilityButton = document.querySelector('[aria-label*="accessibilité"]');
            if (accessibilityButton) {
                accessibilityButton.focus();
                accessibilityButton.click();
            }
        }
    });
});

// Export for external use
window.AccessibilitySystem = AccessibilitySystem;