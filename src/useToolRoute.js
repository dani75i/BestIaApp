import { useEffect, useState } from "react";

export default function useToolRoute(tools) {
  const [hash, setHash] = useState(() => location.hash);
  const id = hash.startsWith("#/outil/") ? hash.slice(8) : null;
  const isComparison = hash.split("?")[0] === "#/comparer";
  const selectedTool = tools.find((tool) => tool.id === id) || null;
  useEffect(() => {
    const change = () => setHash(location.hash);
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.title =
      id !== null
        ? `${selectedTool?.name || "Outil introuvable"} : avis et usages | BestIA`
        : isComparison
          ? "Comparer les IA | BestIA"
          : "BestIA — Trouvez la bonne intelligence artificielle";
    if (id !== null || isComparison) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document
        .getElementById(isComparison ? "comparison-title" : "detail-title")
        ?.focus({ preventScroll: true });
    }
  }, [id, selectedTool, isComparison]);
  return {
    hash,
    isComparison,
    selectedTool,
    isDetail: id !== null,
    openTool: (tool) => {
      location.hash = `/outil/${tool.id}`;
    },
  };
}
