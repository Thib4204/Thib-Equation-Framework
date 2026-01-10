# 🔧 WORKFLOW MAINTENANCE — ThibEquation v5.0

## 🎯 Workflow Quotidien

### Modification du Site (Workflow Standard)

```bash
# 1. Navigue vers ton projet local
cd /chemin/vers/thibequation-site

# 2. Vérifie l'état actuel
git status
git pull origin main  # Récupère les dernières modifications

# 3. Modifie tes fichiers (HTML, CSS, JS, PDF, etc.)
# Exemple : édite index.html avec ton éditeur préféré

# 4. Vérifie les modifications
git diff  # Voir les changements ligne par ligne
git status  # Voir les fichiers modifiés

# 5. Ajoute les fichiers modifiés
git add index.html  # Fichier spécifique
# OU
git add .  # Tous les fichiers modifiés

# 6. Commit avec message descriptif
git commit -m "🎨 Update: Description de ta modification"

# Exemples de messages de commit :
# ✨ Add: Nouveau calculateur GKSC v5.1
# 🐛 Fix: Correction erreur calcul ThibScore
# 📝 Docs: Mise à jour documentation méthodologie
# 🎨 Style: Amélioration design page d'accueil
# ♻️ Refactor: Restructuration code JavaScript
# ⚡ Perf: Optimisation chargement images
# 🔒 Security: Correction faille XSS

# 7. Push vers GitHub
git push origin main

# 8. Vérifie le déploiement (1-2 minutes)
# Va sur : https://dash.cloudflare.com/.../pages/view/thibequation/deployments
# Attends le badge ✅ Success

# 9. Teste le site live
open https://thibequation.com/  # macOS
# OU
xdg-open https://thibequation.com/  # Linux
# OU visite manuellement dans ton navigateur
```

---

## 🔄 Gestion des Branches (Recommandé pour Développement)

### Créer une Branche de Développement

```bash
# Créer et basculer vers branche dev
git checkout -b dev

# Faire des modifications expérimentales
# ... édite fichiers ...

# Commit sur dev
git add .
git commit -m "🧪 Expérimentation: Nouveau design calculateur"

# Push vers GitHub (branche dev)
git push -u origin dev

# Tester sur Cloudflare Pages Preview
# URL automatique : https://dev.thibequation.pages.dev
```

### Fusionner dev vers main (Production)

```bash
# Retour sur main
git checkout main

# Récupère les dernières modifications
git pull origin main

# Fusionne dev dans main
git merge dev

# Résous les conflits (si nécessaire)
# ... édite fichiers en conflit ...
# git add fichier-resolu.html
# git commit -m "🔀 Merge: dev → main"

# Push vers production
git push origin main

# Supprime branche dev (optionnel)
git branch -d dev
git push origin --delete dev
```

---

## ⏪ Procédure de Rollback (Retour Arrière)

### Méthode 1 : Via Interface Cloudflare (RAPIDE)

1. **Va sur** : https://dash.cloudflare.com/.../pages/view/thibequation/deployments
2. **Trouve le déploiement stable** (avant l'erreur)
3. **Clique sur** : `···` (trois points) → `Rollback to this deployment`
4. **Confirme** : Le site sera restauré en 30 secondes

### Méthode 2 : Via Git (Permanent)

```bash
# Voir l'historique des commits
git log --oneline -10

# Identifier le commit à restaurer (ex: abc1234)
git revert HEAD  # Annule le dernier commit
# OU
git revert abc1234  # Annule un commit spécifique

# Push le revert
git push origin main

# Cloudflare Pages va déployer automatiquement
```

### Méthode 3 : Reset Complet (DANGER)

```bash
# ⚠️ ATTENTION : Cette méthode ÉCRASE l'historique

# Retourne à un commit précis
git reset --hard abc1234

# Force push (écrase l'historique distant)
git push origin main --force

# ⚠️ Utilise SEULEMENT en dernier recours
```

---

## 📊 Monitoring du Site

### Vérification Manuelle

```bash
# Exécute le script de vérification
cd /chemin/vers/thibequation-site
./verification-deploiement.sh

# Résultat attendu : 7/7 tests ✅
```

### Monitoring Automatisé (Recommandations)

**Services gratuits recommandés :**

1. **UptimeRobot** (https://uptimerobot.com/)
   - Vérifie le site toutes les 5 minutes
   - Alerte email/SMS si down
   - Configuration : Monitor `https://thibequation.com/` HTTP(S)

2. **Cloudflare Analytics**
   - Dashboard intégré : https://dash.cloudflare.com/.../thibequation.com/analytics
   - Métriques : Visites, bande passante, pays d'origine
   - Gratuit, déjà actif

3. **Google Search Console**
   - Vérifie indexation Google
   - Détecte erreurs 404
   - Ajoute ton site : https://search.google.com/search-console

### Métriques à Surveiller

```bash
# Temps de réponse
curl -w "@curl-format.txt" -o /dev/null -s https://thibequation.com/

# Contenu curl-format.txt :
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n

# Objectifs :
# time_total < 500ms (excellent)
# time_total < 1000ms (bon)
# time_total > 2000ms (problème)
```

---

## 🚨 Procédure d'Urgence

### Site Totalement Inaccessible

**ÉTAPE 1 : Diagnostic Rapide**

```bash
# Test 1 : Site down ou problème local ?
curl -I https://thibequation.com/
ping thibequation.com

# Test 2 : Cloudflare fonctionne ?
curl -I https://www.cloudflare.com/

# Test 3 : DNS OK ?
dig thibequation.com
nslookup thibequation.com
```

**ÉTAPE 2 : Actions Immédiates**

1. **Vérifie Cloudflare Status** : https://www.cloudflarestatus.com/
   - Si incident global → Attends résolution Cloudflare

2. **Vérifie Déploiements Pages** :
   - https://dash.cloudflare.com/.../pages/view/thibequation/deployments
   - Si dernier déploiement ❌ Failed → Rollback (voir ci-dessus)

3. **Purge Cache Cloudflare** :
   - https://dash.cloudflare.com/.../thibequation.com/caching
   - Clique `Purge Everything`
   - Attends 30 secondes

4. **Vérifie DNS** :
   - https://dash.cloudflare.com/.../thibequation.com/dns
   - CNAME doit pointer vers `thibequation.pages.dev`
   - Si modifié accidentellement → Restaure

**ÉTAPE 3 : Redéploiement Forcé**

```bash
# Crée un commit vide pour forcer redéploiement
git commit --allow-empty -m "🔥 Emergency: Force redeploy"
git push origin main

# Attends 1-2 minutes
# Vérifie : https://thibequation.com/
```

**ÉTAPE 4 : Contact Support (Si Rien Ne Fonctionne)**

- **Cloudflare Support** : https://dash.cloudflare.com/.../support
- **GitHub Support** : https://support.github.com/

---

## 📈 Optimisations Recommandées

### Performance

```bash
# 1. Compresse les images
# Utilise : TinyPNG, ImageOptim, Squoosh
# Objectif : Images < 200 KB

# 2. Minifie CSS/JS (optionnel pour site statique)
# Utilise : cssnano, terser
# Gain : 20-30% de réduction

# 3. Active Cloudflare Auto Minify
# Dashboard → Speed → Optimization
# ✅ Auto Minify : JavaScript, CSS, HTML
```

### Sécurité

```bash
# 1. Vérifie headers sécurité
curl -I https://thibequation.com/ | grep -E "X-|Strict"

# Headers recommandés (déjà actifs) :
# ✅ X-Frame-Options: SAMEORIGIN
# ✅ X-Content-Type-Options: nosniff
# ✅ X-XSS-Protection: 1; mode=block
# ✅ Strict-Transport-Security: max-age=15552000

# 2. Teste avec SecurityHeaders.com
open https://securityheaders.com/?q=https://thibequation.com/

# 3. Teste avec SSL Labs
open https://www.ssllabs.com/ssltest/analyze.html?d=thibequation.com
```

### SEO

```markdown
# Checklist SEO (À FAIRE) :

- [x] Sitemap XML généré (`/sitemap.xml`)
- [x] Robots.txt configuré (`/robots.txt`)
- [x] Meta descriptions sur toutes pages
- [ ] Schema.org markup (JSON-LD pour articles scientifiques)
- [ ] Open Graph tags (partage réseaux sociaux)
- [ ] Soumission Google Search Console
- [ ] Soumission Bing Webmaster Tools
```

---

## 🗂️ Gestion des Versions

### Tagging des Releases

```bash
# Marque une version stable
git tag -a v5.0.0 -m "Release v5.0.0: GKSC Framework complet"
git push origin v5.0.0

# Liste toutes les versions
git tag -l

# Retourne à une version spécifique
git checkout v5.0.0
```

### Changelog (Recommandé)

Crée `CHANGELOG.md` pour documenter les modifications :

```markdown
# Changelog ThibEquation Framework

## [5.0.0] - 2025-11-13
### Added
- Framework GKSC complet avec 100 objets validés
- Calculateur premium interactif
- Documentation scientifique complète
- Rapports PDF TH-1517 et A_MAVEN

### Changed
- Migration vers Cloudflare Pages
- Optimisation performance (R²=0.88)

### Fixed
- Corrections erreurs calcul ThibScore
- Amélioration accessibilité WCAG 2.1
```

---

## 📞 Support & Ressources

### Documentation Officielle

- **Cloudflare Pages** : https://developers.cloudflare.com/pages/
- **Git** : https://git-scm.com/doc
- **GitHub** : https://docs.github.com/

### Communautés

- **Cloudflare Community** : https://community.cloudflare.com/
- **Stack Overflow** : Tag `cloudflare-pages`, `cloudflare`

### Contacts Utiles

- **Email projet** : [email du projet]
- **GitHub Issues** : https://github.com/Thib4204/Thib-Equation-Framework/issues
- **Site web** : https://thibequation.com/

---

**📅 DERNIÈRE MISE À JOUR** : 2026-01-09  
**📄 VERSION** : 1.0  
**✍️ AUTEUR** : Pascal Thibodeau / Thibodeau Innovations
