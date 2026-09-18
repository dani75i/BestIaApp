import { test, expect } from "./fixtures.js";
import { additionalTools } from "../../src/data/additionalTools.js";

test("les filtres français et sans inscription se combinent et se réinitialisent", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("checkbox", { name: "Utilisable en français" }).check();
  await page.getByRole("checkbox", { name: "Sans inscription" }).check();
  await expect(page.locator(".tool-card")).toHaveCount(4);
  await page.getByRole("searchbox").fill("deepl");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await page
    .getByRole("combobox", { name: "Filtrer par prix" })
    .selectOption("paid");
  await expect(page.locator(".tool-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
  await expect(page.locator(".tool-card")).toHaveCount(40);
  await expect(
    page.getByRole("checkbox", { name: "Sans inscription" }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Utilisable en français" }),
  ).not.toBeChecked();
});

test("chaque nouveau logo et fiche se chargent et le retour utilisateur reste accessible en haut", async ({
  page,
}) => {
  await page.goto("/");
  const logos = page.locator(".tool-card img");
  await expect(logos).toHaveCount(40);
  await logos.evaluateAll(imgs => imgs.forEach(img => { img.loading = "eager"; }));
  await expect
    .poll(() =>
      logos.evaluateAll((imgs) =>
        imgs.every((i) => i.complete && i.naturalWidth > 0),
      ),
    )
    .toBe(true);
  for (const tool of additionalTools) {
    await page.goto(`/#/outil/${tool.id}`);
    await expect(
      page.getByRole("heading", { name: tool.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Langue et inscription" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Résultat visé" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Les limites du gratuit" }),
    ).toBeVisible();
  }
  for (const route of [
    "/",
    "/#/outil/deepl",
    "/#/comparer?outils=deepl,quillbot",
  ]) {
    await page.goto(route);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 850 });
      await page.evaluate(() => window.scrollTo(0, 0));
      const button = page.getByRole("button", {
        name: "Donner mon avis",
        exact: true,
      });
      await expect(button).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await expect(
    page.getByText("Interface en français", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Limites du gratuit", { exact: true }),
  ).toBeVisible();
});
