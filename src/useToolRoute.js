import { useEffect, useState } from "react";

const readRoute = () =>
  location.hash.startsWith("#/outil/") ? location.hash.slice(8) : null;
export default function useToolRoute(tools) {
  const [id, setId] = useState(readRoute);
  const selectedTool = tools.find((tool) => tool.id === id) || null;
  useEffect(() => {
    const change = () => setId(readRoute());
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.title =
      id !== null
        ? `${selectedTool?.name || "Outil introuvable"} : avis et usages | BestIA`
        : "BestIA — Trouvez la bonne intelligence artificielle";
    if (id !== null) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("detail-title")?.focus({ preventScroll: true });
    }
  }, [id, selectedTool]);
  return {
    selectedTool,
    isDetail: id !== null,
    openTool: (tool) => {
      location.hash = `/outil/${tool.id}`;
    },
  };
}
