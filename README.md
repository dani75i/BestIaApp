# BestIA

Un annuaire d'outils d'intelligence artificielle en français, conçu pour découvrir les IA utiles au quotidien depuis un ordinateur ou un smartphone.

## Fonctionnalités

- Une première sélection de 30 outils avec leur présentation et un lien vers leur site officiel.
- Des catégories pour le code, la rédaction, la vidéo, la musique, les présentations et d'autres usages.
- Une recherche et des filtres par catégorie et modèle tarifaire.
- Des favoris pour retrouver ses outils.
- Des notes personnelles de 1 à 5 étoiles.
- Une interface responsive, adaptée aux petits et grands écrans.
- Un mode clair/sombre : suit le thème de l’appareil par défaut, puis conserve votre choix dans ce navigateur via le bouton soleil/lune.

Les favoris et les notes sont enregistrés dans le navigateur avec `localStorage`, sans compte utilisateur. Ils restent sur le même navigateur et la même adresse du site : les données de la version locale et du site publié sont distinctes. Effacer les données du navigateur efface aussi ces préférences. Les notes ne représentent pas une moyenne publique des visiteurs.

Les modèles tarifaires (gratuit, freemium ou payant) sont des indications générales qui peuvent évoluer. Un essai gratuit ne signifie pas qu'un outil est gratuit durablement. Consultez le site officiel de chaque outil avant de souscrire. Le catalogue est une sélection éditoriale, pas un inventaire exhaustif ni une collecte automatique de tous les services du marché.

## Lancer l'application en local

Prérequis : Node.js 20.17 ou ultérieur et npm. Le workflow de déploiement utilise Node.js 22.

Dans le terminal de VS Code ouvert dans le dossier `BestIaApp` :

```bash
npm ci
npm run dev
```

Ouvrez l'adresse affichée par Vite dans le terminal (habituellement `http://127.0.0.1:5173`). Le serveur écoute uniquement sur votre ordinateur. Les modifications des fichiers se reflètent automatiquement dans le navigateur. Laissez le terminal ouvert et utilisez `Ctrl + C` pour arrêter le serveur.

Si PowerShell bloque `npm.ps1`, utilisez le terminal Bash de VS Code ou remplacez `npm` par `npm.cmd`.

## Vérifier la version à publier

```bash
npm test
npm run build
npm run preview
```

La commande de construction produit le dossier `dist`. La prévisualisation affiche la version construite à l'adresse indiquée dans le terminal. Elle doit être reconstruite après chaque modification que vous souhaitez y vérifier.

L'application est statique : elle ne nécessite pas de serveur applicatif, de base de données ou de clé API. Les outils référencés s'utilisent sur leurs propres sites.

## Déploiement gratuit et automatique

Le fichier [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installe les dépendances, exécute les tests, construit l'application puis publie `dist` sur GitHub Pages après chaque envoi de code sur `main`.

### Activer GitHub Pages une seule fois

1. Ouvrez le dépôt [dani75i/BestIaApp](https://github.com/dani75i/BestIaApp).
2. Avec l'offre **GitHub Free**, le dépôt doit être **public** pour utiliser GitHub Pages. Si le dépôt est privé, décidez si vous souhaitez rendre son code public avant de changer sa visibilité. [Conditions officielles de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
3. Allez dans **Settings → Pages → Build and deployment** et choisissez **GitHub Actions** dans **Source**. [Configuration officielle](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
4. Envoyez le code sur `main`. S'il est déjà envoyé, ouvrez **Actions → Publier BestIA sur GitHub Pages → Run workflow**, puis choisissez `main`.
5. Attendez que les étapes du workflow passent au vert. L'adresse effective du site apparaît dans **Settings → Pages** et dans le déploiement.

Adresse attendue après un premier déploiement réussi : **https://dani75i.github.io/BestIaApp/**. Aucun achat de nom de domaine n'est nécessaire. La présence de ce lien dans le README ne signifie pas qu'un déploiement a déjà réussi.

### Publier les modifications suivantes

Depuis le dossier du projet :

```bash
git add .
git commit -m "Mettre à jour BestIA"
git push -u origin main
```

Vous pouvez aussi utiliser **Contrôle de code source** dans VS Code pour préparer les fichiers, créer le commit puis envoyer les modifications. Git suffit ; GitHub CLI (`gh`) n'est pas nécessaire.

Le site local s'actualise quand vous enregistrez un fichier. Le site public s'actualise après un **commit envoyé sur `main`** et un workflow réussi. Un simple enregistrement sur l'ordinateur ne publie rien.

Si une étape échoue, ouvrez le workflow dans l'onglet **Actions** pour lire son message d'erreur. La version publique précédente reste en place tant que la nouvelle publication n'a pas réussi.

### Structure technique

L'interface utilise React et Vite. Le chemin de base relatif (`base: './'`) permet de servir les fichiers sous `/BestIaApp/`. Le workflow n'utilise aucun jeton personnel à configurer : GitHub fournit les permissions temporaires nécessaires au déploiement. Seul le job de publication dispose des droits d'écriture GitHub Pages.

Référence : [workflows personnalisés pour GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
