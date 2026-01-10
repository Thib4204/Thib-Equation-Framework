// =====================================================
// THIBEQUATION PREMIUM GUARD
// =====================================================
// Système de protection des contenus Premium
// Usage: Inclure ce script sur toutes les pages premium
// =====================================================

const PremiumGuard = {
    // Configuration
    config: {
        SUPABASE_URL: 'https://sgzjsikykqfvidewqqtb.supabase.co',
        SUPABASE_ANON_KEY: 'sb_publishable_oPDDaz8wMUqvOWzQB6ViEg_Q_8nGIH4',
        redirectUrl: 'pricing.html',
        loginUrl: 'connexion.html'
    },

    supabase: null,

    // Initialiser Supabase
    init() {
        if (this.config.SUPABASE_URL && this.config.SUPABASE_URL.includes('supabase.co')) {
            this.supabase = window.supabase.createClient(
                this.config.SUPABASE_URL,
                this.config.SUPABASE_ANON_KEY
            );
        }
    },

    // Vérifier si l'utilisateur est connecté
    async checkAuth() {
        if (this.supabase) {
            const { data: { user } } = await this.supabase.auth.getUser();
            return user;
        } else {
            // Fallback localStorage
            const loggedIn = localStorage.getItem('thibequation_logged_in');
            if (loggedIn) {
                return JSON.parse(localStorage.getItem('thibequation_user') || '{}');
            }
            return null;
        }
    },

    // Vérifier si l'utilisateur est Premium
    async checkPremium() {
        const user = await this.checkAuth();
        
        if (!user) {
            return { isPremium: false, user: null };
        }

        if (this.supabase) {
            // Vérifier dans Supabase
            const { data, error } = await this.supabase
                .from('user_subscriptions')
                .select('subscription, status, paypal_subscription_id')
                .eq('user_id', user.id)
                .single();

            if (error || !data) {
                return { isPremium: false, user };
            }

            const isPremium = data.subscription === 'premium' && data.status === 'active';
            return { isPremium, user, subscription: data };
        } else {
            // Fallback localStorage
            const isPremium = user.subscription === 'premium';
            return { isPremium, user };
        }
    },

    // Protéger une page entière
    async protectPage(options = {}) {
        const {
            allowFreePreview = false,
            previewElements = [],
            redirectUrl = this.config.redirectUrl
        } = options;

        this.init();
        const { isPremium, user } = await this.checkPremium();

        if (!user) {
            // Pas connecté
            this.showLoginModal();
            return false;
        }

        if (!isPremium) {
            if (allowFreePreview) {
                // Afficher preview mais bloquer certains contenus
                this.lockPremiumContent(previewElements);
            } else {
                // Rediriger vers pricing
                this.showUpgradeModal(redirectUrl);
            }
            return false;
        }

        // Utilisateur Premium: tout débloquer
        this.unlockPremiumContent();
        this.showPremiumBadge(user);
        return true;
    },

    // Verrouiller les contenus premium
    lockPremiumContent(previewElements = []) {
        // Chercher tous les éléments avec data-premium="true"
        const premiumElements = document.querySelectorAll('[data-premium="true"]');
        
        premiumElements.forEach(element => {
            // Si pas dans la liste de preview, bloquer
            if (!previewElements.includes(element.id)) {
                // Ajouter overlay de blocage
                const overlay = document.createElement('div');
                overlay.className = 'premium-lock-overlay';
                overlay.innerHTML = `
                    <div class="premium-lock-content">
                        <div class="premium-lock-icon">🔒</div>
                        <h3>Contenu Premium</h3>
                        <p>Passez au Premium pour débloquer cette fonctionnalité</p>
                        <a href="pricing.html" class="premium-unlock-btn">Voir les Plans</a>
                    </div>
                `;
                
                element.style.position = 'relative';
                element.style.pointerEvents = 'none';
                element.style.filter = 'blur(5px)';
                element.style.opacity = '0.5';
                element.appendChild(overlay);
            }
        });

        // Injecter CSS
        this.injectLockStyles();
    },

    // Débloquer les contenus premium
    unlockPremiumContent() {
        const overlays = document.querySelectorAll('.premium-lock-overlay');
        overlays.forEach(overlay => overlay.remove());

        const premiumElements = document.querySelectorAll('[data-premium="true"]');
        premiumElements.forEach(element => {
            element.style.filter = 'none';
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        });
    },

    // Afficher modal de connexion
    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'premium-modal';
        modal.innerHTML = `
            <div class="premium-modal-content">
                <h2>Connexion Requise</h2>
                <p>Vous devez être connecté pour accéder à cette page.</p>
                <div class="premium-modal-actions">
                    <a href="${this.config.loginUrl}" class="btn btn-primary">Se connecter</a>
                    <a href="inscription.html" class="btn btn-secondary">Créer un compte</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.injectModalStyles();
    },

    // Afficher modal upgrade premium
    showUpgradeModal(redirectUrl) {
        const modal = document.createElement('div');
        modal.className = 'premium-modal';
        modal.innerHTML = `
            <div class="premium-modal-content">
                <div class="premium-modal-icon">⭐</div>
                <h2>Premium Requis</h2>
                <p>Cette fonctionnalité est réservée aux membres Premium.</p>
                <ul class="premium-benefits-modal">
                    <li>✓ Calculateur illimité (100+ objets)</li>
                    <li>✓ Simulateurs avancés</li>
                    <li>✓ Téléchargements PDF</li>
                    <li>✓ Accès API</li>
                </ul>
                <div class="premium-modal-actions">
                    <a href="${redirectUrl}" class="btn btn-primary">Passer au Premium</a>
                    <button onclick="window.history.back()" class="btn btn-secondary">Retour</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.injectModalStyles();
    },

    // Afficher badge premium sur le profil
    showPremiumBadge(user) {
        const badge = document.createElement('div');
        badge.className = 'premium-user-badge';
        badge.innerHTML = '⭐ Premium';
        badge.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
            z-index: 999;
        `;
        document.body.appendChild(badge);
    },

    // Injecter styles pour les verrous
    injectLockStyles() {
        if (document.getElementById('premium-lock-styles')) return;

        const style = document.createElement('style');
        style.id = 'premium-lock-styles';
        style.textContent = `
            .premium-lock-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                border-radius: 16px;
            }

            .premium-lock-content {
                text-align: center;
                padding: 2rem;
                max-width: 400px;
            }

            .premium-lock-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .premium-lock-content h3 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: #0d1117;
            }

            .premium-lock-content p {
                color: #57606a;
                margin-bottom: 1.5rem;
            }

            .premium-unlock-btn {
                display: inline-block;
                padding: 0.875rem 2rem;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }

            .premium-unlock-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
            }
        `;
        document.head.appendChild(style);
    },

    // Injecter styles pour les modals
    injectModalStyles() {
        if (document.getElementById('premium-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'premium-modal-styles';
        style.textContent = `
            .premium-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 2rem;
            }

            .premium-modal-content {
                background: white;
                border-radius: 16px;
                padding: 3rem;
                max-width: 500px;
                width: 100%;
                text-align: center;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
            }

            .premium-modal-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .premium-modal-content h2 {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: #0d1117;
            }

            .premium-modal-content p {
                color: #57606a;
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
            }

            .premium-benefits-modal {
                text-align: left;
                list-style: none;
                padding: 1rem;
                background: #f3f6f9;
                border-radius: 8px;
                margin-bottom: 1.5rem;
            }

            .premium-benefits-modal li {
                padding: 0.5rem 0;
                color: #1a1d23;
            }

            .premium-modal-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .premium-modal-actions .btn {
                flex: 1;
                padding: 1rem 2rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                text-align: center;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .premium-modal-actions .btn-primary {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }

            .premium-modal-actions .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
            }

            .premium-modal-actions .btn-secondary {
                background: #f3f6f9;
                color: #0d1117;
                border: 2px solid #e0e8ed;
            }

            .premium-modal-actions .btn-secondary:hover {
                background: #e8f1f5;
            }
        `;
        document.head.appendChild(style);
    }
};

// Export pour utilisation globale
window.PremiumGuard = PremiumGuard;
