// Apply the theme before the page is painted, including on GitHub Pages.
(() => {
  let preference;
  try {
    preference = localStorage.getItem("bestia.theme.v1");
  } catch {
    // The system preference still works when browser storage is unavailable.
  }
  const theme =
    preference === "light" || preference === "dark"
      ? preference
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#14131b" : "#f8f9fc");
})();
