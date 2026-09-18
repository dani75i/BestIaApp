export function sanitizeComparison(value, tools) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(tools.map((tool) => tool.id));
  return [...new Set(value.filter((id) => valid.has(id)))].slice(0, 3);
}

export function readComparisonRoute(hash, tools) {
  const [path, query = ""] = hash.split("?");
  if (path !== "#/comparer") return null;
  return sanitizeComparison(
    (new URLSearchParams(query).get("outils") || "").split(","),
    tools,
  );
}

export function comparisonHref(ids) {
  return `#/comparer${ids.length ? `?outils=${ids.join(",")}` : ""}`;
}
