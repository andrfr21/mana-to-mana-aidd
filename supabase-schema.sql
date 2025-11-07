-- ===========================================
-- MANA-TO-MANA AID - SUPABASE DATABASE SCHEMA
-- ===========================================
-- Instructions: Copiez et exécutez ce script dans l'éditeur SQL de Supabase
-- (Dashboard > SQL Editor > New Query)

-- 1. Créer la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('donor', 'beneficiary')),
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  needs TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Créer la table des besoins
CREATE TABLE IF NOT EXISTS needs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothes', 'food', 'hygiene', 'housing', 'children', 'other')),
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fulfilled')),
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Créer la table des conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  beneficiary_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  need_id UUID REFERENCES needs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(donor_id, beneficiary_id, need_id)
);

-- 4. Créer la table des messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_needs_beneficiary_id ON needs(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_needs_status ON needs(status);
CREATE INDEX IF NOT EXISTS idx_needs_category ON needs(category);
CREATE INDEX IF NOT EXISTS idx_needs_location ON needs(location);
CREATE INDEX IF NOT EXISTS idx_conversations_donor_id ON conversations(donor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_beneficiary_id ON conversations(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- 6. Activer Row Level Security (RLS) sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 7. Politiques RLS pour la table profiles
-- Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Les donateurs peuvent voir les profils des bénéficiaires
CREATE POLICY "Donors can view beneficiary profiles"
  ON profiles FOR SELECT
  USING (
    user_type = 'beneficiary' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND user_type = 'donor'
    )
  );

-- Les profils peuvent être créés lors de l'inscription
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. Politiques RLS pour la table needs
-- Tout le monde peut lire les besoins ouverts
CREATE POLICY "Anyone can view open needs"
  ON needs FOR SELECT
  USING (status = 'open' OR beneficiary_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Les bénéficiaires peuvent créer leurs propres besoins
CREATE POLICY "Beneficiaries can create needs"
  ON needs FOR INSERT
  WITH CHECK (
    beneficiary_id IN (
      SELECT id FROM profiles
      WHERE user_id = auth.uid()
      AND user_type = 'beneficiary'
    )
  );

-- Les bénéficiaires peuvent mettre à jour leurs propres besoins
CREATE POLICY "Beneficiaries can update own needs"
  ON needs FOR UPDATE
  USING (
    beneficiary_id IN (
      SELECT id FROM profiles
      WHERE user_id = auth.uid()
    )
  );

-- Les bénéficiaires peuvent supprimer leurs propres besoins
CREATE POLICY "Beneficiaries can delete own needs"
  ON needs FOR DELETE
  USING (
    beneficiary_id IN (
      SELECT id FROM profiles
      WHERE user_id = auth.uid()
    )
  );

-- 9. Politiques RLS pour la table conversations
-- Les participants peuvent voir leurs conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (
    donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    beneficiary_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Les utilisateurs peuvent créer des conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    beneficiary_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Les participants peuvent mettre à jour leurs conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (
    donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    beneficiary_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- 10. Politiques RLS pour la table messages
-- Les participants peuvent voir les messages de leurs conversations
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
      OR beneficiary_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Les participants peuvent créer des messages dans leurs conversations
CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
      OR beneficiary_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    ) AND
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Les utilisateurs peuvent marquer leurs messages comme lus
CREATE POLICY "Users can update messages sent to them"
  ON messages FOR UPDATE
  USING (
    receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- 11. Fonction pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Note: Le profil doit être créé manuellement depuis l'application
  -- Cette fonction est juste un placeholder pour d'éventuels déclencheurs futurs
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Créer un trigger pour updated_at sur profiles
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- 14. Fonction pour mettre à jour last_message_at dans conversations
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Créer un trigger pour last_message_at
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- ===========================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ===========================================
-- Décommentez les lignes suivantes pour insérer des données de test

-- INSERT INTO profiles (user_id, user_type, full_name, location, bio) VALUES
-- (auth.uid(), 'donor', 'Jean Dupont', 'Papeete', 'Heureux de pouvoir aider la communauté'),
-- (auth.uid(), 'beneficiary', 'Marie Martin', 'Faa''a', 'Mère de famille en difficulté temporaire');

-- ===========================================
-- VÉRIFICATION
-- ===========================================
-- Vérifiez que tout est bien créé :
SELECT 'Profiles count:' as info, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Needs count:', COUNT(*) FROM needs
UNION ALL
SELECT 'Conversations count:', COUNT(*) FROM conversations
UNION ALL
SELECT 'Messages count:', COUNT(*) FROM messages;

-- Vérification des politiques RLS :
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
