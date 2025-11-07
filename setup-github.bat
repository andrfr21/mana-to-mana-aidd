@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🌺 Fa'atauturu - Configuration GitHub Automatique
echo ==================================================
echo.

REM Vérifier que l'utilisateur a fourni son nom GitHub
if "%~1"=="" (
    echo ❌ Erreur: Veuillez fournir votre nom d'utilisateur GitHub
    echo Usage: setup-github.bat YOUR_GITHUB_USERNAME
    exit /b 1
)

set GITHUB_USERNAME=%~1
set REPO_NAME=mana-to-mana-aid

echo ✅ Nom d'utilisateur: %GITHUB_USERNAME%
echo ✅ Nom du repository: %REPO_NAME%
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé
    echo Installez Git: https://git-scm.com/downloads
    exit /b 1
)

echo 📝 Étape 1: Création du .gitignore...
(
echo # Dependencies
echo node_modules/
echo .npm
echo *.log
echo.
echo # Production
echo dist/
echo build/
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.production
echo .env.*.local
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Cache
echo .cache/
echo.
echo # Testing
echo coverage/
) > .gitignore

echo ✅ .gitignore créé
echo.

echo 📝 Étape 2: Création du fichier vercel.json...
(
echo {
echo   "rewrites": [
echo     {
echo       "source": "/^(.*^)",
echo       "destination": "/index.html"
echo     }
echo   ]
echo }
) > vercel.json

echo ✅ vercel.json créé
echo.

echo 📝 Étape 3: Initialisation du repository Git...
if exist .git\ (
    echo ⚠️  Repository Git déjà initialisé
) else (
    git init
    echo ✅ Git initialisé
)
echo.

echo 📝 Étape 4: Ajout des fichiers...
git add .
echo ✅ Fichiers ajoutés
echo.

echo 📝 Étape 5: Premier commit...
git commit -m "Initial commit - Fa'atauturu application solidaire" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Commit déjà effectué
) else (
    echo ✅ Commit créé
)
echo.

echo 📝 Étape 6: Configuration de la branche main...
git branch -M main >nul 2>&1
echo ✅ Branche configurée
echo.

echo 📝 Étape 7: Ajout du remote GitHub...
git remote remove origin >nul 2>&1
git remote add origin "https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git"
echo ✅ Remote ajouté: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
echo.

echo ==================================================
echo ✅ CONFIGURATION TERMINÉE !
echo ==================================================
echo.
echo 📋 PROCHAINES ÉTAPES:
echo.
echo 1. Créez le repository sur GitHub:
echo    👉 https://github.com/new
echo    - Nom: %REPO_NAME%
echo    - Description: Application solidaire de mise en relation - Polynésie française
echo    - Public ou Private (votre choix)
echo    - NE COCHEZ RIEN d'autre
echo.
echo 2. Poussez le code:
echo    git push -u origin main
echo.
echo 3. Si vous avez une erreur d'authentification:
echo    - Créez un Personal Access Token sur GitHub
echo    - Settings → Developer settings → Personal access tokens
echo    - Utilisez le token comme mot de passe
echo.
echo 4. Déployez sur Vercel:
echo    👉 https://vercel.com
echo    - Sign up with GitHub
echo    - Import project
echo    - Ajoutez les variables d'environnement:
echo      * VITE_SUPABASE_URL
echo      * VITE_SUPABASE_ANON_KEY
echo.
echo 🌺 Mauruuru ! (Merci en tahitien)

pause
