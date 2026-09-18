import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Bookmark,
  Check,
  ChevronDown,
  Code2,
  Columns3,
  ExternalLink,
  Heart,
  Image,
  LayoutGrid,
  List,
  MessageCircle,
  Music2,
  Presentation,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Video,
  WandSparkles,
  X,
  PenLine,
} from "lucide-react";
import { categories, tools } from "./data/tools.js";
import { usableInFrench } from "./data/practicalInfo.js";
import "./practical.css";
import ThemeToggle from "./ThemeToggle.jsx";
import useVotes from "./useVotes.js";
import ToolDetail from "./ToolDetail.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import useToolRoute from "./useToolRoute.js";
import Comparison, { CompareButton, ComparisonTray } from "./Comparison.jsx";
import {
  sanitizeComparison,
  readComparisonRoute,
  comparisonHref,
} from "./lib/comparison.js";
import {
  pricingLabels,
  sanitizePreferences,
  selectTools,
} from "./lib/catalogue.js";

const categoryIcons = {
  traduction: PenLine,
  voix: Music2,
  reunions: MessageCircle,
  documents: Bookmark,
  assistants: MessageCircle,
  code: Code2,
  texte: PenLine,
  image: Image,
  video: Video,
  musique: Music2,
  presentations: Presentation,
};
const storageKey = "bestia.preferences.v1";
const toolIds = tools.map((tool) => tool.id);

function readPreferences() {
  try {
    return sanitizePreferences(
      JSON.parse(localStorage.getItem(storageKey)),
      toolIds,
    );
  } catch {
    return { favorites: [], ratings: {} };
  }
}

function Brand({ small = false }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <span className="brand-mark">
        <Asterisk strokeWidth={2.8} />
      </span>
      <span>
        Best<span className="brand-ia">IA</span>
        <span className="brand-dot">.</span>
      </span>
    </span>
  );
}

function ToolLogo({ tool, large = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`tool-logo ${large ? "large" : ""}`}
      style={{ "--tool-color": tool.color }}
    >
      {!failed && tool.logoUrl ? (
        <img
          src={tool.logoUrl}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{tool.name.slice(0, 2)}</span>
      )}
    </span>
  );
}

function CommunityRating({ tool, summary, status }) {
  return (
    <div
      className="community-rating"
      aria-label={`Note moyenne de ${tool.name}`}
    >
      <Star size={14} aria-hidden="true" />
      {status === "loading" ? (
        <span>Chargement des notes…</span>
      ) : status === "error" ? (
        <span>Notes indisponibles</span>
      ) : summary?.count > 0 ? (
        <>
          <strong>
            {summary.average.toLocaleString("fr-FR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
            <span> / 5</span>
          </strong>
          <span>
            ({summary.count} vote{summary.count > 1 ? "s" : ""})
          </span>
        </>
      ) : (
        <span>Aucun vote pour le moment</span>
      )}
    </div>
  );
}

function Rating({ tool, rating, onRate, disabled = false }) {
  return (
    <div
      className="rating"
      role="group"
      aria-label={`Votre note pour ${tool.name}`}
    >
      <span className="rating-label">Mon vote</span>
      <span className="rating-stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Noter ${tool.name} ${value} sur 5`}
            aria-pressed={value === rating}
            title={`${value}/5`}
            onClick={() => onRate(tool.id, value)}
            disabled={disabled}
            className={value <= (rating || 0) ? "rated" : ""}
          >
            <Star size={15} />
          </button>
        ))}
      </span>
      {rating > 0 && <span className="rating-value">{rating}/5</span>}
    </div>
  );
}

function ToolCard({
  tool,
  favorite,
  rating,
  summary,
  voteStatus,
  voting,
  onFavorite,
  onRate,
  onOpen,
  comparison,
}) {
  const mainCategory = categories.find(
    (category) => category.id === tool.categoryIds[0],
  );
  const CategoryIcon = categoryIcons[mainCategory?.id] || Sparkles;
  return (
    <article
      className="tool-card"
      onClick={(event) => {
        if (!event.target.closest("a, button, input, select")) onOpen(tool);
      }}
    >
      <div className="card-top">
        <ToolLogo tool={tool} />
        <div className="card-title">
          <a className="tool-title" href={`#/outil/${tool.id}`}>
            {tool.name}
            <ArrowUpRight size={16} />
          </a>
          <span>{tool.tagline}</span>
        </div>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-pressed={favorite}
          aria-label={`${favorite ? "Retirer" : "Ajouter"} ${tool.name} ${favorite ? "des" : "aux"} favoris`}
          title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => onFavorite(tool.id)}
        >
          <Heart size={19} />
        </button>
      </div>
      <p className="tool-description">{tool.description}</p>
      <div className="practical-badges">
        {usableInFrench(tool.practical) && <span>Usage en français</span>}
        {tool.practical?.account === "optional" && (
          <span>Sans compte · usage limité</span>
        )}
      </div>
      <div className="card-tags">
        <span className={`category-tag category-${mainCategory?.id}`}>
          <CategoryIcon size={12} />
          {mainCategory?.label}
        </span>
        <span className={`price-tag price-${tool.pricing}`}>
          <span />
          {pricingLabels[tool.pricing]}
        </span>
      </div>
      <div className="card-bottom">
        <div className="card-rating-block">
          <CommunityRating tool={tool} summary={summary} status={voteStatus} />
          <Rating
            tool={tool}
            rating={rating}
            onRate={onRate}
            disabled={voting || voteStatus !== "ready"}
          />
        </div>
        <a
          className="visit-link"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ouvrir le site de ${tool.name} dans un nouvel onglet`}
          title={`Découvrir ${tool.name}`}
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
      {comparison}
    </article>
  );
}

function Modal({ children, onClose, titleId }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="modal-close icon-button"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      {children}
    </dialog>
  );
}

function HeroArt() {
  const artTools = [
    "ChatGPT",
    "Claude",
    "Midjourney",
    "Suno",
    "Gamma",
    "GitHub Copilot",
  ]
    .map((name) => tools.find((tool) => tool.name === name))
    .filter(Boolean);
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-glow" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <span className="orbit-dot dot-one" />
      <span className="orbit-dot dot-two" />
      <div className="art-center">
        <Asterisk size={75} strokeWidth={1.5} />
        <span>Une idée. Mille possibles.</span>
      </div>
      {artTools.map((tool, index) => (
        <div className={`floating-tool floating-${index}`} key={tool.id}>
          <ToolLogo tool={tool} />
          <span>{tool.name}</span>
        </div>
      ))}
      <span className="art-spark spark-one">✦</span>
      <span className="art-spark spark-two">✧</span>
      <div className="art-caption">
        <span>
          <Check size={13} />
        </span>
        Le bon outil change tout.
      </div>
    </div>
  );
}

export default function App() {
  const [preferences, setPreferences] = useState(readPreferences);
  const votes = useVotes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pricing, setPricing] = useState("all");
  const [frenchOnly, setFrenchOnly] = useState(false);
  const [noAccountOnly, setNoAccountOnly] = useState(false);
  const [sort, setSort] = useState("selection");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [view, setView] = useState("grid");
  const { selectedTool, isDetail, isComparison, hash, openTool } =
    useToolRoute(tools);
  const [savedComparison, setSavedComparison] = useState(() => {
    try {
      return sanitizeComparison(
        JSON.parse(localStorage.getItem("bestia.comparison.v1")),
        tools,
      );
    } catch {
      return [];
    }
  });
  const comparedIds = readComparisonRoute(hash, tools) ?? savedComparison;
  const comparedTools = comparedIds.map((id) =>
    tools.find((tool) => tool.id === id),
  );
  useEffect(() => {
    const fromRoute = readComparisonRoute(hash, tools);
    if (fromRoute) setSavedComparison(fromRoute);
  }, [hash]);
  useEffect(() => {
    try {
      localStorage.setItem(
        "bestia.comparison.v1",
        JSON.stringify(savedComparison),
      );
    } catch {
      /* La sélection reste utilisable en mémoire et dans le lien partagé. */
    }
  }, [savedComparison]);
  const changeComparison = (ids) => {
    const next = sanitizeComparison(ids, tools);
    setSavedComparison(next);
    if (isComparison) location.hash = comparisonHref(next);
  };
  const toggleComparison = (id) => {
    if (comparedIds.includes(id))
      changeComparison(comparedIds.filter((value) => value !== id));
    else if (comparedIds.length < 3) changeComparison([...comparedIds, id]);
  };
  const comparisonButton = (tool) => (
    <CompareButton
      tool={tool}
      selected={comparedIds.includes(tool.id)}
      full={comparedIds.length >= 3}
      onToggle={toggleComparison}
    />
  );
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageError, setStorageError] = useState(false);
  const searchRef = useRef(null);
  const catalogueRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [preferences]);
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === storageKey || event.key === null)
        setPreferences(readPreferences());
    };
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.scrollIntoView({ block: "center" });
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2600);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    if (votes.error) setToast(votes.error);
  }, [votes.error]);

  const results = useMemo(
    () =>
      selectTools(tools, {
        query,
        category,
        pricing,
        frenchOnly,
        noAccountOnly,
        sort,
        favoritesOnly,
        ...preferences,
        ratings: Object.fromEntries(
          Object.entries(votes.averages).map(([id, value]) => [
            id,
            value.average,
          ]),
        ),
      }),
    [
      query,
      category,
      pricing,
      frenchOnly,
      noAccountOnly,
      sort,
      favoritesOnly,
      preferences,
      votes.averages,
    ],
  );
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((item) => [
          item.id,
          tools.filter(
            (tool) =>
              tool.categoryIds.includes(item.id) &&
              (!favoritesOnly || preferences.favorites.includes(tool.id)),
          ).length,
        ]),
      ),
    [favoritesOnly, preferences.favorites],
  );
  const toggleFavorite = (id) => {
    const exists = preferences.favorites.includes(id);
    setPreferences((previous) => ({
      ...previous,
      favorites: previous.favorites.includes(id)
        ? previous.favorites.filter((value) => value !== id)
        : [...previous.favorites, id],
    }));
    setToast(
      exists ? "Outil retiré de vos favoris" : "Outil ajouté à vos favoris",
    );
  };
  const rateTool = async (id, value) => {
    if (await votes.save(id, value))
      setToast("Votre vote est enregistré dans la moyenne publique");
  };
  const removeVote = async (id) => {
    if (await votes.save(id, null)) setToast("Votre vote a été supprimé");
  };
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setFrenchOnly(false);
    setNoAccountOnly(false);
    setSort("selection");
  };
  const navigate = (favorites) => {
    if (isDetail || isComparison) location.hash = "/";
    setFavoritesOnly(favorites);
    resetFilters();
    catalogueRef.current?.scrollIntoView({ block: "start" });
  };
  const filtersActive = Boolean(
    query ||
    category !== "all" ||
    pricing !== "all" ||
    frenchOnly ||
    noAccountOnly,
  );

  return (
    <>
      <a
        className="skip-link"
        href={
          isComparison
            ? "#comparison-title"
            : isDetail
              ? "#detail-title"
              : "#catalogue"
        }
        onClick={(event) => {
          if (isDetail || isComparison) {
            event.preventDefault();
            document
              .getElementById(
                isComparison ? "comparison-title" : "detail-title",
              )
              ?.focus();
          }
        }}
      >
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand-link"
            href="#"
            aria-label="BestIA, accueil"
            onClick={(event) => {
              event.preventDefault();
              location.hash = "/";
              setFavoritesOnly(false);
              resetFilters();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Brand />
          </a>
          <nav aria-label="Navigation principale">
            <button
              className={!favoritesOnly ? "nav-link active" : "nav-link"}
              onClick={() => navigate(false)}
            >
              Explorer
            </button>
            <button
              className="nav-link about-nav"
              onClick={() => setAboutOpen(true)}
            >
              Le projet
              <ArrowUpRight size={13} />
            </button>
          </nav>
          <div className="header-actions">
            <a
              className="header-compare"
              href={comparisonHref(comparedIds)}
              aria-label={`Ouvrir le comparateur (${comparedIds.length} outils)`}
              aria-current={isComparison ? "page" : undefined}
              title="Comparer des outils"
            >
              <Columns3 size={18} />
              <span>{comparedIds.length}</span>
            </a>
            <ThemeToggle />
            <button
              className={`header-favorites ${favoritesOnly ? "selected" : ""}`}
              aria-label="Mes favoris"
              onClick={() => navigate(!favoritesOnly)}
              aria-pressed={favoritesOnly}
            >
              <Heart size={17} />
              <span>Mes favoris</span>
              <span className="favorites-count">
                {preferences.favorites.length}
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="feedback-banner">
        <div className="page-width">
          <span>Une idée pour améliorer BestIA ?</span>
          <button onClick={() => setFeedbackOpen(true)}>
            <MessageCircle size={17} />
            Donner mon avis
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      <main>
        {isComparison ? (
          <Comparison
            selected={comparedTools}
            tools={tools}
            onChange={changeComparison}
            favorites={preferences.favorites}
            onFavorite={toggleFavorite}
            renderLogo={(tool) => <ToolLogo tool={tool} />}
            renderRating={(tool) => (
              <CommunityRating
                tool={tool}
                summary={votes.averages[tool.id]}
                status={votes.status}
              />
            )}
            voteStatus={votes.status}
            onRetry={votes.refresh}
          />
        ) : isDetail ? (
          selectedTool ? (
            <ToolDetail
              key={selectedTool.id}
              tool={selectedTool}
              tools={tools}
              logo={<ToolLogo tool={selectedTool} large />}
              actions={
                <>
                  {comparisonButton(selectedTool)}{" "}
                  <div className="detail-actions">
                    <a
                      className="primary-button"
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Découvrir {selectedTool.name}
                      <ExternalLink size={16} />
                    </a>
                    <button
                      className={`secondary-button ${preferences.favorites.includes(selectedTool.id) ? "saved" : ""}`}
                      onClick={() => toggleFavorite(selectedTool.id)}
                    >
                      <Heart size={17} />
                      {preferences.favorites.includes(selectedTool.id)
                        ? "Dans mes favoris"
                        : "Garder en favori"}
                    </button>
                  </div>
                </>
              }
              ratingPanel={
                <>
                  {" "}
                  <div className="detail-rating">
                    <CommunityRating
                      tool={selectedTool}
                      summary={votes.averages[selectedTool.id]}
                      status={votes.status}
                    />
                    <Rating
                      tool={selectedTool}
                      rating={votes.myVotes[selectedTool.id]}
                      onRate={rateTool}
                      disabled={votes.pending || votes.status !== "ready"}
                    />
                    {votes.myVotes[selectedTool.id] && (
                      <button
                        className="reset-link"
                        onClick={() => removeVote(selectedTool.id)}
                        disabled={votes.pending}
                      >
                        Supprimer mon vote
                      </button>
                    )}
                    <p>
                      La moyenne inclut les votes de tous les visiteurs et reste
                      disponible sur chaque appareil. Votre vote peut être
                      modifié depuis ce navigateur.
                    </p>
                    {!votes.myVotes[selectedTool.id] &&
                      preferences.ratings[selectedTool.id] && (
                        <p>
                          Votre ancienne note personnelle :{" "}
                          {preferences.ratings[selectedTool.id]}/5. Cliquez sur
                          une étoile pour la publier dans la moyenne.
                        </p>
                      )}
                    {votes.error && <p role="alert">{votes.error}</p>}
                  </div>
                  {votes.status === "error" && (
                    <button
                      className="secondary-button"
                      onClick={votes.refresh}
                    >
                      Réessayer
                    </button>
                  )}
                </>
              }
            />
          ) : (
            <section className="tool-page page-width">
              <h1 id="detail-title" tabIndex={-1}>
                Outil introuvable
              </h1>
              <p>Cette fiche n’existe pas dans le catalogue.</p>
              <a className="primary-button" href="#/">
                Retour au catalogue
              </a>
            </section>
          )
        ) : (
          <>
            {!favoritesOnly && (
              <section className="hero page-width">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span className="live-dot" />
                    L’INTELLIGENCE ARTIFICIELLE, SIMPLEMENT
                  </div>
                  <h1>
                    La bonne IA.
                    <br />
                    Pour toutes{" "}
                    <span className="hero-emphasis">
                      vos idées.
                      <svg viewBox="0 0 340 16" preserveAspectRatio="none">
                        <path d="M3 11 Q160 -1 337 8" />
                      </svg>
                    </span>
                  </h1>
                  <p className="hero-description">
                    Écrire, créer, coder… Découvrez les outils qui vous
                    <br className="desktop-break" /> simplifient la vie. Trouvez
                    celui qui vous ressemble.
                  </p>
                  <button
                    className="primary-button hero-button"
                    onClick={() =>
                      catalogueRef.current?.scrollIntoView({ block: "start" })
                    }
                  >
                    Trouver mon outil
                    <ArrowDown size={17} />
                  </button>
                  <div className="hero-proof">
                    <div className="mini-logos">
                      {tools
                        .filter((tool) =>
                          ["ChatGPT", "Claude", "Gamma"].includes(tool.name),
                        )
                        .slice(0, 3)
                        .map((tool) => (
                          <ToolLogo tool={tool} key={tool.id} />
                        ))}
                    </div>
                    <span>
                      <strong>{tools.length} outils sélectionnés</strong>
                      <span className="proof-dot">·</span>Des possibilités
                      infinies
                    </span>
                  </div>
                </div>
                <HeroArt />
              </section>
            )}
            <section
              id="catalogue"
              ref={catalogueRef}
              className={`catalogue page-width ${favoritesOnly ? "favorites-page" : ""}`}
              aria-labelledby="catalogue-title"
            >
              <div className="section-heading">
                <div>
                  <div className="section-eyebrow">
                    {favoritesOnly ? "VOTRE SÉLECTION" : "LE CATALOGUE"}
                  </div>
                  <h2 id="catalogue-title">
                    {favoritesOnly
                      ? "Vos meilleures trouvailles."
                      : "Explorez les possibilités."}
                  </h2>
                  <p>
                    {favoritesOnly
                      ? "Tous vos outils préférés, réunis au même endroit."
                      : "Une idée en tête ? Il y a une IA pour ça."}
                  </p>
                </div>
                <span className="selection-note">
                  <Sparkles size={15} />
                  Sélection faite avec soin
                </span>
              </div>
              {favoritesOnly && (
                <p className="local-note">
                  <Bookmark size={15} />
                  Vos favoris restent dans ce navigateur. Les notes moyennes
                  sont partagées entre tous les visiteurs.
                </p>
              )}
              <div className="search-row">
                <div className="search-box">
                  <Search size={21} />
                  <input
                    ref={searchRef}
                    type="search"
                    aria-label="Rechercher une intelligence artificielle"
                    placeholder="Un outil, une envie, un besoin…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query ? (
                    <button
                      aria-label="Effacer la recherche"
                      className="icon-button"
                      onClick={() => {
                        setQuery("");
                        searchRef.current?.focus();
                      }}
                    >
                      <X size={17} />
                    </button>
                  ) : (
                    <kbd>Ctrl K</kbd>
                  )}
                </div>
                <div className="select-wrap price-filter">
                  <SlidersHorizontal size={17} />
                  <select
                    aria-label="Filtrer par prix"
                    value={pricing}
                    onChange={(event) => setPricing(event.target.value)}
                  >
                    <option value="all">Tous les prix</option>
                    <option value="free">Gratuit</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Payant</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>
              <div
                className="category-filters"
                role="group"
                aria-label="Filtrer par catégorie"
              >
                <button
                  className={`category-button ${category === "all" ? "active" : ""}`}
                  onClick={() => setCategory("all")}
                  aria-pressed={category === "all"}
                >
                  <LayoutGrid size={16} />
                  Tout explorer
                  <span>
                    {favoritesOnly
                      ? preferences.favorites.length
                      : tools.length}
                  </span>
                </button>
                {categories.map((item) => {
                  const Icon = categoryIcons[item.id] || Sparkles;
                  return (
                    <button
                      key={item.id}
                      className={`category-button ${category === item.id ? "active" : ""}`}
                      onClick={() => setCategory(item.id)}
                      aria-pressed={category === item.id}
                    >
                      <Icon size={16} />
                      {item.label}
                      <span>{categoryCounts[item.id]}</span>
                    </button>
                  );
                })}
              </div>
              <div
                className="practical-filters"
                role="group"
                aria-label="Filtrer par langue et inscription"
              >
                <label>
                  <input
                    type="checkbox"
                    checked={frenchOnly}
                    onChange={(event) => setFrenchOnly(event.target.checked)}
                  />
                  Utilisable en français
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={noAccountOnly}
                    onChange={(event) => setNoAccountOnly(event.target.checked)}
                  />
                  Sans inscription
                </label>
                <p>
                  Français : interface ou contenus confirmés. Sans inscription :
                  au moins un usage de base, avec des limites précisées dans la
                  fiche.
                </p>
              </div>
              <div className="results-toolbar">
                <div className="results-count" role="status" aria-live="polite">
                  <strong>{results.length}</strong> outil
                  {results.length !== 1 ? "s" : ""}{" "}
                  {favoritesOnly ? "dans vos favoris" : "à découvrir"}
                  {filtersActive && (
                    <button onClick={resetFilters} className="reset-link">
                      Effacer les filtres
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div className="results-options">
                  <label className="sort-control">
                    <span>Trier par :</span>
                    <select
                      aria-label="Trier les outils"
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                    >
                      <option value="selection">Notre sélection</option>
                      <option value="name">Nom : A à Z</option>
                      <option value="rating">Les mieux notés</option>
                    </select>
                    <ChevronDown size={13} />
                  </label>
                  <div
                    className="view-toggle"
                    role="group"
                    aria-label="Mode d’affichage"
                  >
                    <button
                      aria-label="Affichage en grille"
                      aria-pressed={view === "grid"}
                      className={view === "grid" ? "active" : ""}
                      onClick={() => setView("grid")}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      aria-label="Affichage en liste"
                      aria-pressed={view === "list"}
                      className={view === "list" ? "active" : ""}
                      onClick={() => setView("list")}
                    >
                      <List size={17} />
                    </button>
                  </div>
                </div>
              </div>
              {storageError && (
                <p className="storage-warning" role="alert">
                  Votre navigateur bloque l’enregistrement. Vos favoris
                  resteront disponibles jusqu’à la fermeture de cette page.
                </p>
              )}
              {votes.status === "error" && (
                <div className="votes-warning" role="status">
                  <span>
                    Les notes sont momentanément indisponibles. Vous pouvez
                    continuer à explorer les outils.
                  </span>
                  <button onClick={votes.refresh}>Réessayer</button>
                </div>
              )}
              {votes.error && (
                <p className="votes-warning" role="alert">
                  {votes.error}
                </p>
              )}
              {results.length ? (
                <div
                  className={`tools-grid ${view === "list" ? "list-view" : ""}`}
                >
                  {results.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      favorite={preferences.favorites.includes(tool.id)}
                      rating={votes.myVotes[tool.id]}
                      summary={votes.averages[tool.id]}
                      voteStatus={votes.status}
                      voting={votes.pending}
                      onFavorite={toggleFavorite}
                      onRate={rateTool}
                      onOpen={openTool}
                      comparison={comparisonButton(tool)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  {favoritesOnly && !preferences.favorites.length ? (
                    <Heart size={32} />
                  ) : (
                    <Search size={32} />
                  )}
                  <h3>
                    {favoritesOnly && !preferences.favorites.length
                      ? "Vos coups de cœur commencent ici."
                      : "Aucun outil pour cette recherche."}
                  </h3>
                  <p>
                    {favoritesOnly && !preferences.favorites.length
                      ? "Un clic sur le cœur d’un outil et vous le retrouverez ici."
                      : "Essayez un autre mot-clé ou élargissez vos filtres."}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() =>
                      favoritesOnly && !preferences.favorites.length
                        ? navigate(false)
                        : resetFilters()
                    }
                  >
                    {favoritesOnly && !preferences.favorites.length
                      ? "Explorer les outils"
                      : "Réinitialiser les filtres"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {results.length > 0 && (
                <p className="catalogue-footnote">
                  Gratuit : accès sans abonnement. Freemium : accès gratuit
                  limité et options payantes.
                  <br />
                  Les offres évoluent : consultez le site de l’outil pour
                  connaître les conditions à jour.
                </p>
              )}
            </section>
            <section className="discovery-banner page-width">
              <div className="banner-icon">
                <WandSparkles size={27} />
              </div>
              <div>
                <h2>Votre prochaine idée mérite le bon outil.</h2>
                <p>
                  Explorez, essayez, gardez vos favoris. Le plus dur, c’est de
                  choisir.
                </p>
              </div>
              <button onClick={() => setAboutOpen(true)}>
                Découvrir BestIA
                <ArrowUpRight size={17} />
              </button>
              <span className="banner-spark" aria-hidden="true">
                ✧
              </span>
            </section>
          </>
        )}
      </main>
      <footer className="site-footer page-width">
        <div>
          <Brand small />
          <p>Un peu d’IA. Beaucoup de possibilités.</p>
        </div>
        <button
          aria-label="Donner mon avis depuis le pied de page"
          onClick={() => setFeedbackOpen(true)}
        >
          Donner mon avis <MessageCircle size={15} />
        </button>
        <span className="footer-caption">
          Pensé pour les curieux. Fait pour tout le monde.
        </span>
        <button onClick={() => setAboutOpen(true)}>
          À propos
          <ArrowUpRight size={13} />
        </button>
      </footer>
      {!isComparison && (
        <ComparisonTray selected={comparedTools} onChange={changeComparison} />
      )}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Check size={16} />
            {toast}
          </>
        )}
      </div>
      {feedbackOpen && (
        <Modal titleId="feedback-title" onClose={() => setFeedbackOpen(false)}>
          <FeedbackForm />
        </Modal>
      )}
      {aboutOpen && (
        <Modal titleId="about-title" onClose={() => setAboutOpen(false)}>
          <span className="about-icon">
            <Sparkles size={29} />
          </span>
          <p className="section-eyebrow">BIENVENUE CHEZ BESTIA</p>
          <h2 id="about-title">L’IA, à portée de toutes les idées.</h2>
          <p className="detail-description">
            BestIA vous aide à trouver un outil d’intelligence artificielle,
            simplement et en français. Une première sélection de {tools.length}{" "}
            outils, réunis par usage pour vous donner un point de départ.
          </p>
          <div className="about-item">
            <Search size={20} />
            <div>
              <h3>Trouvez votre prochain outil</h3>
              <p>
                Explorez les catégories et filtrez par modèle tarifaire.
                Freemium signifie qu’un accès gratuit limité existe, avec des
                options payantes.
              </p>
            </div>
          </div>
          <div className="about-item">
            <Heart size={20} />
            <div>
              <h3>Gardez ce qui vous plaît</h3>
              <p>
                Vos favoris restent dans ce navigateur. Les votes de 1 à 5
                étoiles sont conservés dans une base partagée : leur moyenne et
                leur nombre sont visibles sur tous les appareils, même après une
                mise à jour du site. Les anciennes notes locales ne sont
                publiées que si vous votez à nouveau.
              </p>
              <p>
                Sans compte, votre identité de vote est liée à ce navigateur.
                Vous pouvez modifier ou supprimer votre vote ici. Un autre
                appareil ou l’effacement des données du navigateur crée une
                nouvelle identité ; cela n’efface pas les votes déjà publiés.
              </p>
            </div>
          </div>
          <div className="about-item">
            <Bookmark size={20} />
            <div>
              <h3>Une sélection pour commencer</h3>
              <p>
                Le catalogue n’est pas exhaustif et les offres peuvent évoluer.
                Les liens des fiches vous permettent de vérifier les conditions
                auprès des éditeurs. Les logos appartiennent à leurs marques
                respectives.
              </p>
            </div>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setAboutOpen(false);
              navigate(false);
            }}
          >
            C’est parti
            <ArrowRight size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
