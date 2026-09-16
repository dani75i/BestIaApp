import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "bestia.theme.v1";
const isTheme = (value) => value === "light" || value === "dark";
const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function readPreference() {
  try {
    const saved = localStorage.getItem(storageKey);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState(readPreference);
  const [theme, setTheme] = useState(() => readPreference() || systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#14131b" : "#f8f9fc");
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event) => {
      if (!preference) setTheme(event.matches ? "dark" : "light");
    };
    const handleStorageChange = (event) => {
      if (event.key !== storageKey && event.key !== null) return;
      const saved = isTheme(event.newValue) ? event.newValue : null;
      setPreference(saved);
      setTheme(saved || systemTheme());
    };
    media.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      media.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [preference]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setPreference(nextTheme);
    setTheme(nextTheme);
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Keep the chosen theme for this page even without persistent storage.
    }
  };

  const label =
    theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre";
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
