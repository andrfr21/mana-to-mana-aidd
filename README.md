<<<<<<< HEAD
# 🌺 Manaaki Connection – Fa’atauturu
**Connectons ceux qui ont besoin d’aide avec ceux qui peuvent donner.**  
Un geste simple, un impact réel dans notre communauté polynésienne.

---

## 💡 Concept

**Fa’atauturu** (ou *Manaaki Connection*) est une application solidaire développée en **Polynésie française**.  
Elle permet de **mettre en relation les personnes en difficulté** (sans-abri, familles précaires, étudiants dans le besoin, etc.) avec des **donateurs** qui souhaitent offrir des biens matériels ou une aide directe.

Les utilisateurs peuvent :
- créer un **profil solidaire** (bénéficiaire ou donateur) ;
- consulter les **profils proches géographiquement** ;
- **prendre contact** pour convenir d’un **rendez-vous** (don de vêtements, repas, objets, etc.) ;
- agir **localement**, à Papeete, Faa’a, Moorea, Bora Bora et dans toute la Polynésie.

---

## 🚀 Fonctionnalités principales

| Rôle | Fonctionnalités clés |
|------|----------------------|
| 👥 **Bénéficiaires** | Création de profil, description des besoins (habits, repas, hébergement, etc.), localisation, possibilité de recevoir des dons. |
| ❤️ **Donateurs** | Navigation dans les profils, filtrage par ville et type de besoin, contact direct pour organiser un don. |
| 🗺️ **Localisation** | Sélecteur de communes polynésiennes (Papeete, Faa’a, Moorea, etc.). |
| 💬 **Messagerie simple** | Formulaire ou contact direct entre donateur et bénéficiaire. |
| 🛡️ **Admin / modération** | Validation des profils, gestion des signalements. |
| 📱 **Responsive** | Optimisé pour mobile et ordinateur. |

---

## 🧰 Stack technique

Ce projet a été conçu avec **[Lovable.dev](https://lovable.dev)** — une plateforme de génération d’applications web no-code/low-code.  
Les technos utilisées peuvent inclure :
- **Front-end** : React / Next.js  
- **Backend / Database** : Supabase / Airtable  
- **Auth** : Clerk / Memberstack  
- **Automatisation** : Make (ex-Integromat) ou Zapier  
- **Déploiement** : Vercel  

---

## ⚙️ Installation locale

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/<ton-utilisateur>/manaaki-connection.git
cd manaaki-connection

=======
# 🌺 Fa'atauturu (Mana-to-Mana Aid)

**Application solidaire de mise en relation - Polynésie française**

Connectons ceux qui ont besoin d'aide avec ceux qui peuvent donner. Un geste simple, un impact réel dans notre communauté polynésienne.

---

## 🎯 Objectif

Faciliter les dons directs et locaux entre habitants de Polynésie française en permettant :
- Aux **bénéficiaires** de créer un profil et d'indiquer leurs besoins précis
- Aux **donateurs** de consulter ces profils et proposer leur aide

## ✨ Fonctionnalités Principales

### Pour les Bénéficiaires
- ✅ Création de profil sécurisé
- ✅ Publication de besoins avec description détaillée
- ✅ Catégorisation (vêtements, nourriture, hygiène, logement, enfants, autre)
- ✅ Niveaux d'urgence (faible, moyen, urgent)
- ✅ Gestion de ses propres besoins

### Pour les Donateurs
- ✅ Navigation dans les profils de bénéficiaires
- ✅ Filtrage par localisation, catégorie, urgence
- ✅ Recherche par mots-clés
- ✅ Contact direct avec les bénéficiaires

## 🛠️ Technologies

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth)
- Zustand + React Router v6

## 🚀 Installation Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/andrfr21/mana-to-mana-aid.git
cd mana-to-mana-aid

# 2. Installer les dépendances
npm install

# 3. Configurer Supabase (voir section détaillée ci-dessous)
cp .env.example .env
# Modifier .env avec vos clés Supabase

# 4. Lancer en développement
npm run dev
```

## 📋 Configuration Supabase Détaillée

### 1. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Attendez l'initialisation (2-3 min)

### 2. Exécuter le schéma SQL
1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu de `supabase-schema.sql`
4. Collez et cliquez sur **Run**

### 3. Récupérer les clés API
1. **Project Settings** > **API**
2. Copiez :
   - Project URL
   - anon public key
3. Ajoutez-les dans votre fichier `.env`

## 📂 Structure

```
src/
├── components/          # Composants UI
├── pages/              # Pages de l'app
├── stores/             # State management (Zustand)
├── lib/                # Config Supabase
└── App.tsx             # Point d'entrée
```

## 🗄️ Base de Données

- **profiles**: Utilisateurs (donateurs/bénéficiaires)
- **needs**: Besoins publiés
- **conversations**: Discussions
- **messages**: Messages individuels

## 🔒 Sécurité

- Row Level Security (RLS) activé
- Authentification Supabase
- Validation Zod côté client
- Chiffrement TLS

## 🌍 Déploiement

### Vercel (Recommandé)
```bash
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## 📝 Licence

MIT - Libre d'utilisation

## 🙏 Crédits

Développé pour la communauté polynésienne
Création initiale avec [Lovable.dev](https://lovable.dev)

---

**Fa'a'ite! (À bientôt)** 🌺
>>>>>>> ca23509 (Initial commit - Faatauturu app)
