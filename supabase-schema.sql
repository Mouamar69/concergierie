-- Script SQL pour créer la table leads dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase : https://supabase.com/dashboard/project/_/sql/new

-- Créer la table leads
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT NOT NULL,
  ville TEXT NOT NULL,
  nombre_biens INTEGER NOT NULL DEFAULT 1,
  plateformes TEXT[] DEFAULT '{}',
  situation TEXT NOT NULL,
  motivation TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'Nouveau',
  source TEXT NOT NULL DEFAULT 'Site KBG',
  date TEXT NOT NULL,
  notes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index pour accélérer les recherches par statut et score
CREATE INDEX IF NOT EXISTS idx_leads_statut ON leads(statut);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) - Optionnel mais recommandé
-- Activez RLS si vous voulez sécuriser les données
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique (pour le dashboard)
CREATE POLICY "Allow public read access" ON leads
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion publique (pour le formulaire de diagnostic)
CREATE POLICY "Allow public insert access" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la mise à jour publique (pour le dashboard)
CREATE POLICY "Allow public update access" ON leads
  FOR UPDATE
  USING (true);

-- Politique pour permettre la suppression publique (pour le dashboard)
CREATE POLICY "Allow public delete access" ON leads
  FOR DELETE
  USING (true);

-- Insertion de quelques leads d'exemple (optionnel)
INSERT INTO leads (prenom, nom, telephone, email, ville, nombre_biens, plateformes, situation, motivation, score, statut, source, date, notes)
VALUES
  ('Marie', 'Dubois', '06 12 34 56 78', 'marie.dubois@email.com', 'Paris 11e', 3, ARRAY['Airbnb', 'Booking'], 'Je gère tout moi-même', 'Je manque de temps', 92, 'Intéressé', 'Site KBG', '2024-01-15', ARRAY['Appel le 16/01 - Très intéressée', 'RDV prévu le 22/01']),
  ('Thomas', 'Martin', '06 98 76 54 32', 'thomas.martin@email.com', 'Paris 3e', 4, ARRAY['Airbnb', 'Booking', 'Abritel'], 'J''ai déjà une conciergerie', 'Je veux améliorer mes revenus', 88, 'Rendez-vous', 'Facebook', '2024-01-14', ARRAY['RDV le 20/01 à 14h']),
  ('Sophie', 'Laurent', '06 11 22 33 44', 'sophie.laurent@email.com', 'Boulogne', 1, ARRAY['Pas encore'], 'Je prépare actuellement le lancement', 'Je souhaite lancer mon logement', 65, 'À contacter', 'Leboncoin', '2024-01-13', ARRAY[]::TEXT[]),
  ('Pierre', 'Moreau', '06 55 66 77 88', 'pierre.moreau@email.com', 'Paris 16e', 2, ARRAY['Airbnb'], 'Je délègue certaines tâches', 'Je veux déléguer la gestion', 78, 'Contacté', 'Site KBG', '2024-01-12', ARRAY['Email envoyé le 13/01']),
  ('Isabelle', 'Petit', '06 99 88 77 66', 'isabelle.petit@email.com', 'Neuilly', 1, ARRAY['Booking'], 'Je gère tout moi-même', 'Je manque de temps', 72, 'Nouveau', 'Google Maps', '2024-01-11', ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;
