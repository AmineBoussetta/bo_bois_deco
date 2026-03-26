# Guide de mise en place du CMS — Bo Bois Deco

## Prérequis

- Un compte [GitHub](https://github.com)
- Un compte [Netlify](https://www.netlify.com) (gratuit)

---

## Étape 1 : Créer le dépôt GitHub

1. Aller sur GitHub > **New repository**
2. Nom : `boboisdeco-site`
3. Visibilité : Private
4. Importer le projet : glisser tous les fichiers du dossier ou utiliser Git :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_UTILISATEUR/boboisdeco-site.git
git push -u origin main
```

---

## Étape 2 : Déployer sur Netlify

1. Aller sur [app.netlify.com](https://app.netlify.com)
2. Cliquer **Add new site** > **Import an existing project**
3. Connecter votre compte GitHub
4. Sélectionner le dépôt `boboisdeco-site`
5. Paramètres de build :
   - **Build command** : *(laisser vide)*
   - **Publish directory** : `.`
6. Cliquer **Deploy site**

---

## Étape 3 : Activer Netlify Identity (authentification CMS)

1. Dans Netlify > votre site > **Integrations** > **Identity**
2. Cliquer **Enable Identity**
3. Aller dans **Settings** > **Identity** > **Registration** :
   - Choisir **Invite only** (seules les personnes invitées peuvent se connecter)
4. Aller dans **Services** > **Git Gateway** :
   - Cliquer **Enable Git Gateway**

---

## Étape 4 : Inviter le client

1. Dans **Identity** > **Invite users**
2. Entrer l'email du client : `contact.boboisdeco@gmail.com`
3. Le client recevra un email avec un lien pour créer son mot de passe

---

## Étape 5 : Accéder au CMS

Le client peut maintenant accéder au panneau d'administration à :

```
https://VOTRE-SITE.netlify.app/admin/
```

### Ce que le client peut faire :

- **Réalisations** : Ajouter, modifier, supprimer des projets du portfolio (photo + titre + catégorie)
- **Paramètres** : Modifier le slogan, les coordonnées, les liens réseaux sociaux
- **Page À propos** : Modifier les textes et la photo de la section À propos

Chaque modification crée automatiquement un commit dans GitHub et redéploie le site.

---

## Nom de domaine personnalisé

1. Dans Netlify > **Domain settings** > **Add custom domain**
2. Entrer le domaine (ex: `boboisdeco.com`)
3. Configurer les DNS chez votre registrar :
   - Type `A` → `75.2.60.5`
   - Type `CNAME` pour `www` → `VOTRE-SITE.netlify.app`
4. Netlify fournit automatiquement un certificat SSL (HTTPS)

---

## Ajouter de nouvelles réalisations au portfolio

Pour que le content-loader détecte de nouveaux fichiers portfolio créés via le CMS, mettre à jour la liste `PORTFOLIO_FILES` dans `js/content-loader.js` avec le slug du nouveau projet.

Alternativement, si un grand nombre de projets est prévu, envisager de migrer vers un fichier JSON unique pour le portfolio.
