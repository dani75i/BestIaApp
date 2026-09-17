import { test, expect } from "./fixtures.js";

test("suit le thème système tant qu’aucun choix personnel n’est enregistré", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Activer le mode clair" }),
  ).toBeVisible();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("conserve le mode sombre après rechargement et adapte les fiches", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Activer le mode sombre" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: "ChatGPT", exact: true }).click();
  await expect(page.locator(".detail-panel").first()).toHaveCSS(
    "background-color",
    "rgb(30, 27, 41)",
  );
  await page.getByRole("link", { name: "Retour au catalogue" }).click();
  await page.getByRole("button", { name: "Activer le mode clair" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
