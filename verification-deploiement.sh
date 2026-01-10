#!/bin/bash

echo "🔍 VÉRIFICATION DÉPLOIEMENT THIBEQUATION.COM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1 : Site accessible
echo "1️⃣ Test accessibilité HTTPS..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://thibequation.com/)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "   ✅ Site accessible (HTTP $HTTP_CODE)"
else
    echo "   ❌ Site inaccessible (HTTP $HTTP_CODE)"
fi

# Test 2 : Headers Cloudflare
echo "2️⃣ Test headers Cloudflare..."
SERVER=$(curl -sI https://thibequation.com/ | grep -i "^server:" | awk '{print $2}')
if [[ "$SERVER" == *"cloudflare"* ]]; then
    echo "   ✅ Serveur Cloudflare détecté"
else
    echo "   ❌ Serveur non-Cloudflare : $SERVER"
fi

# Test 3 : HTTPS forcé
echo "3️⃣ Test redirection HTTPS..."
HTTP_REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" http://thibequation.com/)
if [[ "$HTTP_REDIRECT" == "https://"* ]]; then
    echo "   ✅ Redirection HTTPS active"
else
    echo "   ⚠️ Pas de redirection HTTPS détectée"
fi

# Test 4 : Headers sécurité
echo "4️⃣ Test headers de sécurité..."
curl -sI https://thibequation.com/ | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)" | while read line; do
    echo "   ✅ $line"
done

# Test 5 : Contenu ThibEquation
echo "5️⃣ Test contenu ThibEquation Framework..."
if curl -s https://thibequation.com/ | grep -q "ThibEquation Framework v5.0"; then
    echo "   ✅ Contenu ThibEquation détecté"
else
    echo "   ❌ Contenu ThibEquation non trouvé"
fi

# Test 6 : Ressources statiques
echo "6️⃣ Test ressources statiques..."
LOGO_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://thibequation.com/images/logo-thibequation-official.png)
CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://thibequation.com/css/modern-pale-theme-v2.css)
JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://thibequation.com/js/session-manager.js)

if [ "$LOGO_CODE" -eq 200 ] && [ "$CSS_CODE" -eq 200 ] && [ "$JS_CODE" -eq 200 ]; then
    echo "   ✅ Ressources statiques accessibles"
else
    echo "   ⚠️ Certaines ressources manquantes (Logo:$LOGO_CODE CSS:$CSS_CODE JS:$JS_CODE)"
fi

# Test 7 : Pages calculateurs
echo "7️⃣ Test pages calculateurs..."
CALC_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://thibequation.com/calculateur-premium.html)
if [ "$CALC_CODE" -eq 200 ]; then
    echo "   ✅ Calculateurs accessibles"
else
    echo "   ❌ Calculateurs inaccessibles (HTTP $CALC_CODE)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Vérification terminée"
