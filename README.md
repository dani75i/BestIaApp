# BestIA

Un annuaire d'outils d'intelligence artificielle en français, conçu pour découvrir les IA utiles au quotidien depuis un ordinateur ou un smartphone.

## Fonctionnalités

- Une sélection de 40 outils avec leur présentation et un lien vers leur site officiel.
- Filtres combinables « Utilisable en français » (interface ou contenus confirmés) et « Sans inscription » (au moins un usage de base confirmé sans compte). Les informations inconnues et les accès soumis à restriction régionale sont exclus du filtre concerné.
- Fiches et comparateur enrichis : langues, inscription, limites du gratuit et sources datées. Les résultats visés des exemples sont des illustrations éditoriales, pas des résultats de tests réels.
- Bouton « Donner mon avis » dans un bandeau en haut de toutes les pages.

### Ajout des outils de septembre 2026

Sur une base existante, exécuter `supabase/add-tools-2026-09.sql` dans le SQL Editor de Supabase pour autoriser les votes des dix nouveaux outils. Ce script peut être relancé et conserve les votes existants. Les nouvelles installations utilisent directement `supabase/setup.sql`.
- Une page partageable par outil : usages, public, avantages, limites, exemple à copier, prix, sources datées et alternatives.
- Un formulaire privé pour envoyer une suggestion, un problème ou une remarque sur BestIA, avec e-mail facultatif.
- Des catégories pour le code, la rédaction, la vidéo, la musique, les présentations et d'autres usages.
- Une recherche et des filtres par catégorie et modèle tarifaire.
- Des favoris pour retrouver ses outils.
- Des votes de 1 à 5 étoiles avec une moyenne publique et le nombre de votes.
- Une interface responsive, adaptée aux petits et grands écrans.
- Un mode clair/sombre : suit le thème de l’appareil par défaut, puis conserve votre choix dans ce navigateur via le bouton soleil/lune.

Les favoris et le thème sont enregistrés dans le navigateur. Les votes sont conservés dans Supabase : la moyenne et le nombre de votes sont partagés entre appareils. Une session anonyme est créée seulement au premier vote. Un même navigateur peut modifier ou supprimer son vote. Sans compte personnel, changer d’appareil, d’adresse (local/public) ou effacer les données du navigateur crée une nouvelle identité ; cela ne supprime pas les votes publiés. Ce système limite à un vote par outil et identité de navigateur, pas par personne. Les anciennes notes locales restent conservées et ne sont publiées que si le visiteur vote à nouveau.

Les modèles tarifaires (gratuit, freemium ou payant) sont des indications générales qui peuvent évoluer. Un essai gratuit ne signifie pas qu'un outil est gratuit durablement. Consultez le site officiel de chaque outil avant de souscrire. Le catalogue est une sélection éditoriale, pas un inventaire exhaustif ni une collecte automatique de tous les services du marché.

## Lancer l'application en local

Prérequis : Node.js 20.17 ou ultérieur et npm. Le workflow de déploiement utilise Node.js 22.

Dans le terminal de VS Code ouvert dans le dossier `BestIaApp` :

```bash
npm ci
npm run dev
```

Ouvrez l'adresse affichée par Vite dans le terminal (habituellement `http://127.0.0.1:5173`). Le serveur écoute uniquement sur votre ordinateur. Les modifications des fichiers se reflètent automatiquement dans le navigateur. Laissez le terminal ouvert et utilisez `Ctrl + C` pour arrêter le serveur.

Si le port 5173 est déjà occupé, Vite choisit automatiquement le suivant : utilisez l’adresse affichée dans le terminal. Les tests navigateur utilisent le port 5175 pour ne pas arrêter votre serveur de développement.

Si PowerShell bloque `npm.ps1`, utilisez le terminal Bash de VS Code ou remplacez `npm` par `npm.cmd`.

## Vérifier la version à publier

```bash
npm test
npm run build
npm run preview
```

La commande de construction produit le dossier `dist`. La prévisualisation affiche la version construite à l'adresse indiquée dans le terminal. Elle doit être reconstruite après chaque modification que vous souhaitez y vérifier.

L’interface reste statique sur GitHub Pages. Les votes utilisent une base Supabase séparée. Les outils référencés s’utilisent sur leurs propres sites.

## Configurer les votes partagés

1. Dans le projet Supabase, ouvrir **SQL Editor → New query**, coller [supabase/setup.sql](supabase/setup.sql) et cliquer sur **Run**. Le script est réexécutable sans suppression des votes.
2. Dans **Authentication → Sign In / Providers → Anonymous Sign-Ins**, activer les connexions anonymes.
3. La configuration publique (URL et clé `sb_publishable_...`) est dans [src/config/supabase.js](src/config/supabase.js). Aucune clé secrète ou `service_role` ne doit être ajoutée au site ou au dépôt.

La table `tool_votes` applique les règles de sécurité PostgreSQL (RLS) : chaque session peut seulement consulter, modifier ou supprimer ses propres votes. La fonction `get_tool_ratings` expose uniquement la moyenne et le nombre de votes par outil. Les moyennes se rafraîchissent au retour sur la page et toutes les 30 secondes quand elle est visible.

Un déploiement GitHub Pages ne touche jamais à la base. Le workflow n’exécute ni remise à zéro ni migration SQL. Conserver le même projet Supabase préserve les votes d’une version à l’autre. Pour ajouter un outil, ajouter son identifiant à `rating_tools` avec `insert ... on conflict do nothing`; ne pas supprimer les outils référencés par des votes.

En cas de panne réseau, le site affiche des notes indisponibles et ne simule pas un vote enregistré. Les tests navigateur interceptent toutes les requêtes Supabase pour ne pas publier de votes de test. `npm test` vérifie aussi les moyennes, les permissions RLS et la réexécution non destructive du script avec PostgreSQL via PGlite.

L’authentification anonyme ne peut pas empêcher une personne de recréer une identité. Avant une forte exposition, ajouter une vérification CAPTCHA/Turnstile selon la [documentation Supabase](https://supabase.com/docs/guides/auth/auth-anonymous). L’activer côté Supabase seul, sans interface CAPTCHA, bloquerait les votes. L’offre gratuite peut se mettre en pause après une période d’inactivité ; consulter les [conditions de l’offre](https://supabase.com/pricing).

## Lire les retours sur l’application

Dans Supabase, ouvrir **Table Editor → public → feedback**. Chaque ligne contient le type (`suggestion`, `problem`, `general`), le message, l’e-mail facultatif, la page concernée et la date. Le champ `status` peut être modifié dans le tableau : `new`, `in_progress`, `done`. Les retours ne sont jamais affichés sur le site et les visiteurs n’ont aucun accès à cette table.

Installation initiale : exécuter [supabase/feedback.sql](supabase/feedback.sql) dans **SQL Editor**, avec les connexions anonymes activées comme pour les votes. La session anonyme est créée au premier vote ou au premier retour. La fonction `submit_feedback` valide les champs et limite les envois à un par minute et cinq par jour pour une identité de navigateur. Effacer les données du navigateur peut créer une nouvelle identité : ce mécanisme limite les répétitions, sans garantir une identification par personne.

Un déploiement conserve les retours, comme les votes. Aucun e-mail automatique n’est envoyé. Le message d’échec laisse le brouillon dans le formulaire ouvert pour permettre un nouvel essai.

## Pages des outils

### Comparer les outils

Le bouton **Comparer** des cartes et des fiches permet de sélectionner 2 à 3 outils. La barre en bas ouvre un tableau avec usages, public, prix, notes et nombre de votes, avantages, limites et sources. Depuis ce tableau, on peut ajouter, remplacer ou retirer un outil et gérer ses favoris. Les critères et en-têtes restent fixes dans la zone de défilement, également sur smartphone et en mode sombre.

Le lien **Partager la comparaison** encode la sélection et son ordre, par exemple `#/comparer?outils=chatgpt,claude`. Il fonctionne directement sur GitHub Pages et sur un autre appareil. La dernière sélection est conservée dans ce navigateur ; un lien partagé prend priorité sur elle. Aucune nouvelle table ni configuration Supabase n’est nécessaire. Les informations proviennent des fiches existantes et les notes de la moyenne publique.

Les adresses utilisent `#/outil/identifiant`, par exemple [la fiche de Claude](https://dani75i.github.io/BestIaApp/#/outil/claude). Elles se partagent et se rechargent directement sur GitHub Pages. Le catalogue est dans `src/data/tools.js` et le contenu éditorial des fiches dans `src/data/toolDetails.js`. Lors d’un ajout, compléter les deux fichiers et la table `rating_tools`.

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
