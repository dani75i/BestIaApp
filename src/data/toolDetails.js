// Les exemples et les conseils sont éditoriaux ; les offres sont documentées dans tools.js.
// Les sources officielles ont été consultées le 17 septembre 2026.
export const detailsCheckedAt = "2026-09-17";
// audience, deux usages, deux atouts, deux limites, exemple à adapter.
const entries = {
  chatgpt: [
    "Curieux, étudiants et professionnels qui cherchent un assistant polyvalent.",
    ["Préparer un plan de travail", "Reformuler un courrier"],
    [
      "Plusieurs usages dans une même conversation",
      "Les demandes peuvent être affinées progressivement",
    ],
    [
      "Les réponses factuelles demandent une vérification",
      "Les fonctions avancées ont des limites selon le forfait",
    ],
    "Explique-moi ce sujet comme à un débutant, avec un exemple concret puis trois questions pour vérifier ma compréhension.",
  ],
  claude: [
    "Personnes qui travaillent sur des textes, des documents ou du code.",
    ["Synthétiser un document", "Améliorer une première version de texte"],
    [
      "Travail sur des fichiers et des textes dans le même échange",
      "Possibilité de préciser le ton et la structure",
    ],
    [
      "Un résumé peut omettre une nuance du document",
      "Le volume de travail dépend des limites du forfait",
    ],
    "Relis ce texte. Propose une version plus claire, puis explique les trois changements les plus utiles.",
  ],
  gemini: [
    "Utilisateurs qui veulent un assistant pour explorer une idée ou préparer du contenu.",
    ["Préparer une liste de questions", "Comparer des pistes de projet"],
    [
      "Assistant conversationnel polyvalent",
      "Différentes capacités créatives selon l’offre",
    ],
    [
      "Certaines fonctions dépendent du pays et du forfait",
      "Vérifier les faits avant de reprendre une réponse",
    ],
    "Aide-moi à préparer un atelier de découverte de l’IA de 30 minutes. Propose un déroulé accessible et deux activités.",
  ],
  perplexity: [
    "Personnes qui cherchent un point de départ documenté pour leurs recherches.",
    [
      "Explorer un sujet d’actualité",
      "Retrouver les sources d’une explication",
    ],
    [
      "Réponses accompagnées de liens vers des sources",
      "Questions de suivi pour approfondir une recherche",
    ],
    [
      "Une citation ne garantit pas que la conclusion est correcte",
      "Les recherches avancées dépendent de l’offre",
    ],
    "Présente les principales solutions de stockage d’énergie. Sépare les technologies disponibles des pistes expérimentales et cite tes sources.",
  ],
  "mistral-vibe": [
    "Personnes qui souhaitent découvrir l’assistant de Mistral, anciennement Le Chat.",
    ["Organiser des idées", "Préparer un brouillon"],
    [
      "Échanges en langage naturel",
      "Un point d’entrée dans les outils de Mistral",
    ],
    [
      "L’offre et le nom du produit ont évolué",
      "Relire les productions avant de les utiliser",
    ],
    "Transforme ces notes en un compte rendu clair : décisions, questions ouvertes et prochaines actions.",
  ],
  "github-copilot": [
    "Développeurs qui souhaitent une aide directement dans leur éditeur.",
    ["Comprendre une fonction", "Proposer des tests pour du code"],
    [
      "Intégration dans les éditeurs de développement",
      "Suggestions de code et assistance conversationnelle",
    ],
    [
      "Nécessite de savoir relire et tester le code",
      "Les fonctions et quotas varient selon le plan",
    ],
    "Explique cette fonction, identifie les cas limites et propose des tests qui vérifieraient son comportement.",
  ],
  cursor: [
    "Développeurs prêts à travailler dans un éditeur orienté IA.",
    [
      "Explorer un projet existant",
      "Préparer une modification sur plusieurs fichiers",
    ],
    [
      "L’assistant s’utilise au plus près du projet",
      "Édition et conversation réunies",
    ],
    [
      "Prise en main d’un nouvel éditeur",
      "Les changements proposés doivent être contrôlés",
    ],
    "Repère où ce projet traite les erreurs réseau. Propose une modification minimale et explique comment la vérifier.",
  ],
  bolt: [
    "Créateurs qui souhaitent matérialiser une idée d’application web.",
    ["Prototyper une page de réservation", "Tester une interface"],
    [
      "Création à partir d’une description",
      "Environnement de travail accessible dans le navigateur",
    ],
    [
      "Les itérations consomment les ressources du forfait",
      "Un prototype nécessite des vérifications avant publication",
    ],
    "Crée une interface de réservation de cours de cuisine, en français, avec une liste de cours et un formulaire accessible sur mobile.",
  ],
  lovable: [
    "Entrepreneurs et créateurs qui veulent une première version visuelle d’une application.",
    [
      "Construire un prototype de service",
      "Faire évoluer une interface par conversation",
    ],
    [
      "Description du projet en langage naturel",
      "Démarrage rapide pour tester une idée",
    ],
    [
      "Les demandes successives utilisent des crédits",
      "Vérifier les accès aux données avant de publier",
    ],
    "Imagine un tableau de bord simple pour une association : événements à venir, inscriptions et vue adaptée au smartphone.",
  ],
  jasper: [
    "Équipes et indépendants qui produisent des contenus marketing.",
    ["Décliner un message de campagne", "Préparer des textes pour une marque"],
    [
      "Fonctions orientées marketing",
      "Travail sur la cohérence du ton de marque",
    ],
    [
      "Abonnement à prévoir au-delà de l’essai",
      "Les promesses commerciales doivent être vérifiées",
    ],
    "Propose trois accroches pour notre atelier de réparation de vélos. Ton chaleureux, aucune promesse chiffrée inventée, 20 mots maximum.",
  ],
  deepseek: [
    "Personnes souhaitant essayer un assistant de conversation et de raisonnement.",
    ["Décomposer un problème", "Expliquer un extrait de code"],
    [
      "Accès à un assistant de discussion",
      "Application mobile annoncée par l’éditeur",
    ],
    [
      "Ne pas confondre l’application et l’API payante",
      "Un raisonnement détaillé peut malgré tout contenir une erreur",
    ],
    "Aide-moi à comprendre ce problème étape par étape. Indique les hypothèses et vérifie le résultat avec un exemple simple.",
  ],
  grammarly: [
    "Personnes qui souhaitent relire et améliorer leurs écrits, notamment en anglais.",
    ["Corriger un e-mail", "Ajuster le ton d’un message"],
    [
      "Suggestions de correction dans le travail d’écriture",
      "Aide à la reformulation et au ton",
    ],
    [
      "Les capacités dépendent de la langue et du forfait",
      "Les suggestions ne remplacent pas votre intention",
    ],
    "Collez un brouillon d’e-mail, examinez les corrections puis comparez une version neutre et une version plus chaleureuse.",
  ],
  "notion-ai": [
    "Utilisateurs de Notion qui veulent travailler avec leurs notes et documents.",
    [
      "Résumer des notes de réunion",
      "Retrouver une information dans un espace de travail",
    ],
    [
      "IA intégrée aux documents Notion",
      "Fonctions liées à l’organisation du travail",
    ],
    [
      "L’IA n’est qu’en essai sur les plans Free et Plus",
      "L’intérêt dépend des informations présentes dans votre espace",
    ],
    "À partir de ces notes, rédige un compte rendu avec les décisions, les responsables et les échéances explicitement mentionnées.",
  ],
  midjourney: [
    "Créatifs qui explorent des directions artistiques et des illustrations.",
    ["Préparer un univers visuel", "Explorer des variantes d’une affiche"],
    [
      "Génération d’images guidée par une description",
      "Exploration de styles et de compositions",
    ],
    [
      "Un abonnement est nécessaire pour l’usage courant",
      "La confidentialité des créations dépend du plan",
    ],
    "Une petite librairie au bord de la mer, illustration à la gouache, palette bleu et ocre, lumière du matin, sans texte.",
  ],
  "adobe-firefly": [
    "Créateurs qui veulent générer des visuels et utiliser les outils créatifs Adobe.",
    ["Explorer un décor", "Produire des variations visuelles"],
    [
      "Plusieurs fonctions de génération créative",
      "Offres liées à l’écosystème Adobe",
    ],
    [
      "Les crédits et modèles disponibles varient selon le plan",
      "Un rendu final peut demander une retouche",
    ],
    "Un jardin méditerranéen vu à travers une fenêtre, lumière douce, photographie d’architecture, aucun personnage.",
  ],
  leonardo: [
    "Créateurs de visuels qui veulent expérimenter avec plusieurs réglages.",
    [
      "Décliner un concept de personnage",
      "Construire une ambiance pour un projet",
    ],
    [
      "Génération et références visuelles dans un même outil",
      "Crédits gratuits pour commencer",
    ],
    [
      "Les créations privées demandent un forfait adapté",
      "La quantité de générations dépend des jetons disponibles",
    ],
    "Un petit robot jardinier, silhouette simple et sympathique, trois couleurs, vue de face sur fond uni.",
  ],
  ideogram: [
    "Personnes qui veulent explorer des images et des compositions avec du texte.",
    ["Ébaucher une affiche", "Tester un slogan dans un visuel"],
    [
      "Outils de génération d’images",
      "Fonctions créatives accessibles depuis le navigateur",
    ],
    [
      "Les crédits gratuits dépendent de l’éligibilité du compte",
      "Toujours relire le texte présent dans une image",
    ],
    "Affiche minimaliste pour une fête de quartier, texte exact : « Ensemble au jardin », couleurs vert et crème, composition aérée.",
  ],
  canva: [
    "Débutants et équipes qui veulent assembler facilement des supports visuels.",
    [
      "Créer une publication pour les réseaux",
      "Mettre en forme une présentation",
    ],
    [
      "Modèles et éditeur visuel réunis",
      "Fonctions IA au sein d’un outil de mise en page",
    ],
    [
      "Certains contenus et fonctions sont payants",
      "Les résultats demandent une personnalisation pour se distinguer",
    ],
    "Prépare une affiche pour une collecte de livres : titre lisible, date à compléter, lieu à compléter et une illustration simple.",
  ],
  runway: [
    "Créateurs qui souhaitent expérimenter avec la vidéo générative.",
    ["Animer un concept visuel", "Explorer un mouvement de caméra"],
    [
      "Plusieurs modèles de génération créative",
      "Outils pour développer un projet vidéo",
    ],
    [
      "Les crédits gratuits sont une allocation unique",
      "Durée, résolution et modèle influencent le coût en crédits",
    ],
    "Un lent travelling dans une serre au lever du soleil, feuilles légèrement animées par le vent, mouvement stable et naturel.",
  ],
  pika: [
    "Créateurs de clips courts et d’effets visuels pour leurs contenus.",
    ["Animer une image", "Tester un effet visuel ludique"],
    [
      "Outils dédiés aux transformations et animations",
      "Plusieurs formats de création vidéo",
    ],
    [
      "Les fonctions disponibles dépendent du plan",
      "Prévoir plusieurs essais pour un mouvement précis",
    ],
    "Anime cette tasse : une vapeur légère monte, la caméra reste fixe, la lumière est chaleureuse, aucun autre objet ne bouge.",
  ],
  synthesia: [
    "Équipes qui préparent des vidéos explicatives avec un présentateur virtuel.",
    ["Présenter une procédure", "Créer un module de formation"],
    [
      "Production à partir d’un script et d’avatars",
      "Adapté aux messages structurés",
    ],
    [
      "Le temps de vidéo est limité par le forfait",
      "Le jeu d’un avatar diffère de celui d’un intervenant filmé",
    ],
    "Bonjour ! Dans cette courte vidéo, découvrons les trois étapes pour vous inscrire à notre prochain atelier.",
  ],
  heygen: [
    "Créateurs et équipes qui souhaitent présenter ou adapter un message en vidéo.",
    [
      "Faire parler un avatar",
      "Préparer plusieurs versions d’une présentation",
    ],
    [
      "Avatars et outils de localisation vidéo",
      "Offre gratuite limitée pour commencer",
    ],
    [
      "Les langues et fonctions dépendent du plan",
      "Vérifier la prononciation des noms et termes spécialisés",
    ],
    "Bienvenue dans notre association. Voici comment découvrir nos activités, choisir un atelier et contacter notre équipe.",
  ],
  descript: [
    "Créateurs de podcasts et de vidéos qui travaillent beaucoup avec la parole.",
    [
      "Monter une interview par son texte",
      "Préparer des extraits d’un enregistrement",
    ],
    [
      "Montage fondé sur la transcription",
      "Outils audio et vidéo dans le même espace",
    ],
    [
      "Le temps de média et les crédits IA sont plafonnés",
      "Corriger la transcription avant un montage précis",
    ],
    "Importez une courte interview, corrigez les noms propres dans la transcription puis supprimez un passage en modifiant le texte.",
  ],
  suno: [
    "Curieux et créateurs qui souhaitent essayer la génération de chansons.",
    ["Mettre des paroles en musique", "Explorer une ambiance musicale"],
    [
      "Création guidée par un style ou une idée",
      "Possibilité d’explorer des chansons avec voix",
    ],
    [
      "Les usages autorisés diffèrent entre offre gratuite et payante",
      "Une génération peut s’éloigner de la structure souhaitée",
    ],
    "Chanson pop acoustique lumineuse, paroles en français sur un départ en vacances, guitare douce et refrain facile à retenir.",
  ],
  udio: [
    "Personnes qui veulent expérimenter avec la création musicale assistée.",
    ["Explorer une mélodie", "Tester plusieurs directions sonores"],
    [
      "Génération de musique à partir d’indications",
      "Crédits pour expérimenter avec différentes versions",
    ],
    [
      "Les possibilités de téléchargement ont évolué : vérifier l’aide avant de choisir",
      "Les limites de crédits encadrent le nombre d’essais",
    ],
    "Une ambiance instrumentale calme pour une promenade nocturne, piano feutré, basse discrète et tempo lent.",
  ],
  aiva: [
    "Créateurs qui cherchent à composer une bande-son instrumentale.",
    [
      "Préparer une musique d’ambiance",
      "Explorer une composition pour un projet",
    ],
    [
      "Assistant spécialisé dans la composition musicale",
      "Plusieurs offres selon les usages et exports",
    ],
    [
      "La formule gratuite impose des conditions d’attribution et d’usage",
      "Les formats et droits accordés dépendent de l’abonnement",
    ],
    "Choisissez une ambiance contemplative, une instrumentation légère et une durée courte pour accompagner une séquence de paysages.",
  ],
  soundraw: [
    "Créateurs de contenus qui recherchent une musique adaptée à leur montage.",
    ["Créer une ambiance pour une vidéo", "Ajuster une musique à un format"],
    [
      "Génération de musique avec des paramètres créatifs",
      "Offres adaptées à plusieurs usages de contenus",
    ],
    [
      "Les téléchargements et usages dépendent de la formule",
      "Vérifier les conditions pour une diffusion musicale autonome",
    ],
    "Sélectionnez une ambiance joyeuse, un tempo modéré et une instrumentation acoustique pour accompagner un tutoriel de cuisine.",
  ],
  gamma: [
    "Personnes qui veulent structurer rapidement une présentation visuelle.",
    ["Transformer un plan en diapositives", "Préparer un support à partager"],
    [
      "Génération de présentations à partir d’une idée",
      "Mise en page structurée en cartes",
    ],
    [
      "Crédits et options d’export selon le plan",
      "Relire les faits et adapter la densité de chaque carte",
    ],
    "Prépare une présentation de six cartes sur notre jardin partagé : objectif, public, activités, calendrier, besoins et prochaine étape.",
  ],
  "beautiful-ai": [
    "Professionnels qui souhaitent des diapositives visuellement cohérentes.",
    ["Présenter un projet", "Mettre en forme un bilan"],
    [
      "Mise en page guidée par des modèles intelligents",
      "Outils orientés présentations professionnelles",
    ],
    [
      "Usage payant après la période d’essai",
      "Les modèles peuvent contraindre une mise en page très personnalisée",
    ],
    "Construis un plan de présentation pour un projet de café associatif : besoin, concept, public, fonctionnement et étapes de lancement.",
  ],
  "presentations-ai": [
    "Personnes qui souhaitent une première version de présentation à personnaliser.",
    ["Transformer une idée en support", "Préparer une présentation d’équipe"],
    [
      "Création de diapositives assistée par IA",
      "Une offre de démarrage pour essayer",
    ],
    [
      "Les crédits de départ sont limités",
      "Vérifier les options d’export du forfait avant de préparer le document final",
    ],
    "Crée une présentation simple sur un club de lecture : à qui il s’adresse, comment se déroule une séance et comment participer.",
  ],
};
export const toolDetails = Object.fromEntries(
  Object.entries(entries).map(([id, [audience, uses, pros, cons, example]]) => [
    id,
    { audience, uses, pros, cons, example },
  ]),
);
