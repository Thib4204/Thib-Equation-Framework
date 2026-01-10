# ⚡ INSTALLATION RAPIDE — THIBEQUATION v5.0

## 🎯 CONFIGURATION OPTIMALE AUTOMATISÉE

**Temps total : 10-15 minutes**

---

## 📥 ÉTAPE 1 : TÉLÉCHARGE L'ARCHIVE (2 min)

**Action :**

1. Télécharge : [thibequation-site-complete.zip](computer:///mnt/user-data/outputs/thibequation-site-complete.zip)

2. Décompresse sur ton ordinateur

3. Ouvre un terminal dans le dossier `thibequation-site/`

**Vérification :**
```bash
cd /chemin/vers/thibequation-site
ls
# Tu dois voir : index.html, css/, js/, images/, INSTALLATION-AUTOMATIQUE.sh
```

---

## 🚀 ÉTAPE 2 : LANCE LE SCRIPT D'INSTALLATION (10 min)

**Action :**

```bash
./INSTALLATION-AUTOMATIQUE.sh
```

**Le script va automatiquement :**

✅ Vérifier que tout est installé (Git, curl)  
✅ Configurer ton identité Git  
✅ Générer une clé SSH (si nécessaire)  
✅ Initialiser le repo Git local  
✅ Commit tous les fichiers  
✅ Push vers GitHub  
✅ Te guider pour Cloudflare Pages  
✅ Vérifier que tout fonctionne  

**Tu devras juste :**

1. **Ajouter ta clé SSH à GitHub** (si demandé)
   - Le script affiche la clé à copier
   - Va sur https://github.com/settings/ssh/new
   - Colle la clé
   - Appuie sur Entrée

2. **Coller ton token API Cloudflare** (quand demandé)
   - Le script te demande de le coller
   - Il ne sera pas sauvegardé

3. **Autoriser GitHub sur Cloudflare** (étape OAuth)
   - Le script t'ouvrira l'URL
   - Clique "Authorize" dans la popup
   - Appuie sur Entrée

**C'est tout ! Le reste est 100% automatique.**

---

## ✅ ÉTAPE 3 : VÉRIFICATION (2 min)

**Le script exécute automatiquement :**

```bash
./verification-deploiement.sh
```

**Résultat attendu :**
```
✅ Site accessible (HTTP 200)
✅ Serveur Cloudflare détecté
✅ Redirection HTTPS active
✅ Contenu ThibEquation détecté
✅ Ressources statiques accessibles
✅ Calculateurs accessibles
━━━━━━━━━━━━━━━━━━━━━━━
✅ 7/7 tests passés
```

---

## 🎉 TERMINÉ !

**Ton workflow automatisé est actif :**

```
1. Modifie index.html
2. git add index.html
3. git commit -m "Update"
4. git push origin main
5. ⚡ Cloudflare déploie (30-60s)
6. ✅ https://thibequation.com/ mis à jour
```

---

## 🆘 SI PROBLÈME

**Le script affiche une erreur ?**

**Copie-colle l'erreur exacte et dis-moi :**
- À quelle étape ça bloque ? (1/6, 2/6, etc.)
- Quel message d'erreur exact ?
- Quel système d'exploitation ? (macOS/Linux/Windows)

**Je te débloquerai immédiatement.**

---

## 📚 DOCUMENTATION COMPLÈTE

**Si tu veux comprendre en détail :**

- **GUIDE-DEPLOIEMENT-AUTOMATISE.md** : Guide complet étape par étape
- **WORKFLOW-MAINTENANCE.md** : Procédures quotidiennes
- **DIAGNOSTIC-COMPLET-THIBEQUATION.md** : Audit de l'infrastructure

---

## ⚡ COMMANDE UNIQUE

**Si tu veux tout en une commande :**

```bash
cd /chemin/vers/thibequation-site && ./INSTALLATION-AUTOMATIQUE.sh
```

**Appuie sur Entrée quand demandé, c'est tout.** 🚀

---

**📅 Créé le** : 2026-01-09  
**🤖 Mode** : Installation Automatique Optimale  
**✍️ Projet** : ThibEquation Framework v5.0 — Pascal Thibodeau
