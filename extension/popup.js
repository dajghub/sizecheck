// popup.js — SizeCheck Extension · Popup (fallback manuel)
// Dépend de sizes.js (chargé avant)

const state = {
  mode: 'brand',   // 'brand' = depuis ma marque, 'cm' = depuis la longueur de mon pied
  sourceBrand: null,
  sourceSize: null,
  footCm: null,
  pageBrand: null,
  genre: 'homme'
};

function renderBrandGrid() {
  const pageBrandName = state.pageBrand ? SC_BRANDS[state.pageBrand]?.name : null;
  document.getElementById('brand-grid').innerHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
    <button class="brand-btn ${state.sourceBrand === key ? 'active' : ''}" aria-pressed="${state.sourceBrand === key}" data-action="brand" data-value="${key}">
      <img src="${b.logo}" alt="${b.name}" loading="lazy">
      <span class="bname">${b.name}</span>
    </button>
  `).join('');

  if (pageBrandName) {
    const existing = document.getElementById('page-brand-badge');
    if (!existing) {
      const badge = document.createElement('div');
      badge.id = 'page-brand-badge';
      badge.className = 'page-brand-badge';
      badge.textContent = `Tu es sur ${pageBrandName} 📍`;
      document.getElementById('brand-grid').before(badge);
    }
  }
}

function buildResultsHTML(cm) {
  const allResults = Object.entries(SC_BRANDS)
    .filter(([key]) => state.mode === 'cm' || key !== state.sourceBrand || key === state.pageBrand)
    .map(([key, b]) => {
      const matches = scFindBestMatches(key, cm, state.genre, 2);
      return { key, b, best: matches[0], second: scSecondIfTie(matches) };
    })
    .filter(r => r.best)
    .sort((a, b) => {
      if (a.key === state.pageBrand) return -1;
      if (b.key === state.pageBrand) return 1;
      return a.best.diff - b.best.diff;
    });

  return allResults.map(({ key, b, best, second }) => {
      const isPage = key === state.pageBrand;
      return `
        <div class="result-row ${isPage ? 'page-result' : ''}">
          <img class="result-logo" src="${b.logo}" alt="${b.name}" loading="lazy">
          <span class="result-name">${b.name}${isPage ? ' <span class="on-page-tag">cette page</span>' : ''}</span>
          <span class="result-size">EU ${best.label}${second ? `<span class="result-second">ou ${second.label}</span>` : ''}</span>
        </div>
      `;
    }).join('');
}

function updateCmResults() {
  const el = document.getElementById('cm-results');
  if (!el) return;
  el.innerHTML = scIsValidCm(state.footCm) ? `
    <div class="card" style="margin-top:10px">
      <div class="label">Équivalences EU</div>
      <div class="results">${buildResultsHTML(state.footCm)}</div>
    </div>` : '';
}

function renderStep2() {
  const container = document.getElementById('step2');

  if (state.mode === 'cm') {
    container.innerHTML = `
      <div class="card">
        <div class="label">Longueur de mon pied</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <input class="cm-input" id="cm-input" type="number" inputmode="decimal" step="0.1" min="18" max="35" placeholder="26.5"
                 value="${scIsValidCm(state.footCm) ? state.footCm : ''}" aria-label="Longueur du pied en centimètres">
          <span style="font-size:12px;font-weight:700;color:#475569">cm</span>
        </div>
        <p style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5">📏 Talon contre un mur, mesure jusqu'à l'orteil le plus long, en fin de journée. Garde la plus grande mesure des deux pieds.</p>
      </div>
      <div id="cm-results"></div>
    `;
    updateCmResults();
    return;
  }

  if (!state.sourceBrand) {
    container.innerHTML = '<p style="font-size:11px;color:#94a3b8;text-align:center;padding:6px 0 2px">Sélectionne ta marque habituelle ci-dessus</p>';
    return;
  }

  const sizesHTML = scGetSizes(state.sourceBrand, state.genre).map(([label]) => `
    <button class="size-btn ${state.sourceSize === label ? 'active' : ''}" aria-pressed="${state.sourceSize === label}" data-action="size" data-value="${label}">${label}</button>
  `).join('');

  const cm = state.sourceSize ? scGetCm(state.sourceBrand, state.sourceSize, state.genre) : null;
  const resultsHTML = cm ? buildResultsHTML(cm) : '';

  container.innerHTML = `
    <div class="card">
      <div class="label">Ma pointure habituelle</div>
      <div class="size-grid">${sizesHTML}</div>
    </div>
    ${resultsHTML ? `
      <div class="card">
        <div class="label">Équivalences EU</div>
        <div class="results">${resultsHTML}</div>
      </div>
    ` : ''}
  `;
}

function applyGenreStyles() {
  const active = 'background:#fff;color:#1d4ed8;box-shadow:0 1px 3px rgba(0,0,0,0.1)';
  const inactive = 'background:transparent;color:#64748b';
  const btnH = document.getElementById('btn-homme');
  const btnF = document.getElementById('btn-femme');
  btnH.style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${state.genre === 'homme' ? active : inactive}`;
  btnF.style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${state.genre === 'femme' ? active : inactive}`;
  btnH.setAttribute('aria-pressed', state.genre === 'homme');
  btnF.setAttribute('aria-pressed', state.genre === 'femme');
}

function setGenre(g) {
  if (state.genre === g) return;
  state.genre = g;
  if (state.mode === 'brand') {
    state.sourceSize = null;
    chrome.storage.local.set({ sc_genre: g, sc_source_size: null });
  } else {
    chrome.storage.local.set({ sc_genre: g });
  }
  applyGenreStyles();
  render();
}

function applyModeStyles() {
  const active = 'background:#fff;color:#1d4ed8;box-shadow:0 1px 3px rgba(0,0,0,0.1)';
  const inactive = 'background:transparent;color:#64748b';
  const btnB = document.getElementById('btn-mode-brand');
  const btnC = document.getElementById('btn-mode-cm');
  btnB.style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${state.mode === 'brand' ? active : inactive}`;
  btnC.style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${state.mode === 'cm' ? active : inactive}`;
  btnB.setAttribute('aria-pressed', state.mode === 'brand');
  btnC.setAttribute('aria-pressed', state.mode === 'cm');
  document.getElementById('brand-card').style.display = state.mode === 'cm' ? 'none' : '';
}

function setMode(m) {
  if (state.mode === m) return;
  state.mode = m;
  chrome.storage.local.set({ sc_mode: m });
  applyModeStyles();
  render();
}

function render() {
  renderBrandGrid();
  renderStep2();
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, value } = btn.dataset;

  if (action === 'brand') {
    state.sourceBrand = value;
    state.sourceSize = null;
    chrome.storage.local.set({ sc_source_brand: value, sc_source_size: null });
    render();
  }

  if (action === 'size') {
    state.sourceSize = value;
    chrome.storage.local.set({ sc_source_size: value });
    render();
  }
});

document.getElementById('btn-homme').addEventListener('click', () => setGenre('homme'));
document.getElementById('btn-femme').addEventListener('click', () => setGenre('femme'));
document.getElementById('btn-mode-brand').addEventListener('click', () => setMode('brand'));
document.getElementById('btn-mode-cm').addEventListener('click', () => setMode('cm'));

// Saisie de la longueur de pied — met à jour uniquement les résultats
// (pas de re-render complet, pour ne pas perdre le focus de l'input)
document.addEventListener('input', (e) => {
  if (e.target.id !== 'cm-input') return;
  const v = parseFloat(String(e.target.value).replace(',', '.'));
  state.footCm = scIsValidCm(v) ? v : null;
  chrome.storage.local.set({ sc_foot_cm: state.footCm });
  updateCmResults();
});

// Init — détecter la marque de la page active, puis rendre
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  try {
    const host = new URL(tabs[0].url).hostname.replace(/^www\./, '');
    for (const [domain, brand] of Object.entries(SC_DOMAIN_MAP)) {
      if (host === domain || host.endsWith('.' + domain)) {
        state.pageBrand = brand;
        break;
      }
    }
  } catch (e) {}

  chrome.storage.local.get(['sc_source_brand', 'sc_source_size', 'sc_genre', 'sc_mode', 'sc_foot_cm'], (data) => {
    if (data.sc_genre === 'homme' || data.sc_genre === 'femme') state.genre = data.sc_genre;
    if (data.sc_source_brand && SC_BRANDS[data.sc_source_brand]) state.sourceBrand = data.sc_source_brand;
    if (state.sourceBrand && data.sc_source_size &&
        scGetCm(state.sourceBrand, data.sc_source_size, state.genre) !== null) {
      state.sourceSize = data.sc_source_size;
    }
    if (scIsValidCm(data.sc_foot_cm)) state.footCm = data.sc_foot_cm;
    if (data.sc_mode === 'cm' || data.sc_mode === 'brand') state.mode = data.sc_mode;
    applyGenreStyles();
    applyModeStyles();
    render();
  });
});
