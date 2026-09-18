import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { categories } from "./data/tools.js";
import { toolDetails, detailsCheckedAt } from "./data/toolDetails.js";
import { pricingLabels } from "./lib/catalogue.js";
import { languageLabels, accountLabels } from "./data/practicalInfo.js";
import { exampleOutcomes } from "./data/exampleOutcomes.js";
import "./details.css";

export function CopyButton({ value, children }) {
  const [state, setState] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("manual");
    }
  }
  return (
    <div className="copy-control">
      <button className="secondary-button" onClick={copy}>
        {state === "copied" ? <Check size={16} /> : <Copy size={16} />}
        {children}
      </button>
      <span role="status">{state === "copied" && "Copié !"}</span>
      {state === "manual" && (
        <label>
          Copiez ce texte manuellement
          <textarea readOnly value={value} onFocus={(e) => e.target.select()} />
        </label>
      )}
    </div>
  );
}

export default function ToolDetail({
  tool,
  tools,
  logo,
  ratingPanel,
  actions,
}) {
  const detail = toolDetails[tool.id];
  const alternatives = tools
    .filter(
      (other) =>
        other.id !== tool.id && other.categoryIds[0] === tool.categoryIds[0],
    )
    .slice(0, 3);
  return (
    <article className="tool-page page-width">
      <nav aria-label="Fil d’Ariane" className="detail-breadcrumb">
        <a href="#/">
          <ArrowLeft size={16} />
          Retour au catalogue
        </a>
        <span>/</span>
        <span>{tool.name}</span>
      </nav>
      <header className="tool-page-hero">
        <div className="detail-header">
          {logo}
          <div>
            <p className="section-eyebrow">LE BON OUTIL POUR VOTRE IDÉE</p>
            <h1 id="detail-title" tabIndex={-1}>
              {tool.name}
            </h1>
            <p>{tool.tagline}</p>
          </div>
        </div>
        <div className="detail-tags">
          {tool.categoryIds.map((id) => (
            <span key={id} className={`category-tag category-${id}`}>
              {categories.find((c) => c.id === id)?.label}
            </span>
          ))}
        </div>
        <p className="detail-description">{tool.description}</p>
        {actions}
      </header>
      <div className="detail-layout">
        <div className="detail-editorial">
          <section className="detail-panel">
            <p className="section-eyebrow">POUR BIEN COMMENCER</p>
            <h2>À qui s’adresse {tool.name} ?</h2>
            <p>{detail.audience}</p>
            <h3>Ce que vous pouvez en faire</h3>
            <ul>
              {detail.uses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>Avantages et limites</h2>
            <div className="pros-cons">
              <div>
                <h3>
                  <Check size={17} />
                  Les points forts
                </h3>
                <ul>
                  {detail.pros.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>À prendre en compte</h3>
                <ul>
                  {detail.cons.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="source-note">
              Notre lecture éditoriale des fonctionnalités annoncées par
              l’éditeur.
            </p>
          </section>
          <section className="detail-panel example-panel">
            <p className="section-eyebrow">À VOUS D’ESSAYER</p>
            <h2>Une idée pour votre premier essai</h2>
            <blockquote>{detail.example}</blockquote>
            <CopyButton value={detail.example}>Copier l’exemple</CopyButton>
            <div className="example-outcome">
              <h3>Résultat visé</h3>
              <p>{exampleOutcomes[tool.id]}</p>
              <small>
                Illustration éditoriale proposée par BestIA, pas un résultat de
                test de l’outil.
              </small>
            </div>
            <p className="source-note">
              Exemple proposé par BestIA, à adapter à votre besoin et aux
              options de l’outil.
            </p>
          </section>
          <section className="detail-panel">
            <h2>Sources et mise à jour</h2>
            <p>
              Sources officielles consultées le{" "}
              {new Date(
                `${detail.checkedAt || detailsCheckedAt}T12:00:00`,
              ).toLocaleDateString("fr-FR")}
              . Les offres et les fonctionnalités peuvent évoluer.
            </p>
            <a
              className="source-link"
              href={tool.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consulter la source officielle <ArrowUpRight size={16} />
            </a>
          </section>
        </div>
        <aside className="detail-sidebar" aria-label="Informations pratiques">
          <section className="detail-panel">
            <h2>Prix et accès</h2>
            <span className={`price-tag price-${tool.pricing}`}>
              <span />
              {pricingLabels[tool.pricing]}
            </span>
            <p>{tool.pricingNote}</p>
            <a
              className="source-link"
              href={tool.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vérifier les conditions actuelles <ArrowUpRight size={16} />
            </a>
            <h3>Les limites du gratuit</h3>
            <p>{tool.practical.freeLimit}</p>
          </section>
          <section className="detail-panel practical-panel">
            <h2>Langue et inscription</h2>
            <dl>
              <dt>Interface en français</dt>
              <dd>{languageLabels[tool.practical.interfaceFr]}</dd>
              <dt>Contenus ou consignes en français</dt>
              <dd>{languageLabels[tool.practical.contentFr]}</dd>
              <dt>Inscription</dt>
              <dd>{accountLabels[tool.practical.account]}</dd>
            </dl>
            <p>{tool.practical.note}</p>
            <p className="source-note">
              Informations consultées le{" "}
              {new Date(
                `${tool.practical.checkedAt}T12:00:00`,
              ).toLocaleDateString("fr-FR")}
              . « Non confirmé » ne signifie pas indisponible.
            </p>
            <ul className="practical-sources">
              {[...new Set([tool.sourceUrl, ...tool.practical.sources])].map(
                (url, index) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {index === 0
                        ? "Offre officielle"
                        : `Documentation · ${new URL(url).hostname}`}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>L’avis des visiteurs</h2>
            {ratingPanel}
          </section>
          <section className="detail-panel">
            <h2>
              <Share2 size={18} />
              Partager cette fiche
            </h2>
            <p>Gardez le lien ou envoyez-le à un proche.</p>
            <CopyButton
              value={`${location.origin}${location.pathname}#/outil/${tool.id}`}
            >
              Copier le lien
            </CopyButton>
          </section>
        </aside>
      </div>
      <section className="detail-alternatives">
        <p className="section-eyebrow">POUR COMPARER</p>
        <h2>D’autres outils à découvrir</h2>
        <div>
          {alternatives.map((other) => (
            <a
              className="detail-panel"
              href={`#/outil/${other.id}`}
              key={other.id}
            >
              <strong>
                {other.name}
                <ArrowUpRight size={17} />
              </strong>
              <p>{other.tagline}</p>
              <span className={`price-tag price-${other.pricing}`}>
                <span />
                {pricingLabels[other.pricing]}
              </span>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
