// Sélection éditoriale initiale : les offres évoluent, consulter la source officielle.
// « freemium » comprend un accès gratuit limité ; un simple essai reste « paid ».
// Les notes publiques sont gérées par Supabase, pas par ce catalogue.
export const categories = [
  {
    id: "assistants",
    label: "Assistants IA",
    description: "Apprendre, chercher et simplifier le quotidien.",
  },
  {
    id: "code",
    label: "Code & développement",
    description: "Créer un site, développer et comprendre du code.",
  },
  {
    id: "texte",
    label: "Écriture & texte",
    description: "Trouver les bons mots, rédiger et reformuler.",
  },
  {
    id: "image",
    label: "Images & design",
    description: "Donner une forme visuelle à toutes vos idées.",
  },
  {
    id: "video",
    label: "Vidéo",
    description: "Créer des vidéos, animer et monter vos contenus.",
  },
  {
    id: "musique",
    label: "Musique & audio",
    description: "Composer une chanson ou une ambiance sonore.",
  },
  {
    id: "presentations",
    label: "Présentations",
    description: "Transformer vos idées en diapositives.",
  },
];

// Copies locales des icônes des éditeurs : aucun appel tiers lors de l'affichage.
const logoExtensions = {
  chatgpt: "png",
  claude: "ico",
  gemini: "png",
  perplexity: "ico",
  "mistral-vibe": "ico",
  "github-copilot": "svg",
  cursor: "ico",
  bolt: "svg",
  lovable: "png",
  jasper: "png",
  deepseek: "png",
  grammarly: "png",
  "notion-ai": "ico",
  midjourney: "png",
  "adobe-firefly": "png",
  leonardo: "png",
  ideogram: "ico",
  canva: "ico",
  runway: "png",
  pika: "ico",
  synthesia: "png",
  heygen: "ico",
  descript: "svg",
  suno: "ico",
  udio: "ico",
  aiva: "ico",
  soundraw: "ico",
  gamma: "svg",
  "beautiful-ai": "ico",
  "presentations-ai": "png",
};

export const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    tagline: "Un coup de main pour chaque idée",
    description:
      "Un assistant polyvalent pour poser vos questions, écrire, analyser des documents ou créer des images. La conversation permet de préciser votre besoin au fil des réponses.",
    categoryIds: ["assistants", "texte", "code", "image"],
    pricing: "freemium",
    pricingNote:
      "Version gratuite avec des limites ; abonnements pour accéder à davantage de fonctions et de capacités.",
    url: "https://chatgpt.com/",
    color: "#109b78",
    tags: ["Polyvalent", "Rédaction", "Documents"],
    featured: true,
    sourceUrl: "https://chatgpt.com/pricing/",
  },
  {
    id: "claude",
    name: "Claude",
    tagline: "Réfléchir, écrire et aller plus loin",
    description:
      "Discutez avec un assistant pour préparer un texte, explorer une idée ou comprendre des fichiers. Claude aide aussi à écrire du code et à organiser vos projets.",
    categoryIds: ["assistants", "texte", "code"],
    pricing: "freemium",
    pricingNote:
      "Accès gratuit limité ; abonnements Pro et Max pour un usage plus soutenu.",
    url: "https://claude.ai/",
    color: "#cd7657",
    tags: ["Documents", "Rédaction", "Analyse"],
    featured: true,
    sourceUrl: "https://claude.com/pricing",
  },
  {
    id: "gemini",
    name: "Gemini",
    tagline: "L’assistant créatif de Google",
    description:
      "Un assistant pour chercher des idées, expliquer un sujet, rédiger et générer des images. Certaines fonctions se connectent aux services Google.",
    categoryIds: ["assistants", "texte", "image"],
    pricing: "freemium",
    pricingNote:
      "Accès gratuit avec des limites ; offres Google AI payantes pour des capacités supplémentaires.",
    url: "https://gemini.google.com/",
    color: "#527ceb",
    tags: ["Google", "Recherche", "Créativité"],
    sourceUrl: "https://gemini.google/subscriptions/",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    tagline: "Des réponses avec leurs sources",
    description:
      "Posez une question et obtenez une réponse accompagnée de liens vers les sources consultées. Utile pour découvrir un sujet et approfondir vos recherches.",
    categoryIds: ["assistants"],
    pricing: "freemium",
    pricingNote:
      "Recherche standard gratuite ; fonctions avancées et limites étendues avec les abonnements.",
    url: "https://www.perplexity.ai/",
    color: "#21808d",
    tags: ["Recherche web", "Sources", "Apprentissage"],
    featured: true,
    sourceUrl:
      "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you",
  },
  {
    id: "mistral-vibe",
    name: "Mistral Vibe",
    tagline: "L’assistant de Mistral AI",
    description:
      "Anciennement Le Chat, cet assistant aide à chercher des informations, créer des documents et travailler sur du code. Vous pouvez lui donner vos fichiers comme point de départ.",
    categoryIds: ["assistants", "texte", "code"],
    pricing: "freemium",
    pricingNote:
      "Offre gratuite pour les tâches courantes ; formules Pro et Team pour davantage de capacités.",
    url: "https://chat.mistral.ai/",
    color: "#ed8a23",
    tags: ["Mistral", "Le Chat", "Documents"],
    sourceUrl: "https://mistral.ai/products/vibe/",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    tagline: "Votre partenaire dans l’éditeur",
    description:
      "Un assistant intégré aux outils de développement pour proposer du code, répondre à vos questions et accompagner les modifications d’un projet.",
    categoryIds: ["code"],
    pricing: "freemium",
    pricingNote:
      "Formule Free avec des limites ; abonnements pour augmenter les capacités et les fonctions disponibles.",
    url: "https://github.com/features/copilot",
    color: "#333847",
    tags: ["VS Code", "Programmation", "GitHub"],
    sourceUrl: "https://github.com/features/copilot/plans",
  },
  {
    id: "cursor",
    name: "Cursor",
    tagline: "Un éditeur qui comprend votre code",
    description:
      "Un éditeur de code avec une IA pour explorer un projet, générer des fonctions et modifier plusieurs fichiers à partir de vos instructions.",
    categoryIds: ["code"],
    pricing: "freemium",
    pricingNote:
      "Offre Hobby gratuite avec des requêtes limitées ; abonnements pour un usage plus intensif.",
    url: "https://cursor.com/",
    color: "#313a47",
    tags: ["Éditeur", "Programmation", "Projets"],
    featured: true,
    sourceUrl: "https://cursor.com/pricing",
  },
  {
    id: "bolt",
    name: "Bolt",
    tagline: "De l’idée à votre première app",
    description:
      "Décrivez un site ou une application et construisez une première version dans votre navigateur. Vous pouvez ensuite ajuster le résultat en discutant avec l’IA.",
    categoryIds: ["code"],
    pricing: "freemium",
    pricingNote:
      "Plan gratuit avec un quota de génération ; abonnements et capacités supplémentaires disponibles.",
    url: "https://bolt.new/",
    color: "#428ee8",
    tags: ["Sites web", "Sans code", "Prototypage"],
    sourceUrl: "https://bolt.new/pricing",
  },
  {
    id: "lovable",
    name: "Lovable",
    tagline: "Créez une app en la décrivant",
    description:
      "Un outil de création de sites et d’applications web à partir d’instructions en langage courant. Il aide à concevoir l’interface et les fonctions de votre projet.",
    categoryIds: ["code"],
    pricing: "freemium",
    pricingNote:
      "Crédits gratuits limités ; abonnements pour construire et héberger des projets plus ambitieux.",
    url: "https://lovable.dev/",
    color: "#e87773",
    tags: ["Sans code", "Applications", "Sites web"],
    sourceUrl: "https://lovable.dev/pricing",
  },
  {
    id: "jasper",
    name: "Jasper",
    tagline: "Des contenus à l’image de votre marque",
    description:
      "Un assistant de rédaction destiné aux contenus marketing : articles, campagnes et publications. Il permet de guider la rédaction avec le ton de votre marque.",
    categoryIds: ["texte"],
    pricing: "paid",
    pricingNote:
      "Abonnement payant ; essai gratuit proposé selon l’offre en cours.",
    url: "https://www.jasper.ai/",
    color: "#9164ec",
    tags: ["Marketing", "Articles", "Réseaux sociaux"],
    sourceUrl: "https://www.jasper.ai/pricing",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    tagline: "Un assistant gratuit pour vos questions",
    description:
      "Un assistant conversationnel pour comprendre un sujet, rédiger et travailler sur du code. Vous pouvez échanger avec lui depuis le web ou l’application mobile.",
    categoryIds: ["assistants", "texte", "code"],
    pricing: "free",
    pricingNote:
      "Application de chat gratuite. L’API destinée aux développeurs est un service distinct, facturé à l’usage.",
    url: "https://chat.deepseek.com/",
    color: "#4d76e8",
    tags: ["Gratuit", "Raisonnement", "Rédaction"],
    sourceUrl: "https://api-docs.deepseek.com/news/news250115/",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    tagline: "Des textes plus clairs au quotidien",
    description:
      "Un assistant de rédaction qui corrige les erreurs et suggère des reformulations. Il aide notamment à améliorer le ton et la clarté de vos textes en anglais.",
    categoryIds: ["texte"],
    pricing: "freemium",
    pricingNote:
      "Corrections de base et génération limitée gratuites ; fonctions avancées avec Pro.",
    url: "https://www.grammarly.com/",
    color: "#158769",
    tags: ["Correction", "Reformulation", "Anglais"],
    sourceUrl: "https://www.grammarly.com/plans",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    tagline: "Vos notes deviennent un point de départ",
    description:
      "L’IA intégrée à Notion aide à rédiger, résumer des documents et retrouver des informations dans votre espace de travail.",
    categoryIds: ["texte", "assistants"],
    pricing: "paid",
    pricingNote:
      "Essai IA limité dans les offres Free et Plus ; accès étendu avec les formules Business et Enterprise.",
    url: "https://www.notion.com/product/ai",
    color: "#444852",
    tags: ["Notes", "Organisation", "Résumés"],
    sourceUrl: "https://www.notion.com/pricing",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "Donnez vie à votre imagination",
    description:
      "Créez des images à partir d’une description et explorez différents styles visuels. Un outil pour imaginer des illustrations, des ambiances et des concepts.",
    categoryIds: ["image", "video"],
    pricing: "paid",
    pricingNote:
      "Abonnements mensuels ou annuels ; capacités de génération selon la formule choisie.",
    url: "https://www.midjourney.com/",
    color: "#547797",
    tags: ["Illustration", "Créativité", "Art"],
    featured: true,
    sourceUrl:
      "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    tagline: "Votre studio de création visuelle",
    description:
      "Générez et transformez des images à partir de vos idées. Firefly propose aussi des fonctions de création vidéo et audio selon les modèles et les offres.",
    categoryIds: ["image", "video"],
    pricing: "freemium",
    pricingNote:
      "Générations gratuites limitées ; abonnements et crédits pour les fonctions supplémentaires.",
    url: "https://firefly.adobe.com/",
    color: "#ef716f",
    tags: ["Adobe", "Retouche", "Création visuelle"],
    sourceUrl: "https://www.adobe.com/products/firefly/plans.html",
  },
  {
    id: "leonardo",
    name: "Leonardo.Ai",
    tagline: "Explorez toutes vos pistes visuelles",
    description:
      "Un atelier pour générer des images, partir de références et explorer des variations. Il propose également des outils de retouche et de génération vidéo.",
    categoryIds: ["image", "video"],
    pricing: "freemium",
    pricingNote:
      "Quota gratuit renouvelé chaque jour ; abonnements avec davantage de crédits et de fonctions.",
    url: "https://leonardo.ai/",
    color: "#976be2",
    tags: ["Illustration", "Design", "Retouche"],
    sourceUrl: "https://leonardo.ai/pricing",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    tagline: "Des visuels où les mots comptent",
    description:
      "Créez des images et des compositions graphiques à partir d’une description. Ses outils sont adaptés aux idées d’affiches, de lettrages et de visuels pour les réseaux sociaux.",
    categoryIds: ["image"],
    pricing: "freemium",
    pricingNote:
      "Crédits gratuits pour les comptes éligibles ; abonnements pour plus de générations et de fonctions.",
    url: "https://ideogram.ai/",
    color: "#de7b50",
    tags: ["Affiches", "Typographie", "Design"],
    sourceUrl: "https://ideogram.ai/pricing/",
  },
  {
    id: "canva",
    name: "Canva AI",
    tagline: "Créez sans partir d’une page blanche",
    description:
      "Les outils IA de Canva aident à créer des images, des textes et des designs. Personnalisez ensuite vos visuels ou vos présentations dans un éditeur accessible.",
    categoryIds: ["image", "presentations", "texte"],
    pricing: "freemium",
    pricingNote:
      "Offre gratuite avec un accès IA limité ; capacités et fonctions supplémentaires dans les offres payantes.",
    url: "https://www.canva.com/",
    color: "#27a6be",
    tags: ["Design", "Réseaux sociaux", "Diapositives"],
    featured: true,
    sourceUrl: "https://www.canva.com/pricing/",
  },
  {
    id: "runway",
    name: "Runway",
    tagline: "Vos idées prennent du mouvement",
    description:
      "Créez des séquences vidéo avec des modèles génératifs et explorez des outils de transformation visuelle. Une image ou une description peut servir de point de départ.",
    categoryIds: ["video", "image"],
    pricing: "freemium",
    pricingNote:
      "Crédits de découverte offerts une seule fois ; abonnements pour poursuivre la génération.",
    url: "https://runway.com/",
    color: "#75815a",
    tags: ["Génération vidéo", "Animation", "Créativité"],
    featured: true,
    sourceUrl: "https://runway.com/pricing",
  },
  {
    id: "pika",
    name: "Pika",
    tagline: "Animez vos images et vos idées",
    description:
      "Transformez une image ou un texte en courte vidéo et ajoutez des effets créatifs. Un outil pour expérimenter avec le mouvement et les transformations visuelles.",
    categoryIds: ["video"],
    pricing: "paid",
    pricingNote:
      "Compte Free sans crédits mensuels inclus ; achat de packs ou abonnement pour générer des contenus.",
    url: "https://pika.art/",
    color: "#9470cc",
    tags: ["Animation", "Effets vidéo", "Réseaux sociaux"],
    sourceUrl: "https://pika.art/pricing",
  },
  {
    id: "synthesia",
    name: "Synthesia",
    tagline: "Un présentateur pour votre message",
    description:
      "Créez des vidéos avec des avatars et des voix à partir d’un script. Pratique pour une explication, une formation ou une présentation dans plusieurs langues.",
    categoryIds: ["video"],
    pricing: "freemium",
    pricingNote:
      "Plan Basic gratuit limité ; téléchargement des vidéos et fonctions avancées dans les offres payantes.",
    url: "https://www.synthesia.io/",
    color: "#6675cf",
    tags: ["Avatars", "Formation", "Multilingue"],
    sourceUrl: "https://www.synthesia.io/pricing",
  },
  {
    id: "heygen",
    name: "HeyGen",
    tagline: "Votre script devient une vidéo",
    description:
      "Produisez des vidéos avec des avatars ou adaptez un contenu vidéo à plusieurs langues. L’outil accompagne la création à partir d’un texte.",
    categoryIds: ["video"],
    pricing: "freemium",
    pricingNote:
      "Nombre limité de vidéos gratuites ; abonnements pour les fonctions et capacités supplémentaires.",
    url: "https://www.heygen.com/",
    color: "#9270e7",
    tags: ["Avatars", "Traduction vidéo", "Scripts"],
    sourceUrl: "https://www.heygen.com/pricing",
  },
  {
    id: "descript",
    name: "Descript",
    tagline: "Montez une vidéo comme un texte",
    description:
      "Éditez une vidéo ou un podcast à partir de sa transcription. Les fonctions IA aident au montage, à la création de contenus et à l’amélioration audio.",
    categoryIds: ["video"],
    pricing: "freemium",
    pricingNote:
      "Offre gratuite pour découvrir le montage et les outils IA ; abonnements avec des quotas supérieurs.",
    url: "https://www.descript.com/",
    color: "#4169dd",
    tags: ["Montage", "Podcasts", "Transcription"],
    sourceUrl: "https://www.descript.com/pricing",
  },
  {
    id: "suno",
    name: "Suno",
    tagline: "Une idée, une chanson",
    description:
      "Décrivez un style, une ambiance ou des paroles pour créer une chanson avec voix et instruments. Vous pouvez ensuite explorer des variations de votre idée.",
    categoryIds: ["musique"],
    pricing: "freemium",
    pricingNote:
      "Création gratuite limitée sans téléchargement de chansons ni droits commerciaux ; abonnements pour aller plus loin.",
    url: "https://suno.com/",
    color: "#dc7d53",
    tags: ["Chansons", "Voix", "Composition"],
    featured: true,
    sourceUrl: "https://suno.com/pricing",
  },
  {
    id: "udio",
    name: "Udio",
    tagline: "Explorez vos idées musicales",
    description:
      "Créez des morceaux à partir d’un texte, puis explorez des extensions et des variations. Les outils d’édition permettent d’affiner votre création.",
    categoryIds: ["musique"],
    pricing: "freemium",
    pricingNote:
      "Crédits de création gratuits limités ; abonnements Standard et Pro avec davantage de crédits.",
    url: "https://www.udio.com/",
    color: "#d38d46",
    tags: ["Composition", "Chansons", "Remix"],
    sourceUrl:
      "https://help.udio.com/en/articles/10739134-credits-and-credit-limits",
  },
  {
    id: "aiva",
    name: "AIVA",
    tagline: "Une bande-son pour votre projet",
    description:
      "Générez des compositions dans différents styles et personnalisez vos morceaux. Un point de départ pour imaginer une ambiance ou accompagner une création.",
    categoryIds: ["musique"],
    pricing: "freemium",
    pricingNote:
      "Offre gratuite limitée pour un usage non commercial ; téléchargements et droits selon l’abonnement.",
    url: "https://www.aiva.ai/",
    color: "#d27082",
    tags: ["Composition", "Instrumental", "Bandes-son"],
    sourceUrl: "https://www.aiva.ai/pricing",
  },
  {
    id: "soundraw",
    name: "SOUNDRAW",
    tagline: "La bonne ambiance pour vos contenus",
    description:
      "Choisissez un genre et une ambiance pour générer un morceau. Ajustez sa durée, son énergie ou ses instruments dans l’éditeur.",
    categoryIds: ["musique"],
    pricing: "paid",
    pricingNote:
      "Abonnement requis pour télécharger les morceaux ; formats et conditions d’utilisation selon la formule.",
    url: "https://soundraw.io/",
    color: "#bc963f",
    tags: ["Instrumental", "Bandes-son", "Créateurs"],
    sourceUrl: "https://soundraw.io/",
  },
  {
    id: "gamma",
    name: "Gamma",
    tagline: "Vos idées méritent de belles slides",
    description:
      "Transformez un sujet ou un document en présentation, puis ajustez la mise en page. Gamma propose aussi la création de documents et de pages web.",
    categoryIds: ["presentations"],
    pricing: "freemium",
    pricingNote:
      "Offre gratuite limitée ; abonnements pour davantage de fonctions IA et le retrait de la marque Gamma.",
    url: "https://gamma.app/",
    color: "#8863d1",
    tags: ["Diapositives", "Documents", "Mise en page"],
    featured: true,
    sourceUrl: "https://gamma.app/pricing",
  },
  {
    id: "beautiful-ai",
    name: "Beautiful.ai",
    tagline: "Des slides qui trouvent leur place",
    description:
      "Créez des présentations avec des modèles qui adaptent leur mise en page au contenu. L’IA aide à préparer les diapositives et leur rédaction.",
    categoryIds: ["presentations"],
    pricing: "paid",
    pricingNote:
      "Abonnement payant ; essai de 14 jours avec carte bancaire et renouvellement automatique.",
    url: "https://www.beautiful.ai/",
    color: "#438dc5",
    tags: ["Diapositives", "Mise en page", "PowerPoint"],
    sourceUrl: "https://www.beautiful.ai/pricing",
  },
  {
    id: "presentations-ai",
    name: "Presentations.AI",
    tagline: "Du premier brouillon à la présentation",
    description:
      "Générez une présentation à partir d’instructions puis personnalisez le contenu et le style. L’outil propose des fonctions de partage et d’export.",
    categoryIds: ["presentations"],
    pricing: "freemium",
    pricingNote:
      "Formule Starter gratuite avec des crédits limités ; offres Pro et Gold pour plus de capacités.",
    url: "https://www.presentations.ai/",
    color: "#af72bd",
    tags: ["Diapositives", "PowerPoint", "Présenter"],
    sourceUrl: "https://www.presentations.ai/pricing",
  },
].map((tool) => ({
  featured: false,
  checkedAt: "2026-09-15",
  ...tool,
  logoUrl: `./logos/${tool.id}.${logoExtensions[tool.id]}`,
}));
