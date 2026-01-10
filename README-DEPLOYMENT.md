# ThibEquation Framework v5.0 - Site Web

## 📁 Structure du Projet

```
thibequation-site/
├── index.html                  # Page d'accueil principale
├── calculateur-*.html          # Calculateurs scientifiques
├── documentation-*.html        # Documentation technique
├── css/                        # Styles CSS
├── js/                         # Scripts JavaScript
├── images/                     # Logos et assets
└── *.pdf                       # Rapports scientifiques
```

## 🚀 Déploiement Cloudflare Pages

### Prérequis
- Compte Cloudflare avec domaine thibequation.com configuré
- Token API Cloudflare avec permissions Pages

### Configuration Cloudflare Pages
1. **Framework** : Aucun (site statique pur)
2. **Build command** : `(aucune)`
3. **Output directory** : `/`
4. **Root directory** : `/`

### Variables d'environnement
Aucune variable nécessaire — site statique HTML/CSS/JS pur.

## 🔧 Technologies

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Librairies** : Chart.js 4.4.0
- **Fonts** : Google Fonts (Inter, Space Grotesk, Cinzel)

## 📊 Métriques du Site

- **73 fichiers** (4.9 MB total)
- **50 pages HTML** documentées
- **5 calculateurs** scientifiques interactifs
- **14 fichiers JS** pour fonctionnalités avancées

## 🔒 Sécurité

Headers de sécurité configurés :
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=15552000`

## 📄 Licence

Thibodeau-Innovations-Framework License 1.0
© 2025 Pascal Thibodeau / Thibodeau Innovations

---

**Auteur** : Pascal Thibodeau  
**Contact** : https://thibequation.com/
