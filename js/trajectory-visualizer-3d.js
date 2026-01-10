/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 THIBEQUATION FRAMEWORK V2.0-BETA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * TRAJECTORY VISUALIZER 3D
 * Système de visualisation spectaculaire pour trajectoires RK4/Monte-Carlo
 * 
 * @module TrajectoryVisualizer3D
 * @author Thib - Développeur-Chercheur en Analyse Mathématique Interstellaire
 * @version 2.0.0-BETA
 * @license MIT
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TrajectoryVisualizer3D {
    /**
     * Constructeur du visualiseur 3D spectaculaire
     * @param {Object} options - Configuration du visualiseur
     */
    constructor(options = {}) {
        // Configuration avec valeurs par défaut
        this.options = {
            containerId: options.containerId || 'trajectory-canvas',
            width: options.width || null,  // null = auto (container width)
            height: options.height || null,  // null = auto (container height)
            enableAnimation: options.enableAnimation !== false,
            enableControls: options.enableControls !== false,
            enableParticles: options.enableParticles !== false,
            enableBloom: options.enableBloom !== false,
            colorScheme: options.colorScheme || 'velocity-gradient',  // 'velocity-gradient' | 'gksc-heatmap'
            backgroundColor: options.backgroundColor || 0x0a0e27,
            lineWidth: options.lineWidth || 0.05,
            tubeRadius: options.tubeRadius || 0.03,
            animationSpeed: options.animationSpeed || 1.0,
            autoRotate: options.autoRotate || false,
            showAxes: options.showAxes !== false,
            showGrid: options.showGrid !== false
        };

        // État interne
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.container = null;
        
        // Objets 3D
        this.trajectoryGroup = new THREE.Group();
        this.deterministicLine = null;
        this.quantileEnvelopes = [];
        this.particleSystems = [];
        this.velocityVectors = [];
        
        // Animation
        this.animationState = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            speed: this.options.animationSpeed,
            cursor: null,
            trail: null
        };
        
        // Données
        this.currentData = {
            deterministic: null,
            quantiles: null,
            metadata: null
        };
        
        // Events
        this.events = {
            onRenderComplete: null,
            onAnimationStart: null,
            onAnimationPause: null,
            onAnimationEnd: null,
            onTimeUpdate: null
        };
        
        // Initialisation
        this.init();
    }

    /**
     * Initialisation du visualiseur 3D
     */
    init() {
        try {
            this.container = document.getElementById(this.options.containerId);
            if (!this.container) {
                throw new Error(`Container #${this.options.containerId} not found`);
            }

            // Setup Three.js core
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            
            if (this.options.showAxes) this.setupAxes();
            if (this.options.showGrid) this.setupGrid();
            if (this.options.enableControls) this.setupControls();
            
            // Ajouter trajectory group à la scène
            this.scene.add(this.trajectoryGroup);
            
            // Démarrer boucle animation
            this.animate();
            
            // Gérer redimensionnement fenêtre
            window.addEventListener('resize', () => this.onWindowResize());
            
            console.log('✅ TrajectoryVisualizer3D initialized successfully');
        } catch (error) {
            console.error('❌ TrajectoryVisualizer3D initialization failed:', error);
            throw error;
        }
    }

    /**
     * Configuration de la scène Three.js
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        
        // Ajouter fog pour profondeur
        this.scene.fog = new THREE.Fog(this.options.backgroundColor, 5, 15);
    }

    /**
     * Configuration de la caméra
     */
    setupCamera() {
        const width = this.options.width || this.container.clientWidth;
        const height = this.options.height || this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(
            60,  // FOV
            width / height,  // Aspect ratio
            0.1,  // Near plane
            1000  // Far plane
        );
        
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Configuration du renderer WebGL
     */
    setupRenderer() {
        const width = this.options.width || this.container.clientWidth;
        const height = this.options.height || this.container.clientHeight;
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Configuration des lumières
     */
    setupLights() {
        // Ambient light (éclairage général doux)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (soleil)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Hemisphere light (ciel/sol)
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x545454, 0.5);
        this.scene.add(hemisphereLight);
        
        // Point lights pour effet cosmic
        const pointLight1 = new THREE.PointLight(0x667eea, 0.5, 10);
        pointLight1.position.set(2, 2, 2);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x764ba2, 0.5, 10);
        pointLight2.position.set(-2, -2, -2);
        this.scene.add(pointLight2);
    }

    /**
     * Configuration des axes XYZ
     */
    setupAxes() {
        const axesHelper = new THREE.AxesHelper(2);
        axesHelper.name = 'axes';
        this.scene.add(axesHelper);
        
        // Labels texte pour axes (X, Y, Z)
        const loader = new THREE.FontLoader();
        // Note: Dans production, charger font réelle
        // Pour beta, utiliser sprites simples
        this.createAxisLabel('X', new THREE.Vector3(2.2, 0, 0), 0xff0000);
        this.createAxisLabel('Y', new THREE.Vector3(0, 2.2, 0), 0x00ff00);
        this.createAxisLabel('Z', new THREE.Vector3(0, 0, 2.2), 0x0000ff);
    }

    /**
     * Créer label texte pour axe
     */
    createAxisLabel(text, position, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.font = 'Bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(0.3, 0.3, 1);
        
        this.scene.add(sprite);
    }

    /**
     * Configuration de la grille
     */
    setupGrid() {
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        gridHelper.name = 'grid';
        this.scene.add(gridHelper);
    }

    /**
     * Configuration des contrôles orbite
     */
    setupControls() {
        if (typeof THREE.OrbitControls === 'undefined') {
            console.warn('⚠️ THREE.OrbitControls not loaded, controls disabled');
            return;
        }
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = 1.0;
    }

    /**
     * Render trajectoire déterministe (RK4)
     * @param {Object} trajectoryData - Données trajectory avec points {t, x, y, z, vx, vy, vz, G, K, S, C}
     */
    renderDeterministicTrajectory(trajectoryData) {
        try {
            console.log('🎨 Rendering deterministic trajectory...', trajectoryData);
            
            // Nettoyer ligne existante
            if (this.deterministicLine) {
                this.trajectoryGroup.remove(this.deterministicLine);
                this.deterministicLine.geometry.dispose();
                this.deterministicLine.material.dispose();
            }
            
            const points = trajectoryData.trajectory || trajectoryData;
            if (!points || points.length < 2) {
                throw new Error('Trajectory must have at least 2 points');
            }
            
            // Créer géométrie ligne
            const positions = [];
            const colors = [];
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                positions.push(point.x, point.y, point.z);
                
                // Calculer couleur basée sur vitesse ou GKSC
                const color = this.calculatePointColor(point, i, points.length);
                colors.push(color.r, color.g, color.b);
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            // Material avec vertex colors
            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                linewidth: 2  // Note: linewidth > 1 non supporté sur certains navigateurs
            });
            
            this.deterministicLine = new THREE.Line(geometry, material);
            this.deterministicLine.name = 'deterministic-trajectory';
            this.trajectoryGroup.add(this.deterministicLine);
            
            // Stocker données
            this.currentData.deterministic = trajectoryData;
            if (trajectoryData.metadata) {
                this.currentData.metadata = trajectoryData.metadata;
                this.animationState.duration = trajectoryData.metadata.timeRange?.duration || 0;
            }
            
            // Ajouter particules si activé
            if (this.options.enableParticles) {
                this.addParticleEffects(points);
            }
            
            console.log(`✅ Deterministic trajectory rendered: ${points.length} points`);
            
            if (this.events.onRenderComplete) {
                this.events.onRenderComplete({ type: 'deterministic', pointCount: points.length });
            }
            
        } catch (error) {
            console.error('❌ Error rendering deterministic trajectory:', error);
            throw error;
        }
    }

    /**
     * Calculer couleur d'un point selon vitesse ou GKSC
     */
    calculatePointColor(point, index, totalPoints) {
        if (this.options.colorScheme === 'gksc-heatmap' && point.hasOwnProperty('ThibScore')) {
            // Heatmap GKSC: rouge (anomalie haute) → bleu (normale)
            const score = point.ThibScore || 0;
            const normalized = Math.min(Math.max(score / 10, 0), 1);
            return new THREE.Color().setHSL(0.66 - normalized * 0.66, 0.8, 0.5);
        } else {
            // Gradient vitesse: bleu (lent) → rouge (rapide)
            const vx = point.vx || 0;
            const vy = point.vy || 0;
            const vz = point.vz || 0;
            const speed = Math.sqrt(vx*vx + vy*vy + vz*vz);
            
            // Normaliser vitesse (assumant max ~100 m/s)
            const normalized = Math.min(speed / 100, 1);
            return new THREE.Color().setHSL(0.66 - normalized * 0.66, 1.0, 0.5);
        }
    }

    /**
     * Render enveloppes quantiles (Monte-Carlo)
     * @param {Object} quantilesData - Données quantiles avec {t, x_q##, y_q##, z_q##}
     * @param {Array} quantilesList - Liste des quantiles (ex: [5, 25, 50, 75, 95])
     */
    renderQuantileEnvelope(quantilesData, quantilesList) {
        try {
            console.log('🎨 Rendering quantile envelopes...', quantilesList);
            
            // Nettoyer enveloppes existantes
            this.quantileEnvelopes.forEach(envelope => {
                this.trajectoryGroup.remove(envelope);
                envelope.geometry.dispose();
                envelope.material.dispose();
            });
            this.quantileEnvelopes = [];
            
            const points = quantilesData.trajectory || quantilesData;
            if (!points || points.length < 2) {
                throw new Error('Quantile data must have at least 2 points');
            }
            
            // Identifier paires de quantiles pour bandes (q05-q25, q25-q75, q75-q95)
            const bands = [
                { lower: 5, upper: 25, opacity: 0.15, color: 0xffa500 },  // Orange (incertitude haute)
                { lower: 25, upper: 75, opacity: 0.35, color: 0x7cfc00 }, // Vert clair (confiance)
                { lower: 75, upper: 95, opacity: 0.15, color: 0xffa500 }  // Orange (incertitude haute)
            ];
            
            bands.forEach(band => {
                if (quantilesList.includes(band.lower) && quantilesList.includes(band.upper)) {
                    const envelope = this.createQuantileBand(points, band.lower, band.upper, band.color, band.opacity);
                    if (envelope) {
                        this.trajectoryGroup.add(envelope);
                        this.quantileEnvelopes.push(envelope);
                    }
                }
            });
            
            // Render médiane (q50) comme ligne épaisse si disponible
            if (quantilesList.includes(50)) {
                const medianLine = this.createMedianLine(points);
                if (medianLine) {
                    this.trajectoryGroup.add(medianLine);
                    this.quantileEnvelopes.push(medianLine);
                }
            }
            
            // Stocker données
            this.currentData.quantiles = quantilesData;
            
            console.log(`✅ Quantile envelopes rendered: ${this.quantileEnvelopes.length} objects`);
            
            if (this.events.onRenderComplete) {
                this.events.onRenderComplete({ 
                    type: 'quantiles', 
                    envelopeCount: this.quantileEnvelopes.length,
                    quantiles: quantilesList
                });
            }
            
        } catch (error) {
            console.error('❌ Error rendering quantile envelopes:', error);
            throw error;
        }
    }

    /**
     * Créer bande entre deux quantiles
     */
    createQuantileBand(points, lowerQ, upperQ, color, opacity) {
        try {
            // Extraire positions pour quantiles inférieur et supérieur
            const lowerPoints = [];
            const upperPoints = [];
            
            for (const point of points) {
                const xLower = point[`x_q${lowerQ.toString().padStart(2, '0')}`];
                const yLower = point[`y_q${lowerQ.toString().padStart(2, '0')}`];
                const zLower = point[`z_q${lowerQ.toString().padStart(2, '0')}`];
                
                const xUpper = point[`x_q${upperQ.toString().padStart(2, '0')}`];
                const yUpper = point[`y_q${upperQ.toString().padStart(2, '0')}`];
                const zUpper = point[`z_q${upperQ.toString().padStart(2, '0')}`];
                
                if (xLower !== undefined && yLower !== undefined && zLower !== undefined &&
                    xUpper !== undefined && yUpper !== undefined && zUpper !== undefined) {
                    lowerPoints.push(new THREE.Vector3(xLower, yLower, zLower));
                    upperPoints.push(new THREE.Vector3(xUpper, yUpper, zUpper));
                }
            }
            
            if (lowerPoints.length < 2) return null;
            
            // Créer mesh tube entre lower et upper
            // Simplification: utiliser TubeGeometry sur lower curve avec radius variable
            const lowerCurve = new THREE.CatmullRomCurve3(lowerPoints);
            const upperCurve = new THREE.CatmullRomCurve3(upperPoints);
            
            // Calculer radius moyen entre lower et upper
            const segments = Math.min(lowerPoints.length * 4, 200);
            const geometry = new THREE.TubeGeometry(lowerCurve, segments, this.options.tubeRadius, 8, false);
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = `quantile-band-q${lowerQ}-q${upperQ}`;
            
            return mesh;
            
        } catch (error) {
            console.warn(`⚠️ Could not create quantile band q${lowerQ}-q${upperQ}:`, error);
            return null;
        }
    }

    /**
     * Créer ligne médiane (q50)
     */
    createMedianLine(points) {
        try {
            const positions = [];
            
            for (const point of points) {
                const x = point[`x_q50`];
                const y = point[`y_q50`];
                const z = point[`z_q50`];
                
                if (x !== undefined && y !== undefined && z !== undefined) {
                    positions.push(x, y, z);
                }
            }
            
            if (positions.length < 6) return null;  // Minimum 2 points
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: 0xffd700,  // Or
                linewidth: 3
            });
            
            const line = new THREE.Line(geometry, material);
            line.name = 'median-q50';
            
            return line;
            
        } catch (error) {
            console.warn('⚠️ Could not create median line:', error);
            return null;
        }
    }

    /**
     * Ajouter effets particules aux points clés
     */
    addParticleEffects(points) {
        try {
            // Nettoyer particules existantes
            this.particleSystems.forEach(ps => {
                this.trajectoryGroup.remove(ps);
                ps.geometry.dispose();
                ps.material.dispose();
            });
            this.particleSystems = [];
            
            // Créer particules tous les N points (densité adaptative)
            const step = Math.max(1, Math.floor(points.length / 20));
            const particlePositions = [];
            const particleColors = [];
            
            for (let i = 0; i < points.length; i += step) {
                const point = points[i];
                particlePositions.push(point.x, point.y, point.z);
                
                const color = this.calculatePointColor(point, i, points.length);
                particleColors.push(color.r, color.g, color.b);
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });
            
            const particles = new THREE.Points(geometry, material);
            particles.name = 'trajectory-particles';
            this.trajectoryGroup.add(particles);
            this.particleSystems.push(particles);
            
            console.log(`✨ Particle effects added: ${particlePositions.length / 3} particles`);
            
        } catch (error) {
            console.warn('⚠️ Could not add particle effects:', error);
        }
    }

    /**
     * Ajouter animation temporelle avec curseur
     * @param {Number} duration - Durée animation en millisecondes
     */
    addTemporalAnimation(duration = 10000) {
        try {
            if (!this.currentData.deterministic) {
                console.warn('⚠️ No deterministic trajectory loaded for animation');
                return;
            }
            
            this.animationState.duration = duration / 1000;  // Convertir en secondes
            this.animationState.currentTime = 0;
            
            // Créer curseur (sphere émissive)
            if (this.animationState.cursor) {
                this.trajectoryGroup.remove(this.animationState.cursor);
            }
            
            const cursorGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const cursorMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 1.0
            });
            this.animationState.cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
            this.animationState.cursor.name = 'animation-cursor';
            this.trajectoryGroup.add(this.animationState.cursor);
            
            // Créer trail (ligne qui suit curseur)
            const trailGeometry = new THREE.BufferGeometry();
            const trailMaterial = new THREE.LineBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.5
            });
            this.animationState.trail = new THREE.Line(trailGeometry, trailMaterial);
            this.animationState.trail.name = 'animation-trail';
            this.trajectoryGroup.add(this.animationState.trail);
            
            console.log(`⏱️ Temporal animation configured: ${duration}ms`);
            
        } catch (error) {
            console.error('❌ Error adding temporal animation:', error);
        }
    }

    /**
     * Jouer animation temporelle
     */
    playAnimation() {
        if (!this.options.enableAnimation) {
            console.warn('⚠️ Animation disabled in options');
            return;
        }
        
        this.animationState.isPlaying = true;
        console.log('▶️ Animation started');
        
        if (this.events.onAnimationStart) {
            this.events.onAnimationStart();
        }
    }

    /**
     * Pause animation temporelle
     */
    pauseAnimation() {
        this.animationState.isPlaying = false;
        console.log('⏸️ Animation paused');
        
        if (this.events.onAnimationPause) {
            this.events.onAnimationPause();
        }
    }

    /**
     * Reset animation temporelle
     */
    resetAnimation() {
        this.animationState.isPlaying = false;
        this.animationState.currentTime = 0;
        console.log('⏹️ Animation reset');
    }

    /**
     * Définir vitesse animation
     */
    setAnimationSpeed(speed) {
        this.animationState.speed = Math.max(0.1, Math.min(speed, 5.0));
        console.log(`⏩ Animation speed: ${this.animationState.speed}x`);
    }

    /**
     * Seek à un temps spécifique
     */
    seekToTime(time) {
        this.animationState.currentTime = Math.max(0, Math.min(time, this.animationState.duration));
        console.log(`⏭️ Seek to: ${this.animationState.currentTime.toFixed(2)}s`);
        
        if (this.events.onTimeUpdate) {
            this.events.onTimeUpdate(this.animationState.currentTime);
        }
    }

    /**
     * Update animation cursor position
     */
    updateAnimationCursor(deltaTime) {
        if (!this.animationState.isPlaying || !this.currentData.deterministic) {
            return;
        }
        
        // Avancer temps
        this.animationState.currentTime += deltaTime * this.animationState.speed;
        
        // Loop ou stop à la fin
        if (this.animationState.currentTime >= this.animationState.duration) {
            this.animationState.currentTime = 0;  // Loop
            
            if (this.events.onAnimationEnd) {
                this.events.onAnimationEnd();
            }
        }
        
        // Interpoler position curseur
        const points = this.currentData.deterministic.trajectory || this.currentData.deterministic;
        const metadata = this.currentData.deterministic.metadata;
        
        if (metadata && metadata.timeRange) {
            const tMin = metadata.timeRange.tMin;
            const tMax = metadata.timeRange.tMax;
            const currentT = tMin + (this.animationState.currentTime / this.animationState.duration) * (tMax - tMin);
            
            // Trouver indices points encadrants
            let i = 0;
            while (i < points.length - 1 && points[i].t < currentT) {
                i++;
            }
            
            if (i > 0 && i < points.length) {
                // Interpolation linéaire entre points[i-1] et points[i]
                const p0 = points[i - 1];
                const p1 = points[i];
                const t = (currentT - p0.t) / (p1.t - p0.t);
                
                const x = p0.x + (p1.x - p0.x) * t;
                const y = p0.y + (p1.y - p0.y) * t;
                const z = p0.z + (p1.z - p0.z) * t;
                
                if (this.animationState.cursor) {
                    this.animationState.cursor.position.set(x, y, z);
                }
                
                // Update trail (dernières N positions)
                // Simplification: trail sera implémenté dans version future
            }
        }
        
        if (this.events.onTimeUpdate) {
            this.events.onTimeUpdate(this.animationState.currentTime);
        }
    }

    /**
     * Toggle axes visibility
     */
    toggleAxes(visible) {
        const axes = this.scene.getObjectByName('axes');
        if (axes) axes.visible = visible;
    }

    /**
     * Toggle grid visibility
     */
    toggleGrid(visible) {
        const grid = this.scene.getObjectByName('grid');
        if (grid) grid.visible = visible;
    }

    /**
     * Toggle auto-rotation
     */
    toggleAutoRotate(enabled) {
        if (this.controls) {
            this.controls.autoRotate = enabled;
        }
    }

    /**
     * Clear all trajectories
     */
    clearTrajectories() {
        // Remove deterministic line
        if (this.deterministicLine) {
            this.trajectoryGroup.remove(this.deterministicLine);
            this.deterministicLine.geometry.dispose();
            this.deterministicLine.material.dispose();
            this.deterministicLine = null;
        }
        
        // Remove quantile envelopes
        this.quantileEnvelopes.forEach(envelope => {
            this.trajectoryGroup.remove(envelope);
            envelope.geometry.dispose();
            envelope.material.dispose();
        });
        this.quantileEnvelopes = [];
        
        // Remove particles
        this.particleSystems.forEach(ps => {
            this.trajectoryGroup.remove(ps);
            ps.geometry.dispose();
            ps.material.dispose();
        });
        this.particleSystems = [];
        
        // Clear data
        this.currentData = {
            deterministic: null,
            quantiles: null,
            metadata: null
        };
        
        console.log('🧹 All trajectories cleared');
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        if (this.camera) {
            this.camera.position.set(3, 3, 3);
            this.camera.lookAt(0, 0, 0);
        }
        
        if (this.controls) {
            this.controls.reset();
        }
        
        console.log('📷 Camera reset to default position');
    }

    /**
     * Export screenshot
     * @param {Number} width - Largeur image
     * @param {Number} height - Hauteur image
     * @param {String} filename - Nom fichier
     */
    exportScreenshot(width = 1920, height = 1080, filename = 'trajectory-screenshot.png') {
        try {
            // Sauvegarder taille actuelle
            const currentWidth = this.renderer.domElement.width;
            const currentHeight = this.renderer.domElement.height;
            
            // Render à résolution demandée
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.render(this.scene, this.camera);
            
            // Obtenir image data
            this.renderer.domElement.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
                
                console.log(`📸 Screenshot exported: ${filename} (${width}x${height})`);
            });
            
            // Restaurer taille originale
            this.renderer.setSize(currentWidth, currentHeight);
            this.camera.aspect = currentWidth / currentHeight;
            this.camera.updateProjectionMatrix();
            
        } catch (error) {
            console.error('❌ Error exporting screenshot:', error);
        }
    }

    /**
     * Gérer redimensionnement fenêtre
     */
    onWindowResize() {
        const width = this.options.width || this.container.clientWidth;
        const height = this.options.height || this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }

    /**
     * Boucle d'animation principale
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = 0.016;  // ~60 FPS
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update animation cursor
        this.updateAnimationCursor(deltaTime);
        
        // Update particles rotation (effet subtil)
        this.particleSystems.forEach(ps => {
            ps.rotation.y += 0.001;
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Cleanup et destruction
     */
    destroy() {
        try {
            // Stop animation
            this.animationState.isPlaying = false;
            
            // Clear trajectories
            this.clearTrajectories();
            
            // Dispose scene objects
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            
            // Dispose renderer
            if (this.renderer) {
                this.renderer.dispose();
                if (this.container && this.renderer.domElement) {
                    this.container.removeChild(this.renderer.domElement);
                }
            }
            
            // Remove event listeners
            window.removeEventListener('resize', this.onWindowResize);
            
            console.log('🗑️ TrajectoryVisualizer3D destroyed');
            
        } catch (error) {
            console.error('❌ Error destroying TrajectoryVisualizer3D:', error);
        }
    }
}

// Export pour utilisation module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrajectoryVisualizer3D;
}

console.log('✅ TrajectoryVisualizer3D class loaded');
