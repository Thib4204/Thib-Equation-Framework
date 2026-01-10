/**
 * ThibEquation Interactive Tutorial System
 * Step-by-step guided tour for GKSC calculator with accessibility support
 */

class InteractiveTutorial {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.steps = [];
        this.onComplete = null;
        this.onSkip = null;
        
        this.createTutorialElements();
        this.setupKeyboardNavigation();
    }
    
    // Define tutorial steps for GKSC calculator
    defineTutorialSteps() {
        this.steps = [
            {
                id: 'welcome',
                title: 'tutorial.welcome.title',
                description: 'tutorial.welcome.description',
                target: null,
                position: 'center',
                action: 'highlight',
                validation: null
            },
            {
                id: 'geometric-section',
                title: 'tutorial.step1.title',
                description: 'tutorial.step1.description',
                target: '.gksc-section.gksc-geometric, .geometric-inputs, #geometric-parameters',
                position: 'bottom',
                action: 'highlight',
                validation: null,
                interactiveElements: ['#g1', '#g2', '#g3']
            },
            {
                id: 'kinematic-section', 
                title: 'tutorial.step2.title',
                description: 'tutorial.step2.description',
                target: '.gksc-section.gksc-kinematic, .kinematic-inputs, #kinematic-parameters',
                position: 'bottom',
                action: 'highlight',
                validation: null,
                interactiveElements: ['#k1', '#k2', '#k3']
            },
            {
                id: 'spectroscopic-section',
                title: 'tutorial.step3.title', 
                description: 'tutorial.step3.description',
                target: '.gksc-section.gksc-spectroscopic, .spectroscopic-inputs, #spectroscopic-parameters',
                position: 'bottom',
                action: 'highlight',
                validation: null,
                interactiveElements: ['#s1', '#s2', '#s3']
            },
            {
                id: 'contextual-section',
                title: 'tutorial.step4.title',
                description: 'tutorial.step4.description', 
                target: '.gksc-section.gksc-contextual, .contextual-inputs, #contextual-parameters',
                position: 'bottom',
                action: 'highlight',
                validation: null,
                interactiveElements: ['#c1', '#c2', '#c3']
            },
            {
                id: 'calculation',
                title: 'tutorial.step5.title',
                description: 'tutorial.step5.description',
                target: '#calculate-button, .calculate-btn, button[onclick*="calculer"]',
                position: 'top',
                action: 'pulse',
                validation: this.validateCalculation.bind(this)
            }
        ];
        
        this.totalSteps = this.steps.length;
    }
    
    createTutorialElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: none;
            backdrop-filter: blur(3px);
        `;
        
        // Create tooltip container
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(59, 130, 246, 0.3);
            max-width: 400px;
            z-index: 10001;
            display: none;
            backdrop-filter: blur(20px);
            font-family: 'Inter', sans-serif;
        `;
        
        // Create tooltip content structure
        this.tooltip.innerHTML = `
            <div class="tutorial-header">
                <h3 class="tutorial-title" style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: 700; color: #3b82f6;"></h3>
                <button class="tutorial-close" aria-label="Close tutorial" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: color 0.3s ease;
                ">×</button>
            </div>
            <div class="tutorial-content">
                <p class="tutorial-description" style="margin: 0 0 2rem 0; line-height: 1.6; color: rgba(255, 255, 255, 0.9);"></p>
                <div class="tutorial-progress" style="margin: 1rem 0; background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div class="progress-bar" style="height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.3s ease;"></div>
                </div>
                <div class="tutorial-step-info" style="margin: 1rem 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); text-align: center;">
                    <span class="current-step">1</span> / <span class="total-steps">5</span>
                </div>
            </div>
            <div class="tutorial-actions" style="display: flex; gap: 1rem; justify-content: space-between; align-items: center;">
                <button class="btn-skip" style="
                    background: none;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.8);
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                " data-i18n="tutorial.button.skip">Passer</button>
                <div class="nav-buttons" style="display: flex; gap: 0.5rem;">
                    <button class="btn-previous" style="
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 500;
                    " data-i18n="tutorial.button.previous">Précédent</button>
                    <button class="btn-next" style="
                        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                        border: none;
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 600;
                    " data-i18n="tutorial.button.next">Suivant</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.tooltip.querySelector('.tutorial-close').addEventListener('click', () => this.closeTutorial());
        this.tooltip.querySelector('.btn-skip').addEventListener('click', () => this.skipTutorial());
        this.tooltip.querySelector('.btn-previous').addEventListener('click', () => this.previousStep());
        this.tooltip.querySelector('.btn-next').addEventListener('click', () => this.nextStep());
        
        // Add hover effects
        this.addButtonHoverEffects();
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
    }
    
    addButtonHoverEffects() {
        const buttons = this.tooltip.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('tutorial-close')) {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
        
        // Special hover for close button
        this.tooltip.querySelector('.tutorial-close').addEventListener('mouseenter', (e) => {
            e.target.style.color = '#ef4444';
        });
        
        this.tooltip.querySelector('.tutorial-close').addEventListener('mouseleave', (e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.6)';
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeTutorial();
                    break;
                case 'ArrowRight':
                case 'Enter':
                    e.preventDefault();
                    this.nextStep();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousStep();
                    break;
            }
        });
    }
    
    startTutorial(options = {}) {
        this.onComplete = options.onComplete || null;
        this.onSkip = options.onSkip || null;
        
        this.defineTutorialSteps();
        this.currentStep = 0;
        this.isActive = true;
        
        // Show overlay and tooltip
        this.overlay.style.display = 'block';
        this.tooltip.style.display = 'block';
        
        // Animate in
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.tooltip.style.opacity = '1';
            this.tooltip.style.transform = 'scale(1)';
        });
        
        // Focus management
        this.tooltip.querySelector('.btn-next').focus();
        
        // Update translations if multilingual system is available
        if (window.i18n) {
            window.i18n.translatePage();
        }
        
        this.showStep(this.currentStep);
    }
    
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;
        
        const step = this.steps[stepIndex];
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Update tooltip content
        const titleElement = this.tooltip.querySelector('.tutorial-title');
        const descriptionElement = this.tooltip.querySelector('.tutorial-description');
        const currentStepElement = this.tooltip.querySelector('.current-step');
        const progressBar = this.tooltip.querySelector('.progress-bar');
        
        titleElement.textContent = window.i18n ? window.i18n.t(step.title) : step.title;
        descriptionElement.textContent = window.i18n ? window.i18n.t(step.description) : step.description;
        currentStepElement.textContent = stepIndex + 1;
        this.tooltip.querySelector('.total-steps').textContent = this.totalSteps;
        
        // Update progress bar
        const progress = ((stepIndex + 1) / this.totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update button states
        this.tooltip.querySelector('.btn-previous').disabled = stepIndex === 0;
        this.tooltip.querySelector('.btn-previous').style.opacity = stepIndex === 0 ? '0.5' : '1';
        
        const nextButton = this.tooltip.querySelector('.btn-next');
        if (stepIndex === this.totalSteps - 1) {
            nextButton.textContent = window.i18n ? window.i18n.t('tutorial.button.finish') : 'Terminer';
        } else {
            nextButton.textContent = window.i18n ? window.i18n.t('tutorial.button.next') : 'Suivant';
        }
        
        // Position tooltip and highlight target
        if (step.target) {
            const targetElement = this.findBestTarget(step.target);
            if (targetElement) {
                this.highlightElement(targetElement, step.action);
                this.positionTooltip(targetElement, step.position);
                
                // Add interactive highlighting for inputs
                if (step.interactiveElements) {
                    this.highlightInteractiveElements(step.interactiveElements);
                }
            } else {
                console.warn(`Tutorial target not found: ${step.target}`);
                this.positionTooltip(null, 'center');
            }
        } else {
            this.positionTooltip(null, 'center');
        }
        
        // Scroll target into view
        if (step.target) {
            const targetElement = this.findBestTarget(step.target);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
        
        // Announce step to screen readers
        this.announceStep(step);
    }
    
    findBestTarget(selector) {
        // Try multiple selectors separated by commas
        const selectors = selector.split(',').map(s => s.trim());
        
        for (const sel of selectors) {
            const element = document.querySelector(sel);
            if (element) {
                return element;
            }
        }
        
        return null;
    }
    
    highlightElement(element, action = 'highlight') {
        element.classList.add('tutorial-highlight');
        
        // Add custom styles for highlighting
        const highlightStyle = document.createElement('style');
        highlightStyle.id = 'tutorial-highlight-styles';
        highlightStyle.textContent = `
            .tutorial-highlight {
                position: relative !important;
                z-index: 10002 !important;
                border: 3px solid #3b82f6 !important;
                border-radius: 12px !important;
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.6) !important;
                animation: tutorial-${action} 2s ease-in-out infinite !important;
            }
            
            @keyframes tutorial-highlight {
                0%, 100% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                50% { box-shadow: 0 0 50px rgba(59, 130, 246, 0.9); }
            }
            
            @keyframes tutorial-pulse {
                0%, 100% { 
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 50px rgba(59, 130, 246, 0.9);
                    transform: scale(1.05);
                }
            }
        `;
        
        document.head.appendChild(highlightStyle);
    }
    
    highlightInteractiveElements(selectors) {
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('tutorial-interactive');
                element.style.cssText += `
                    border: 2px solid #10b981 !important;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.4) !important;
                `;
                
                // Add input listeners for validation
                element.addEventListener('input', () => this.validateStep());
            }
        });
    }
    
    clearHighlights() {
        // Remove highlight classes and styles
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        document.querySelectorAll('.tutorial-interactive').forEach(el => {
            el.classList.remove('tutorial-interactive');
            el.style.border = '';
            el.style.boxShadow = '';
        });
        
        // Remove highlight styles
        const existingStyle = document.getElementById('tutorial-highlight-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
    }
    
    positionTooltip(targetElement, position) {
        if (!targetElement || position === 'center') {
            // Center the tooltip
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - 20;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - 20;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + 20;
                break;
            default:
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        }
        
        // Ensure tooltip stays within viewport
        const margin = 20;
        top = Math.max(margin, Math.min(top, window.innerHeight - tooltipRect.height - margin));
        left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));
        
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.transform = 'none';
    }
    
    validateStep() {
        const step = this.steps[this.currentStep];
        if (step.validation) {
            return step.validation();
        }
        return true;
    }
    
    validateCalculation() {
        // Check if all required inputs have values
        const inputs = ['g1', 'g2', 'g3', 'k1', 'k2', 'k3', 's1', 's2', 's3', 'c1', 'c2', 'c3'];
        let filledInputs = 0;
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.value !== '' && !isNaN(parseFloat(element.value))) {
                filledInputs++;
            }
        });
        
        return filledInputs >= 6; // At least half the inputs should be filled
    }
    
    announceStep(step) {
        // Create live region for screen readers
        let liveRegion = document.getElementById('tutorial-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'tutorial-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(liveRegion);
        }
        
        const announcement = window.i18n ? 
            `${window.i18n.t(step.title)}. ${window.i18n.t(step.description)}` :
            `${step.title}. ${step.description}`;
            
        liveRegion.textContent = announcement;
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.completeTutorial();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    skipTutorial() {
        if (this.onSkip) {
            this.onSkip();
        }
        this.closeTutorial();
    }
    
    completeTutorial() {
        if (this.onComplete) {
            this.onComplete();
        }
        this.closeTutorial();
        
        // Show completion message
        this.showCompletionMessage();
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
        `;
        
        message.textContent = window.i18n ? 
            window.i18n.t('tutorial.completion.message') || 'Tutoriel terminé ! Vous pouvez maintenant utiliser le calculateur GKSC.' :
            'Tutoriel terminé ! Vous pouvez maintenant utiliser le calculateur GKSC.';
        
        document.body.appendChild(message);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
    
    closeTutorial() {
        this.isActive = false;
        this.clearHighlights();
        
        // Animate out
        this.overlay.style.opacity = '0';
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.tooltip.style.display = 'none';
        }, 300);
        
        // Remove live region
        const liveRegion = document.getElementById('tutorial-live-region');
        if (liveRegion) {
            liveRegion.remove();
        }
        
        // Return focus to document
        document.activeElement.blur();
    }
    
    // Static method to check if tutorial should be shown
    static shouldShowTutorial() {
        const hasSeenTutorial = localStorage.getItem('thibequation-tutorial-seen');
        return !hasSeenTutorial;
    }
    
    // Mark tutorial as seen
    static markTutorialSeen() {
        localStorage.setItem('thibequation-tutorial-seen', 'true');
    }
    
    // Reset tutorial state (for testing)
    static resetTutorial() {
        localStorage.removeItem('thibequation-tutorial-seen');
    }
}

// Auto-initialize tutorial system
document.addEventListener('DOMContentLoaded', () => {
    // Create global tutorial instance
    window.tutorialSystem = new InteractiveTutorial();
    
    // Auto-start tutorial for first-time users on calculator pages
    const isCalculatorPage = window.location.pathname.includes('calculateur') || 
                            window.location.pathname.includes('simulateur');
    
    if (isCalculatorPage && InteractiveTutorial.shouldShowTutorial()) {
        // Delay tutorial start to ensure page is fully loaded
        setTimeout(() => {
            window.tutorialSystem.startTutorial({
                onComplete: () => {
                    InteractiveTutorial.markTutorialSeen();
                },
                onSkip: () => {
                    InteractiveTutorial.markTutorialSeen();
                }
            });
        }, 2000);
    }
});

// Add tutorial trigger button to pages
function addTutorialTrigger() {
    const button = document.createElement('button');
    button.id = 'tutorial-trigger';
    button.innerHTML = '<i class="fas fa-question-circle"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('click', () => {
        if (window.tutorialSystem) {
            window.tutorialSystem.startTutorial();
        }
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
    });
    
    document.body.appendChild(button);
}

// Add tutorial trigger on calculator pages
document.addEventListener('DOMContentLoaded', () => {
    const isCalculatorPage = window.location.pathname.includes('calculateur') || 
                            window.location.pathname.includes('simulateur');
                            
    if (isCalculatorPage) {
        addTutorialTrigger();
    }
});