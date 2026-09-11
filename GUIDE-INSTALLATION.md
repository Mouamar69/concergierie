# 🚀 Guide d'installation - KBG Conciergerie avec Supabase

## ✅ Ce qui a été fait

Votre site KBG Conciergerie est maintenant **connecté à une vraie base de données Supabase** !

### Fonctionnalités activées :
- ✅ Les leads du diagnostic sont **sauvegardés automatiquement** dans Supabase
- ✅ Le back-office admin **lit les données depuis la base**
- ✅ Les modifications de statut sont **persistées**
- ✅ Les notes sont **sauvegardées**
- ✅ Mode **fallback local** si Supabase n'est pas configuré

---

## 📋 Étapes d'installation

### 1. Créer un compte Supabase (gratuit)

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub ou créez un compte

### 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Remplissez les informations :
   - **Name** : `kbg-conciergerie`
   - **Database Password** : (choisissez un mot de passe fort et notez-le)
   - **Region** : `West EU (Paris)` (pour la performance en France)
3. Cliquez sur "Create new project"
4. Attendez 2-3 minutes que le projet soit prêt

### 3. Récupérer vos clés API

1. Dans le dashboard Supabase, allez dans **Settings** (icône engrenage)
2. Cliquez sur **API** dans le menu de gauche
3. Copiez ces deux valeurs :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Créer la table leads

1. Dans le dashboard Supabase, allez dans **SQL Editor** (icône base de données)
2. Cliquez sur "New query"
3. Copiez-collez le contenu du fichier `supabase-schema.sql`
4. Cliquez sur "Run" (ou Ctrl+Enter)
5. Vous devriez voir "Success. No rows returned"

### 5. Configurer les variables d'environnement

1. À la racine du projet, créez un fichier `.env` (copiez `.env.example`)
2. Remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

**Important** : Remplacez par VOS valeurs copiées à l'étape 3 !

### 6. Tester la connexion

1. Lancez le site : `npm run dev`
2. Ouvrez le site dans votre navigateur
3. Allez dans "Espace KBG" (back-office)
4. Vous devriez voir un **badge vert "Supabase connecté"** en haut à droite
5. Les 5 leads d'exemple devraient s'afficher (insérés par le script SQL)

---

## 🎯 Comment ça fonctionne

### Côté site public (diagnostic)

1. Un propriétaire remplit le diagnostic
2. Ses réponses sont converties en lead avec un score
3. Le lead est **automatiquement sauvegardé** dans Supabase
4. Un message de confirmation s'affiche

### Côté back-office admin

1. Les leads sont **chargés depuis Supabase** au démarrage
2. Vous pouvez **filtrer** par statut et score
3. Vous pouvez **changer le statut** d'un lead (Nouveau → Contacté → RDV → Client)
4. Vous pouvez **ajouter des notes** internes
5. Toutes les modifications sont **sauvegardées en temps réel**

---

## 🔧 Structure de la base de données

### Table `leads`

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Identifiant unique |
| prenom | TEXT | Prénom du prospect |
| nom | TEXT | Nom du prospect |
| telephone | TEXT | Numéro de téléphone |
| email | TEXT | Adresse email |
| ville | TEXT | Ville du bien |
| nombre_biens | INTEGER | Nombre de logements |
| plateformes | TEXT[] | Plateformes utilisées (Airbnb, Booking...) |
| situation | TEXT | Situation actuelle |
| motivation | TEXT | Motivation principale |
| score | INTEGER | Score de qualification (0-100) |
| statut | TEXT | Statut du lead |
| source | TEXT | Source du lead |
| date | TEXT | Date de création |
| notes | TEXT[] | Notes internes |
| created_at | TIMESTAMP | Date de création automatique |
| updated_at | TIMESTAMP | Date de modification automatique |

---

## 📊 Scoring automatique

Le score est calculé automatiquement selon les réponses :

| Critère | Points |
|---------|--------|
| Localisation Paris | +20 |
| Localisation Petite couronne | +10 |
| 4+ biens | +15 |
| 2-3 biens | +10 |
| Plusieurs plateformes | +15 |
| Airbnb ou Booking | +10 |
| Déjà une conciergerie | +10 |
| Gère tout soi-même | +15 |
| Manque de temps / délégation | +20 |
| Améliorer revenus | +15 |

**Score maximum : 100**

### Catégories :
- 🔥 **80-100** : Très qualifié
- 🟠 **60-79** : Qualifié
- 🟡 **40-59** : À vérifier
- ❌ **< 40** : Non qualifié

---

## 🎨 Indicateurs visuels

### Badge de connexion Supabase

Un badge apparaît dans le back-office :
- 🟢 **Vert** : Supabase connecté
- 🔴 **Rouge** : Mode local (Supabase non configuré)

### Statuts des leads

Chaque lead affiche un badge coloré selon son statut :
- 🔵 **Nouveau** : Bleu
- 🟡 **À contacter** : Jaune
- 🟣 **Contacté** : Violet
- 🟢 **Intéressé** : Vert
- 🟠 **Rendez-vous** : Orange
- 🟢 **Client** : Vert émeraude
- ⚫ **Non qualifié** : Gris

---

## 🔒 Sécurité

### Row Level Security (RLS)

Le script SQL active RLS avec des politiques permissives :
- Lecture publique (pour le dashboard)
- Insertion publique (pour le formulaire)
- Mise à jour publique (pour le dashboard)
- Suppression publique (pour le dashboard)

**Pour une production réelle**, vous devriez :
1. Créer un système d'authentification
2. Restreindre l'accès en écriture aux utilisateurs authentifiés
3. Utiliser des JWT tokens

---

## 🐛 Dépannage

### "Supabase non connecté"

**Problème** : Le badge est rouge dans le back-office

**Solutions** :
1. Vérifiez que le fichier `.env` existe et contient les bonnes valeurs
2. Redémarrez le serveur de développement : `npm run dev`
3. Vérifiez que les clés API sont correctes dans Supabase

### Erreur "relation leads does not exist"

**Problème** : La table n'existe pas

**Solution** :
1. Allez dans SQL Editor de Supabase
2. Exécutez le script `supabase-schema.sql`
3. Vérifiez que la table apparaît dans "Table Editor"

### Les leads ne se sauvegardent pas

**Problème** : Le diagnostic fonctionne mais les leads n'apparaissent pas dans le back-office

**Solutions** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs dans l'onglet "Console"
3. Vérifiez les politiques RLS dans Supabase
4. Rafraichissez la page du back-office

---

## 📈 Améliorations futures

### Authentification admin
- Ajouter un système de login pour protéger le back-office
- Utiliser Supabase Auth

### Notifications email
- Envoyer un email à KBG quand un nouveau lead arrive
- Utiliser Supabase Edge Functions

### Export des données
- Exporter les leads en CSV/Excel
- Intégrer avec des outils CRM

### Analytics
- Suivre les conversions
- Analyser les sources de leads
- Dashboard avec graphiques

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur pour les erreurs
2. Consultez la documentation Supabase : https://supabase.com/docs
3. Vérifiez que votre projet Supabase est actif

---

## 🎉 Félicitations !

Votre site KBG Conciergerie est maintenant **100% fonctionnel** avec :
- ✅ Site vitrine premium
- ✅ Diagnostic interactif
- ✅ Base de données Supabase
- ✅ Back-office admin complet
- ✅ Génération de leads légale et efficace

**Prochaine étape** : Mettre en ligne le site et commencer à générer des leads !
