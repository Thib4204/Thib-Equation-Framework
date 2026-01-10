/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 THIBEQUATION FRAMEWORK V2.0-BETA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * TRAJECTORY UI COMPONENT
 * Interface utilisateur spectaculaire pour système trajectoires
 * 
 * @module TrajectoryUIComponent
 * @author Thib - Développeur-Chercheur en Analyse Mathématique Interstellaire
 * @version 2.0.0-BETA
 * @license MIT
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TrajectoryUIComponent {
    /**
     * Constructeur du composant UI
     * @param {TrajectoryAdapter} trajectoryAdapter - Adaptateur trajectoires
     * @param {TrajectoryVisualizer3D} visualizer3D - Visualiseur 3D
     * @param {Object} options - Options configuration
     */
    constructor(trajectoryAdapter, visualizer3D, options = {}) {
        if (!trajectoryAdapter) {
            throw new Error('TrajectoryAdapter instance required');
        }
        if (!visualizer3D) {
            throw new Error('TrajectoryVisualizer3D instance required');
        }

        this.adapter = trajectoryAdapter;
        this.visualizer = visualizer3D;
        
        this.options = {
            containerId: options.containerId || 'trajectory-ui-container',
            theme: options.theme || 'cosmic',
            showPreview: options.showPreview !== false,
            showControls: options.showControls !== false,
            showSettings: options.showSettings !== false,
            maxPreviewRows: options.maxPreviewRows || 10
        };

        // État interne
        this.state = {
            selectedType: 'deterministic',
            fileLoaded: false,
            currentFile: null,
            isAnimating: false,
            currentTime: 0,
            animationSpeed: 1.0
        };

        // Éléments DOM
        this.elements = {
            container: null,
            dropZone: null,
            fileInput: null,
            typeSelector: null,
            fileInfo: null,
            controls: null,
            timeScrubber: null,
            speedSlider: null,
            plotsContainer: null,
            settings: null
        };

        // Charts Chart.js
        this.charts = {
            xPlot: null,
            yPlot: null,
            zPlot: null
        };

        // Initialisation
        this.init();
    }

    /**
     * Initialisation du composant
     */
    init() {
        try {
            this.elements.container = document.getElementById(this.options.containerId);
            if (!this.elements.container) {
                throw new Error(`Container #${this.options.containerId} not found`);
            }

            this.createUI();
            this.setupEventListeners();
            this.setupAdapterEvents();
            this.setupVisualizerEvents();

            console.log('✅ TrajectoryUIComponent initialized successfully');
        } catch (error) {
            console.error('❌ TrajectoryUIComponent initialization failed:', error);
            throw error;
        }
    }

    /**
     * Créer structure HTML complète
     */
    createUI() {
        const html = `
            <div class="trajectory-ui trajectory-ui--${this.options.theme}">
                <div class="trajectory-ui__content">
                    <!-- Drop Zone -->
                    <div class="trajectory-drop-zone" id="trajectory-drop-zone">
                        <div class="trajectory-drop-zone__icon">
                            <i class="fas fa-satellite-dish"></i>
                        </div>
                        <h3 class="trajectory-drop-zone__title">
                            Importer Trajectoire RK4/Monte-Carlo
                        </h3>
                        <p class="trajectory-drop-zone__description">
                            Glissez-déposez un fichier CSV ou cliquez pour sélectionner<br>
                            <small>Formats supportés: trajectory_deterministic.csv, trajectory_quantiles.csv</small>
                        </p>
                        <input type="file" id="trajectory-file-input" class="trajectory-drop-zone__input" accept=".csv">
                    </div>

                    <!-- Type Selector -->
                    <div class="trajectory-type-selector" id="trajectory-type-selector">
                        <div class="trajectory-type-option">
                            <input type="radio" id="type-deterministic" name="trajectory-type" value="deterministic" checked>
                            <label for="type-deterministic">
                                <i class="fas fa-chart-line"></i>
                                <span>Déterministe (RK4)</span>
                            </label>
                        </div>
                        <div class="trajectory-type-option">
                            <input type="radio" id="type-quantiles" name="trajectory-type" value="quantiles">
                            <label for="type-quantiles">
                                <i class="fas fa-layer-group"></i>
                                <span>Quantiles (Monte-Carlo)</span>
                            </label>
                        </div>
                        <div class="trajectory-type-option">
                            <input type="radio" id="type-montecarlo" name="trajectory-type" value="montecarlo">
                            <label for="type-montecarlo">
                                <i class="fas fa-random"></i>
                                <span>Monte-Carlo (Multiple)</span>
                            </label>
                        </div>
                    </div>

                    <!-- File Info -->
                    <div class="trajectory-file-info trajectory-hidden" id="trajectory-file-info">
                        <div class="trajectory-file-info__grid" id="trajectory-file-info-grid">
                            <!-- Filled dynamically -->
                        </div>
                    </div>

                    <!-- Success Message -->
                    <div class="trajectory-success trajectory-hidden" id="trajectory-success">
                        <i class="fas fa-check-circle"></i>
                        <span class="trajectory-success__message" id="trajectory-success-message"></span>
                    </div>

                    <!-- Error Message -->
                    <div class="trajectory-error trajectory-hidden" id="trajectory-error">
                        <div class="trajectory-error__title">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Erreur d'Import</span>
                        </div>
                        <p class="trajectory-error__message" id="trajectory-error-message"></p>
                    </div>

                    ${this.options.showControls ? this.createControlsHTML() : ''}
                    ${this.options.showPreview ? this.createPlotsHTML() : ''}
                    ${this.options.showSettings ? this.createSettingsHTML() : ''}
                </div>
            </div>
        `;

        this.elements.container.innerHTML = html;

        // Références éléments
        this.elements.dropZone = document.getElementById('trajectory-drop-zone');
        this.elements.fileInput = document.getElementById('trajectory-file-input');
        this.elements.typeSelector = document.getElementById('trajectory-type-selector');
        this.elements.fileInfo = document.getElementById('trajectory-file-info');
    }

    /**
     * Créer HTML controls animation
     */
    createControlsHTML() {
        return `
            <div class="trajectory-controls trajectory-hidden" id="trajectory-controls">
                <h3 class="trajectory-controls__title">
                    <i class="fas fa-play-circle"></i>
                    <span>Animation Temporelle</span>
                </h3>

                <div class="trajectory-controls__buttons">
                    <button class="trajectory-control-button" id="btn-play" aria-label="Play animation">
                        <i class="fas fa-play"></i>
                        <span>Play</span>
                    </button>
                    <button class="trajectory-control-button" id="btn-pause" aria-label="Pause animation">
                        <i class="fas fa-pause"></i>
                        <span>Pause</span>
                    </button>
                    <button class="trajectory-control-button" id="btn-reset" aria-label="Reset animation">
                        <i class="fas fa-undo"></i>
                        <span>Reset</span>
                    </button>
                    <button class="trajectory-control-button trajectory-control-button--secondary" id="btn-screenshot" aria-label="Take screenshot">
                        <i class="fas fa-camera"></i>
                        <span>Screenshot</span>
                    </button>
                </div>

                <div class="trajectory-time-scrubber-container">
                    <div class="trajectory-time-display">
                        <span>Temps: <strong id="current-time-display">0.00s</strong></span>
                        <span>Durée: <strong id="duration-display">0.00s</strong></span>
                    </div>
                    <input type="range" class="trajectory-time-scrubber" id="time-scrubber" min="0" max="100" value="0" aria-label="Time scrubber">
                </div>

                <div class="trajectory-speed-control">
                    <label class="trajectory-speed-control__label" for="speed-slider">
                        Vitesse Animation:
                    </label>
                    <input type="range" class="trajectory-speed-control__slider" id="speed-slider" min="0.5" max="5" step="0.5" value="1.0" aria-label="Animation speed">
                    <span class="trajectory-speed-control__value" id="speed-value">1.0x</span>
                </div>
            </div>
        `;
    }

    /**
     * Créer HTML preview plots 2D
     */
    createPlotsHTML() {
        return `
            <div class="trajectory-preview-plots trajectory-hidden" id="trajectory-preview-plots">
                <div class="trajectory-plot-container">
                    <h4 class="trajectory-plot-container__title">
                        <i class="fas fa-chart-area"></i>
                        <span>X(t) - Position X</span>
                    </h4>
                    <canvas id="chart-x"></canvas>
                </div>
                <div class="trajectory-plot-container">
                    <h4 class="trajectory-plot-container__title">
                        <i class="fas fa-chart-area"></i>
                        <span>Y(t) - Position Y</span>
                    </h4>
                    <canvas id="chart-y"></canvas>
                </div>
                <div class="trajectory-plot-container">
                    <h4 class="trajectory-plot-container__title">
                        <i class="fas fa-chart-area"></i>
                        <span>Z(t) - Position Z</span>
                    </h4>
                    <canvas id="chart-z"></canvas>
                </div>
            </div>
        `;
    }

    /**
     * Créer HTML settings visualisation
     */
    createSettingsHTML() {
        return `
            <div class="trajectory-settings trajectory-hidden" id="trajectory-settings">
                <h3 class="trajectory-settings__title">
                    <i class="fas fa-cog"></i>
                    <span>Paramètres Visualisation</span>
                </h3>

                <div class="trajectory-settings__grid">
                    <div class="trajectory-setting-item">
                        <span class="trajectory-setting-item__label">Axes XYZ</span>
                        <div class="trajectory-toggle active" id="toggle-axes" role="switch" aria-checked="true" aria-label="Toggle axes" tabindex="0"></div>
                    </div>
                    <div class="trajectory-setting-item">
                        <span class="trajectory-setting-item__label">Grille</span>
                        <div class="trajectory-toggle active" id="toggle-grid" role="switch" aria-checked="true" aria-label="Toggle grid" tabindex="0"></div>
                    </div>
                    <div class="trajectory-setting-item">
                        <span class="trajectory-setting-item__label">Particules</span>
                        <div class="trajectory-toggle active" id="toggle-particles" role="switch" aria-checked="true" aria-label="Toggle particles" tabindex="0"></div>
                    </div>
                    <div class="trajectory-setting-item">
                        <span class="trajectory-setting-item__label">Auto-Rotation</span>
                        <div class="trajectory-toggle" id="toggle-autorotate" role="switch" aria-checked="false" aria-label="Toggle auto-rotate" tabindex="0"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Configuration event listeners UI
     */
    setupEventListeners() {
        // Drop zone events
        if (this.elements.dropZone && this.elements.fileInput) {
            this.setupDragDrop();
            
            this.elements.dropZone.addEventListener('click', () => {
                this.elements.fileInput.click();
            });

            this.elements.fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        }

        // Type selector
        if (this.elements.typeSelector) {
            const radioButtons = this.elements.typeSelector.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.state.selectedType = e.target.value;
                    console.log(`📝 Trajectory type selected: ${this.state.selectedType}`);
                });
            });
        }

        // Animation controls
        const btnPlay = document.getElementById('btn-play');
        const btnPause = document.getElementById('btn-pause');
        const btnReset = document.getElementById('btn-reset');
        const btnScreenshot = document.getElementById('btn-screenshot');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => this.playAnimation());
        }
        if (btnPause) {
            btnPause.addEventListener('click', () => this.pauseAnimation());
        }
        if (btnReset) {
            btnReset.addEventListener('click', () => this.resetAnimation());
        }
        if (btnScreenshot) {
            btnScreenshot.addEventListener('click', () => this.takeScreenshot());
        }

        // Time scrubber
        const timeScrubber = document.getElementById('time-scrubber');
        if (timeScrubber) {
            timeScrubber.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const time = (value / 100) * this.visualizer.animationState.duration;
                this.visualizer.seekToTime(time);
            });
        }

        // Speed slider
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.visualizer.setAnimationSpeed(speed);
                this.state.animationSpeed = speed;
                
                const speedValue = document.getElementById('speed-value');
                if (speedValue) {
                    speedValue.textContent = `${speed.toFixed(1)}x`;
                }
            });
        }

        // Settings toggles
        this.setupSettingsToggles();
    }

    /**
     * Configuration drag & drop
     */
    setupDragDrop() {
        const dropZone = this.elements.dropZone;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }

    /**
     * Configuration toggles settings
     */
    setupSettingsToggles() {
        const toggles = {
            'toggle-axes': (active) => this.visualizer.toggleAxes(active),
            'toggle-grid': (active) => this.visualizer.toggleGrid(active),
            'toggle-particles': (active) => {
                this.visualizer.options.enableParticles = active;
                // Refresh particles if trajectory loaded
                if (this.adapter.trajectories.deterministic) {
                    const points = this.adapter.trajectories.deterministic.trajectory;
                    if (active) {
                        this.visualizer.addParticleEffects(points);
                    } else {
                        this.visualizer.particleSystems.forEach(ps => {
                            this.visualizer.trajectoryGroup.remove(ps);
                            ps.geometry.dispose();
                            ps.material.dispose();
                        });
                        this.visualizer.particleSystems = [];
                    }
                }
            },
            'toggle-autorotate': (active) => this.visualizer.toggleAutoRotate(active)
        };

        Object.entries(toggles).forEach(([id, callback]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                // Click event
                toggle.addEventListener('click', () => {
                    const isActive = toggle.classList.toggle('active');
                    toggle.setAttribute('aria-checked', isActive.toString());
                    callback(isActive);
                });

                // Keyboard support
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            }
        });
    }

    /**
     * Configuration events adapter
     */
    setupAdapterEvents() {
        this.adapter.onImportSuccess = (data) => {
            console.log('✅ Trajectory imported successfully', data);
            this.handleImportSuccess(data);
        };

        this.adapter.onImportError = (error) => {
            console.error('❌ Trajectory import error', error);
            this.showError(error.message || 'Erreur lors de l\'import de la trajectoire');
        };

        this.adapter.onValidationWarning = (warning) => {
            console.warn('⚠️ Validation warning', warning);
        };
    }

    /**
     * Configuration events visualizer
     */
    setupVisualizerEvents() {
        this.visualizer.events.onRenderComplete = (data) => {
            console.log('🎨 Render complete', data);
        };

        this.visualizer.events.onTimeUpdate = (time) => {
            this.updateTimeDisplay(time);
        };

        this.visualizer.events.onAnimationStart = () => {
            this.state.isAnimating = true;
        };

        this.visualizer.events.onAnimationPause = () => {
            this.state.isAnimating = false;
        };

        this.visualizer.events.onAnimationEnd = () => {
            console.log('⏹️ Animation ended');
        };
    }

    /**
     * Gérer upload fichier
     */
    async handleFileUpload(file) {
        try {
            this.showLoading();
            this.hideError();
            this.hideSuccess();

            console.log(`📁 Uploading file: ${file.name}`);

            // Import selon type sélectionné
            let result;
            switch (this.state.selectedType) {
                case 'deterministic':
                    result = await this.adapter.importDeterministic(file);
                    break;
                case 'quantiles':
                    result = await this.adapter.importQuantiles(file);
                    break;
                case 'montecarlo':
                    result = await this.adapter.importMonteCarlo(file);
                    break;
                default:
                    throw new Error(`Unknown trajectory type: ${this.state.selectedType}`);
            }

            this.state.currentFile = file;
            this.state.fileLoaded = true;

            this.hideLoading();

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
            throw error;
        }
    }

    /**
     * Gérer succès import
     */
    handleImportSuccess(data) {
        // Afficher file info
        this.updateFileInfo(data);

        // Render 3D
        if (this.state.selectedType === 'deterministic') {
            this.visualizer.renderDeterministicTrajectory(data);
            
            // Setup animation
            const duration = data.metadata?.timeRange?.duration || 3;
            this.visualizer.addTemporalAnimation(duration * 1000);
        } else if (this.state.selectedType === 'quantiles') {
            this.visualizer.renderQuantileEnvelope(data.trajectory, data.quantiles);
        }

        // Update preview plots
        if (this.options.showPreview) {
            this.updatePreviewPlots(data);
        }

        // Show controls
        this.showControls();
        this.showSettings();

        // Success message
        const pointCount = data.trajectory?.length || 0;
        this.showSuccess(`Trajectoire importée avec succès: ${pointCount} points`);
    }

    /**
     * Update file info panel
     */
    updateFileInfo(data) {
        const fileInfo = this.elements.fileInfo;
        const grid = document.getElementById('trajectory-file-info-grid');
        
        if (!fileInfo || !grid) return;

        const metadata = data.metadata || {};
        const trajectory = data.trajectory || [];

        const infoHTML = `
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">Fichier</div>
                <div class="trajectory-file-info__value">${this.state.currentFile?.name || 'N/A'}</div>
            </div>
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">Taille</div>
                <div class="trajectory-file-info__value">${this.formatFileSize(this.state.currentFile?.size || 0)}</div>
            </div>
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">Points</div>
                <div class="trajectory-file-info__value trajectory-file-info__value--highlight">${trajectory.length}</div>
            </div>
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">Durée</div>
                <div class="trajectory-file-info__value">${metadata.timeRange ? `${metadata.timeRange.duration.toFixed(2)}s` : 'N/A'}</div>
            </div>
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">Étendue Spatiale</div>
                <div class="trajectory-file-info__value">${metadata.spatialExtent ? `${metadata.spatialExtent.maxExtent.toFixed(2)}m` : 'N/A'}</div>
            </div>
            <div class="trajectory-file-info__item">
                <div class="trajectory-file-info__label">GKSC Scores</div>
                <div class="trajectory-file-info__value">${metadata.hasGKSC ? '✓ Oui' : '✗ Non'}</div>
            </div>
        `;

        grid.innerHTML = infoHTML;
        fileInfo.classList.remove('trajectory-hidden');
        fileInfo.classList.add('trajectory-fade-in');
    }

    /**
     * Update preview plots 2D
     */
    updatePreviewPlots(data) {
        const plotsContainer = document.getElementById('trajectory-preview-plots');
        if (!plotsContainer) return;

        plotsContainer.classList.remove('trajectory-hidden');
        plotsContainer.classList.add('trajectory-fade-in');

        const trajectory = data.trajectory || [];
        const type = this.state.selectedType;

        // Préparer données
        const times = trajectory.map(p => p.t);

        // Destroy existing charts
        ['xPlot', 'yPlot', 'zPlot'].forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                this.charts[key] = null;
            }
        });

        // Create charts
        if (type === 'deterministic') {
            const xData = trajectory.map(p => p.x);
            const yData = trajectory.map(p => p.y);
            const zData = trajectory.map(p => p.z);

            this.charts.xPlot = this.createChart('chart-x', times, xData, 'X', 'rgba(255, 99, 132, 1)');
            this.charts.yPlot = this.createChart('chart-y', times, yData, 'Y', 'rgba(54, 162, 235, 1)');
            this.charts.zPlot = this.createChart('chart-z', times, zData, 'Z', 'rgba(75, 192, 192, 1)');
        } else if (type === 'quantiles') {
            // Plot medians + envelopes
            const xMedian = trajectory.map(p => p.x_q50);
            const yMedian = trajectory.map(p => p.y_q50);
            const zMedian = trajectory.map(p => p.z_q50);

            this.charts.xPlot = this.createChart('chart-x', times, xMedian, 'X (q50)', 'rgba(255, 99, 132, 1)');
            this.charts.yPlot = this.createChart('chart-y', times, yMedian, 'Y (q50)', 'rgba(54, 162, 235, 1)');
            this.charts.zPlot = this.createChart('chart-z', times, zMedian, 'Z (q50)', 'rgba(75, 192, 192, 1)');
        }
    }

    /**
     * Créer chart Chart.js
     */
    createChart(canvasId, xData, yData, label, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: xData,
                datasets: [{
                    label: label,
                    data: yData,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.1)'),
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Temps (s)', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        title: { display: true, text: label, color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    /**
     * Afficher controls
     */
    showControls() {
        const controls = document.getElementById('trajectory-controls');
        if (controls) {
            controls.classList.remove('trajectory-hidden');
            controls.classList.add('trajectory-fade-in');
        }
    }

    /**
     * Afficher settings
     */
    showSettings() {
        const settings = document.getElementById('trajectory-settings');
        if (settings) {
            settings.classList.remove('trajectory-hidden');
            settings.classList.add('trajectory-fade-in');
        }
    }

    /**
     * Play animation
     */
    playAnimation() {
        this.visualizer.playAnimation();
        this.state.isAnimating = true;
        console.log('▶️ Animation started from UI');
    }

    /**
     * Pause animation
     */
    pauseAnimation() {
        this.visualizer.pauseAnimation();
        this.state.isAnimating = false;
        console.log('⏸️ Animation paused from UI');
    }

    /**
     * Reset animation
     */
    resetAnimation() {
        this.visualizer.resetAnimation();
        this.state.isAnimating = false;
        this.updateTimeDisplay(0);
        console.log('⏹️ Animation reset from UI');
    }

    /**
     * Take screenshot
     */
    takeScreenshot() {
        const filename = `trajectory-${Date.now()}.png`;
        this.visualizer.exportScreenshot(1920, 1080, filename);
        console.log(`📸 Screenshot taken: ${filename}`);
    }

    /**
     * Update time display
     */
    updateTimeDisplay(time) {
        const currentTimeDisplay = document.getElementById('current-time-display');
        const timeScrubber = document.getElementById('time-scrubber');
        const durationDisplay = document.getElementById('duration-display');

        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = `${time.toFixed(2)}s`;
        }

        if (timeScrubber && this.visualizer.animationState.duration > 0) {
            const percent = (time / this.visualizer.animationState.duration) * 100;
            timeScrubber.value = percent;
        }

        if (durationDisplay && this.visualizer.animationState.duration > 0) {
            durationDisplay.textContent = `${this.visualizer.animationState.duration.toFixed(2)}s`;
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const dropZone = this.elements.dropZone;
        if (dropZone) {
            dropZone.innerHTML = `
                <div class="trajectory-loading">
                    <div class="trajectory-spinner"></div>
                    <p class="trajectory-loading__text">Import en cours...</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        // Recreate drop zone HTML
        const dropZone = this.elements.dropZone;
        if (dropZone) {
            dropZone.innerHTML = `
                <div class="trajectory-drop-zone__icon">
                    <i class="fas fa-satellite-dish"></i>
                </div>
                <h3 class="trajectory-drop-zone__title">
                    Importer Trajectoire RK4/Monte-Carlo
                </h3>
                <p class="trajectory-drop-zone__description">
                    Glissez-déposez un fichier CSV ou cliquez pour sélectionner<br>
                    <small>Formats supportés: trajectory_deterministic.csv, trajectory_quantiles.csv</small>
                </p>
            `;
        }
    }

    /**
     * Show error
     */
    showError(message) {
        const errorEl = document.getElementById('trajectory-error');
        const errorMessage = document.getElementById('trajectory-error-message');
        
        if (errorEl && errorMessage) {
            errorMessage.textContent = message;
            errorEl.classList.remove('trajectory-hidden');
            errorEl.classList.add('trajectory-fade-in');
        }
    }

    /**
     * Hide error
     */
    hideError() {
        const errorEl = document.getElementById('trajectory-error');
        if (errorEl) {
            errorEl.classList.add('trajectory-hidden');
        }
    }

    /**
     * Show success
     */
    showSuccess(message) {
        const successEl = document.getElementById('trajectory-success');
        const successMessage = document.getElementById('trajectory-success-message');
        
        if (successEl && successMessage) {
            successMessage.textContent = message;
            successEl.classList.remove('trajectory-hidden');
            successEl.classList.add('trajectory-fade-in');

            // Auto-hide after 5s
            setTimeout(() => {
                successEl.classList.add('trajectory-hidden');
            }, 5000);
        }
    }

    /**
     * Hide success
     */
    hideSuccess() {
        const successEl = document.getElementById('trajectory-success');
        if (successEl) {
            successEl.classList.add('trajectory-hidden');
        }
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Destroy component
     */
    destroy() {
        // Destroy charts
        ['xPlot', 'yPlot', 'zPlot'].forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
            }
        });

        // Clear container
        if (this.elements.container) {
            this.elements.container.innerHTML = '';
        }

        console.log('🗑️ TrajectoryUIComponent destroyed');
    }
}

// Export pour utilisation module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrajectoryUIComponent;
}

console.log('✅ TrajectoryUIComponent class loaded');
