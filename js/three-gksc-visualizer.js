/**
 * ThibEquation 3D GKSC Visualizer
 * Advanced Three.js visualization system for GKSC parameters and trajectories
 */

class GKSCVisualizer3D {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        
        // GKSC visualization objects
        this.gkscSphere = null;
        this.trajectoryLine = null;
        this.particleSystem = null;
        this.scoreIndicators = [];
        
        // Animation parameters
        this.time = 0;
        this.animationSpeed = 0.01;
        
        // Current GKSC values
        this.currentGKSC = {
            G: 0, K: 0, S: 0, C: 0
        };
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLights();
        this.createGKSCVisualization();
        this.createStarField();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a); // Deep space black
        this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    }
    
    createCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 10, 20);
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    createControls() {
        // OrbitControls for smooth camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI;
    }
    
    createLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (like a distant star)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
        pointLight.position.set(-10, -10, -10);
        this.scene.add(pointLight);
        
        // Atmospheric rim light
        const rimLight = new THREE.DirectionalLight(0x10b981, 0.5);
        rimLight.position.set(-5, 0, -10);
        this.scene.add(rimLight);
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createGKSCVisualization() {
        // Central GKSC sphere representing the analyzed object
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        this.gkscSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.gkscSphere.castShadow = true;
        this.gkscSphere.receiveShadow = true;
        this.scene.add(this.gkscSphere);
        
        // GKSC component indicators (4 orbiting elements)
        this.createGKSCIndicators();
        
        // Trajectory visualization
        this.createTrajectoryVisualization();
    }
    
    createGKSCIndicators() {
        const indicators = [
            { name: 'G', color: 0x3b82f6, position: [5, 0, 0] },   // Geometric - Blue
            { name: 'K', color: 0x10b981, position: [0, 5, 0] },   // Kinematic - Green  
            { name: 'S', color: 0xf59e0b, position: [-5, 0, 0] },  // Spectroscopic - Orange
            { name: 'C', color: 0x8b5cf6, position: [0, -5, 0] }   // Contextual - Purple
        ];
        
        indicators.forEach((indicator, index) => {
            // Create indicator geometry
            const geometry = new THREE.OctahedronGeometry(0.5);
            const material = new THREE.MeshPhongMaterial({
                color: indicator.color,
                transparent: true,
                opacity: 0.9,
                emissive: indicator.color,
                emissiveIntensity: 0.2
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...indicator.position);
            mesh.userData = { 
                component: indicator.name,
                originalPosition: new THREE.Vector3(...indicator.position),
                orbitRadius: 5,
                orbitSpeed: 0.5 + index * 0.1
            };
            
            this.scoreIndicators.push(mesh);
            this.scene.add(mesh);
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: indicator.color,
                transparent: true,
                opacity: 0.3
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            mesh.add(glow);
        });
    }
    
    createTrajectoryVisualization() {
        // Create curved trajectory path
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, 0, 0),
            new THREE.Vector3(-5, 5, 2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, -2),
            new THREE.Vector3(10, 0, 0)
        ]);
        
        const points = curve.getPoints(100);
        const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const trajectoryMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
        });
        
        this.trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
        this.scene.add(this.trajectoryLine);
        
        // Add moving particle along trajectory
        this.createTrajectoryParticle(curve);
    }
    
    createTrajectoryParticle(curve) {
        const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5
        });
        
        this.trajectoryParticle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.trajectoryParticle.userData = { curve: curve, progress: 0 };
        this.scene.add(this.trajectoryParticle);
    }
    
    updateGKSCValues(gkscData) {
        this.currentGKSC = { ...gkscData };
        
        // Update central sphere based on total score
        const totalScore = (gkscData.G + gkscData.K + gkscData.S + gkscData.C) / 4;
        const normalizedScore = totalScore / 10;
        
        // Scale and color based on score
        this.gkscSphere.scale.setScalar(0.5 + normalizedScore * 1.5);
        
        // Color interpolation based on score
        const lowColor = new THREE.Color(0x3b82f6);  // Blue for low scores
        const highColor = new THREE.Color(0xff4444); // Red for high scores  
        const currentColor = lowColor.lerp(highColor, normalizedScore);
        this.gkscSphere.material.color = currentColor;
        
        // Update individual indicators
        this.scoreIndicators.forEach((indicator, index) => {
            const components = ['G', 'K', 'S', 'C'];
            const value = gkscData[components[index]] / 10;
            
            // Scale based on component value
            indicator.scale.setScalar(0.5 + value * 1.5);
            
            // Adjust emissive intensity
            indicator.material.emissiveIntensity = 0.1 + value * 0.4;
            
            // Update orbit radius based on value
            indicator.userData.orbitRadius = 3 + value * 4;
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += this.animationSpeed;
        
        // Update controls
        this.controls.update();
        
        // Animate GKSC indicators orbiting
        this.scoreIndicators.forEach((indicator, index) => {
            const userData = indicator.userData;
            const angle = this.time * userData.orbitSpeed + (index * Math.PI / 2);
            
            indicator.position.x = Math.cos(angle) * userData.orbitRadius;
            indicator.position.z = Math.sin(angle) * userData.orbitRadius;
            
            // Rotate indicator
            indicator.rotation.x += 0.02;
            indicator.rotation.y += 0.01;
        });
        
        // Animate central sphere
        if (this.gkscSphere) {
            this.gkscSphere.rotation.y += 0.005;
            this.gkscSphere.rotation.x += 0.002;
        }
        
        // Animate trajectory particle
        if (this.trajectoryParticle && this.trajectoryParticle.userData.curve) {
            const curve = this.trajectoryParticle.userData.curve;
            this.trajectoryParticle.userData.progress += 0.005;
            
            if (this.trajectoryParticle.userData.progress > 1) {
                this.trajectoryParticle.userData.progress = 0;
            }
            
            const point = curve.getPointAt(this.trajectoryParticle.userData.progress);
            this.trajectoryParticle.position.copy(point);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    createScoreVisualization(thibScore) {
        // Remove existing score visualization
        this.scene.children.forEach(child => {
            if (child.userData.isScoreViz) {
                this.scene.remove(child);
            }
        });
        
        // Create score visualization ring
        const ringGeometry = new THREE.RingGeometry(8, 10, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: this.getScoreColor(thibScore),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const scoreRing = new THREE.Mesh(ringGeometry, ringMaterial);
        scoreRing.rotation.x = Math.PI / 2;
        scoreRing.userData.isScoreViz = true;
        this.scene.add(scoreRing);
        
        // Add score text (3D text would require additional setup)
        this.displayScoreHUD(thibScore);
    }
    
    getScoreColor(score) {
        if (score < 3) return 0x10b981; // Green - Low priority
        if (score < 6) return 0xf59e0b; // Orange - Medium priority  
        if (score < 8) return 0xff6b35; // Red-orange - High priority
        return 0xff4444; // Red - Critical priority
    }
    
    displayScoreHUD(score) {
        // Create or update HUD overlay for score display
        const hudElement = document.getElementById('gksc-score-hud') || this.createScoreHUD();
        hudElement.innerHTML = `
            <div class="score-display">
                <div class="score-value">${score.toFixed(2)}</div>
                <div class="score-label">ThibScore</div>
                <div class="score-interpretation">${this.getScoreInterpretation(score)}</div>
            </div>
        `;
    }
    
    createScoreHUD() {
        const hud = document.createElement('div');
        hud.id = 'gksc-score-hud';
        hud.className = 'gksc-3d-hud';
        hud.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        this.container.appendChild(hud);
        return hud;
    }
    
    getScoreInterpretation(score) {
        if (score < 3) return "Standard Object";
        if (score < 6) return "Interesting Characteristics";
        if (score < 8) return "High Priority Investigation";
        return "Critical Anomaly";
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Cleanup Three.js objects
        if (this.scene) {
            this.scene.clear();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.onWindowResize);
    }
}

// Export for use in other modules
window.GKSCVisualizer3D = GKSCVisualizer3D;