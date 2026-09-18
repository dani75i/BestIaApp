import { test, expect } from "./fixtures.js";

test("sélection de trois outils au maximum, filtres conservés et sélection rechargeable", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Ajouter ChatGPT au comparateur",
      exact: true,
    })
    .click();
  const tray = page.getByRole("complementary", {
    name: "Sélection à comparer",
  });
  await expect(
    tray.getByRole("button", { name: "Comparer les outils", exact: true }),
  ).toBeDisabled();
  await page.getByRole("searchbox").fill("claude");
  await page
    .getByRole("button", { name: "Ajouter Claude au comparateur", exact: true })
    .click();
  await page.getByRole("searchbox").fill("gemini");
  await page
    .getByRole("button", { name: "Ajouter Gemini au comparateur", exact: true })
    .click();
  await page.getByRole("searchbox").fill("perplexity");
  await expect(
    page.getByRole("button", {
      name: "Ajouter Perplexity au comparateur",
      exact: true,
    }),
  ).toBeDisabled();
  await tray.getByRole("link", { name: "Comparer les 3 outils" }).click();
  await expect(page).toHaveURL(/#\/comparer\?outils=chatgpt,claude,gemini$/);
  await expect(page.locator("thead th")).toHaveCount(4);
  await page.goBack();
  await expect(page.getByRole("searchbox")).toHaveValue("perplexity");
  await page.reload();
  await expect(tray.getByRole("status")).toContainText("3/3");
  await tray.getByRole("button", { name: "Tout retirer" }).click();
  await expect(tray).toHaveCount(0);
});

test("lien partagé, remplacement, favoris et retour arrière", async ({
  page,
}) => {
  await page.goto("/#/comparer?outils=claude,chatgpt");
  await expect(
    page.getByRole("heading", { name: "Les IA, côte à côte." }),
  ).toBeFocused();
  await expect(page).toHaveTitle("Comparer les IA | BestIA");
  await expect(page.locator("thead th").nth(1)).toContainText("Claude");
  await page
    .getByRole("combobox", { name: "Remplacer Claude" })
    .selectOption("perplexity");
  await expect(page).toHaveURL(/outils=perplexity,chatgpt$/);
  await page
    .getByRole("combobox", { name: "Ajouter un outil" })
    .selectOption("gemini");
  await expect(page.locator("thead th")).toHaveCount(4);
  await page
    .getByRole("button", {
      name: "Ajouter Perplexity aux favoris",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Retirer Perplexity des favoris",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("thead th")).toHaveCount(4);
  await page
    .getByRole("button", { name: "Retirer Gemini du comparateur", exact: true })
    .click();
  await expect(page.locator("thead th")).toHaveCount(3);
  await page.goBack();
  await expect(page.locator("thead th")).toHaveCount(4);
  await page.getByRole("link", { name: "Fiche de ChatGPT" }).click();
  await expect(
    page.getByRole("heading", { name: "ChatGPT", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Retirer ChatGPT du comparateur",
      exact: true,
    })
    .click();
  await expect(
    page
      .getByRole("complementary", { name: "Sélection à comparer" })
      .getByRole("status"),
  ).toContainText("2/3");
});

test("liens incomplets ou corrompus et stockage bloqué restent utilisables", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("bestia.comparison.v1", "{invalid");
  });
  await page.goto("/#/comparer?outils=inconnu,claude,claude,%ZZ");
  await expect(
    page.getByRole("heading", { name: "Choisissez un deuxième outil" }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Blocked");
    };
  });
  await page
    .getByRole("combobox", { name: "Ajouter un outil" })
    .selectOption("chatgpt");
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByRole("button", { name: "Tout retirer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Choisissez 2 ou 3 outils" }),
  ).toBeVisible();
});

test("notes publiques, erreurs de lecture et copie du lien", async ({
  page,
  backend,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Noter Claude 4 sur 5", exact: true })
    .click();
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("4,0");
  await page.goto("/#/comparer?outils=claude,chatgpt");
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("1 vote");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedComparison = text;
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Partager la comparaison" }).click();
  expect(await page.evaluate(() => window.copiedComparison)).toMatch(
    /#\/comparer\?outils=claude,chatgpt$/,
  );
  backend.failReads = true;
  await page.reload();
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("Notes indisponibles");
  backend.failReads = false;
  await page.getByRole("button", { name: "Réessayer", exact: true }).click();
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("4,0");
});

test("tableau sombre, défilement contenu et critères fixes sur mobile", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/#/comparer?outils=chatgpt,claude,gemini");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `largeur ${width}`,
    ).toBeTruthy();
  }
  await expect(page.locator("tbody td").first()).toHaveCSS(
    "background-color",
    "rgb(30, 27, 41)",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const before = await page.locator("thead th").first().boundingBox();
  await page.locator(".comparison-table-scroll").evaluate((el) => {
    el.scrollLeft = 300;
    el.scrollTop = 250;
  });
  const after = await page.locator("thead th").first().boundingBox();
  expect(Math.abs(after.x - before.x)).toBeLessThan(2);
  expect(Math.abs(after.y - before.y)).toBeLessThan(2);
});
