export const pricingLabels = {
  free: "Gratuit",
  freemium: "Freemium",
  paid: "Payant",
};

export function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

export function selectTools(
  tools,
  {
    query = "",
    category = "all",
    pricing = "all",
    favoritesOnly = false,
    favorites = [],
    sort = "selection",
    ratings = {},
  } = {},
) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const result = tools.filter((tool) => {
    const haystack = normalize(
      [
        tool.name,
        tool.tagline,
        tool.description,
        ...tool.tags,
        ...tool.categoryIds,
      ].join(" "),
    );
    return (
      words.every((word) => haystack.includes(word)) &&
      (category === "all" || tool.categoryIds.includes(category)) &&
      (pricing === "all" || tool.pricing === pricing) &&
      (!favoritesOnly || favorites.includes(tool.id))
    );
  });
  if (sort === "name")
    result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else if (sort === "rating")
    result.sort(
      (a, b) =>
        (ratings[b.id] || 0) - (ratings[a.id] || 0) ||
        a.name.localeCompare(b.name, "fr"),
    );
  else result.sort((a, b) => Number(b.featured) - Number(a.featured));
  return result;
}

export function sanitizePreferences(value, validIds) {
  const ids = new Set(validIds);
  return {
    favorites: [
      ...new Set(
        (Array.isArray(value?.favorites) ? value.favorites : []).filter((id) =>
          ids.has(id),
        ),
      ),
    ],
    ratings: Object.fromEntries(
      Object.entries(
        value?.ratings && typeof value.ratings === "object"
          ? value.ratings
          : {},
      ).filter(
        ([id, rating]) =>
          ids.has(id) && Number.isInteger(rating) && rating >= 1 && rating <= 5,
      ),
    ),
  };
}
