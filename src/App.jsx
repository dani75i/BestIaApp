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
import {
  pricingLabels,
  sanitizePreferences,
  selectTools,
} from "./lib/catalogue.js";

const categoryIcons = {
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

function Rating({ tool, rating, onRate }) {
  return (
    <div
      className="rating"
      role="group"
      aria-label={`Votre note pour ${tool.name}`}
    >
      <span className="rating-label">Ma note</span>
      <span className="rating-stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Noter ${tool.name} ${value} sur 5`}
            aria-pressed={value === rating}
            title={`${value}/5`}
            onClick={() => onRate(tool.id, value)}
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

function ToolCard({ tool, favorite, rating, onFavorite, onRate, onOpen }) {
  const mainCategory = categories.find(
    (category) => category.id === tool.categoryIds[0],
  );
  const CategoryIcon = categoryIcons[mainCategory?.id] || Sparkles;
  return (
    <article className="tool-card">
      <div className="card-top">
        <ToolLogo tool={tool} />
        <div className="card-title">
          <button className="tool-title" onClick={() => onOpen(tool)}>
            {tool.name}
            <ArrowUpRight size={16} />
          </button>
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
        <Rating tool={tool} rating={rating} onRate={onRate} />
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pricing, setPricing] = useState("all");
  const [sort, setSort] = useState("selection");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [view, setView] = useState("grid");
  const [selectedTool, setSelectedTool] = useState(null);
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

  const results = useMemo(
    () =>
      selectTools(tools, {
        query,
        category,
        pricing,
        sort,
        favoritesOnly,
        ...preferences,
      }),
    [query, category, pricing, sort, favoritesOnly, preferences],
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
  const rateTool = (id, value) => {
    setPreferences((previous) => ({
      ...previous,
      ratings: { ...previous.ratings, [id]: value },
    }));
    setToast("Votre note a été mise à jour");
  };
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setSort("selection");
  };
  const navigate = (favorites) => {
    setFavoritesOnly(favorites);
    resetFilters();
    catalogueRef.current?.scrollIntoView({ block: "start" });
  };
  const filtersActive = Boolean(
    query || category !== "all" || pricing !== "all",
  );

  return (
    <>
      <a className="skip-link" href="#catalogue">
        Aller au catalogue
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand-link"
            href="#"
            aria-label="BestIA, accueil"
            onClick={(event) => {
              event.preventDefault();
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
          <button
            className={`header-favorites ${favoritesOnly ? "selected" : ""}`}
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
      </header>
      <main>
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
                  <span className="proof-dot">·</span>Des possibilités infinies
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
              Vos favoris et notes sont conservés dans ce navigateur, sans
              compte.
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
                {favoritesOnly ? preferences.favorites.length : tools.length}
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
                  <option value="rating">Mes meilleures notes</option>
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
              Votre navigateur bloque l’enregistrement. Vos favoris et notes
              resteront disponibles jusqu’à la fermeture de cette page.
            </p>
          )}
          {results.length ? (
            <div className={`tools-grid ${view === "list" ? "list-view" : ""}`}>
              {results.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  favorite={preferences.favorites.includes(tool.id)}
                  rating={preferences.ratings[tool.id]}
                  onFavorite={toggleFavorite}
                  onRate={rateTool}
                  onOpen={setSelectedTool}
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
              Gratuit : accès sans abonnement. Freemium : accès gratuit limité
              et options payantes.
              <br />
              Les offres évoluent : consultez le site de l’outil pour connaître
              les conditions à jour.
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
      </main>
      <footer className="site-footer page-width">
        <div>
          <Brand small />
          <p>Un peu d’IA. Beaucoup de possibilités.</p>
        </div>
        <span className="footer-caption">
          Pensé pour les curieux. Fait pour tout le monde.
        </span>
        <button onClick={() => setAboutOpen(true)}>
          À propos
          <ArrowUpRight size={13} />
        </button>
      </footer>
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
      {selectedTool && (
        <Modal titleId="detail-title" onClose={() => setSelectedTool(null)}>
          <div className="detail-header">
            <ToolLogo tool={selectedTool} large />
            <div>
              <p className="section-eyebrow">À DÉCOUVRIR</p>
              <h2 id="detail-title">{selectedTool.name}</h2>
              <p>{selectedTool.tagline}</p>
            </div>
          </div>
          <p className="detail-description">{selectedTool.description}</p>
          <div className="detail-tags">
            {selectedTool.categoryIds.map((id) => (
              <span key={id} className={`category-tag category-${id}`}>
                {categories.find((item) => item.id === id)?.label}
              </span>
            ))}
          </div>
          <div className="detail-pricing">
            <span className={`price-tag price-${selectedTool.pricing}`}>
              <span />
              {pricingLabels[selectedTool.pricing]}
            </span>
            <p>{selectedTool.pricingNote}</p>
          </div>
          <h3>Pour vos envies de…</h3>
          <div className="detail-tags">
            {selectedTool.tags.map((tag) => (
              <span className="keyword" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="detail-rating">
            <Rating
              tool={selectedTool}
              rating={preferences.ratings[selectedTool.id]}
              onRate={rateTool}
            />
            {preferences.ratings[selectedTool.id] && (
              <button
                className="reset-link"
                onClick={() =>
                  setPreferences((previous) => {
                    const ratings = { ...previous.ratings };
                    delete ratings[selectedTool.id];
                    return { ...previous, ratings };
                  })
                }
              >
                Effacer ma note
              </button>
            )}
            <p>Votre avis personnel, enregistré dans ce navigateur.</p>
          </div>
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
          <p className="source-note">
            Fiche vérifiée le{" "}
            {new Date(`${selectedTool.checkedAt}T12:00:00`).toLocaleDateString(
              "fr-FR",
            )}{" "}
            ·{" "}
            <a
              href={selectedTool.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consulter la source officielle
              <ArrowUpRight size={11} />
            </a>
            <br />
            Les tarifs et les fonctionnalités peuvent évoluer.
          </p>
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
                Vos favoris et vos notes personnelles de 1 à 5 étoiles sont
                enregistrés dans ce navigateur. Ils ne sont pas partagés entre
                appareils et disparaissent si vous effacez les données du site.
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
