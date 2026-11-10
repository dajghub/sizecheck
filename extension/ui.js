// ui.js — SizeCheck Extension · Identité « mètre ruban » partagée
// Chargé après sizes.js, avant popup.js / content.js.
// Mêmes jetons, composants et étiquette de résultat que le site (index.html) :
// toute évolution visuelle du site doit être reportée ici.

/* Police : Archivo embarquée (fonts/, SIL OFL). Nom propre à l'extension pour
   ne jamais entrer en conflit avec une police « Archivo » d'une page visitée. */
const SC_FONT_FAMILY = 'SizeCheck Archivo';
const SC_FONT_PATH = 'fonts/archivo-latin.woff2';

const SC_UI_CSS = `
  .sc-root {
    --alu: #E3E5E6; --alu-deep: #CDD1D4; --paper: #FFFFFF; --ink: #202326;
    --muted: #575D62; --rule: #D3D7DA; --tape: #F6C500; --tape-edge: #DDB000;
    font-family: '${SC_FONT_FAMILY}', system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-size: 14px; font-weight: 400; font-style: normal; line-height: 1.45;
    letter-spacing: normal; text-transform: none; text-align: left;
    color: var(--ink); background: var(--alu);
    -webkit-font-smoothing: antialiased;
  }
  /* Remises à zéro en :where() (spécificité nulle) : les composants ci-dessous gardent la main */
  :where(.sc-root) *, :where(.sc-root) *::before, :where(.sc-root) *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :where(.sc-root) :where(button, input) { font: inherit; color: inherit; letter-spacing: inherit; }
  :where(.sc-root) button { cursor: pointer; }
  :where(.sc-root) a { color: inherit; text-underline-offset: 3px; }
  .sc-root :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

  /* En-tête : mot-symbole + bande de mètre */
  .sc-top {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 11px 14px 9px;
  }
  .sc-wordmark {
    font-weight: 900; font-stretch: 70%; font-size: 21px; letter-spacing: -0.01em;
    line-height: 1; text-decoration: none;
  }
  .sc-top-aside { font-size: 13px; font-weight: 600; }
  .sc-strip {
    height: 12px; background-color: var(--tape); border-bottom: 2px solid var(--tape-edge);
    background-image:
      repeating-linear-gradient(90deg, var(--ink) 0 1.5px, transparent 1.5px 30px),
      repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 6px);
    background-size: 100% 8px, 100% 4px;
    background-repeat: no-repeat;
  }

  .sc-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 12px; }
  .sc-step { font-size: 13px; font-weight: 700; margin-bottom: 7px; }
  .sc-note { font-size: 12px; color: var(--muted); }
  .sc-note b { color: var(--ink); }

  /* Homme / Femme */
  .sc-seg {
    display: grid; grid-template-columns: 1fr 1fr;
    border: 1.5px solid var(--ink); border-radius: 6px; overflow: hidden;
    background: var(--paper);
  }
  .sc-seg button { border: 0; background: transparent; padding: 8px 0; font-size: 13px; font-weight: 700; }
  .sc-seg button + button { border-left: 1.5px solid var(--ink); }
  .sc-seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
  .sc-seg button:focus-visible { outline-offset: -5px; outline-color: var(--tape); }

  /* Avec ma pointure / Avec mon pied en cm */
  .sc-modes { display: flex; gap: 18px; border-bottom: 1.5px solid var(--alu-deep); }
  .sc-modes button {
    border: 0; background: none; padding: 6px 0 7px; margin-bottom: -1.5px;
    font-size: 13px; font-weight: 600; color: var(--muted);
    border-bottom: 3px solid transparent;
  }
  .sc-modes button[aria-pressed="true"] { color: var(--ink); border-bottom-color: var(--ink); }
  .sc-modes button:hover { color: var(--ink); }

  /* Marques et pointures */
  .sc-brands { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
  .sc-brand {
    min-height: 42px; padding: 6px 7px;
    display: flex; align-items: flex-end; text-align: left;
    background: var(--paper); border: 1.5px solid var(--alu-deep); border-radius: 4px;
    font-weight: 800; font-stretch: 72%; font-size: 15px; line-height: 1.02;
  }
  .sc-sizes { display: grid; grid-template-columns: repeat(auto-fill, minmax(46px, 1fr)); gap: 5px; }
  .sc-size {
    height: 38px; padding: 0 2px;
    background: var(--paper); border: 1.5px solid var(--alu-deep); border-radius: 4px;
    font-weight: 700; font-stretch: 78%; font-size: 16px; font-variant-numeric: tabular-nums;
  }
  .sc-brand:hover, .sc-size:hover { border-color: var(--ink); }
  .sc-brand[aria-pressed="true"], .sc-size[aria-pressed="true"] {
    background: var(--ink); border-color: var(--ink); color: var(--tape);
  }

  /* Longueur du pied */
  .sc-cm {
    display: flex; align-items: baseline; gap: 6px;
    background: var(--paper); border: 1.5px solid var(--alu-deep); border-radius: 4px;
    padding: 4px 12px;
  }
  .sc-cm:focus-within { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
  .sc-cm input:focus-visible { outline: none; }
  .sc-cm input {
    flex: 1; min-width: 0; border: 0; outline: 0; background: transparent;
    font-weight: 850; font-stretch: 66%; font-size: 30px; line-height: 1.15;
    font-variant-numeric: tabular-nums;
  }
  .sc-cm span { font-weight: 700; color: var(--muted); }
  .sc-hint { font-size: 12px; color: var(--muted); margin-top: 6px; }

  /* L'étiquette de boîte */
  .sc-label { background: var(--paper); border: 2px solid var(--ink); border-radius: 4px; }
  .sc-label-head { padding: 10px 12px 9px; border-bottom: 2px solid var(--ink); }
  .sc-label-head h2 { font-size: 18px; font-weight: 850; font-stretch: 72%; line-height: 1.1; }
  .sc-label-head p { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .sc-eq { width: 100%; border-collapse: collapse; }
  .sc-eq thead th { font-size: 11px; font-weight: 600; color: var(--muted); text-align: left; padding: 7px 12px 3px; }
  .sc-eq .r { text-align: right; }
  .sc-eq tbody th, .sc-eq tbody td { padding: 7px 12px; border-top: 1px solid var(--rule); vertical-align: middle; }
  .sc-eq tbody th { text-align: left; font-weight: 800; font-stretch: 74%; font-size: 16px; line-height: 1.1; }
  .sc-eq-size {
    text-align: right; white-space: nowrap;
    font-weight: 850; font-stretch: 66%; font-size: 24px; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .sc-eq-alt { display: block; margin-top: 2px; font-size: 11px; font-weight: 600; font-stretch: 100%; color: var(--muted); }
  .sc-eq-len { text-align: right; white-space: nowrap; font-size: 12px; font-variant-numeric: tabular-nums; }
  .sc-eq-gap { display: block; font-size: 11px; color: var(--muted); }
  .sc-eq-gap.is-exact { color: var(--ink); font-weight: 700; }
  .sc-eq tr.is-page { background: var(--tape); }
  .sc-eq tr.is-page .sc-eq-alt, .sc-eq tr.is-page .sc-eq-gap { color: var(--ink); }
  .sc-here { display: block; margin-top: 2px; font-size: 11px; font-weight: 600; font-stretch: 100%; }

  /* La pointure de la page, en grand sur le mètre */
  .sc-focus {
    display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
    padding: 18px 12px 10px;
    background-color: var(--tape);
    background-image:
      repeating-linear-gradient(90deg, var(--ink) 0 1.5px, transparent 1.5px 30px),
      repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 6px);
    background-size: 100% 9px, 100% 5px;
    background-repeat: no-repeat;
  }
  .sc-focus-size {
    font-weight: 850; font-stretch: 64%; font-size: 64px; line-height: .9;
    font-variant-numeric: tabular-nums;
  }
  .sc-focus-unit { font-weight: 800; font-stretch: 72%; font-size: 20px; }
  .sc-focus-alt { font-size: 13px; font-weight: 600; }

  .sc-fits { padding: 2px 12px 12px; border-top: 2px solid var(--ink); }
  .sc-fits h3 { font-size: 13px; font-weight: 700; margin: 9px 0 2px; }
  .sc-fits p { font-size: 12px; margin-top: 5px; }

  .sc-link-btn {
    align-self: flex-start; border: 0; background: none;
    font-size: 13px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px;
  }
`;

/** « pile » / « +3 mm » / « −2 mm » — même formulation que le site */
function scGapText(mm) {
  if (mm === 0) return 'pile';
  return (mm > 0 ? '+' : '−') + Math.abs(mm) + ' mm';
}

/** Le nom de la marque précède déjà le conseil : « Vans. Taille grand… » */
function scTipText(b) {
  if (!b.tip.startsWith(b.name + ' ')) return b.tip;
  const rest = b.tip.slice(b.name.length + 1);
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Sous-titre de l'étiquette : d'où vient la longueur de pied */
function scSourceText(s, cm) {
  if (s.mode === 'cm') return `Pour un pied de ${scFr(cm)} cm, rayon ${s.genre}.`;
  return `${SC_BRANDS[s.sourceBrand].name} ${scFr(s.sourceSize)} ${s.genre}, soit ${scFr(cm)} cm de pied.`;
}

/** Étiquette « Tes pointures équivalentes » : marques dans l'ordre fixe du site,
    la marque de la page (si connue) surlignée en jaune. */
function scLabelHTML(s, cm, pageKey) {
  const keys = Object.keys(SC_BRANDS)
    .filter(k => s.mode === 'cm' || k !== s.sourceBrand || k === pageKey);
  const rows = keys.map(key => {
    const matches = scFindBestMatches(key, cm, s.genre, 2);
    return { key, b: SC_BRANDS[key], best: matches[0], second: scSecondIfTie(matches) };
  }).filter(r => r.best);

  const rowsHTML = rows.map(({ key, b, best, second }) => {
    const mm = Math.round((best.cm - cm) * 10);
    const isPage = key === pageKey;
    return `
      <tr${isPage ? ' class="is-page"' : ''}>
        <th scope="row">${b.name}${isPage ? '<span class="sc-here">cette page</span>' : ''}</th>
        <td class="sc-eq-size">${scFr(best.label)}${second ? `<span class="sc-eq-alt">ou ${scFr(second.label)}</span>` : ''}</td>
        <td class="sc-eq-len">${scFr(best.cm)} cm<span class="sc-eq-gap${mm === 0 ? ' is-exact' : ''}">${scGapText(mm)}</span></td>
      </tr>`;
  }).join('');

  // Conseils : celui de la marque de la page s'il y en a une, sinon tous (comme le site)
  const tipRows = rows.filter(r => scHasTip(r.b, s.genre) && (!pageKey || r.key === pageKey));
  const tipsHTML = tipRows.length ? `
    <div class="sc-fits">
      <h3>Bon à savoir</h3>
      ${tipRows.map(r => `<p><strong>${r.b.name}.</strong> ${scTipText(r.b)}</p>`).join('')}
    </div>` : '';

  return `
    <div class="sc-label">
      <div class="sc-label-head">
        <h2>Tes pointures équivalentes</h2>
        <p>${scSourceText(s, cm)}</p>
      </div>
      <table class="sc-eq">
        <thead><tr><th scope="col">Marque</th><th scope="col" class="r">Pointure EU</th><th scope="col" class="r">Longueur</th></tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
      ${tipsHTML}
    </div>`;
}

/** Contrôles communs (rayon, méthode, marque, pointure, cm) */
function scSegHTML(genre) {
  return `
    <div class="sc-seg" role="group" aria-label="Rayon">
      <button type="button" data-action="genre" data-value="homme" aria-pressed="${genre === 'homme'}">Homme</button>
      <button type="button" data-action="genre" data-value="femme" aria-pressed="${genre === 'femme'}">Femme</button>
    </div>`;
}

function scModesHTML(mode) {
  return `
    <div class="sc-modes" role="group" aria-label="Méthode">
      <button type="button" data-action="mode" data-value="brand" aria-pressed="${mode === 'brand'}">Avec ma pointure</button>
      <button type="button" data-action="mode" data-value="cm" aria-pressed="${mode === 'cm'}">Avec mon pied en cm</button>
    </div>`;
}

function scBrandsHTML(sourceBrand) {
  return Object.entries(SC_BRANDS).map(([key, b]) =>
    `<button type="button" class="sc-brand" data-action="brand" data-value="${key}" aria-pressed="${sourceBrand === key}">${b.name}</button>`
  ).join('');
}

function scSizesHTML(s) {
  return scGetSizes(s.sourceBrand, s.genre).map(([label]) =>
    `<button type="button" class="sc-size" data-action="size" data-value="${label}" aria-pressed="${s.sourceSize === label}">${scFr(label)}</button>`
  ).join('');
}

function scCmFieldHTML(footCm) {
  return `
    <div class="sc-cm">
      <input type="text" inputmode="decimal" autocomplete="off" placeholder="26,5" data-action="cmInput"
             value="${scIsValidCm(footCm) ? scFr(footCm) : ''}" aria-label="Longueur du pied en centimètres">
      <span>cm</span>
    </div>
    <p class="sc-hint">Talon contre un mur, mesure jusqu'à l'orteil le plus long, en fin de journée. Garde la plus grande mesure des deux pieds.</p>`;
}

/** Lecture de la saisie cm : accepte « 26,5 » comme « 26.5 » */
function scParseCm(v) {
  const n = parseFloat(String(v).replace(',', '.'));
  return scIsValidCm(n) ? n : null;
}
