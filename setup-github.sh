#!/bin/bash

# Script d'automatisation pour GitHub
# Usage: ./setup-github.sh YOUR_GITHUB_USERNAME

echo "🌺 Fa'atauturu - Configuration GitHub Automatique"
echo "=================================================="
echo ""

# Vérifier que l'utilisateur a fourni son nom GitHub
if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez fournir votre nom d'utilisateur GitHub"
    echo "Usage: ./setup-github.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="mana-to-mana-aid"

echo "✅ Nom d'utilisateur: $GITHUB_USERNAME"
echo "✅ Nom du repository: $REPO_NAME"
echo ""

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    echo "Installez Git: https://git-scm.com/downloads"
    exit 1
fi

echo "📝 Étape 1: Création du .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.npm
*.log

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.production
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Cache
.cache/
.turbo

# Testing
coverage/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Local
*.local
EOF

echo "✅ .gitignore créé"
echo ""

echo "📝 Étape 2: Création du fichier vercel.json..."
cat > vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

echo "✅ vercel.json créé"
echo ""

echo "📝 Étape 3: Initialisation du repository Git..."
if [ -d .git ]; then
    echo "⚠️  Repository Git déjà initialisé"
else
    git init
    echo "✅ Git initialisé"
fi
echo ""

echo "📝 Étape 4: Ajout des fichiers..."
git add .
echo "✅ Fichiers ajoutés"
echo ""

echo "📝 Étape 5: Premier commit..."
git commit -m "Initial commit - Fa'atauturu application solidaire" 2>/dev/null || echo "⚠️  Commit déjà effectué"
echo "✅ Commit créé"
echo ""

echo "📝 Étape 6: Configuration de la branche main..."
git branch -M main 2>/dev/null || echo "⚠️  Branche main déjà configurée"
echo "✅ Branche configurée"
echo ""

echo "📝 Étape 7: Ajout du remote GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "✅ Remote ajouté: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

echo "=================================================="
echo "✅ CONFIGURATION TERMINÉE !"
echo "=================================================="
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo ""
echo "1. Créez le repository sur GitHub:"
echo "   👉 https://github.com/new"
echo "   - Nom: $REPO_NAME"
echo "   - Description: Application solidaire de mise en relation - Polynésie française"
echo "   - Public ou Private (votre choix)"
echo "   - NE COCHEZ RIEN d'autre"
echo ""
echo "2. Poussez le code:"
echo "   git push -u origin main"
echo ""
echo "3. Si vous avez une erreur d'authentification:"
echo "   - Créez un Personal Access Token sur GitHub"
echo "   - Settings → Developer settings → Personal access tokens"
echo "   - Utilisez le token comme mot de passe"
echo ""
echo "4. Déployez sur Vercel:"
echo "   👉 https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import project"
echo "   - Ajoutez les variables d'environnement:"
echo "     * VITE_SUPABASE_URL"
echo "     * VITE_SUPABASE_ANON_KEY"
echo ""
echo "🌺 Mauruuru ! (Merci en tahitien)"
