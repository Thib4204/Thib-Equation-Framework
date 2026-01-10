/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 THIBEQUATION FRAMEWORK V2.0-BETA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SESSION UI - INTERFACE GESTIONNAIRE SESSIONS
 * Interface utilisateur pour sauvegarder/charger sessions GKSC
 * 
 * @module SessionUI
 * @author Thib - Développeur-Chercheur en Analyse Mathématique Interstellaire
 * @version 2.0.0-BETA
 * @license MIT
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class SessionUI {
    /**
     * Constructeur
     * @param {SessionManager} sessionManager - Instance SessionManager
     * @param {Object} options - Configuration UI
     */
    constructor(sessionManager, options = {}) {
        if (!sessionManager) {
            throw new Error('SessionManager instance required');
        }

        this.sessionManager = sessionManager;
        
        this.options = {
            containerId: options.containerId || 'session-ui-container',
            position: options.position || 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
            theme: options.theme || 'cosmic',
            showAutoSaveIndicator: options.showAutoSaveIndicator !== false,
            showSessionList: options.showSessionList !== false
        };

        // État
        this.isOpen = false;
        this.container = null;

        // Callbacks
        this.onSessionLoad = null;
        this.onSessionSave = null;

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        this.createUI();
        this.attachEventListeners();
        
        // Setup callbacks SessionManager
        this.sessionManager.onSave = (data) => {
            this.updateAutoSaveIndicator('saved');
            if (this.onSessionSave) {
                this.onSessionSave(data);
            }
        };

        this.sessionManager.onLoad = (data) => {
            if (this.onSessionLoad) {
                this.onSessionLoad(data);
            }
        };

        console.log('✅ SessionUI initialized');
    }

    /**
     * Créer structure HTML
     */
    createUI() {
        // Container principal
        this.container = document.createElement('div');
        this.container.id = this.options.containerId;
        this.container.className = `session-ui session-ui--${this.options.theme} session-ui--${this.options.position}`;
        
        this.container.innerHTML = `
            <!-- Auto-save Indicator -->
            ${this.options.showAutoSaveIndicator ? this.createAutoSaveIndicator() : ''}
            
            <!-- Floating Button -->
            <button 
                class="session-ui__fab" 
                id="session-fab"
                aria-label="Gérer les sessions"
                title="Gérer les sessions sauvegardées">
                <i class="fas fa-save"></i>
            </button>

            <!-- Panel -->
            <div class="session-ui__panel" id="session-panel" aria-hidden="true">
                <div class="session-ui__header">
                    <h3 class="session-ui__title">
                        <i class="fas fa-history"></i>
                        Gestion des Sessions
                    </h3>
                    <button 
                        class="session-ui__close" 
                        id="session-close"
                        aria-label="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="session-ui__content">
                    <!-- Actions rapides -->
                    <div class="session-ui__quick-actions">
                        <button class="session-ui__button session-ui__button--primary" id="btn-save-current">
                            <i class="fas fa-save"></i>
                            <span>Sauvegarder Actuelle</span>
                        </button>
                        <button class="session-ui__button session-ui__button--secondary" id="btn-load-last">
                            <i class="fas fa-undo"></i>
                            <span>Charger Dernière</span>
                        </button>
                    </div>

                    <!-- Import/Export -->
                    <div class="session-ui__import-export">
                        <button class="session-ui__button session-ui__button--outline" id="btn-export">
                            <i class="fas fa-download"></i>
                            <span>Exporter JSON</span>
                        </button>
                        <button class="session-ui__button session-ui__button--outline" id="btn-import">
                            <i class="fas fa-upload"></i>
                            <span>Importer JSON</span>
                        </button>
                        <input type="file" id="session-file-input" accept=".json" style="display: none;">
                    </div>

                    <!-- Liste sessions -->
                    ${this.options.showSessionList ? this.createSessionList() : ''}

                    <!-- Statistiques storage -->
                    <div class="session-ui__stats" id="session-stats">
                        <!-- Filled dynamically -->
                    </div>

                    <!-- Actions dangereuses -->
                    <div class="session-ui__danger-zone">
                        <button class="session-ui__button session-ui__button--danger" id="btn-clear-all">
                            <i class="fas fa-trash-alt"></i>
                            <span>Supprimer Toutes les Sessions</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
        
        // Ajouter styles
        this.injectStyles();
    }

    /**
     * Créer indicateur auto-save
     */
    createAutoSaveIndicator() {
        return `
            <div class="session-ui__autosave-indicator" id="autosave-indicator">
                <i class="fas fa-sync-alt"></i>
                <span>Auto-sauvegarde...</span>
            </div>
        `;
    }

    /**
     * Créer liste sessions
     */
    createSessionList() {
        return `
            <div class="session-ui__session-list" id="session-list">
                <h4 class="session-ui__section-title">
                    <i class="fas fa-list"></i>
                    Sessions Sauvegardées
                </h4>
                <div class="session-ui__sessions" id="sessions-container">
                    <!-- Filled dynamically -->
                </div>
            </div>
        `;
    }

    /**
     * Attacher event listeners
     */
    attachEventListeners() {
        // FAB toggle
        const fab = document.getElementById('session-fab');
        if (fab) {
            fab.addEventListener('click', () => this.togglePanel());
        }

        // Close button
        const closeBtn = document.getElementById('session-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }

        // Save current
        const saveBtn = document.getElementById('btn-save-current');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.handleSaveCurrent());
        }

        // Load last
        const loadLastBtn = document.getElementById('btn-load-last');
        if (loadLastBtn) {
            loadLastBtn.addEventListener('click', () => this.handleLoadLast());
        }

        // Export
        const exportBtn = document.getElementById('btn-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }

        // Import
        const importBtn = document.getElementById('btn-import');
        const fileInput = document.getElementById('session-file-input');
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleImport(e));
        }

        // Clear all
        const clearAllBtn = document.getElementById('btn-clear-all');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.handleClearAll());
        }

        // Click outside to close
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('session-panel');
            if (this.isOpen && 
                !panel.contains(e.target) && 
                !fab.contains(e.target)) {
                this.closePanel();
            }
        });

        // Keyboard ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
    }

    /**
     * Toggle panel
     */
    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    /**
     * Ouvrir panel
     */
    openPanel() {
        const panel = document.getElementById('session-panel');
        if (!panel) return;

        panel.classList.add('session-ui__panel--open');
        panel.setAttribute('aria-hidden', 'false');
        this.isOpen = true;

        // Refresh liste sessions
        this.refreshSessionList();
        
        // Refresh stats
        this.updateStats();
    }

    /**
     * Fermer panel
     */
    closePanel() {
        const panel = document.getElementById('session-panel');
        if (!panel) return;

        panel.classList.remove('session-ui__panel--open');
        panel.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
    }

    /**
     * Sauvegarder session actuelle
     */
    handleSaveCurrent() {
        // Récupérer données GKSC depuis formulaire
        const gkscData = this.collectGKSCData();
        
        if (!gkscData) {
            alert('⚠️ Aucune donnée GKSC à sauvegarder. Veuillez remplir le formulaire.');
            return;
        }

        const sessionId = this.sessionManager.saveGKSCSession(gkscData);
        
        if (sessionId) {
            this.refreshSessionList();
            this.updateStats();
        }
    }

    /**
     * Charger dernière session
     */
    handleLoadLast() {
        const sessionData = this.sessionManager.loadGKSCSession();
        
        if (sessionData && sessionData.data) {
            this.populateGKSCForm(sessionData.data);
            this.closePanel();
        } else {
            alert('ℹ️ Aucune session sauvegardée trouvée.');
        }
    }

    /**
     * Exporter session
     */
    handleExport() {
        const lastSessionId = this.sessionManager.getLastSessionId();
        
        if (!lastSessionId) {
            alert('ℹ️ Aucune session à exporter.');
            return;
        }

        this.sessionManager.exportSession(lastSessionId);
    }

    /**
     * Importer session
     */
    async handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const sessionData = await this.sessionManager.importSession(file);
        
        if (sessionData) {
            this.refreshSessionList();
            this.updateStats();
            
            // Charger automatiquement
            if (confirm('✅ Session importée ! Voulez-vous la charger maintenant ?')) {
                this.populateGKSCForm(sessionData.data);
                this.closePanel();
            }
        } else {
            alert('❌ Erreur lors de l\'import. Vérifiez le format du fichier JSON.');
        }

        // Reset input
        event.target.value = '';
    }

    /**
     * Supprimer toutes sessions
     */
    handleClearAll() {
        if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les sessions ? Cette action est irréversible.')) {
            return;
        }

        if (confirm('🚨 DERNIÈRE CONFIRMATION : Toutes vos sessions seront définitivement perdues !')) {
            this.sessionManager.clearAllSessions();
            this.refreshSessionList();
            this.updateStats();
        }
    }

    /**
     * Rafraîchir liste sessions
     */
    refreshSessionList() {
        const container = document.getElementById('sessions-container');
        if (!container) return;

        const sessions = this.sessionManager.listSessions();

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="session-ui__empty">
                    <i class="fas fa-inbox"></i>
                    <p>Aucune session sauvegardée</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sessions.map(session => `
            <div class="session-ui__session-item" data-session-id="${session.id}">
                <div class="session-ui__session-info">
                    <div class="session-ui__session-date">
                        <i class="fas fa-clock"></i>
                        ${new Date(session.timestamp).toLocaleString('fr-FR')}
                    </div>
                    <div class="session-ui__session-preview">
                        ${session.preview}
                    </div>
                </div>
                <div class="session-ui__session-actions">
                    <button 
                        class="session-ui__icon-button" 
                        onclick="sessionUI.loadSession('${session.id}')"
                        title="Charger cette session">
                        <i class="fas fa-folder-open"></i>
                    </button>
                    <button 
                        class="session-ui__icon-button" 
                        onclick="sessionUI.exportSessionById('${session.id}')"
                        title="Exporter cette session">
                        <i class="fas fa-download"></i>
                    </button>
                    <button 
                        class="session-ui__icon-button session-ui__icon-button--danger" 
                        onclick="sessionUI.deleteSession('${session.id}')"
                        title="Supprimer cette session">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Charger session spécifique
     */
    loadSession(sessionId) {
        const sessionData = this.sessionManager.loadGKSCSession(sessionId);
        
        if (sessionData && sessionData.data) {
            this.populateGKSCForm(sessionData.data);
            this.closePanel();
        }
    }

    /**
     * Exporter session spécifique
     */
    exportSessionById(sessionId) {
        this.sessionManager.exportSession(sessionId);
    }

    /**
     * Supprimer session spécifique
     */
    deleteSession(sessionId) {
        if (!confirm('⚠️ Supprimer cette session ?')) {
            return;
        }

        this.sessionManager.deleteSession(sessionId);
        this.refreshSessionList();
        this.updateStats();
    }

    /**
     * Mettre à jour statistiques
     */
    updateStats() {
        const statsContainer = document.getElementById('session-stats');
        if (!statsContainer) return;

        const stats = this.sessionManager.getStorageStats();
        
        if (!stats) {
            statsContainer.innerHTML = '<p class="session-ui__stats-unavailable">Statistiques non disponibles</p>';
            return;
        }

        statsContainer.innerHTML = `
            <h4 class="session-ui__section-title">
                <i class="fas fa-chart-pie"></i>
                Statistiques de Stockage
            </h4>
            <div class="session-ui__stats-grid">
                <div class="session-ui__stat-item">
                    <span class="session-ui__stat-label">Sessions:</span>
                    <span class="session-ui__stat-value">${stats.sessionCount}</span>
                </div>
                <div class="session-ui__stat-item">
                    <span class="session-ui__stat-label">Utilisé:</span>
                    <span class="session-ui__stat-value">${stats.totalSizeFormatted}</span>
                </div>
                <div class="session-ui__stat-item">
                    <span class="session-ui__stat-label">Disponible:</span>
                    <span class="session-ui__stat-value">${stats.availableFormatted}</span>
                </div>
                <div class="session-ui__stat-item">
                    <span class="session-ui__stat-label">Utilisation:</span>
                    <span class="session-ui__stat-value">${stats.usagePercent}%</span>
                </div>
            </div>
            <div class="session-ui__stats-bar">
                <div 
                    class="session-ui__stats-bar-fill" 
                    style="width: ${Math.min(stats.usagePercent, 100)}%"
                    aria-valuenow="${stats.usagePercent}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar">
                </div>
            </div>
        `;
    }

    /**
     * Mettre à jour indicateur auto-save
     */
    updateAutoSaveIndicator(status) {
        const indicator = document.getElementById('autosave-indicator');
        if (!indicator) return;

        indicator.className = `session-ui__autosave-indicator session-ui__autosave-indicator--${status}`;

        if (status === 'saving') {
            indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Sauvegarde...</span>';
        } else if (status === 'saved') {
            indicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Sauvegardé</span>';
            
            // Hide après 2s
            setTimeout(() => {
                indicator.classList.add('session-ui__autosave-indicator--hidden');
            }, 2000);
        }
    }

    /**
     * Collecter données GKSC depuis formulaire
     */
    collectGKSCData() {
        // Chercher inputs GKSC dans page
        const G = this.getInputValue('g') || this.getInputValue('G');
        const K = this.getInputValue('k') || this.getInputValue('K');
        const S = this.getInputValue('s') || this.getInputValue('S');
        const C = this.getInputValue('c') || this.getInputValue('C');

        if (G === null && K === null && S === null && C === null) {
            return null;
        }

        // Calculer ThibScore
        const ThibScore = (0.30 * G) + (0.30 * K) + (0.25 * S) + (0.15 * C);

        return { G, K, S, C, ThibScore };
    }

    /**
     * Peupler formulaire GKSC avec données
     */
    populateGKSCForm(data) {
        if (!data) return;

        // Remplir inputs
        this.setInputValue('g', data.G);
        this.setInputValue('G', data.G);
        this.setInputValue('k', data.K);
        this.setInputValue('K', data.K);
        this.setInputValue('s', data.S);
        this.setInputValue('S', data.S);
        this.setInputValue('c', data.C);
        this.setInputValue('C', data.C);

        // Trigger events pour recalcul
        this.triggerCalculation();
    }

    /**
     * Helper: Get input value
     */
    getInputValue(id) {
        const input = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        return input ? parseFloat(input.value) || 0 : null;
    }

    /**
     * Helper: Set input value
     */
    setInputValue(id, value) {
        const input = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        if (input && value !== undefined) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    /**
     * Helper: Trigger calculation
     */
    triggerCalculation() {
        // Dispatch custom event pour déclencher recalcul
        document.dispatchEvent(new CustomEvent('gkscDataLoaded'));
    }

    /**
     * Injecter styles CSS
     */
    injectStyles() {
        if (document.getElementById('session-ui-styles')) return;

        const style = document.createElement('style');
        style.id = 'session-ui-styles';
        style.textContent = `
            /* Session UI Styles */
            .session-ui {
                position: fixed;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            }

            .session-ui--bottom-right {
                bottom: 20px;
                right: 20px;
            }

            .session-ui--bottom-left {
                bottom: 20px;
                left: 20px;
            }

            .session-ui--top-right {
                top: 20px;
                right: 20px;
            }

            .session-ui--top-left {
                top: 20px;
                left: 20px;
            }

            /* FAB Button */
            .session-ui__fab {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
                z-index: 10000;
            }

            .session-ui__fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }

            .session-ui__fab:active {
                transform: scale(0.95);
            }

            /* Auto-save Indicator */
            .session-ui__autosave-indicator {
                position: fixed;
                bottom: 90px;
                right: 20px;
                padding: 8px 16px;
                background: rgba(16, 185, 129, 0.95);
                color: white;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(10px);
                pointer-events: none;
            }

            .session-ui__autosave-indicator--saving,
            .session-ui__autosave-indicator--saved {
                opacity: 1;
                transform: translateY(0);
            }

            .session-ui__autosave-indicator--hidden {
                opacity: 0;
                transform: translateY(10px);
            }

            /* Panel */
            .session-ui__panel {
                position: fixed;
                width: 400px;
                max-height: 600px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                transform: scale(0.8);
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .session-ui--bottom-right .session-ui__panel {
                bottom: 90px;
                right: 0;
                transform-origin: bottom right;
            }

            .session-ui__panel--open {
                transform: scale(1);
                opacity: 1;
                pointer-events: all;
            }

            .session-ui__header {
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .session-ui__title {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .session-ui__close {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
            }

            .session-ui__close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .session-ui__content {
                padding: 20px;
                max-height: 500px;
                overflow-y: auto;
            }

            /* Buttons */
            .session-ui__button {
                width: 100%;
                padding: 12px 16px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .session-ui__button--primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .session-ui__button--secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .session-ui__button--outline {
                background: transparent;
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: white;
            }

            .session-ui__button--danger {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.5);
            }

            .session-ui__button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            /* Quick Actions */
            .session-ui__quick-actions {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .session-ui__quick-actions .session-ui__button {
                flex: 1;
            }

            /* Import/Export */
            .session-ui__import-export {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            /* Section Title */
            .session-ui__section-title {
                font-size: 14px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.8);
                margin: 16px 0 12px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Session List */
            .session-ui__sessions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 200px;
                overflow-y: auto;
            }

            .session-ui__session-item {
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.2s;
            }

            .session-ui__session-item:hover {
                background: rgba(255, 255, 255, 0.08);
            }

            .session-ui__session-info {
                flex: 1;
            }

            .session-ui__session-date {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .session-ui__session-preview {
                font-size: 14px;
                color: #FFD700;
                font-weight: 600;
            }

            .session-ui__session-actions {
                display: flex;
                gap: 4px;
            }

            .session-ui__icon-button {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
            }

            .session-ui__icon-button:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .session-ui__icon-button--danger:hover {
                background: rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }

            /* Empty State */
            .session-ui__empty {
                text-align: center;
                padding: 32px;
                color: rgba(255, 255, 255, 0.5);
            }

            .session-ui__empty i {
                font-size: 48px;
                margin-bottom: 12px;
                opacity: 0.3;
            }

            /* Stats */
            .session-ui__stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 12px;
            }

            .session-ui__stat-item {
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .session-ui__stat-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .session-ui__stat-value {
                font-size: 18px;
                font-weight: 700;
                color: #FFD700;
            }

            .session-ui__stats-bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .session-ui__stats-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #3b82f6);
                transition: width 0.5s ease;
            }

            /* Danger Zone */
            .session-ui__danger-zone {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Responsive */
            @media (max-width: 480px) {
                .session-ui__panel {
                    width: calc(100vw - 40px);
                    left: 20px !important;
                    right: 20px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Destroy instance
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        this.onSessionLoad = null;
        this.onSessionSave = null;

        console.log('🗑️ SessionUI destroyed');
    }
}

// Global instance pour accès depuis HTML
window.sessionUI = null;

// Export pour utilisation module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionUI;
}

console.log('✅ SessionUI class loaded');
