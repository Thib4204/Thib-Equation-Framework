/* ================================================================
   JAVA CSS INTEGRATION - Framework Loeb-Thib V1.0 GKSC
   JavaScript CSS Controller for ThibEquation Framework
   ================================================================ */

class JavaCSSController {
    constructor() {
        this.initialized = false;
        this.animations = new Map();
        this.observers = new Map();
        this.gkscComponents = ['geometric', 'kinematic', 'spectroscopic', 'contextual'];
        this.init();
    }

    /* ================================================================
       INITIALIZATION
       ================================================================ */
    
    init() {
        if (this.initialized) return;
        
        console.log('🚀 Java CSS Controller - Framework Loeb-Thib GKSC Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.loadJavaCSSStyles();
        this.setupGKSCComponents();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.bindEventListeners();
        this.optimizePerformance();
        
        this.initialized = true;
        console.log('✅ Java CSS Controller - Framework Loeb-Thib GKSC Ready!');
    }

    /* ================================================================
       CSS LOADING AND CONFIGURATION
       ================================================================ */
    
    loadJavaCSSStyles() {
        const cssFiles = [
            'css/java-css-config.css',
            'css/thibequation-common.css',
            'css/spatial-theme.css'
        ];

        cssFiles.forEach(cssFile => {
            if (!document.querySelector(`link[href="${cssFile}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                link.onload = () => console.log(`✅ Loaded: ${cssFile}`);
                document.head.appendChild(link);
            }
        });
    }

    /* ================================================================
       GKSC COMPONENT MANAGEMENT
       ================================================================ */
    
    setupGKSCComponents() {
        this.gkscComponents.forEach(component => {
            const elements = document.querySelectorAll(`.gksc-component.${component}`);
            
            elements.forEach(element => {
                this.enhanceGKSCComponent(element, component);
            });
        });
    }

    enhanceGKSCComponent(element, componentType) {
        // Add Java CSS classes
        element.classList.add('java-accelerated', 'java-interactive', 'java-smooth');
        
        // Set CSS custom properties for dynamic styling
        const colors = this.getGKSCColors(componentType);
        element.style.setProperty('--component-primary-rgb', colors.primaryRGB);
        element.style.setProperty('--component-secondary-rgb', colors.secondaryRGB);
        
        // Add enhanced interactivity
        this.addComponentInteractivity(element, componentType);
        
        // Add animation triggers
        this.setupComponentAnimation(element);
    }

    getGKSCColors(componentType) {
        const colorMap = {
            geometric: { 
                primaryRGB: '59, 130, 246',
                secondaryRGB: '30, 64, 175'
            },
            kinematic: { 
                primaryRGB: '16, 185, 129',
                secondaryRGB: '4, 120, 87'
            },
            spectroscopic: { 
                primaryRGB: '245, 158, 11',
                secondaryRGB: '217, 119, 6'
            },
            contextual: { 
                primaryRGB: '139, 92, 246',
                secondaryRGB: '124, 58, 237'
            }
        };
        
        return colorMap[componentType] || colorMap.geometric;
    }

    /* ================================================================
       ANIMATION SYSTEM
       ================================================================ */
    
    initializeAnimations() {
        // Stagger animations for GKSC components
        const components = document.querySelectorAll('.gksc-component');
        components.forEach((component, index) => {
            setTimeout(() => {
                component.classList.add('java-fade-in');
            }, index * 150);
        });

        // Initialize chart animations
        this.setupChartAnimations();
    }

    setupChartAnimations() {
        const chartContainers = document.querySelectorAll('.java-chart-container');
        chartContainers.forEach(container => {
            container.classList.add('java-accelerated');
            
            // Animate chart appearance
            const chart = container.querySelector('canvas');
            if (chart) {
                chart.style.opacity = '0';
                setTimeout(() => {
                    chart.style.opacity = '1';
                    chart.classList.add('java-chart-animated');
                }, 300);
            }
        });
    }

    setupComponentAnimation(element) {
        element.addEventListener('mouseenter', () => {
            if (!element.classList.contains('animating')) {
                element.classList.add('animating');
                element.style.transform = 'scale(1.02) translateZ(0)';
                
                setTimeout(() => {
                    element.classList.remove('animating');
                }, 300);
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) translateZ(0)';
        });
    }

    /* ================================================================
       INTERSECTION OBSERVER FOR PERFORMANCE
       ================================================================ */
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementIntoView(entry.target);
                }
            });
        }, observerOptions);

        // Observe all Java CSS animated elements
        const animatedElements = document.querySelectorAll('[class*="java-"]');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set('intersection', observer);
    }

    animateElementIntoView(element) {
        if (!element.classList.contains('animated-in')) {
            element.classList.add('java-fade-in', 'animated-in');
            
            // Add GPU acceleration
            element.classList.add('java-accelerated');
        }
    }

    /* ================================================================
       EVENT LISTENERS
       ================================================================ */
    
    bindEventListeners() {
        // GKSC Parameter Input Enhancement
        const parameterInputs = document.querySelectorAll('.gksc-parameter-input input');
        parameterInputs.forEach(input => {
            this.enhanceParameterInput(input);
        });

        // Responsive handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    enhanceParameterInput(input) {
        const container = input.closest('.gksc-parameter-input');
        if (!container) return;

        // Add Java CSS enhancement
        container.classList.add('java-interactive', 'java-smooth');

        input.addEventListener('focus', () => {
            container.style.transform = 'translateZ(0) scale(1.02)';
            container.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            container.style.transform = 'translateZ(0) scale(1)';
            container.classList.remove('focused');
        });

        input.addEventListener('input', () => {
            this.validateGKSCParameter(input);
        });
    }

    /* ================================================================
       GKSC PARAMETER VALIDATION
       ================================================================ */
    
    validateGKSCParameter(input) {
        const value = parseFloat(input.value);
        const container = input.closest('.gksc-parameter-input');
        
        if (isNaN(value) || value < 0 || value > 10) {
            container.classList.add('error');
            container.style.borderColor = '#ef4444';
        } else {
            container.classList.remove('error');
            container.style.borderColor = '';
            
            // Add success animation
            container.classList.add('success');
            setTimeout(() => container.classList.remove('success'), 1000);
        }
    }

    /* ================================================================
       PERFORMANCE OPTIMIZATION
       ================================================================ */
    
    optimizePerformance() {
        // Enable GPU acceleration for key elements
        const acceleratedElements = document.querySelectorAll('.java-accelerated');
        acceleratedElements.forEach(element => {
            element.style.willChange = 'transform';
            element.style.transform = 'translateZ(0)';
        });

        // Optimize animations
        this.optimizeAnimations();
        
        // Reduce motion for accessibility
        this.handleReducedMotion();
    }

    optimizeAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--java-transition-speed', '0.1s');
        }
    }

    handleReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }

    /* ================================================================
       RESPONSIVE HANDLING
       ================================================================ */
    
    handleResize() {
        // Recalculate chart dimensions
        const charts = document.querySelectorAll('.java-chart-wrapper');
        charts.forEach(chart => {
            if (chart.chart) {
                chart.chart.resize();
            }
        });

        // Update GKSC grid layout
        this.updateGKSCGrid();
    }

    updateGKSCGrid() {
        const grids = document.querySelectorAll('.gksc-grid');
        const isMobile = window.innerWidth < 768;
        
        grids.forEach(grid => {
            if (isMobile) {
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            }
        });
    }

    /* ================================================================
       PERFORMANCE MONITORING
       ================================================================ */
    
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`Java CSS Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    /* ================================================================
       UTILITIES
       ================================================================ */
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /* ================================================================
       PUBLIC API
       ================================================================ */
    
    // Add GKSC component dynamically
    addGKSCComponent(element, componentType) {
        if (this.gkscComponents.includes(componentType)) {
            element.classList.add('gksc-component', componentType);
            this.enhanceGKSCComponent(element, componentType);
        }
    }

    // Update CSS custom properties
    updateCSSProperty(property, value) {
        document.documentElement.style.setProperty(property, value);
    }

    // Get component performance metrics
    getPerformanceMetrics() {
        return {
            animationsActive: this.animations.size,
            observersActive: this.observers.size,
            acceleratedElements: document.querySelectorAll('.java-accelerated').length
        };
    }
}

/* ================================================================
   GLOBAL INITIALIZATION
   ================================================================ */

// Initialize Java CSS Controller when DOM is ready
let javaCSSController;

document.addEventListener('DOMContentLoaded', () => {
    javaCSSController = new JavaCSSController();
    
    // Make it globally available
    window.JavaCSS = javaCSSController;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JavaCSSController;
}

/* ================================================================
   FRAMEWORK LOEB-THIB INTEGRATION
   ================================================================ */

// Integration with ThibEquation calculators
document.addEventListener('ThibEquationReady', () => {
    if (javaCSSController) {
        console.log('🔗 Java CSS integrated with Framework Loeb-Thib GKSC');
        
        // Enhance existing calculators
        const calculators = document.querySelectorAll('.thibequation-calculator');
        calculators.forEach(calc => {
            calc.classList.add('java-enhanced');
        });
    }
});

console.log('📦 Java CSS Integration Module Loaded - Framework Loeb-Thib V1.0');