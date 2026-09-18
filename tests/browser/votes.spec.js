import { test, expect } from "./fixtures.js";

test("deux appareils partagent une moyenne mais gardent des votes distincts", async ({
  page,
  browser,
  backend,
  baseURL,
}) => {
  const other = await browser.newContext();
  await backend.install(other);
  const otherPage = await other.newPage();
  try {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Noter ChatGPT 4 sur 5", exact: true })
      .click();
    const average = page.getByLabel("Note moyenne de ChatGPT", { exact: true });
    await expect(average).toContainText("4,0");
    await expect(average).toContainText("1 vote");
    await otherPage.goto(baseURL);
    await expect(
      otherPage.getByLabel("Note moyenne de ChatGPT", { exact: true }),
    ).toContainText("4,0");
    await expect(
      otherPage.getByRole("button", {
        name: "Noter ChatGPT 4 sur 5",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "false");
    await otherPage
      .getByRole("button", { name: "Noter ChatGPT 2 sur 5", exact: true })
      .click();
    await expect(
      otherPage.getByLabel("Note moyenne de ChatGPT", { exact: true }),
    ).toContainText("3,0");
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(average).toContainText("3,0");
    await expect(average).toContainText("2 votes");
    await page
      .getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true })
      .click();
    await expect(average).toContainText("3,5");
    await expect(average).toContainText("2 votes");
  } finally {
    await other.close();
  }
});

test("une écriture refusée ne change pas la moyenne et permet de réessayer", async ({
  page,
  backend,
}) => {
  await page.goto("/");
  backend.failWrites = true;
  await page
    .getByRole("button", { name: "Noter Claude 5 sur 5", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "n’a pas pu être enregistré",
  );
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("Aucun vote");
  await expect(
    page.getByRole("button", { name: "Noter Claude 5 sur 5", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  backend.failWrites = false;
  await page
    .getByRole("button", { name: "Noter Claude 5 sur 5", exact: true })
    .click();
  await expect(
    page.getByLabel("Note moyenne de Claude", { exact: true }),
  ).toContainText("5,0");
});

test("une panne de lecture ne présente pas de faux zéro et préserve le catalogue", async ({
  page,
  backend,
}) => {
  backend.failReads = true;
  await page.goto("/");
  await expect(page.locator(".tool-card")).toHaveCount(40);
  await expect(
    page.getByLabel("Note moyenne de ChatGPT", { exact: true }),
  ).toContainText("Notes indisponibles");
  await expect(
    page.getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true }),
  ).toBeDisabled();
  backend.failReads = false;
  await page.getByRole("button", { name: "Réessayer", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true }),
  ).toBeEnabled();
});

test("les anciennes notes locales ne deviennent pas des votes publics sans action", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "bestia.preferences.v1",
      JSON.stringify({ favorites: ["chatgpt"], ratings: { chatgpt: 5 } }),
    ),
  );
  await page.goto("/");
  await expect(
    page.getByLabel("Note moyenne de ChatGPT", { exact: true }),
  ).toContainText("Aucun vote");
  await expect(
    page.getByRole("button", { name: "Noter ChatGPT 5 sur 5", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("link", { name: "ChatGPT", exact: true }).click();
  await expect(page.locator(".tool-page")).toContainText(
    "ancienne note personnelle : 5/5",
  );
});
