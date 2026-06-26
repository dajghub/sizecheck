// popup.js — SizeCheck Extension · Popup
// Dépend de sizes.js (chargé avant)

const state = {
  gender: 'homme',
  sourceBrand: null,
  sourceSize: null
};

/* ── Render brand grid ── */
function renderBrandGrid() {
  const grid = document.getElementById('brand-grid');
  grid.innerHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
    <button class="brand-btn ${state.sourceBrand === key ? 'active' : ''}" data-action="brand" data-value="${key}">
      <img src="${b.logo}" alt="${b.name}" loading="lazy">
      <span class="bname">${b.name}</span>
    </button>
  `).join('');
}

/* ── Render step 2 (pointure + résultats) ── */
function renderStep2() {
  const container = document.getElementById('step2');

  if (!state.sourceBrand) {
    container.innerHTML = '';
    return;
  }

  const sizes = SC_SIZE_RANGES[state.gender];
  const sizesHTML = sizes.map(s => `
    <button class="size-btn ${state.sourceSize === s ? 'active' : ''}" data-action="size" data-value="${s}">${s}</button>
  `).join('');

  let resultsHTML = '';
  if (state.sourceSize) {
    const cm = scGetCm(state.sourceBrand, state.sourceSize);
    if (cm) {
      resultsHTML = Object.entries(SC_BRANDS).map(([key, b]) => {
        const targetSize = scFindBestSize(key, cm);
        return `
          <div class="result-row">
            <img class="result-logo" src="${b.logo}" alt="${b.name}" loading="lazy">
            <span class="result-name">${b.name}</span>
            <span class="result-size">EU ${targetSize}</span>
            <span class="fit-tag ${b.fit}">${SC_FIT[b.fit].label}</span>
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
    ${srcBrand.tip ? `<div class="tip">💡 ${srcBrand.tip}</div>` : ''}
    ` : state.sourceSize ? '' : '<p class="hint">Sélectionne ta pointure pour voir les équivalences</p>'}
  `;

  // Rebind size buttons
  container.querySelectorAll('[data-action="size"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.sourceSize = parseInt(btn.dataset.value);
      renderStep2();
      // Highlight active button
      container.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.value) === state.sourceSize));
      renderStep2(); // re-render with results
    });
  });
}

/* ── Render tout ── */
function render() {
  // Tabs genre
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.value === state.gender);
  });
  renderBrandGrid();
  renderStep2();
}

/* ── Délégation d'événements ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, value } = btn.dataset;

  if (action === 'gender') {
    state.gender = value;
    state.sourceSize = null;
    chrome.storage.local.set({ sc_gender: value });
    render();
  }

  if (action === 'brand') {
    state.sourceBrand = value;
    state.sourceSize = null;
    chrome.storage.local.set({ sc_source_brand: value });
    render();
  }
});

/* ── Init ── */
chrome.storage.local.get(['sc_gender', 'sc_source_brand'], (data) => {
  if (data.sc_gender) state.gender = data.sc_gender;
  if (data.sc_source_brand) state.sourceBrand = data.sc_source_brand;
  render();
});
