// popup.js — SizeCheck Extension · Popup (fallback manuel)
// Dépend de sizes.js et ui.js (chargés avant)

const style = document.createElement('style');
style.textContent = SC_UI_CSS;
document.head.appendChild(style);

const state = {
  mode: 'brand',   // 'brand' = avec ma pointure, 'cm' = avec la longueur de mon pied
  sourceBrand: null,
  sourceSize: null,
  footCm: null,
  pageBrand: null,
  genre: 'homme'
};

const app = document.getElementById('app');

function activeCm() {
  if (state.mode === 'cm') return scIsValidCm(state.footCm) ? state.footCm : null;
  if (!state.sourceBrand || !state.sourceSize) return null;
  return scGetCm(state.sourceBrand, state.sourceSize, state.genre);
}

function resultsHTML() {
  const cm = activeCm();
  return cm === null ? '' : scLabelHTML(state, cm, state.pageBrand);
}

function render() {
  const page = state.pageBrand ? SC_BRANDS[state.pageBrand] : null;
  let steps;
  if (state.mode === 'cm') {
    steps = `
      <section>
        <h2 class="sc-step">Longueur de ton pied</h2>
        ${scCmFieldHTML(state.footCm)}
      </section>`;
  } else {
    steps = `
      <section>
        <h2 class="sc-step">Ta marque habituelle</h2>
        <div class="sc-brands">${scBrandsHTML(state.sourceBrand)}</div>
      </section>
      ${state.sourceBrand ? `
        <section>
          <h2 class="sc-step">Ta pointure ${SC_BRANDS[state.sourceBrand].name}</h2>
          <div class="sc-sizes">${scSizesHTML(state)}</div>
        </section>` : ''}`;
  }

  app.innerHTML = `
    ${page ? `<p class="sc-note">Tu es sur un site <b>${page.name}</b> : sa ligne est surlignée en jaune.</p>` : ''}
    ${scSegHTML(state.genre)}
    ${scModesHTML(state.mode)}
    ${steps}
    <div id="sc-results">${resultsHTML()}</div>
  `;
}

app.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, value } = btn.dataset;

  if (action === 'genre' && state.genre !== value) {
    state.genre = value;
    if (state.mode === 'brand') {
      state.sourceSize = null;   // les grilles diffèrent selon le genre
      chrome.storage.local.set({ sc_genre: value, sc_source_size: null });
    } else {
      chrome.storage.local.set({ sc_genre: value });
    }
    render();
  }

  if (action === 'mode' && state.mode !== value) {
    state.mode = value;
    chrome.storage.local.set({ sc_mode: value });
    render();
    if (value === 'cm') app.querySelector('[data-action="cmInput"]')?.focus();
  }

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

// Saisie de la longueur de pied — ne met à jour que l'étiquette
// (pas de re-render complet, pour garder le focus du champ)
app.addEventListener('input', (e) => {
  if (e.target.dataset.action !== 'cmInput') return;
  state.footCm = scParseCm(e.target.value);
  chrome.storage.local.set({ sc_foot_cm: state.footCm });
  document.getElementById('sc-results').innerHTML = resultsHTML();
});

// Init — détecter la marque de l'onglet actif, puis rendre
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
    render();
  });
});
