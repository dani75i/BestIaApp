import { test, expect } from "./fixtures.js";

test("affiche le catalogue et combine recherche, catégorie et prix", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /La bonne IA/ }),
  ).toBeVisible();
  await expect(page.locator(".tool-card")).toHaveCount(30);
  await page.getByRole("searchbox").fill("CLAUDE");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(page.locator(".tool-title")).toHaveText("Claude");
  await page
    .getByRole("combobox", { name: "Filtrer par prix" })
    .selectOption("paid");
  await expect(
    page.getByRole("heading", { name: "Aucun outil pour cette recherche." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
  await expect(page.locator(".tool-card")).toHaveCount(30);
  await page.getByRole("button", { name: /^Code & développement/ }).click();
  await expect(page.locator(".tool-card")).not.toHaveCount(30);
  await page
    .getByRole("combobox", { name: "Filtrer par prix" })
    .selectOption("paid");
  for (const badge of await page
    .locator(".tool-card .price-tag")
    .allTextContents())
    expect(badge).toBe("Payant");
  expect(errors).toEqual([]);
});

test("conserve les favoris et notes après rechargement", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ajouter Claude aux favoris", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Noter Claude 4 sur 5", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Noter Claude 4 sur 5", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await page.getByRole("button", { name: /Mes favoris/ }).click();
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Noter Claude 4 sur 5", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Retirer Claude des favoris", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Vos coups de cœur commencent ici." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explorer les outils", exact: true })
    .click();
  await expect(page.locator(".tool-card")).toHaveCount(30);
});

test("ouvre une fiche accessible et permet de supprimer sa note", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true })
    .click();
  const trigger = page.getByRole("link", { name: "ChatGPT", exact: true });
  await trigger.click();
  const dialog = page.locator(".tool-page");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "ChatGPT", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: /Découvrir ChatGPT/ }),
  ).toHaveAttribute("href", "https://chatgpt.com/");
  await dialog.getByRole("button", { name: "Supprimer mon vote" }).click();
  await expect(
    dialog.getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("link", { name: "Retour au catalogue" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeVisible();
});

test("résiste à des préférences invalides et au stockage bloqué", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("bestia.preferences.v1", "{invalide"),
  );
  await page.goto("/");
  await expect(page.locator(".tool-card")).toHaveCount(30);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Stockage désactivé");
    };
  });
  await page
    .getByRole("button", { name: "Ajouter ChatGPT aux favoris", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "bloque l’enregistrement",
  );
  await page.getByRole("button", { name: /Mes favoris/ }).click();
  await expect(page.locator(".tool-card")).toHaveCount(1);
});

test("le tri alphabétique et les modes d’affichage fonctionnent", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Trier les outils" })
    .selectOption("name");
  const names = await page.locator(".tool-title").allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "fr")));
  await page.getByRole("button", { name: "Affichage en liste" }).click();
  await expect(page.locator(".tools-grid")).toHaveClass(/list-view/);
  await page.getByRole("button", { name: "Affichage en grille" }).click();
  await expect(page.locator(".tools-grid")).not.toHaveClass(/list-view/);
});

test("aucun débordement horizontal du mobile à l’ordinateur", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.content, `Largeur ${width}`).toBeLessThanOrEqual(
      dimensions.viewport,
    );
  }
});
