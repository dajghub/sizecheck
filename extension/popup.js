// popup.js — SizeCheck Extension · Popup (fallback manuel)
// Dépend de sizes.js (chargé avant)

const state = {
  sourceBrand: null,
  sourceSize: null,
  pageBrand: null,
  genre: 'homme'
};

function renderBrandGrid() {
  const pageBrandName = state.pageBrand ? SC_BRANDS[state.pageBrand]?.name : null;
  document.getElementById('brand-grid').innerHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
    <button class="brand-btn ${state.sourceBrand === key ? 'active' : ''}" data-action="brand" data-value="${key}">
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

function renderStep2() {
  const container = document.getElementById('step2');
  if (!state.sourceBrand) {
    container.innerHTML = '<p style="font-size:11px;color:#94a3b8;text-align:center;padding:6px 0 2px">Sélectionne ta marque habituelle ci-dessus</p>';
    return;
  }

  const sizesHTML = scGetSizes(state.sourceBrand, state.genre).map(([label]) => `
    <button class="size-btn ${state.sourceSize === label ? 'active' : ''}" data-action="size" data-value="${label}">${label}</button>
  `).join('');

  let resultsHTML = '';
  if (state.sourceSize) {
    const cm = scGetCm(state.sourceBrand, state.sourceSize, state.genre);
    if (cm) {
      const allResults = Object.entries(SC_BRANDS)
        .filter(([key]) => key !== state.sourceBrand || key === state.pageBrand)
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

      resultsHTML = allResults.map(({ key, b, best, second }) => {
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
  }

  const srcBrand = SC_BRANDS[state.sourceBrand];

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

function setGenre(g) {
  if (state.genre === g) return;
  state.genre = g;
  state.sourceSize = null;
  const active = 'background:#fff;color:#1d4ed8;box-shadow:0 1px 3px rgba(0,0,0,0.1)';
  const inactive = 'background:transparent;color:#64748b';
  document.getElementById('btn-homme').style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${g === 'homme' ? active : inactive}`;
  document.getElementById('btn-femme').style.cssText = `flex:1;padding:6px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;${g === 'femme' ? active : inactive}`;
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
    chrome.storage.local.set({ sc_source_brand: value });
    render();
  }

  if (action === 'size') {
    state.sourceSize = value;
    render();
  }
});

document.getElementById('btn-homme').addEventListener('click', () => setGenre('homme'));
document.getElementById('btn-femme').addEventListener('click', () => setGenre('femme'));

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

  chrome.storage.local.get(['sc_source_brand'], (data) => {
    if (data.sc_source_brand) state.sourceBrand = data.sc_source_brand;
    render();
  });
});
