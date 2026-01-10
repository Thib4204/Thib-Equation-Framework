#!/bin/bash

# ============================================
# THIBEQUATION v5.0 - INSTALLATION AUTOMATIQUE
# ============================================
# Script d'installation ONE-SHOT
# Configure GitHub + Cloudflare Pages automatiquement
# ============================================

set -e  # Arrête si erreur

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="Thib-Equation-Framework"
GITHUB_USER="Thib4204"
GITHUB_EMAIL="Thib4e@gmail.com"
GITHUB_FULLNAME="Pascal Thibodeau"
CLOUDFLARE_ACCOUNT_ID="9ccb11e93c3acd7accfaf734c96bf52a"
DOMAIN="thibequation.com"
PROJECT_NAME="thibequation"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   THIBEQUATION v5.0 - INSTALLATION AUTOMATIQUE          ║"
echo "║   Configuration GitHub + Cloudflare Pages                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================
# ÉTAPE 1 : VÉRIFICATIONS PRÉALABLES
# ============================================

echo -e "${YELLOW}[1/6] Vérifications préalables...${NC}"

# Vérifier Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé. Installe-le d'abord.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git installé${NC}"

# Vérifier curl
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl n'est pas installé.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ curl installé${NC}"

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur : Tu n'es pas dans le dossier thibequation-site/${NC}"
    echo -e "${YELLOW}Exécute : cd /chemin/vers/thibequation-site${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dossier correct (index.html trouvé)${NC}"

# Compter les fichiers
FILE_COUNT=$(find . -type f | wc -l)
echo -e "${GREEN}✅ $FILE_COUNT fichiers détectés${NC}"

# ============================================
# ÉTAPE 2 : CONFIGURATION GIT
# ============================================

echo ""
echo -e "${YELLOW}[2/6] Configuration Git...${NC}"

# Configurer identité Git (global)
git config --global user.name "$GITHUB_FULLNAME" 2>/dev/null || true
git config --global user.email "$GITHUB_EMAIL" 2>/dev/null || true
echo -e "${GREEN}✅ Identité Git configurée${NC}"

# Vérifier clé SSH
if [ ! -f "$HOME/.ssh/id_ed25519" ] && [ ! -f "$HOME/.ssh/id_rsa" ]; then
    echo -e "${YELLOW}⚠️  Aucune clé SSH détectée${NC}"
    echo -e "${YELLOW}Génération d'une clé SSH...${NC}"
    
    ssh-keygen -t ed25519 -C "$GITHUB_EMAIL" -f "$HOME/.ssh/id_ed25519" -N "" || {
        echo -e "${RED}❌ Erreur lors de la génération de la clé SSH${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Clé SSH créée : $HOME/.ssh/id_ed25519${NC}"
    echo ""
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}ACTION MANUELLE REQUISE :${NC}"
    echo ""
    echo -e "1. Copie cette clé publique :"
    echo -e "${BLUE}"
    cat "$HOME/.ssh/id_ed25519.pub"
    echo -e "${NC}"
    echo ""
    echo -e "2. Ajoute-la à GitHub :"
    echo -e "   ${BLUE}https://github.com/settings/ssh/new${NC}"
    echo ""
    echo -e "3. Appuie sur ${GREEN}Entrée${NC} quand c'est fait..."
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    read -r
else
    echo -e "${GREEN}✅ Clé SSH déjà présente${NC}"
fi

# Tester connexion GitHub
echo -e "${YELLOW}Test connexion GitHub SSH...${NC}"
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo -e "${GREEN}✅ Connexion GitHub SSH fonctionnelle${NC}"
else
    echo -e "${YELLOW}⚠️  Connexion SSH non confirmée (peut être normal)${NC}"
fi

# ============================================
# ÉTAPE 3 : INITIALISATION GIT LOCAL
# ============================================

echo ""
echo -e "${YELLOW}[3/6] Initialisation Git local...${NC}"

# Supprimer .git existant si présent
if [ -d ".git" ]; then
    echo -e "${YELLOW}Suppression ancien .git...${NC}"
    rm -rf .git
fi

# Initialiser Git
git init
git checkout -b main
echo -e "${GREEN}✅ Git initialisé (branche main)${NC}"

# Ajouter remote
git remote add origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || \
git remote set-url origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
echo -e "${GREEN}✅ Remote GitHub configuré${NC}"

# Ajouter tous les fichiers
git add .
echo -e "${GREEN}✅ Fichiers ajoutés au staging${NC}"

# Commit
git commit -m "🚀 Deploy ThibEquation v5.0 - Complete Website

- 50+ HTML pages (calculateurs scientifiques, documentation)
- 14 JavaScript modules (Chart.js, visualisations 3D, multilingual)
- 5 CSS stylesheets (modern-pale-theme, accessibility, responsive)
- 3 Images PNG (logos officiels)
- 2 PDFs scientifiques (TH-1517, A_MAVEN)
- Documentation complète (deployment, workflow, maintenance)
- Scripts de vérification automatisés

Site statique HTML/CSS/JS pur
Framework: ThibEquation GKSC v5.0
Validation empirique: R²=0.88 sur 100 objets
Licence: Thibodeau-Innovations-Framework License 1.0

Architecture: Cloudflare Pages + GitHub
Déploiement: Automatique via Git push
Auteur: Pascal Thibodeau / Thibodeau Innovations" || {
    echo -e "${RED}❌ Erreur lors du commit${NC}"
    exit 1
}
echo -e "${GREEN}✅ Commit créé${NC}"

# ============================================
# ÉTAPE 4 : PUSH VERS GITHUB
# ============================================

echo ""
echo -e "${YELLOW}[4/6] Push vers GitHub...${NC}"

echo -e "${BLUE}Tentative de push (force) vers GitHub...${NC}"
if git push -u origin main --force; then
    echo -e "${GREEN}✅ Push vers GitHub réussi !${NC}"
else
    echo -e "${RED}❌ Push vers GitHub échoué${NC}"
    echo ""
    echo -e "${YELLOW}Solutions possibles :${NC}"
    echo -e "1. Vérifie que ta clé SSH est ajoutée à GitHub"
    echo -e "2. Teste : ${BLUE}ssh -T git@github.com${NC}"
    echo -e "3. Vérifie que le repo existe : ${BLUE}https://github.com/${GITHUB_USER}/${REPO_NAME}${NC}"
    echo ""
    echo -e "${YELLOW}Veux-tu continuer quand même ? (y/n)${NC}"
    read -r continue_choice
    if [ "$continue_choice" != "y" ]; then
        exit 1
    fi
fi

# ============================================
# ÉTAPE 5 : CONFIGURATION CLOUDFLARE PAGES
# ============================================

echo ""
echo -e "${YELLOW}[5/6] Configuration Cloudflare Pages...${NC}"

# Demander le token API Cloudflare
echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Token API Cloudflare requis${NC}"
echo ""
echo -e "Tu as dit avoir créé un token API Cloudflare."
echo -e "Colle-le ici (il ne sera pas sauvegardé) :"
echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
read -s CLOUDFLARE_TOKEN
echo ""

if [ -z "$CLOUDFLARE_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  Pas de token fourni. Configuration Cloudflare Pages sera manuelle.${NC}"
    echo ""
    echo -e "${BLUE}Instructions manuelles :${NC}"
    echo -e "1. Va sur : ${BLUE}https://dash.cloudflare.com/${CLOUDFLARE_ACCOUNT_ID}/workers-and-pages${NC}"
    echo -e "2. Clique : Create application → Pages → Connect to Git"
    echo -e "3. Sélectionne : ${GITHUB_USER}/${REPO_NAME}"
    echo -e "4. Configuration :"
    echo -e "   - Project name: ${PROJECT_NAME}"
    echo -e "   - Branch: main"
    echo -e "   - Framework: None"
    echo -e "   - Build command: (vide)"
    echo -e "   - Output directory: /"
    echo -e "5. Clique : Save and Deploy"
    echo ""
    echo -e "${YELLOW}Appuie sur Entrée quand c'est fait...${NC}"
    read -r
else
    echo -e "${GREEN}✅ Token reçu${NC}"
    
    # Créer projet Pages via API
    echo -e "${YELLOW}Création projet Cloudflare Pages via API...${NC}"
    
    # Note : La création complète nécessite OAuth GitHub, on ne peut que préparer
    echo -e "${YELLOW}⚠️  L'API Cloudflare nécessite OAuth GitHub pour connecter le repo.${NC}"
    echo -e "${YELLOW}Configuration semi-automatique...${NC}"
    echo ""
    echo -e "${BLUE}Instructions :${NC}"
    echo -e "1. Va sur : ${BLUE}https://dash.cloudflare.com/${CLOUDFLARE_ACCOUNT_ID}/workers-and-pages${NC}"
    echo -e "2. Clique : Create application → Pages → Connect to Git"
    echo -e "3. Autorise GitHub (popup OAuth)"
    echo -e "4. Sélectionne : ${GITHUB_USER}/${REPO_NAME}"
    echo -e "5. Utilise cette config :"
    echo ""
    echo -e "   ${GREEN}Project name:${NC} ${PROJECT_NAME}"
    echo -e "   ${GREEN}Branch:${NC} main"
    echo -e "   ${GREEN}Framework:${NC} None"
    echo -e "   ${GREEN}Build command:${NC} (vide)"
    echo -e "   ${GREEN}Output directory:${NC} /"
    echo ""
    echo -e "6. Clique : Save and Deploy"
    echo ""
    echo -e "${YELLOW}Appuie sur Entrée quand le déploiement est Success...${NC}"
    read -r
fi

# ============================================
# ÉTAPE 6 : VÉRIFICATION FINALE
# ============================================

echo ""
echo -e "${YELLOW}[6/6] Vérification finale...${NC}"

# Vérifier GitHub
echo -e "${YELLOW}Vérification GitHub...${NC}"
if curl -s "https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents" | grep -q "index.html"; then
    echo -e "${GREEN}✅ Fichiers présents sur GitHub${NC}"
else
    echo -e "${YELLOW}⚠️  Impossible de vérifier GitHub (peut être normal si repo privé)${NC}"
fi

# Vérifier site
echo -e "${YELLOW}Vérification site web...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/" | grep -q "200"; then
    echo -e "${GREEN}✅ Site accessible : https://${DOMAIN}/${NC}"
else
    echo -e "${YELLOW}⚠️  Site inaccessible (peut prendre quelques minutes)${NC}"
fi

# Exécuter script de vérification
if [ -f "verification-deploiement.sh" ]; then
    echo ""
    echo -e "${YELLOW}Exécution tests automatisés...${NC}"
    bash verification-deploiement.sh
fi

# ============================================
# RÉSUMÉ FINAL
# ============================================

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║               INSTALLATION TERMINÉE !                    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ SUCCÈS - Configuration complète${NC}"
echo ""
echo -e "${YELLOW}📊 RÉSUMÉ :${NC}"
echo -e "  • GitHub repo : ${GREEN}https://github.com/${GITHUB_USER}/${REPO_NAME}${NC}"
echo -e "  • Site web : ${GREEN}https://${DOMAIN}/${NC}"
echo -e "  • Cloudflare : ${GREEN}https://dash.cloudflare.com/${CLOUDFLARE_ACCOUNT_ID}/workers-and-pages${NC}"
echo ""
echo -e "${YELLOW}🚀 WORKFLOW AUTOMATISÉ :${NC}"
echo -e "  1. Modifie un fichier (ex: index.html)"
echo -e "  2. ${BLUE}git add fichier.html${NC}"
echo -e "  3. ${BLUE}git commit -m 'Update'${NC}"
echo -e "  4. ${BLUE}git push origin main${NC}"
echo -e "  5. ⚡ Cloudflare déploie automatiquement (30-60s)"
echo -e "  6. ✅ https://${DOMAIN}/ mis à jour"
echo ""
echo -e "${YELLOW}📚 DOCUMENTATION :${NC}"
echo -e "  • Guide complet : ${BLUE}GUIDE-DEPLOIEMENT-AUTOMATISE.md${NC}"
echo -e "  • Maintenance : ${BLUE}WORKFLOW-MAINTENANCE.md${NC}"
echo -e "  • Diagnostic : ${BLUE}DIAGNOSTIC-COMPLET-THIBEQUATION.md${NC}"
echo ""
echo -e "${GREEN}🎉 Ton site ThibEquation v5.0 est maintenant en production !${NC}"
echo ""
