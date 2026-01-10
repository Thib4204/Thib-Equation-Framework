/**
 * 🚀 ThibEquation Framework - Adaptateur Trajectoires RK4/Monte-Carlo
 * Version: 2.0.0-BETA
 * Auteur: Thib4204
 * 
 * Système d'import et validation de trajectoires calculées en Notebook
 * Support RK4 déterministe + Monte-Carlo probabiliste avec quantiles
 */

class TrajectoryAdapter {
    constructor(options = {}) {
        this.options = {
            validatePhysics: true,
            autoNormalize: true,
            interpolate: false,
            maxPoints: 10000,
            supportedTypes: ['deterministic', 'quantiles', 'monte-carlo'],
            ...options
        };
        
        this.trajectories = {
            deterministic: null,
            quantiles: null,
            monteCarlo: []
        };
        
        this.metadata = {
            deterministic: null,
            quantiles: null
        };
        
        this.statistics = null;
        this.errors = [];
        
        this.eventListeners = {
            onTrajectoryLoaded: [],
            onTrajectoryError: [],
            onValidationComplete: []
        };
    }
    
    // ========================================
    // IMPORT TRAJECTOIRES
    // ========================================
    
    /**
     * Import trajectoire déterministe (RK4)
     * @param {File|string} source - Fichier ou contenu CSV
     * @returns {Promise<Object>} Résultat de l'import
     */
    async importDeterministic(source) {
        try {
            const content = await this.readSource(source);
            const parsed = this.parseTrajectoryCSV(content, 'deterministic');
            
            // Validation physique
            if (this.options.validatePhysics) {
                this.validatePhysicalConsistency(parsed.data, 'deterministic');
            }
            
            // Normalisation si demandée
            if (this.options.autoNormalize) {
                parsed.data = this.normalizeTrajectory(parsed.data);
            }
            
            this.trajectories.deterministic = parsed.data;
            this.metadata.deterministic = {
                headers: parsed.headers,
                pointCount: parsed.data.length,
                timeRange: this.getTimeRange(parsed.data),
                spatialExtent: this.getSpatialExtent(parsed.data)
            };
            
            this.trigger('onTrajectoryLoaded', {
                type: 'deterministic',
                points: parsed.data.length,
                metadata: this.metadata.deterministic
            });
            
            return {
                success: true,
                type: 'deterministic',
                data: this.trajectories.deterministic,
                metadata: this.metadata.deterministic
            };
            
        } catch (error) {
            this.errors.push({ type: 'deterministic', error });
            this.trigger('onTrajectoryError', { type: 'deterministic', error });
            throw error;
        }
    }
    
    /**
     * Import trajectoires Monte-Carlo avec quantiles
     * @param {File|string} source - Fichier ou contenu CSV
     * @returns {Promise<Object>} Résultat de l'import
     */
    async importQuantiles(source) {
        try {
            const content = await this.readSource(source);
            const parsed = this.parseTrajectoryCSV(content, 'quantiles');
            
            // Validation de la structure quantiles
            this.validateQuantilesStructure(parsed);
            
            // Normalisation
            if (this.options.autoNormalize) {
                parsed.data = this.normalizeTrajectory(parsed.data);
            }
            
            this.trajectories.quantiles = parsed.data;
            this.metadata.quantiles = {
                headers: parsed.headers,
                pointCount: parsed.data.length,
                quantiles: this.extractQuantiles(parsed.headers),
                timeRange: this.getTimeRange(parsed.data),
                spatialExtent: this.getSpatialExtent(parsed.data)
            };
            
            this.trigger('onTrajectoryLoaded', {
                type: 'quantiles',
                points: parsed.data.length,
                metadata: this.metadata.quantiles
            });
            
            return {
                success: true,
                type: 'quantiles',
                data: this.trajectories.quantiles,
                metadata: this.metadata.quantiles
            };
            
        } catch (error) {
            this.errors.push({ type: 'quantiles', error });
            this.trigger('onTrajectoryError', { type: 'quantiles', error });
            throw error;
        }
    }
    
    /**
     * Import trajectoires Monte-Carlo brutes (simulations individuelles)
     * @param {File|string} source - Fichier ou contenu CSV
     * @returns {Promise<Object>} Résultat de l'import
     */
    async importMonteCarlo(source) {
        try {
            const content = await this.readSource(source);
            const parsed = this.parseTrajectoryCSV(content, 'monte-carlo');
            
            // Validation physique de chaque simulation
            if (this.options.validatePhysics) {
                this.validatePhysicalConsistency(parsed.data, 'monte-carlo');
            }
            
            this.trajectories.monteCarlo.push(parsed.data);
            
            this.trigger('onTrajectoryLoaded', {
                type: 'monte-carlo',
                simulation: this.trajectories.monteCarlo.length,
                points: parsed.data.length
            });
            
            return {
                success: true,
                type: 'monte-carlo',
                simulationIndex: this.trajectories.monteCarlo.length - 1,
                data: parsed.data
            };
            
        } catch (error) {
            this.errors.push({ type: 'monte-carlo', error });
            this.trigger('onTrajectoryError', { type: 'monte-carlo', error });
            throw error;
        }
    }
    
    // ========================================
    // PARSING CSV
    // ========================================
    
    /**
     * Parse CSV de trajectoire
     * @param {string} content - Contenu CSV
     * @param {string} type - Type de trajectoire
     * @returns {Object} Données parsées
     */
    parseTrajectoryCSV(content, type) {
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            throw new Error('Fichier CSV vide');
        }
        
        // Extraction des headers
        const headers = this.parseLine(lines[0]);
        
        // Validation des champs requis selon le type
        this.validateHeaders(headers, type);
        
        // Parsing des données
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (data.length >= this.options.maxPoints) {
                console.warn(`Limite de ${this.options.maxPoints} points atteinte. Lignes restantes ignorées.`);
                break;
            }
            
            const values = this.parseLine(lines[i]);
            
            if (values.length !== headers.length) {
                console.warn(`Ligne ${i + 1}: nombre de colonnes incorrect`);
                continue;
            }
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = this.parseValue(values[index]);
            });
            
            data.push(row);
        }
        
        return { headers, data };
    }
    
    /**
     * Parse une ligne CSV
     * @param {string} line - Ligne CSV
     * @returns {Array} Valeurs
     */
    parseLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }
    
    /**
     * Parse une valeur en détectant son type
     * @param {string} value - Valeur à parser
     * @returns {*} Valeur typée
     */
    parseValue(value) {
        value = value.trim();
        
        if (value === '' || value.toLowerCase() === 'null' || value.toLowerCase() === 'nan') {
            return null;
        }
        
        if (/^-?\d+\.?\d*([eE][+-]?\d+)?$/.test(value)) {
            const num = parseFloat(value);
            return isNaN(num) ? value : num;
        }
        
        return value;
    }
    
    // ========================================
    // VALIDATION
    // ========================================
    
    /**
     * Validation des headers selon le type
     * @param {Array} headers - Headers du CSV
     * @param {string} type - Type de trajectoire
     */
    validateHeaders(headers, type) {
        const requiredFields = {
            'deterministic': ['t', 'x', 'y', 'z', 'vx', 'vy', 'vz'],
            'quantiles': ['t', 'x_q50', 'y_q50', 'z_q50'], // Minimum
            'monte-carlo': ['t', 'x', 'y', 'z']
        };
        
        const required = requiredFields[type];
        if (!required) {
            throw new Error(`Type de trajectoire inconnu: ${type}`);
        }
        
        const missing = required.filter(field => !headers.includes(field));
        if (missing.length > 0) {
            throw new Error(`Champs manquants pour ${type}: ${missing.join(', ')}`);
        }
    }
    
    /**
     * Validation de la structure quantiles
     * @param {Object} parsed - Données parsées
     */
    validateQuantilesStructure(parsed) {
        const headers = parsed.headers;
        
        // Vérifier la présence de quantiles
        const quantilePattern = /_q\d+$/;
        const quantileHeaders = headers.filter(h => quantilePattern.test(h));
        
        if (quantileHeaders.length === 0) {
            throw new Error('Aucun quantile détecté dans les headers (format attendu: x_q05, x_q50, etc.)');
        }
        
        // Vérifier que chaque dimension a des quantiles
        const dimensions = ['x', 'y', 'z'];
        dimensions.forEach(dim => {
            const dimQuantiles = quantileHeaders.filter(h => h.startsWith(dim + '_q'));
            if (dimQuantiles.length === 0) {
                console.warn(`Aucun quantile trouvé pour la dimension ${dim}`);
            }
        });
    }
    
    /**
     * Validation de la consistance physique
     * @param {Array} data - Données de trajectoire
     * @param {string} type - Type de trajectoire
     */
    validatePhysicalConsistency(data, type) {
        const errors = [];
        
        // Vérifier la monotonie du temps
        for (let i = 1; i < data.length; i++) {
            if (data[i].t <= data[i - 1].t) {
                errors.push(`Point ${i}: temps non monotone (t=${data[i].t} <= t=${data[i - 1].t})`);
            }
        }
        
        // Vérifier les valeurs finies
        data.forEach((point, index) => {
            ['x', 'y', 'z'].forEach(coord => {
                const value = point[coord];
                if (value !== null && value !== undefined && !isFinite(value)) {
                    errors.push(`Point ${index}: ${coord} non fini (${value})`);
                }
            });
        });
        
        // Vérifier les vitesses si présentes (déterministe)
        if (type === 'deterministic') {
            data.forEach((point, index) => {
                ['vx', 'vy', 'vz'].forEach(vel => {
                    const value = point[vel];
                    if (value !== null && value !== undefined) {
                        if (!isFinite(value)) {
                            errors.push(`Point ${index}: ${vel} non fini (${value})`);
                        }
                        // Vérifier vitesses physiquement réalistes (< vitesse lumière)
                        const c = 299792458; // m/s
                        if (Math.abs(value) > c) {
                            errors.push(`Point ${index}: ${vel} dépasse vitesse lumière (${value})`);
                        }
                    }
                });
            });
        }
        
        if (errors.length > 0) {
            console.warn(`Validation physique: ${errors.length} problèmes détectés`, errors.slice(0, 5));
            this.trigger('onValidationComplete', {
                valid: false,
                errors: errors,
                type: type
            });
        } else {
            this.trigger('onValidationComplete', {
                valid: true,
                type: type
            });
        }
    }
    
    // ========================================
    // UTILITAIRES
    // ========================================
    
    /**
     * Lecture de la source (File ou string)
     * @param {File|string} source - Source à lire
     * @returns {Promise<string>} Contenu
     */
    async readSource(source) {
        if (typeof source === 'string') {
            return source;
        }
        
        if (source instanceof File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(new Error('Erreur de lecture du fichier'));
                reader.readAsText(source, 'UTF-8');
            });
        }
        
        throw new Error('Source doit être un File ou une string');
    }
    
    /**
     * Normalisation de trajectoire (centrage et mise à l'échelle)
     * @param {Array} data - Données de trajectoire
     * @returns {Array} Données normalisées
     */
    normalizeTrajectory(data) {
        // Calcul du centre de masse
        const center = { x: 0, y: 0, z: 0 };
        let count = 0;
        
        data.forEach(point => {
            if (point.x !== null && point.y !== null && point.z !== null) {
                center.x += point.x;
                center.y += point.y;
                center.z += point.z;
                count++;
            }
        });
        
        if (count > 0) {
            center.x /= count;
            center.y /= count;
            center.z /= count;
        }
        
        // Calcul de l'échelle maximale
        let maxDist = 0;
        data.forEach(point => {
            if (point.x !== null && point.y !== null && point.z !== null) {
                const dist = Math.sqrt(
                    Math.pow(point.x - center.x, 2) +
                    Math.pow(point.y - center.y, 2) +
                    Math.pow(point.z - center.z, 2)
                );
                maxDist = Math.max(maxDist, dist);
            }
        });
        
        // Normalisation
        const scale = maxDist > 0 ? 1.0 / maxDist : 1.0;
        
        return data.map(point => {
            const normalized = { ...point };
            
            if (point.x !== null) normalized.x = (point.x - center.x) * scale;
            if (point.y !== null) normalized.y = (point.y - center.y) * scale;
            if (point.z !== null) normalized.z = (point.z - center.z) * scale;
            
            return normalized;
        });
    }
    
    /**
     * Extraction des quantiles des headers
     * @param {Array} headers - Headers du CSV
     * @returns {Array} Liste des quantiles
     */
    extractQuantiles(headers) {
        const quantilePattern = /_q(\d+)$/;
        const quantiles = new Set();
        
        headers.forEach(header => {
            const match = header.match(quantilePattern);
            if (match) {
                quantiles.add(parseInt(match[1]));
            }
        });
        
        return Array.from(quantiles).sort((a, b) => a - b);
    }
    
    /**
     * Calcul de la plage temporelle
     * @param {Array} data - Données de trajectoire
     * @returns {Object} {tMin, tMax, duration}
     */
    getTimeRange(data) {
        const times = data.map(p => p.t).filter(t => t !== null && isFinite(t));
        
        if (times.length === 0) {
            return { tMin: 0, tMax: 0, duration: 0 };
        }
        
        const tMin = Math.min(...times);
        const tMax = Math.max(...times);
        
        return {
            tMin,
            tMax,
            duration: tMax - tMin
        };
    }
    
    /**
     * Calcul de l'étendue spatiale
     * @param {Array} data - Données de trajectoire
     * @returns {Object} {xRange, yRange, zRange, maxExtent}
     */
    getSpatialExtent(data) {
        const coords = {
            x: data.map(p => p.x).filter(v => v !== null && isFinite(v)),
            y: data.map(p => p.y).filter(v => v !== null && isFinite(v)),
            z: data.map(p => p.z).filter(v => v !== null && isFinite(v))
        };
        
        const extent = {};
        
        ['x', 'y', 'z'].forEach(coord => {
            if (coords[coord].length > 0) {
                const min = Math.min(...coords[coord]);
                const max = Math.max(...coords[coord]);
                extent[coord + 'Range'] = { min, max, span: max - min };
            } else {
                extent[coord + 'Range'] = { min: 0, max: 0, span: 0 };
            }
        });
        
        extent.maxExtent = Math.max(
            extent.xRange.span,
            extent.yRange.span,
            extent.zRange.span
        );
        
        return extent;
    }
    
    // ========================================
    // STATISTIQUES ET ANALYSE
    // ========================================
    
    /**
     * Calcul des statistiques globales
     * @returns {Object} Statistiques
     */
    calculateStatistics() {
        const stats = {
            hasDeterm inistic: !!this.trajectories.deterministic,
            hasQuantiles: !!this.trajectories.quantiles,
            monteCarloCount: this.trajectories.monteCarlo.length
        };
        
        // Stats déterministe
        if (this.trajectories.deterministic) {
            stats.deterministic = {
                pointCount: this.trajectories.deterministic.length,
                ...this.metadata.deterministic.timeRange,
                ...this.metadata.deterministic.spatialExtent
            };
        }
        
        // Stats quantiles
        if (this.trajectories.quantiles) {
            stats.quantiles = {
                pointCount: this.trajectories.quantiles.length,
                quantiles: this.metadata.quantiles.quantiles,
                ...this.metadata.quantiles.timeRange,
                ...this.metadata.quantiles.spatialExtent
            };
        }
        
        this.statistics = stats;
        return stats;
    }
    
    // ========================================
    // GESTION DES ÉVÉNEMENTS
    // ========================================
    
    /**
     * Enregistrement d'un listener
     * @param {string} eventName - Nom de l'événement
     * @param {Function} callback - Fonction callback
     */
    on(eventName, callback) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].push(callback);
        }
    }
    
    /**
     * Déclenchement d'un événement
     * @param {string} eventName - Nom de l'événement
     * @param {*} data - Données de l'événement
     */
    trigger(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erreur dans callback ${eventName}:`, error);
                }
            });
        }
    }
    
    // ========================================
    // GETTERS
    // ========================================
    
    getDeterministic() {
        return this.trajectories.deterministic;
    }
    
    getQuantiles() {
        return this.trajectories.quantiles;
    }
    
    getMonteCarlo(index = null) {
        if (index !== null) {
            return this.trajectories.monteCarlo[index];
        }
        return this.trajectories.monteCarlo;
    }
    
    getMetadata(type = null) {
        if (type) {
            return this.metadata[type];
        }
        return this.metadata;
    }
    
    getStatistics() {
        if (!this.statistics) {
            return this.calculateStatistics();
        }
        return this.statistics;
    }
    
    getErrors() {
        return this.errors;
    }
    
    /**
     * Réinitialisation
     */
    reset() {
        this.trajectories = {
            deterministic: null,
            quantiles: null,
            monteCarlo: []
        };
        this.metadata = {
            deterministic: null,
            quantiles: null
        };
        this.statistics = null;
        this.errors = [];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrajectoryAdapter;
}

if (typeof window !== 'undefined') {
    window.TrajectoryAdapter = TrajectoryAdapter;
}