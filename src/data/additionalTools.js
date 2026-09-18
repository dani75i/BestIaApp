// Sélection complémentaire, sources officielles consultées le 18/09/2026.
export const additionalTools = [
  {
    id: "deepl",
    name: "DeepL",
    tagline: "Traduisez sans perdre le sens",
    description:
      "Traduisez un texte ou un document et comparez les formulations proposées. Utile pour comprendre un message ou préparer une version dans une autre langue.",
    categoryIds: ["traduction", "texte"],
    pricing: "freemium",
    pricingNote:
      "Traduction gratuite avec des limites de volume et de documents ; abonnements pour des capacités supplémentaires.",
    url: "https://www.deepl.com/fr/translator",
    sourceUrl: "https://www.deepl.com/fr/pro",
    color: "#17456b",
    tags: ["Traduction", "Documents", "Langues"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    tagline: "Donnez une voix à vos textes",
    description:
      "Transformez un texte en voix de synthèse, notamment en français. Une solution pour préparer une narration, un tutoriel ou une piste audio à partir d’un script.",
    categoryIds: ["voix", "musique"],
    pricing: "freemium",
    pricingNote:
      "Forfait gratuit à crédits limités ; la licence commerciale et des volumes supérieurs dépendent d’une offre payante.",
    url: "https://elevenlabs.io/fr",
    sourceUrl: "https://elevenlabs.io/pricing",
    color: "#373737",
    tags: ["Voix", "Narration", "Synthèse vocale"],
  },
  {
    id: "fireflies",
    name: "Fireflies.ai",
    tagline: "Retrouvez l’essentiel de vos réunions",
    description:
      "Enregistrez et transcrivez des réunions, puis retrouvez les informations dans leur contenu. Les résumés aident à préparer le suivi des échanges.",
    categoryIds: ["reunions", "texte"],
    pricing: "freemium",
    pricingNote:
      "Plan gratuit avec 400 minutes de stockage par équipe et résumés IA limités ; téléchargements et fonctions avancées selon le plan.",
    url: "https://fireflies.ai/",
    sourceUrl: "https://fireflies.ai/pricing",
    color: "#7854dc",
    tags: ["Transcription", "Réunions", "Comptes rendus"],
  },
  {
    id: "fathom",
    name: "Fathom",
    tagline: "Vos échanges deviennent des notes utiles",
    description:
      "Un assistant de réunion pour enregistrer, transcrire et résumer les conversations. Il aide à retrouver les décisions et à partager les points importants.",
    categoryIds: ["reunions", "texte"],
    pricing: "freemium",
    pricingNote:
      "Offre individuelle gratuite ; certaines fonctions IA et de collaboration nécessitent un abonnement.",
    url: "https://www.fathom.ai/",
    sourceUrl: "https://www.fathom.ai/pricing",
    color: "#346bc0",
    tags: ["Réunions", "Transcription", "Décisions"],
  },
  {
    id: "notebooklm",
    name: "Gemini Notebook (NotebookLM)",
    tagline: "Explorez vos documents avec leurs sources",
    description:
      "Ajoutez vos sources pour poser des questions, préparer une synthèse et explorer leurs liens. Le service connu sous le nom NotebookLM est désormais présenté comme Gemini Notebook.",
    categoryIds: ["documents", "assistants"],
    pricing: "freemium",
    pricingNote:
      "Accès gratuit avec des limites d’usage selon la complexité des tâches ; capacités supplémentaires selon l’offre Google.",
    url: "https://notebook.google/",
    sourceUrl: "https://support.google.com/gemininotebook/",
    color: "#4257a8",
    tags: ["NotebookLM", "PDF", "Recherche", "Sources"],
  },
  {
    id: "photoroom",
    name: "Photoroom",
    tagline: "Des photos prêtes à être présentées",
    description:
      "Détourez et retouchez des images pour préparer des photos de produits ou des visuels. Les outils avancés permettent de composer de nouveaux décors.",
    categoryIds: ["image"],
    pricing: "freemium",
    pricingNote:
      "Formule gratuite limitée ; les exports, crédits IA et fonctions avancées dépendent de l’abonnement.",
    url: "https://www.photoroom.com/fr",
    sourceUrl: "https://www.photoroom.com/fr/pricing",
    color: "#7657d5",
    tags: ["Retouche photo", "Produits", "Arrière-plan"],
  },
  {
    id: "remove-bg",
    name: "remove.bg",
    tagline: "Retirez le fond d’une photo",
    description:
      "Isolez automatiquement le sujet d’une image et récupérez un fond transparent. Une tâche ciblée pour préparer un portrait, une annonce ou un montage.",
    categoryIds: ["image"],
    pricing: "freemium",
    pricingNote:
      "Aperçu gratuit ; les exports haute résolution et les traitements à grande échelle sont soumis aux conditions du forfait.",
    url: "https://www.remove.bg/fr",
    sourceUrl: "https://www.remove.bg/pricing",
    color: "#bb9025",
    tags: ["Détourage", "Photo", "Fond transparent"],
  },
  {
    id: "adobe-podcast",
    name: "Adobe Podcast",
    tagline: "Une parole plus claire à l’écoute",
    description:
      "Améliorez la qualité d’un enregistrement vocal avec Enhance Speech. Le service propose aussi des outils d’enregistrement et de montage audio dans le navigateur.",
    categoryIds: ["voix", "musique"],
    pricing: "freemium",
    pricingNote:
      "Enhance Speech gratuit : audio jusqu’à 30 minutes et 500 Mo par fichier, une heure par jour. Offre payante pour davantage de capacités.",
    url: "https://podcast.adobe.com/",
    sourceUrl: "https://podcast.adobe.com/en/plans",
    color: "#b746dd",
    tags: ["Nettoyage audio", "Podcasts", "Voix"],
  },
  {
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    tagline: "Un assistant pour vos questions du quotidien",
    description:
      "Posez vos questions, explorez une idée et préparez un texte par conversation. L’assistant grand public est distinct de GitHub Copilot, consacré au développement.",
    categoryIds: ["assistants", "texte"],
    pricing: "freemium",
    pricingNote:
      "Assistant grand public accessible gratuitement ; options supplémentaires et intégrations Microsoft 365 selon l’abonnement.",
    url: "https://copilot.microsoft.com/",
    sourceUrl: "https://www.microsoft.com/fr-fr/microsoft-365-copilot/personal",
    color: "#3f86ad",
    tags: ["Microsoft", "Recherche", "Conversation"],
  },
  {
    id: "quillbot",
    name: "QuillBot",
    tagline: "Trouvez une autre façon de le dire",
    description:
      "Reformulez un texte en français pour améliorer sa fluidité ou varier les formulations. Comparez la proposition à l’original pour conserver votre intention.",
    categoryIds: ["texte", "traduction"],
    pricing: "freemium",
    pricingNote:
      "Reformulation de base gratuite et sans inscription ; davantage de modes et de capacités avec Premium.",
    url: "https://quillbot.com/fr/reformuler-un-texte",
    sourceUrl: "https://quillbot.com/fr/reformuler-un-texte",
    color: "#378665",
    tags: ["Reformulation", "Correction", "Français"],
  },
].map((tool) => ({ ...tool, checkedAt: "2026-09-18" }));

const details = {
  deepl: [
    "Personnes qui lisent ou rédigent dans plusieurs langues.",
    ["Comprendre un courrier étranger", "Traduire un document de travail"],
    ["Alternatives de formulation", "Texte et documents dans le même service"],
    ["Relire les termes spécialisés", "Les documents gratuits ont des limites"],
    "Traduisez en français : The meeting has been moved to Friday morning. Puis comparez les formulations proposées.",
  ],
  elevenlabs: [
    "Créateurs de tutoriels, narrations et contenus audio.",
    ["Créer une voix off", "Écouter un script avant publication"],
    ["Voix françaises proposées", "Réglages et choix de voix"],
    [
      "Les crédits limitent la durée générée",
      "Relire le script et écouter les noms propres",
    ],
    "Bienvenue dans notre atelier. Aujourd’hui, nous allons apprendre à rempoter une plante en trois étapes simples.",
  ],
  fireflies: [
    "Équipes qui veulent retrouver les informations de leurs réunions.",
    ["Transcrire un échange", "Préparer un compte rendu"],
    ["Recherche dans les réunions", "Transcription en français"],
    [
      "Stockage et résumés limités en gratuit",
      "Informer les participants avant d’enregistrer",
    ],
    "Après une réunion autorisée, retrouvez les décisions et vérifiez chaque échéance dans la transcription.",
  ],
  fathom: [
    "Personnes qui veulent se concentrer sur leurs échanges en visioconférence.",
    ["Retrouver une décision", "Partager un résumé de réunion"],
    [
      "Enregistrement et notes réunis",
      "Français pris en charge pour les réunions",
    ],
    [
      "Vérifier les intégrations compatibles",
      "Un résumé peut omettre une nuance importante",
    ],
    "Enregistrez une réunion avec l’accord des participants, puis vérifiez les actions proposées dans le compte rendu.",
  ],
  notebooklm: [
    "Étudiants et professionnels qui travaillent à partir d’un ensemble de sources.",
    ["Comparer plusieurs documents", "Préparer une fiche de révision"],
    [
      "Réponses centrées sur les sources fournies",
      "Langue de sortie configurable",
    ],
    [
      "La qualité dépend des documents ajoutés",
      "Une citation doit être relue dans son contexte",
    ],
    "À partir de ces deux documents, liste les points d’accord et de désaccord. Associe chaque point à sa source.",
  ],
  photoroom: [
    "Vendeurs et créateurs qui préparent des photos à publier.",
    ["Détourer une photo de produit", "Harmoniser plusieurs visuels"],
    ["Outils centrés sur la photo produit", "Retouche et composition réunies"],
    [
      "Certaines générations consomment des crédits",
      "Vérifier les détails et proportions du produit",
    ],
    "Importez votre photo de produit, retirez le fond puis choisissez un décor neutre qui ne modifie pas son apparence.",
  ],
  "remove-bg": [
    "Personnes qui veulent détourer une image sans maîtriser un logiciel de retouche.",
    ["Isoler un objet", "Préparer un portrait sur fond transparent"],
    ["Une tâche simple et ciblée", "Détourage automatique"],
    [
      "Les contours fins peuvent demander une correction",
      "La haute résolution dépend de l’offre",
    ],
    "Importez une photo d’un objet sur fond chargé et vérifiez le contour avant d’utiliser l’image détourée.",
  ],
  "adobe-podcast": [
    "Créateurs qui souhaitent améliorer un enregistrement de parole.",
    ["Réduire un bruit de fond", "Préparer une piste de podcast"],
    [
      "Amélioration vocale accessible sur le web",
      "Essai gratuit avec limites publiées",
    ],
    [
      "Le traitement peut modifier le timbre",
      "Comparer au son original avant de publier",
    ],
    "Importez un court enregistrement de votre voix, lancez Enhance Speech puis écoutez alternativement l’original et la version traitée.",
  ],
  "microsoft-copilot": [
    "Curieux qui veulent une aide à la recherche et à la rédaction.",
    ["Préparer une liste d’idées", "Clarifier une explication"],
    [
      "Conversations en français",
      "Fonctions de base accessibles sans connexion",
    ],
    [
      "Les intégrations Office dépendent de l’offre",
      "Vérifier les informations factuelles",
    ],
    "Propose trois idées d’activités gratuites pour un après-midi pluvieux à la maison, avec du matériel courant.",
  ],
  quillbot: [
    "Personnes qui veulent améliorer un brouillon tout en conservant son sens.",
    ["Alléger une phrase", "Varier le vocabulaire"],
    [
      "Reformulation française sans inscription",
      "Comparaison avec le texte original",
    ],
    [
      "Tous les styles ne sont pas gratuits",
      "La reformulation peut déplacer une nuance",
    ],
    "Reformulez : Je vous contacte afin de savoir si vous avez eu le temps de consulter mon précédent message.",
  ],
};
export const additionalDetails = Object.fromEntries(
  Object.entries(details).map(([id, [audience, uses, pros, cons, example]]) => [
    id,
    { audience, uses, pros, cons, example, checkedAt: "2026-09-18" },
  ]),
);
