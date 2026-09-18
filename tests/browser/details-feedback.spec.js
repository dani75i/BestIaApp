import { test, expect } from "./fixtures.js";

test("les fiches se partagent, se rechargent et conservent les filtres au retour", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("claude");
  await page.getByRole("link", { name: "Claude", exact: true }).click();
  await expect(page).toHaveURL(/#\/outil\/claude$/);
  await expect(
    page.getByRole("heading", { name: "Claude", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Avantages et limites" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("searchbox")).toHaveValue("claude");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await page.goForward();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Claude", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Claude.*BestIA/);
  await page.goto("/#/outil/inconnu");
  await expect(
    page.getByRole("heading", { name: "Outil introuvable" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Retour au catalogue" }).click();
  await expect(page.locator(".tool-card")).toHaveCount(40);
});

test("les fiches restent lisibles à toutes les largeurs et la copie a un secours", async ({
  page,
}) => {
  await page.goto("/#/outil/presentations-ai");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    }),
  );
  await page.getByRole("button", { name: "Copier le lien" }).click();
  await expect(page.getByLabel("Copiez ce texte manuellement")).toHaveValue(
    /#\/outil\/presentations-ai$/,
  );
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `largeur ${width}`,
    ).toBeTruthy();
  }
});

test("un retour privé conserve son brouillon en cas d’échec puis confirme l’envoi", async ({
  page,
  backend,
}) => {
  await page.goto("/#/outil/claude");
  await page
    .getByRole("button", { name: "Donner mon avis", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Votre message")
    .fill("Ce serait utile de comparer deux outils côte à côte.");
  await dialog.getByLabel("Votre e-mail").fill("visiteur@example.com");
  backend.failWrites = true;
  await dialog.getByRole("button", { name: "Envoyer mon retour" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "n’a pas pu être envoyé",
  );
  await expect(dialog.getByLabel("Votre message")).toHaveValue(
    /comparer deux outils/,
  );
  expect(backend.feedback).toHaveLength(0);
  backend.failWrites = false;
  await dialog.getByRole("button", { name: "Envoyer mon retour" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "Merci pour votre retour",
  );
  expect(backend.feedback).toEqual([
    {
      p_category: "suggestion",
      p_message: "Ce serait utile de comparer deux outils côte à côte.",
      p_email: "visiteur@example.com",
      p_page_path: "/#/outil/claude",
    },
  ]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Donner mon avis", exact: true }),
  ).toBeFocused();
});

test("la validation et la limite d’envoi ne créent pas de faux succès", async ({
  page,
  backend,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Donner mon avis", exact: true })
    .click();
  await page.getByLabel("Votre message").fill("          ");
  await page.getByRole("button", { name: "Envoyer mon retour" }).click();
  await expect(page.getByRole("alert")).toContainText("10 caractères");
  expect(backend.feedback).toHaveLength(0);
  await page
    .getByLabel("Votre message")
    .fill("Une suggestion suffisamment longue.");
  backend.feedbackError = "feedback_rate_limit";
  await page.getByRole("button", { name: "Envoyer mon retour" }).click();
  await expect(page.getByRole("alert")).toContainText("cinq par jour");
  await expect(
    page.getByRole("button", { name: "Envoyer mon retour" }),
  ).toBeEnabled();
  expect(backend.feedback).toHaveLength(0);
});
