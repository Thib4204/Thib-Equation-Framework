/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 THIBEQUATION FRAMEWORK V2.0-BETA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SESSION MANAGER - SAUVEGARDE AUTOMATIQUE LOCALSTORAGE
 * Système de persistance pour reprendre sessions utilisateur
 * 
 * @module SessionManager
 * @author Thib - Développeur-Chercheur en Analyse Mathématique Interstellaire
 * @version 2.0.0-BETA
 * @license MIT
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class SessionManager {
    /**
     * Constructeur du gestionnaire de sessions
     * @param {Object} options - Configuration
     */
    constructor(options = {}) {
        this.options = {
            storagePrefix: options.storagePrefix || 'thibequation_',
            autoSave: options.autoSave !== false,
            autoSaveDelay: options.autoSaveDelay || 1000, // 1 seconde debounce
            maxSessions: options.maxSessions || 10,
            enableCompression: options.enableCompression !== false,
            showNotifications: options.showNotifications !== false
        };

        // État interne
        this.currentSessionId = null;
        this.autoSaveTimeout = null;
        this.isSupported = this.checkLocalStorageSupport();

        // Callbacks
        this.onSave = null;
        this.onLoad = null;
        this.onClear = null;
        this.onError = null;

        console.log('✅ SessionManager initialized', {
            supported: this.isSupported,
            autoSave: this.options.autoSave
        });
    }

    /**
     * Vérifier support localStorage
     */
    checkLocalStorageSupport() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ localStorage not supported:', e);
            return false;
        }
    }

    /**
     * Générer clé storage avec prefix
     */
    getStorageKey(key) {
        return `${this.options.storagePrefix}${key}`;
    }

    /**
     * Sauvegarder session GKSC
     * @param {Object} data - Données GKSC à sauvegarder
     * @param {String} sessionId - ID session optionnel
     */
    saveGKSCSession(data, sessionId = null) {
        if (!this.isSupported) {
            console.warn('⚠️ Cannot save: localStorage not supported');
            return false;
        }

        try {
            // Générer ID si non fourni
            if (!sessionId) {
                sessionId = this.currentSessionId || this.generateSessionId();
            }
            this.currentSessionId = sessionId;

            // Enrichir données avec métadonnées
            const sessionData = {
                id: sessionId,
                timestamp: Date.now(),
                date: new Date().toISOString(),
                version: '2.0.0-BETA',
                type: 'gksc',
                data: data,
                userAgent: navigator.userAgent.substring(0, 100)
            };

            // Compression optionnelle (base64)
            let dataToStore = JSON.stringify(sessionData);
            if (this.options.enableCompression) {
                dataToStore = this.compressData(dataToStore);
            }

            // Sauvegarder
            const key = this.getStorageKey(`session_${sessionId}`);
            localStorage.setItem(key, dataToStore);

            // Mettre à jour index sessions
            this.updateSessionIndex(sessionId, sessionData);

            // Notification
            if (this.options.showNotifications) {
                this.showNotification('💾 Session sauvegardée', 'success');
            }

            console.log('💾 Session saved:', sessionId);

            if (this.onSave) {
                this.onSave(sessionData);
            }

            return sessionId;

        } catch (error) {
            console.error('❌ Error saving session:', error);
            if (this.onError) {
                this.onError(error);
            }
            
            // Si quota dépassé, nettoyer anciennes sessions
            if (error.name === 'QuotaExceededError') {
                this.cleanOldSessions();
                // Réessayer
                return this.saveGKSCSession(data, sessionId);
            }
            
            return false;
        }
    }

    /**
     * Sauvegarder automatiquement avec debounce
     */
    autoSaveGKSCSession(data) {
        if (!this.options.autoSave) return;

        // Clear timeout existant
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Nouveau timeout avec debounce
        this.autoSaveTimeout = setTimeout(() => {
            this.saveGKSCSession(data);
        }, this.options.autoSaveDelay);
    }

    /**
     * Charger session GKSC
     * @param {String} sessionId - ID session à charger
     */
    loadGKSCSession(sessionId = null) {
        if (!this.isSupported) {
            console.warn('⚠️ Cannot load: localStorage not supported');
            return null;
        }

        try {
            // Si pas d'ID, charger dernière session
            if (!sessionId) {
                sessionId = this.getLastSessionId();
                if (!sessionId) {
                    console.log('ℹ️ No previous session found');
                    return null;
                }
            }

            // Charger données
            const key = this.getStorageKey(`session_${sessionId}`);
            let dataStored = localStorage.getItem(key);

            if (!dataStored) {
                console.warn('⚠️ Session not found:', sessionId);
                return null;
            }

            // Décompression si nécessaire
            if (this.options.enableCompression) {
                dataStored = this.decompressData(dataStored);
            }

            const sessionData = JSON.parse(dataStored);

            // Valider structure
            if (!this.validateSessionData(sessionData)) {
                console.warn('⚠️ Invalid session data structure');
                return null;
            }

            this.currentSessionId = sessionId;

            // Notification
            if (this.options.showNotifications) {
                const date = new Date(sessionData.timestamp).toLocaleString('fr-FR');
                this.showNotification(`📂 Session chargée (${date})`, 'info');
            }

            console.log('📂 Session loaded:', sessionId);

            if (this.onLoad) {
                this.onLoad(sessionData);
            }

            return sessionData;

        } catch (error) {
            console.error('❌ Error loading session:', error);
            if (this.onError) {
                this.onError(error);
            }
            return null;
        }
    }

    /**
     * Lister toutes les sessions
     */
    listSessions() {
        if (!this.isSupported) return [];

        try {
            const indexKey = this.getStorageKey('sessions_index');
            const indexData = localStorage.getItem(indexKey);
            
            if (!indexData) return [];

            const index = JSON.parse(indexData);
            
            // Trier par timestamp décroissant
            return index.sort((a, b) => b.timestamp - a.timestamp);

        } catch (error) {
            console.error('❌ Error listing sessions:', error);
            return [];
        }
    }

    /**
     * Supprimer session
     */
    deleteSession(sessionId) {
        if (!this.isSupported) return false;

        try {
            // Supprimer données session
            const key = this.getStorageKey(`session_${sessionId}`);
            localStorage.removeItem(key);

            // Mettre à jour index
            this.removeFromSessionIndex(sessionId);

            // Notification
            if (this.options.showNotifications) {
                this.showNotification('🗑️ Session supprimée', 'info');
            }

            console.log('🗑️ Session deleted:', sessionId);

            return true;

        } catch (error) {
            console.error('❌ Error deleting session:', error);
            return false;
        }
    }

    /**
     * Supprimer toutes les sessions
     */
    clearAllSessions() {
        if (!this.isSupported) return false;

        try {
            const sessions = this.listSessions();
            
            sessions.forEach(session => {
                const key = this.getStorageKey(`session_${session.id}`);
                localStorage.removeItem(key);
            });

            // Clear index
            const indexKey = this.getStorageKey('sessions_index');
            localStorage.removeItem(indexKey);

            this.currentSessionId = null;

            // Notification
            if (this.options.showNotifications) {
                this.showNotification('🗑️ Toutes les sessions supprimées', 'info');
            }

            console.log('🗑️ All sessions cleared');

            if (this.onClear) {
                this.onClear();
            }

            return true;

        } catch (error) {
            console.error('❌ Error clearing sessions:', error);
            return false;
        }
    }

    /**
     * Exporter session vers JSON téléchargeable
     */
    exportSession(sessionId = null) {
        const sessionData = this.loadGKSCSession(sessionId);
        
        if (!sessionData) {
            console.warn('⚠️ No session to export');
            return false;
        }

        try {
            const json = JSON.stringify(sessionData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `thibequation_session_${sessionData.id}_${Date.now()}.json`;
            link.click();
            
            URL.revokeObjectURL(url);

            // Notification
            if (this.options.showNotifications) {
                this.showNotification('📥 Session exportée', 'success');
            }

            console.log('📥 Session exported:', sessionData.id);

            return true;

        } catch (error) {
            console.error('❌ Error exporting session:', error);
            return false;
        }
    }

    /**
     * Importer session depuis JSON
     */
    async importSession(file) {
        try {
            const text = await file.text();
            const sessionData = JSON.parse(text);

            // Valider structure
            if (!this.validateSessionData(sessionData)) {
                throw new Error('Invalid session data structure');
            }

            // Générer nouvel ID
            const newId = this.generateSessionId();
            sessionData.id = newId;
            sessionData.timestamp = Date.now();
            sessionData.date = new Date().toISOString();

            // Sauvegarder
            const key = this.getStorageKey(`session_${newId}`);
            localStorage.setItem(key, JSON.stringify(sessionData));

            // Mettre à jour index
            this.updateSessionIndex(newId, sessionData);

            // Notification
            if (this.options.showNotifications) {
                this.showNotification('📤 Session importée', 'success');
            }

            console.log('📤 Session imported:', newId);

            return sessionData;

        } catch (error) {
            console.error('❌ Error importing session:', error);
            if (this.onError) {
                this.onError(error);
            }
            return null;
        }
    }

    /**
     * Générer ID session unique
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Obtenir ID dernière session
     */
    getLastSessionId() {
        const sessions = this.listSessions();
        return sessions.length > 0 ? sessions[0].id : null;
    }

    /**
     * Mettre à jour index des sessions
     */
    updateSessionIndex(sessionId, sessionData) {
        try {
            const indexKey = this.getStorageKey('sessions_index');
            let index = [];

            const existing = localStorage.getItem(indexKey);
            if (existing) {
                index = JSON.parse(existing);
            }

            // Supprimer entrée existante si présente
            index = index.filter(item => item.id !== sessionId);

            // Ajouter nouvelle entrée
            index.push({
                id: sessionId,
                timestamp: sessionData.timestamp,
                date: sessionData.date,
                type: sessionData.type,
                preview: this.generateSessionPreview(sessionData)
            });

            // Limiter nombre de sessions
            if (index.length > this.options.maxSessions) {
                // Supprimer plus anciennes
                const toRemove = index.slice(0, index.length - this.options.maxSessions);
                toRemove.forEach(session => {
                    const key = this.getStorageKey(`session_${session.id}`);
                    localStorage.removeItem(key);
                });
                index = index.slice(-this.options.maxSessions);
            }

            // Sauvegarder index
            localStorage.setItem(indexKey, JSON.stringify(index));

        } catch (error) {
            console.error('❌ Error updating session index:', error);
        }
    }

    /**
     * Supprimer de l'index
     */
    removeFromSessionIndex(sessionId) {
        try {
            const indexKey = this.getStorageKey('sessions_index');
            let index = [];

            const existing = localStorage.getItem(indexKey);
            if (existing) {
                index = JSON.parse(existing);
            }

            index = index.filter(item => item.id !== sessionId);

            localStorage.setItem(indexKey, JSON.stringify(index));

        } catch (error) {
            console.error('❌ Error removing from session index:', error);
        }
    }

    /**
     * Générer preview session
     */
    generateSessionPreview(sessionData) {
        const data = sessionData.data;
        
        if (data.ThibScore !== undefined) {
            return `ThibScore: ${data.ThibScore.toFixed(2)}`;
        }
        
        if (data.G !== undefined) {
            return `G:${data.G.toFixed(1)} K:${data.K.toFixed(1)} S:${data.S.toFixed(1)} C:${data.C.toFixed(1)}`;
        }

        return 'Session GKSC';
    }

    /**
     * Valider structure données session
     */
    validateSessionData(sessionData) {
        return (
            sessionData &&
            typeof sessionData === 'object' &&
            sessionData.id &&
            sessionData.timestamp &&
            sessionData.type === 'gksc' &&
            sessionData.data &&
            typeof sessionData.data === 'object'
        );
    }

    /**
     * Nettoyer anciennes sessions (si quota dépassé)
     */
    cleanOldSessions() {
        try {
            const sessions = this.listSessions();
            
            // Supprimer 20% plus anciennes
            const toRemove = Math.max(1, Math.floor(sessions.length * 0.2));
            const oldestSessions = sessions.slice(-toRemove);

            oldestSessions.forEach(session => {
                this.deleteSession(session.id);
            });

            console.log(`🧹 Cleaned ${toRemove} old sessions`);

        } catch (error) {
            console.error('❌ Error cleaning old sessions:', error);
        }
    }

    /**
     * Compression données (simple base64)
     */
    compressData(data) {
        try {
            return btoa(unescape(encodeURIComponent(data)));
        } catch (error) {
            console.warn('⚠️ Compression failed, using raw data');
            return data;
        }
    }

    /**
     * Décompression données
     */
    decompressData(data) {
        try {
            return decodeURIComponent(escape(atob(data)));
        } catch (error) {
            // Si échec, probablement données non compressées
            return data;
        }
    }

    /**
     * Afficher notification
     */
    showNotification(message, type = 'info') {
        // Créer notification simple
        const notification = document.createElement('div');
        notification.className = `session-notification session-notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');

        // Styles inline
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '10000',
            animation: 'slideInUp 0.3s ease-out',
            fontFamily: 'Inter, sans-serif'
        });

        document.body.appendChild(notification);

        // Auto-remove après 3s
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Obtenir statistiques storage
     */
    getStorageStats() {
        if (!this.isSupported) return null;

        try {
            let totalSize = 0;
            const sessions = this.listSessions();

            sessions.forEach(session => {
                const key = this.getStorageKey(`session_${session.id}`);
                const data = localStorage.getItem(key);
                if (data) {
                    totalSize += data.length;
                }
            });

            // Estimation quota (généralement 5-10MB)
            const estimatedQuota = 5 * 1024 * 1024; // 5 MB
            const usagePercent = (totalSize / estimatedQuota) * 100;

            return {
                sessionCount: sessions.length,
                totalSize: totalSize,
                totalSizeFormatted: this.formatBytes(totalSize),
                estimatedQuota: estimatedQuota,
                usagePercent: usagePercent.toFixed(1),
                available: estimatedQuota - totalSize,
                availableFormatted: this.formatBytes(estimatedQuota - totalSize)
            };

        } catch (error) {
            console.error('❌ Error getting storage stats:', error);
            return null;
        }
    }

    /**
     * Formater bytes en lecture humaine
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Destroy instance
     */
    destroy() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        this.onSave = null;
        this.onLoad = null;
        this.onClear = null;
        this.onError = null;

        console.log('🗑️ SessionManager destroyed');
    }
}

// Export pour utilisation module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}

// Ajouter animations CSS
const style = document.createElement('style');
style.textContent = `
@keyframes slideInUp {
    from {
        transform: translateY(100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideOutDown {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(100px);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

console.log('✅ SessionManager class loaded');
