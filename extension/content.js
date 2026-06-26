// content.js — SizeCheck Extension · Widget injecté
// Dépend de sizes.js (chargé avant via manifest)

(function () {
  'use strict';

  // Éviter une double-injection (SPA navigation)
  if (document.getElementById('__sizecheck_ext__')) return;

  /* ══════════════════════════════════════════
     DÉTECTION MARQUE & TYPE DE PAGE
  ══════════════════════════════════════════ */

  const DOMAIN_MAP = {
    'nike.com': 'nike',       'nike.fr': 'nike',
    'adidas.com': 'adidas',   'adidas.fr': 'adidas',
    'newbalance.com': 'newbalance', 'newbalance.fr': 'newbalance',
    'converse.com': 'converse', 'converse.fr': 'converse',
    'birkenstock.com': 'birkenstock', 'birkenstock.fr': 'birkenstock',
    'salomon.com': 'salomon',  'salomon.fr': 'salomon',
    'crocs.com': 'crocs',      'crocs.fr': 'crocs',
    'vans.com': 'vans',        'vans.fr': 'vans'
  };

  const MULTI_BRAND_HOSTS = ['jdsports', 'zalando', 'footlocker', 'courir', 'sizeer'];

  function detectBrandFromDomain() {
    const host = location.hostname.replace(/^www\./, '');
    for (const [domain, brand] of Object.entries(DOMAIN_MAP)) {
      if (host === domain || host.endsWith('.' + domain)) return brand;
    }
    return null;
  }

  function detectBrandFromPage() {
    const textSources = [
      document.title,
      document.querySelector('h1')?.textContent || '',
      document.querySelector('[itemprop="brand"]')?.textContent || '',
      document.querySelector('[class*="brand-name"], [class*="brandName"]')?.textContent || ''
    ].join(' ');

    const lower = textSources.toLowerCase();
    for (const [key, b] of Object.entries(SC_BRANDS)) {
      if (lower.includes(b.name.toLowerCase())) return key;
    }

    // Breadcrumbs
    const crumb = document.querySelector('[aria-label*="breadcrumb" i], .breadcrumb, [class*="breadcrumb" i]');
    if (crumb) {
      const t = crumb.textContent.toLowerCase();
      for (const [key, b] of Object.entries(SC_BRANDS)) {
        if (t.includes(b.name.toLowerCase())) return key;
      }
    }
    return null;
  }

  function isProductPage() {
    // JSON-LD Product schema (signal le plus fiable)
    for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const d = JSON.parse(el.textContent);
        const nodes = [d, ...(d['@graph'] || [])];
        if (nodes.some(n => n['@type'] === 'Product')) return true;
      } catch { /* ignore */ }
    }
    // Patterns d'URL courants
    if (/\/(product|products|p\/|chaussures|shoes|sneakers|trainers)/i.test(location.pathname)) return true;
    // Présence de sélecteurs de taille (signal fort)
    const sizeEls = document.querySelectorAll(
      '[data-size], [data-eu], [class*="SizeSelector"], [class*="size-selector"], ' +
      '[aria-label*="size" i], [aria-label*="taille" i]'
    );
    return sizeEls.length >= 2;
  }

  const detectedBrand = detectBrandFromDomain() || detectBrandFromPage();
  const host = location.hostname.replace(/^www\./, '');
  const isMultiBrand = MULTI_BRAND_HOSTS.some(m => host.includes(m));

  // Sur les sites multi-marques, n'afficher que sur les pages produit
  if (isMultiBrand && !isProductPage()) return;

  /* ══════════════════════════════════════════
     STATE
  ══════════════════════════════════════════ */

  const state = {
    gender: 'homme',
    sourceBrand: null,
    sourceSize: null,
    open: false
  };

  /* ══════════════════════════════════════════
     SHADOW DOM HOST
  ══════════════════════════════════════════ */

  const hostEl = document.createElement('div');
  hostEl.id = '__sizecheck_ext__';
  document.body.appendChild(hostEl);

  const shadow = hostEl.attachShadow({ mode: 'open' });

  /* ══════════════════════════════════════════
     CSS (shadow DOM — isolé de la page)
  ══════════════════════════════════════════ */

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      display: block !important;
      pointer-events: none;
    }

    .sc-wrap {
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }

    /* ── Bouton flottant ── */
    .sc-fab {
      background: #1d4ed8;
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 11px 18px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 4px 20px rgba(29,78,216,0.4);
      transition: transform .15s, box-shadow .15s;
      white-space: nowrap;
      letter-spacing: -.01em;
      line-height: 1;
    }
    .sc-fab:hover { transform: scale(1.04); box-shadow: 0 6px 26px rgba(29,78,216,0.5); }
    .sc-fab-icon { font-size: 16px; }

    /* ── Panel ── */
    .sc-panel {
      width: 310px;
      background: #f1f5f9;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05);
      overflow: hidden;
      display: none;
      flex-direction: column;
      max-height: min(540px, calc(100vh - 90px));
    }
    .sc-panel.open { display: flex; }

    /* ── Header ── */
    .sc-header {
      background: #fff;
      padding: 13px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    .sc-header-left { display: flex; align-items: center; gap: 7px; }
    .sc-header-title { font-weight: 800; font-size: 14px; color: #1e293b; letter-spacing: -.02em; }
    .sc-detected-badge {
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      border: 1px solid #bfdbfe;
    }
    .sc-close-btn {
      background: #f1f5f9;
      border: none;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1;
      transition: background .15s;
    }
    .sc-close-btn:hover { background: #e2e8f0; color: #334155; }

    /* ── Contenu scrollable ── */
    .sc-body {
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }

    /* ── Label section ── */
    .sc-section-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 5px;
    }

    /* ── Tabs genre ── */
    .sc-tabs {
      display: flex;
      background: #e2e8f0;
      border-radius: 12px;
      padding: 3px;
      gap: 3px;
    }
    .sc-tab {
      flex: 1;
      padding: 7px 0;
      border: none;
      border-radius: 10px;
      background: transparent;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      transition: all .15s;
      letter-spacing: -.01em;
    }
    .sc-tab.active {
      background: #fff;
      color: #1d4ed8;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    /* ── Grille marques ── */
    .sc-brand-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
    }
    .sc-brand-btn {
      background: #fff;
      border: 2px solid transparent;
      border-radius: 11px;
      padding: 7px 3px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      transition: all .15s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .sc-brand-btn:hover { border-color: #bfdbfe; }
    .sc-brand-btn.active { border-color: #1d4ed8; background: #eff6ff; }
    .sc-brand-btn img { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
    .sc-brand-btn .sc-brand-name {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-align: center;
      line-height: 1.2;
    }
    .sc-brand-btn.active .sc-brand-name { color: #1d4ed8; }

    /* ── Grille pointures ── */
    .sc-size-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .sc-size-btn {
      padding: 6px 9px;
      border: 2px solid #e2e8f0;
      border-radius: 9px;
      background: #fff;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      transition: all .15s;
      min-width: 36px;
      text-align: center;
    }
    .sc-size-btn:hover { border-color: #93c5fd; }
    .sc-size-btn.active { border-color: #1d4ed8; background: #1d4ed8; color: #fff; }

    /* ── Résultats ── */
    .sc-results { display: flex; flex-direction: column; gap: 5px; }
    .sc-result {
      background: #fff;
      border-radius: 12px;
      padding: 9px 11px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 2px solid transparent;
    }
    .sc-result.highlight { border-color: #1d4ed8; background: #eff6ff; }
    .sc-result-logo { width: 18px; height: 18px; object-fit: contain; border-radius: 3px; flex-shrink: 0; }
    .sc-result-name { font-size: 12px; font-weight: 700; color: #1e293b; flex: 1; }
    .sc-result-size { font-size: 14px; font-weight: 800; color: #1d4ed8; flex-shrink: 0; }
    .sc-page-tag {
      font-size: 8px;
      font-weight: 800;
      background: #1d4ed8;
      color: #fff;
      padding: 2px 6px;
      border-radius: 20px;
      flex-shrink: 0;
    }
    .sc-fit-tag {
      font-size: 8px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 20px;
      flex-shrink: 0;
    }
    .sc-fit-tag.standard { display: none; }
    .sc-fit-tag.small    { background: #fffbeb; color: #92400e; }
    .sc-fit-tag.large    { background: #fff7ed; color: #9a3412; }
    .sc-fit-tag.very-large { background: #fef2f2; color: #991b1b; }

    /* ── Tip ── */
    .sc-tip {
      font-size: 10.5px;
      color: #64748b;
      line-height: 1.5;
      background: #fffbeb;
      border-radius: 8px;
      padding: 8px 10px;
      border-left: 3px solid #fcd34d;
    }

    /* ── Footer ── */
    .sc-footer {
      text-align: center;
      font-size: 9px;
      color: #cbd5e1;
      padding-top: 2px;
    }
    .sc-footer a { color: #93c5fd; text-decoration: none; }
    .sc-footer a:hover { color: #1d4ed8; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  shadow.appendChild(styleEl);

  const wrap = document.createElement('div');
  wrap.className = 'sc-wrap';
  shadow.appendChild(wrap);

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */

  function renderResults() {
    const cm = scGetCm(state.sourceBrand, state.sourceSize);
    if (!cm) return '';

    return Object.entries(SC_BRANDS).map(([key, b]) => {
      const targetSize = scFindBestSize(key, cm);
      const isPage = key === detectedBrand;
      const fitClass = b.fit;
      const fitLabel = SC_FIT[b.fit].label;

      return `
        <div class="sc-result ${isPage ? 'highlight' : ''}">
          <img class="sc-result-logo" src="${b.logo}" alt="${b.name}" loading="lazy">
          <span class="sc-result-name">${b.name}</span>
          ${isPage ? '<span class="sc-page-tag">Cette page</span>' : ''}
          <span class="sc-result-size">EU ${targetSize}</span>
          <span class="sc-fit-tag ${fitClass}">${fitLabel}</span>
        </div>
      `;
    }).join('');
  }

  function render() {
    const pageBrand = detectedBrand ? SC_BRANDS[detectedBrand] : null;
    const srcBrand = state.sourceBrand ? SC_BRANDS[state.sourceBrand] : null;

    const brandsHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
      <button class="sc-brand-btn ${state.sourceBrand === key ? 'active' : ''}" data-action="brand" data-value="${key}">
        <img src="${b.logo}" alt="${b.name}" loading="lazy">
        <span class="sc-brand-name">${b.name}</span>
      </button>
    `).join('');

    const sizesHTML = state.sourceBrand ? SC_SIZE_RANGES[state.gender].map(s => `
      <button class="sc-size-btn ${state.sourceSize === s ? 'active' : ''}" data-action="size" data-value="${s}">${s}</button>
    `).join('') : '';

    wrap.innerHTML = `
      <div class="sc-panel ${state.open ? 'open' : ''}" id="sc-panel">
        <div class="sc-header">
          <div class="sc-header-left">
            <span>👟</span>
            <span class="sc-header-title">SizeCheck</span>
            ${pageBrand ? `<span class="sc-detected-badge">${pageBrand.name}</span>` : ''}
          </div>
          <button class="sc-close-btn" data-action="close">✕</button>
        </div>

        <div class="sc-body">
          <!-- Genre -->
          <div>
            <div class="sc-section-label">Genre</div>
            <div class="sc-tabs">
              <button class="sc-tab ${state.gender === 'homme' ? 'active' : ''}" data-action="gender" data-value="homme">Homme</button>
              <button class="sc-tab ${state.gender === 'femme' ? 'active' : ''}" data-action="gender" data-value="femme">Femme</button>
            </div>
          </div>

          <!-- Marque habituelle -->
          <div>
            <div class="sc-section-label">Ma marque habituelle</div>
            <div class="sc-brand-grid">${brandsHTML}</div>
          </div>

          ${state.sourceBrand ? `
          <!-- Pointure habituelle -->
          <div>
            <div class="sc-section-label">Ma pointure habituelle</div>
            <div class="sc-size-grid">${sizesHTML}</div>
          </div>
          ` : ''}

          ${state.sourceBrand && state.sourceSize ? `
          <!-- Résultats -->
          <div>
            <div class="sc-section-label">Équivalences EU</div>
            <div class="sc-results">${renderResults()}</div>
          </div>
          ${srcBrand?.tip ? `<div class="sc-tip">💡 ${srcBrand.tip}</div>` : ''}
          ` : ''}

          <div class="sc-footer"><a href="https://www.sizecheck.fr" target="_blank" rel="noopener">sizecheck.fr</a></div>
        </div>
      </div>

      <button class="sc-fab" data-action="toggle">
        <span class="sc-fab-icon">👟</span>
        <span>SizeCheck${pageBrand ? ' · ' + pageBrand.name : ''}</span>
      </button>
    `;

    bindEvents();
  }

  /* ══════════════════════════════════════════
     EVENTS (délégation sur le shadow root)
  ══════════════════════════════════════════ */

  function bindEvents() {
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      switch (action) {
        case 'toggle':
          state.open = !state.open;
          wrap.querySelector('#sc-panel').classList.toggle('open', state.open);
          break;

        case 'close':
          state.open = false;
          wrap.querySelector('#sc-panel').classList.remove('open');
          break;

        case 'gender':
          state.gender = value;
          state.sourceSize = null;
          chrome.storage.local.set({ sc_gender: value });
          render();
          break;

        case 'brand':
          state.sourceBrand = value;
          state.sourceSize = null;
          chrome.storage.local.set({ sc_source_brand: value });
          render();
          break;

        case 'size':
          state.sourceSize = parseInt(value);
          render();
          // Scroll vers les résultats
          setTimeout(() => {
            const body = wrap.querySelector('.sc-body');
            if (body) body.scrollTop = body.scrollHeight;
          }, 50);
          break;
      }
    }, { capture: false });
  }

  /* ══════════════════════════════════════════
     INIT — charger les préférences sauvegardées
  ══════════════════════════════════════════ */

  chrome.storage.local.get(['sc_gender', 'sc_source_brand'], (data) => {
    if (data.sc_gender) state.gender = data.sc_gender;
    if (data.sc_source_brand) state.sourceBrand = data.sc_source_brand;
    render();
  });

})();
