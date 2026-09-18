import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Columns3,
  Heart,
  X,
} from "lucide-react";
import { toolDetails, detailsCheckedAt } from "./data/toolDetails.js";
import { pricingLabels } from "./lib/catalogue.js";
import { languageLabels, accountLabels } from "./data/practicalInfo.js";
import { comparisonHref } from "./lib/comparison.js";
import { CopyButton } from "./ToolDetail.jsx";
import "./comparison.css";

export function CompareButton({ tool, selected, full, onToggle }) {
  return (
    <button
      className={`compare-button ${selected ? "is-compared" : ""}`}
      aria-label={`${selected ? "Retirer" : "Ajouter"} ${tool.name} ${selected ? "du" : "au"} comparateur`}
      aria-pressed={selected}
      disabled={full && !selected}
      title={
        full && !selected
          ? "Retirez un outil pour en choisir un autre (3 maximum)"
          : undefined
      }
      onClick={() => onToggle(tool.id)}
    >
      {selected ? <Check size={15} /> : <Columns3 size={15} />}
      {selected ? "Sélectionné" : "Comparer"}
    </button>
  );
}

export function ComparisonTray({ selected, onChange }) {
  if (!selected.length) return null;
  return (
    <aside className="comparison-tray" aria-label="Sélection à comparer">
      <div className="comparison-tray-inner">
        <div className="comparison-selection">
          <span className="comparison-count" role="status">
            {selected.length}/3 outils
            {selected.length === 1
              ? " · choisissez-en encore un"
              : selected.length === 3
                ? " · maximum atteint"
                : ""}
          </span>
          <div className="comparison-chips">
            {selected.map((tool) => (
              <button
                key={tool.id}
                onClick={() =>
                  onChange(
                    selected.filter((t) => t.id !== tool.id).map((t) => t.id),
                  )
                }
                aria-label={`Retirer ${tool.name} de la sélection`}
              >
                {tool.name}
                <X size={14} />
              </button>
            ))}
          </div>
        </div>
        <div className="comparison-tray-actions">
          {selected.length >= 2 ? (
            <a
              className="primary-button"
              href={comparisonHref(selected.map((t) => t.id))}
            >
              Comparer les {selected.length} outils <Columns3 size={17} />
            </a>
          ) : (
            <button className="primary-button" disabled>
              Comparer les outils
            </button>
          )}
          <button className="reset-link" onClick={() => onChange([])}>
            Tout retirer
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Comparison({
  selected,
  tools,
  onChange,
  favorites,
  onFavorite,
  renderLogo,
  renderRating,
  voteStatus,
  onRetry,
}) {
  const ids = selected.map((t) => t.id);
  const available = tools
    .filter((t) => !ids.includes(t.id))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const href = comparisonHref(ids);
  const shareUrl = `${location.origin}${location.pathname}${href}`;
  const rows = [
    ["En quelques mots", (tool) => tool.description],
    [
      "Usages",
      (tool) => (
        <ul>
          {toolDetails[tool.id].uses.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ),
    ],
    ["Pour qui ?", (tool) => toolDetails[tool.id].audience],
    [
      "Interface en français",
      (tool) => languageLabels[tool.practical.interfaceFr],
    ],
    [
      "Contenus ou consignes en français",
      (tool) => languageLabels[tool.practical.contentFr],
    ],
    [
      "Inscription",
      (tool) => (
        <>
          <strong>{accountLabels[tool.practical.account]}</strong>
          <p>{tool.practical.note}</p>
        </>
      ),
    ],
    ["Limites du gratuit", (tool) => tool.practical.freeLimit],
    [
      "Prix et limites de l’offre",
      (tool) => (
        <>
          <span className={`price-tag price-${tool.pricing}`}>
            <span />
            {pricingLabels[tool.pricing]}
          </span>
          <p>{tool.pricingNote}</p>
        </>
      ),
    ],
    ["Notes des visiteurs", (tool) => renderRating(tool)],
    [
      "Points forts",
      (tool) => (
        <ul>
          {toolDetails[tool.id].pros.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ),
    ],
    [
      "À prendre en compte",
      (tool) => (
        <ul>
          {toolDetails[tool.id].cons.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ),
    ],
    [
      "Pour approfondir",
      (tool) => (
        <div className="comparison-links">
          <a href={`#/outil/${tool.id}`}>
            Fiche de {tool.name}
            <ArrowUpRight size={15} />
          </a>
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Site officiel
            <ArrowUpRight size={15} />
          </a>
        </div>
      ),
    ],
    [
      "Source et vérification",
      (tool) => (
        <>
          <a
            className="source-link"
            href={tool.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source officielle
            <ArrowUpRight size={14} />
          </a>
          <p>
            Consultée le{" "}
            {new Date(
              `${toolDetails[tool.id].checkedAt || detailsCheckedAt}T12:00:00`,
            ).toLocaleDateString("fr-FR")}
          </p>
        </>
      ),
    ],
  ];
  return (
    <section className="comparison-page page-width">
      <a href="#/" className="comparison-back">
        <ArrowLeft size={16} />
        Retour au catalogue
      </a>
      <div className="comparison-heading">
        <div>
          <p className="section-eyebrow">LE CHOIX DEVIENT PLUS SIMPLE</p>
          <h1 id="comparison-title" tabIndex={-1}>
            Les IA, côte à côte.
          </h1>
          <p>
            Comparez leurs usages et leurs limites pour trouver celle qui vous
            convient.
          </p>
        </div>
        {selected.length >= 2 && (
          <CopyButton key={href} value={shareUrl}>
            Partager la comparaison
          </CopyButton>
        )}
      </div>
      <div className="comparison-controls">
        <label htmlFor="comparison-add">
          {selected.length < 3 ? "Ajouter un outil" : "3 outils sélectionnés"}
        </label>
        <select
          id="comparison-add"
          value=""
          disabled={selected.length >= 3}
          onChange={(event) => {
            if (event.target.value) onChange([...ids, event.target.value]);
          }}
        >
          <option value="">
            {selected.length >= 3
              ? "Retirez ou remplacez un outil"
              : "Choisir dans le catalogue…"}
          </option>
          {available.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
        {selected.length > 0 && (
          <button className="reset-link" onClick={() => onChange([])}>
            Tout retirer
          </button>
        )}
      </div>
      {selected.length < 2 ? (
        <div className="comparison-empty detail-panel">
          <Columns3 size={32} />
          <h2>
            Choisissez{" "}
            {selected.length === 1 ? "un deuxième outil" : "2 ou 3 outils"}
          </h2>
          <p>
            Utilisez la liste ci-dessus ou le bouton « Comparer » des cartes du
            catalogue.
          </p>
          {selected.map((tool) => (
            <div className="comparison-single" key={tool.id}>
              {renderLogo(tool)}
              <strong>{tool.name}</strong>
              <button
                className="icon-button"
                onClick={() => onChange([])}
                aria-label={`Retirer ${tool.name} du comparateur`}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p id="comparison-scroll-help" className="comparison-help">
            Sur petit écran, faites glisser le tableau horizontalement. Les noms
            et les critères restent visibles dans le tableau.
          </p>
          <div
            className="comparison-table-scroll"
            role="region"
            aria-label="Tableau comparatif des outils"
            aria-describedby="comparison-scroll-help"
            tabIndex={0}
          >
            <table className="comparison-table">
              <caption className="sr-only">
                Comparaison de {selected.map((t) => t.name).join(", ")}
              </caption>
              <colgroup>
                <col className="comparison-criteria" />
                {selected.map((tool) => (
                  <col key={tool.id} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    Votre sélection<span>2 à 3 outils</span>
                  </th>
                  {selected.map((tool, index) => (
                    <th key={tool.id} scope="col">
                      <div className="comparison-tool-title">
                        {renderLogo(tool)}
                        <a href={`#/outil/${tool.id}`}>{tool.name}</a>
                        <button
                          className="icon-button"
                          aria-label={`Retirer ${tool.name} du comparateur`}
                          onClick={() =>
                            onChange(ids.filter((id) => id !== tool.id))
                          }
                        >
                          <X size={17} />
                        </button>
                      </div>
                      <div className="comparison-tool-controls">
                        <button
                          className={`compare-favorite ${favorites.includes(tool.id) ? "saved" : ""}`}
                          aria-label={`${favorites.includes(tool.id) ? "Retirer" : "Ajouter"} ${tool.name} ${favorites.includes(tool.id) ? "des" : "aux"} favoris`}
                          aria-pressed={favorites.includes(tool.id)}
                          onClick={() => onFavorite(tool.id)}
                        >
                          <Heart size={15} />
                          Favori
                        </button>
                        <select
                          value=""
                          aria-label={`Remplacer ${tool.name}`}
                          onChange={(event) => {
                            if (event.target.value)
                              onChange(
                                ids.map((id, i) =>
                                  i === index ? event.target.value : id,
                                ),
                              );
                          }}
                        >
                          <option value="">Remplacer…</option>
                          {available.map((other) => (
                            <option key={other.id} value={other.id}>
                              {other.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, render]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {selected.map((tool) => (
                      <td key={tool.id}>{render(tool)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {voteStatus === "error" && (
            <p role="alert" className="comparison-help">
              Les notes sont indisponibles.{" "}
              <button className="reset-link" onClick={onRetry}>
                Réessayer
              </button>
            </p>
          )}
          <p className="comparison-help">
            Les notes reflètent les votes des visiteurs : tenez compte du nombre
            de votes. Les offres peuvent évoluer ; vérifiez les conditions
            auprès des éditeurs.
          </p>
        </>
      )}
    </section>
  );
}
