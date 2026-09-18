import test from "node:test";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";
import { categories, tools } from "../src/data/tools.js";
import { toolDetails } from "../src/data/toolDetails.js";
import {
  practicalInfo,
  languageLabels,
  accountLabels,
} from "../src/data/practicalInfo.js";
import { exampleOutcomes } from "../src/data/exampleOutcomes.js";

test("les informations pratiques couvrent le catalogue avec des valeurs explicites", () => {
  for (const data of [practicalInfo, exampleOutcomes])
    assert.deepEqual(Object.keys(data).sort(), tools.map((t) => t.id).sort());
  for (const tool of tools) {
    const p = tool.practical;
    assert.ok(p.interfaceFr in languageLabels, tool.id);
    assert.ok(p.contentFr in languageLabels, tool.id);
    assert.ok(p.account in accountLabels, tool.id);
    assert.ok(p.freeLimit.length > 30 && p.note.length > 30, tool.id);
    assert.ok(exampleOutcomes[tool.id].length > 30, tool.id);
    for (const source of p.sources)
      assert.equal(new URL(source).protocol, "https:");
  }
});

test("les nouveaux filtres excluent les informations inconnues et se combinent aux autres", () => {
  const options = {
    frenchOnly: true,
    noAccountOnly: true,
    category: "texte",
    pricing: "freemium",
    favoritesOnly: true,
    favorites: ["deepl", "quillbot", "chatgpt", "claude"],
    query: "deepl",
  };
  assert.deepEqual(
    selectTools(tools, options).map((t) => t.id),
    ["deepl"],
  );
  assert.deepEqual(selectTools(tools, { ...options, category: "code" }), []);
  const uncertain = [
    {
      ...tools[0],
      practical: {
        interfaceFr: "unknown",
        contentFr: "unknown",
        account: "unknown",
      },
    },
  ];
  assert.deepEqual(selectTools(uncertain, { frenchOnly: true }), []);
  assert.deepEqual(selectTools(uncertain, { noAccountOnly: true }), []);
  assert.ok(
    !selectTools(tools, { noAccountOnly: true }).some(
      (t) => t.id === "chatgpt",
    ),
  );
});
import {
  sanitizeComparison,
  readComparisonRoute,
  comparisonHref,
} from "../src/lib/comparison.js";

test("les liens de comparaison éliminent les doublons et les outils inconnus et respectent la limite", () => {
  assert.deepEqual(sanitizeComparison(null, tools), []);
  assert.deepEqual(
    sanitizeComparison(
      ["claude", "claude", "inconnu", "chatgpt", "gemini", "perplexity"],
      tools,
    ),
    ["claude", "chatgpt", "gemini"],
  );
  assert.equal(readComparisonRoute("#/outil/claude", tools), null);
  assert.deepEqual(
    readComparisonRoute("#/comparer?outils=claude%2Cchatgpt", tools),
    ["claude", "chatgpt"],
  );
  assert.deepEqual(
    readComparisonRoute("#/comparer?outils=%E0%A4%A", tools),
    [],
  );
  assert.equal(
    comparisonHref(["claude", "chatgpt"]),
    "#/comparer?outils=claude,chatgpt",
  );
});
import { selectTools, sanitizePreferences } from "../src/lib/catalogue.js";

const examples = [
  {
    id: "studio",
    name: "Studio Écriture",
    tagline: "Rédaction et vidéo",
    description: "Créez des vidéos à partir de vos textes.",
    tags: ["Créativité", "Écriture"],
    categoryIds: ["texte", "video"],
    pricing: "freemium",
    featured: false,
  },
  {
    id: "brouillon",
    name: "Brouillon",
    tagline: "Rédaction de textes",
    description: "Préparez vos courriers et reformulez vos idées.",
    tags: ["Courriers"],
    categoryIds: ["texte"],
    pricing: "free",
    featured: false,
  },
  {
    id: "atelier",
    name: "Atelier",
    tagline: "Votre assistant de code",
    description: "Documentez et corrigez vos programmes.",
    tags: ["Développement"],
    categoryIds: ["code", "texte"],
    pricing: "freemium",
    featured: true,
  },
  {
    id: "zebre",
    name: "Zèbre Vidéo",
    tagline: "Donnez vie aux images",
    description: "Générez des films et des animations.",
    tags: ["Montage"],
    categoryIds: ["video"],
    pricing: "paid",
    featured: false,
  },
  {
    id: "echo",
    name: "Écho",
    tagline: "Imaginez une chanson",
    description: "Composez la bande-son de votre projet.",
    tags: ["Voix"],
    categoryIds: ["musique"],
    pricing: "free",
    featured: false,
  },
];

const selectedIds = (options) =>
  selectTools(examples, options).map((tool) => tool.id);

test("chaque outil possède une fiche complète avec un exemple distinct", () => {
  assert.deepEqual(
    Object.keys(toolDetails).sort(),
    tools.map((t) => t.id).sort(),
  );
  assert.equal(
    new Set(Object.values(toolDetails).map((d) => d.example)).size,
    tools.length,
  );
  for (const tool of tools) {
    const detail = toolDetails[tool.id];
    assert.ok(detail.audience.length > 20);
    for (const field of ["uses", "pros", "cons"])
      assert.ok(detail[field].length >= 2);
    assert.equal(new URL(tool.sourceUrl).protocol, "https:");
  }
});

test("la recherche ignore la casse, les accents et les espaces superflus", () => {
  assert.deepEqual(selectedIds({ query: "  RÉDACTION   ViDeO  " }), ["studio"]);
  assert.deepEqual(selectedIds({ query: "developpement" }), ["atelier"]);
  assert.deepEqual(selectedIds({ query: "courriers" }), ["brouillon"]);
});

test("chaque terme doit correspondre, y compris dans des champs différents", () => {
  assert.deepEqual(selectedIds({ query: "studio creativite textes" }), [
    "studio",
  ]);
  assert.deepEqual(selectedIds({ query: "redaction chanson" }), []);
  assert.deepEqual(selectedIds({ query: "outil introuvable" }), []);
});

test("catégorie, prix, recherche et favoris se combinent par intersection", () => {
  const options = {
    category: "video",
    pricing: "freemium",
    favoritesOnly: true,
    favorites: ["studio", "brouillon", "atelier", "zebre"],
  };
  assert.deepEqual(selectedIds(options), ["studio"]);
  assert.deepEqual(selectedIds({ ...options, query: "montage" }), []);
  assert.deepEqual(selectedIds({ ...options, category: "code" }), ["atelier"]);
  assert.deepEqual(selectedIds({ ...options, favorites: ["zebre"] }), []);
});

test("une liste vide de favoris ne masque les résultats que dans la vue favoris", () => {
  assert.equal(
    selectTools(examples, { favorites: [] }).length,
    examples.length,
  );
  assert.deepEqual(selectedIds({ favoritesOnly: true, favorites: [] }), []);
  assert.equal(
    selectTools(examples, { query: " \t " }).length,
    examples.length,
  );
});

test("le tri par note classe les notes décroissantes puis les noms sans modifier les entrées", () => {
  const frozenTools = Object.freeze(structuredClone(examples));
  const before = structuredClone(frozenTools);
  const ratings = Object.freeze({ studio: 4, brouillon: 5, atelier: 5 });
  const result = selectTools(frozenTools, { sort: "rating", ratings });

  assert.deepEqual(
    result.map((tool) => tool.id),
    ["atelier", "brouillon", "studio", "echo", "zebre"],
  );
  assert.deepEqual(frozenTools, before);
  assert.deepEqual(ratings, { studio: 4, brouillon: 5, atelier: 5 });
  assert.notEqual(result, frozenTools);
});

test("les tris par nom et sélection éditoriale conservent tous les résultats", () => {
  assert.deepEqual(selectedIds({ sort: "name" }), [
    "atelier",
    "brouillon",
    "echo",
    "studio",
    "zebre",
  ]);
  const selection = selectedIds({ sort: "selection" });
  assert.equal(selection[0], "atelier");
  assert.deepEqual(
    new Set(selection),
    new Set(examples.map((tool) => tool.id)),
  );
});

test("des préférences absentes ou de forme corrompue donnent un état vide", () => {
  for (const value of [
    undefined,
    null,
    false,
    12,
    "{JSON invalide",
    [],
    {},
    { favorites: {}, ratings: "cinq" },
  ]) {
    assert.deepEqual(sanitizePreferences(value, ["studio"]), {
      favorites: [],
      ratings: {},
    });
  }
});

test("les préférences éliminent doublons, outils inconnus et notes invalides", () => {
  const stored = {
    favorites: ["studio", "studio", "ancien-outil", null, 12, "atelier"],
    ratings: {
      studio: 5,
      atelier: 1,
      brouillon: 0,
      zebre: 6,
      echo: 2.5,
      "ancien-outil": 4,
      chaine: "3",
      infini: Infinity,
      absent: NaN,
    },
  };
  const before = structuredClone(stored);
  assert.deepEqual(
    sanitizePreferences(stored, [
      ...examples.map((tool) => tool.id),
      "chaine",
      "infini",
      "absent",
    ]),
    {
      favorites: ["studio", "atelier"],
      ratings: { studio: 5, atelier: 1 },
    },
  );
  assert.deepEqual(stored, before);
  assert.deepEqual(sanitizePreferences(stored, []), {
    favorites: [],
    ratings: {},
  });
});

test("le catalogue contient 40 outils uniques et des fiches complètes utilisables", () => {
  assert.equal(tools.length, 40);
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length);
  assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);

  const categoryIds = new Set(categories.map((category) => category.id));
  assert.equal(categoryIds.size, categories.length);
  for (const expected of [
    "code",
    "texte",
    "video",
    "musique",
    "presentations",
  ]) {
    assert.ok(categoryIds.has(expected), `Catégorie requise : ${expected}`);
  }

  for (const tool of tools) {
    for (const field of [
      "id",
      "name",
      "tagline",
      "description",
      "pricingNote",
    ]) {
      assert.equal(typeof tool[field], "string", `${tool.id}.${field}`);
      assert.ok(tool[field].trim(), `${tool.id}.${field} doit être renseigné`);
    }
    assert.match(tool.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(
      ["free", "freemium", "paid"].includes(tool.pricing),
      `${tool.id}.pricing`,
    );
    assert.ok(
      Array.isArray(tool.categoryIds) && tool.categoryIds.length > 0,
      `${tool.id}.categoryIds`,
    );
    assert.equal(new Set(tool.categoryIds).size, tool.categoryIds.length);
    assert.ok(
      tool.categoryIds.every((id) => categoryIds.has(id)),
      `${tool.id} : catégorie inconnue`,
    );
    assert.ok(
      Array.isArray(tool.tags) && tool.tags.length > 0,
      `${tool.id}.tags`,
    );
    assert.ok(
      tool.tags.every((tag) => typeof tag === "string" && tag.trim()),
      `${tool.id}.tags`,
    );
    assert.equal(typeof tool.featured, "boolean");
    assert.match(tool.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(tool.color, /^#[a-f0-9]{6}$/i);
    assert.match(tool.logoUrl, /^\.\/logos\/[a-z0-9-]+\.(svg|png|ico)$/);
    assert.ok(
      existsSync(new URL(`../public/${tool.logoUrl}`, import.meta.url)),
      `${tool.id} : logo local absent`,
    );
    for (const field of ["url", "sourceUrl"]) {
      const url = new URL(tool[field]);
      assert.equal(url.protocol, "https:", `${tool.id}.${field}`);
      assert.ok(
        url.hostname.includes("."),
        `${tool.id}.${field} : domaine attendu`,
      );
      assert.equal(url.username, "");
      assert.equal(url.password, "");
    }
  }

  for (const category of categories) {
    assert.ok(category.label && category.description);
    assert.ok(
      tools.some((tool) => tool.categoryIds.includes(category.id)),
      `${category.id} : catégorie vide`,
    );
  }
});
