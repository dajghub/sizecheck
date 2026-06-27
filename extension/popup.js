// popup.js — SizeCheck Extension · Popup (fallback manuel)
// Dépend de sizes.js (chargé avant)

const state = {
  sourceBrand: null,
  sourceSize: null
};

function renderBrandGrid() {
  document.getElementById('brand-grid').innerHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
    <button class="brand-btn ${state.sourceBrand === key ? 'active' : ''}" data-action="brand" data-value="${key}">
      <img src="${b.logo}" alt="${b.name}" loading="lazy">
      <span class="bname">${b.name}</span>
    </button>
  `).join('');
}

function renderStep2() {
  const container = document.getElementById('step2');
  if (!state.sourceBrand) { container.innerHTML = ''; return; }

  const sizesHTML = SC_ALL_SIZES.map(s => `
    <button class="size-btn ${state.sourceSize === s ? 'active' : ''}" data-action="size" data-value="${s}">${s}</button>
  `).join('');

  let resultsHTML = '';
  if (state.sourceSize) {
    const cm = scGetCm(state.sourceBrand, state.sourceSize);
    if (cm) {
      resultsHTML = Object.entries(SC_BRANDS)
        .filter(([key]) => key !== state.sourceBrand)
        .map(([key, b]) => ({ key, b, targetSize: scFindBestSize(key, cm) }))
        .sort((a, b) => Math.abs(b.targetSize - state.sourceSize) - Math.abs(a.targetSize - state.sourceSize))
        .map(({ key, b, targetSize }) => {
          const delta = targetSize - state.sourceSize;
          const deltaLabel = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '';
          const deltaClass = delta > 0 ? 'up' : delta < 0 ? 'down' : 'none';
          return `
            <div class="result-row">
              <img class="result-logo" src="${b.logo}" alt="${b.name}" loading="lazy">
              <span class="result-name">${b.name}</span>
              <span class="fit-tag ${deltaClass}">${deltaLabel}</span>
              <span class="result-size">EU ${targetSize}</span>
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
    state.sourceSize = parseInt(value);
    render();
  }
});

// Init
chrome.storage.local.get(['sc_source_brand'], (data) => {
  if (data.sc_source_brand) state.sourceBrand = data.sc_source_brand;
  render();
});
