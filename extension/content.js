// content.js — SizeCheck Extension · Widget injecté
// Dépend de sizes.js (chargé avant via manifest)

(function () {
  'use strict';

  if (document.getElementById('__sizecheck_ext__')) return;

  /* ══════════════════════════════════════════
     DÉTECTION MARQUE & TYPE DE PAGE
  ══════════════════════════════════════════ */

  const DOMAIN_MAP = {
    'nike.com': 'nike',       'nike.fr': 'nike',
    'adidas.com': 'adidas',   'adidas.fr': 'adidas',
    'newbalance.com': 'newbalance', 'newbalance.fr': 'newbalance',
    'converse.com': 'converse', 'converse.fr': 'converse',
    'salomon.com': 'salomon',  'salomon.fr': 'salomon',
    'vans.com': 'vans',        'vans.fr': 'vans',
    'asics.com': 'asics',      'asics.fr': 'asics',
    'hoka.com': 'hoka',        'hoka.fr': 'hoka'
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
    for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const d = JSON.parse(el.textContent);
        const nodes = [d, ...(d['@graph'] || [])];
        if (nodes.some(n => n['@type'] === 'Product')) return true;
      } catch { /* ignore */ }
    }
    if (/\/(product|products|p\/|chaussures|shoes|sneakers|trainers)/i.test(location.pathname)) return true;
    const sizeEls = document.querySelectorAll(
      '[data-size], [data-eu], [class*="SizeSelector"], [class*="size-selector"], ' +
      '[aria-label*="size" i], [aria-label*="taille" i]'
    );
    return sizeEls.length >= 2;
  }

  let detectedBrand = detectBrandFromDomain() || detectBrandFromPage();
  const pageHost = location.hostname.replace(/^www\./, '');
  const isMultiBrand = MULTI_BRAND_HOSTS.some(m => pageHost.includes(m));

  // Masqué via le ✕ du FAB — pour la durée de l'onglet
  if (sessionStorage.getItem('__sizecheck_hidden__')) return;

  // Le widget reste injecté mais caché hors contexte utile : il se ré-évalue
  // à chaque navigation SPA (les multi-marques ne rechargent pas la page).
  const CHECKOUT_RE = /(checkout|panier|cart|paiement|payment|commande|order)/i;
  function shouldShow() {
    if (CHECKOUT_RE.test(location.pathname)) return false;
    if (isMultiBrand) return isProductPage();
    return true;
  }

  /* ══════════════════════════════════════════
     STATE
  ══════════════════════════════════════════ */

  const state = {
    sourceBrand: null,
    sourceSize: null,
    genre: 'homme',
    open: false,
    showAll: false   // true = afficher toutes les marques, false = focus marque détectée
  };

  /* ══════════════════════════════════════════
     SHADOW DOM
  ══════════════════════════════════════════ */

  const hostEl = document.createElement('div');
  hostEl.id = '__sizecheck_ext__';
  document.body.appendChild(hostEl);

  const shadow = hostEl.attachShadow({ mode: 'open' });

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

    /* ── FAB ── */
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
    .sc-fab-hide {
      opacity: .55;
      font-size: 10px;
      padding: 3px 5px;
      margin-left: 2px;
      border-radius: 50%;
      line-height: 1;
    }
    .sc-fab-hide:hover { opacity: 1; background: rgba(255,255,255,.18); }

    /* ── Panel ── */
    .sc-panel {
      width: 330px;
      background: #f1f5f9;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05);
      overflow: hidden;
      display: none;
      flex-direction: column;
      max-height: min(520px, calc(100vh - 90px));
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
      transition: background .15s;
    }
    .sc-close-btn:hover { background: #e2e8f0; color: #334155; }

    /* ── Body ── */
    .sc-body {
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }

    .sc-section-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 5px;
    }

    /* ── Brand grid ── */
    .sc-brand-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
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
    .sc-brand-btn .sc-bname {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-align: center;
      line-height: 1.2;
    }
    .sc-brand-btn.active .sc-bname { color: #1d4ed8; }

    /* ── Size grid ── */
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

    /* ── Résultat focus (marque détectée) ── */
    .sc-focus-card {
      background: #fff;
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      border: 2px solid #1d4ed8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .sc-focus-brand {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
    }
    .sc-focus-brand img { width: 18px; height: 18px; object-fit: contain; border-radius: 3px; }
    .sc-focus-size {
      font-size: 32px;
      font-weight: 900;
      color: #1d4ed8;
      letter-spacing: -.03em;
      line-height: 1;
    }
    .sc-focus-label { font-size: 11px; color: #94a3b8; }

    /* ── Fit tag ── */
    /* ── Toggle "voir toutes les marques" ── */
    .sc-toggle-all {
      background: none;
      border: none;
      font-size: 11px;
      color: #1d4ed8;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      padding: 2px 0;
      letter-spacing: -.01em;
    }
    .sc-toggle-all:hover { text-decoration: underline; }

    /* ── Résultats liste (mode "toutes marques") ── */
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

  function updateVisibility() {
    hostEl.style.setProperty('display', shouldShow() ? 'block' : 'none', 'important');
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */

  function renderResultsSection() {
    const cm = scGetCm(state.sourceBrand, state.sourceSize, state.genre);
    if (!cm) return '';

    // Mode focus : marque détectée en vedette
    if (detectedBrand && !state.showAll) {
      const b = SC_BRANDS[detectedBrand];
      const matches = scFindBestMatches(detectedBrand, cm, state.genre, 2);
      const best = matches[0];
      const second = scSecondIfTie(matches);

      return `
        <div>
          <div class="sc-section-label">Ta taille sur cette page</div>
          <div class="sc-focus-card">
            <div class="sc-focus-brand">
              <img src="${b.logo}" alt="${b.name}" loading="lazy">
              <span>${b.name}</span>
            </div>
            <div class="sc-focus-size">EU ${best.label}</div>
            ${second ? `<div style="font-size:11px;color:#94a3b8">ou EU ${second.label}</div>` : ''}
            ${b.tip ? `<div class="sc-tip" style="text-align:left;margin-top:4px">💡 ${b.tip}</div>` : ''}
          </div>
          <button class="sc-toggle-all" style="margin-top:8px;width:100%" data-action="toggleAll">
            Voir toutes les marques →
          </button>
        </div>
      `;
    }

    // Mode toutes marques
    const allRows = Object.entries(SC_BRANDS)
      .filter(([key]) => key !== state.sourceBrand)
      .map(([key, b]) => {
        const matches = scFindBestMatches(key, cm, state.genre, 2);
        return { key, b, best: matches[0], second: scSecondIfTie(matches) };
      })
      .filter(r => r.best)
      .sort((a, b) => a.best.diff - b.best.diff);

    const rows = allRows.map(({ key, b, best, second }) => {
        const isPage = key === detectedBrand;
        return `
          <div class="sc-result ${isPage ? 'highlight' : ''}">
            <img class="sc-result-logo" src="${b.logo}" alt="${b.name}" loading="lazy">
            <span class="sc-result-name">${b.name}</span>
            <span class="sc-result-size">EU ${best.label}${second ? `<span style="font-size:9px;color:#94a3b8;display:block">ou ${second.label}</span>` : ''}</span>
          </div>
        `;
      }).join('');

    return `
      <div>
        <div class="sc-section-label">Toutes les marques</div>
        <div class="sc-results">${rows}</div>
        ${detectedBrand ? `
          <button class="sc-toggle-all" style="margin-top:8px;width:100%" data-action="toggleAll">
            ← Retour
          </button>
        ` : ''}
      </div>
    `;
  }

  /* ── FAB : affiche directement la taille convertie quand le profil est connu ── */
  function fabHTML() {
    let label = 'SizeCheck' + (detectedBrand ? ' · ' + SC_BRANDS[detectedBrand].name : '');
    if (detectedBrand && state.sourceBrand && state.sourceSize) {
      const cm = scGetCm(state.sourceBrand, state.sourceSize, state.genre);
      const best = cm !== null ? scFindBestMatches(detectedBrand, cm, state.genre, 1)[0] : null;
      if (best) label = `Ta taille ici : EU ${best.label}`;
    }
    return `<span>👟</span><span>${label}</span><span class="sc-fab-hide" data-action="hide" title="Masquer SizeCheck sur cet onglet">✕</span>`;
  }

  function patchFab() {
    const fab = wrap.querySelector('.sc-fab');
    if (fab) fab.innerHTML = fabHTML();
  }

  /* ── Mise à jour chirurgicale du genre toggle ── */
  function patchGenreToggle() {
    const active   = 'background:#fff;color:#1d4ed8;box-shadow:0 1px 3px rgba(0,0,0,0.1)';
    const inactive = 'background:transparent;color:#64748b';
    wrap.querySelectorAll('[data-action="genre"]').forEach(btn => {
      btn.style.cssText = `flex:1;padding:5px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;${btn.dataset.value === state.genre ? active : inactive}`;
      btn.setAttribute('aria-pressed', btn.dataset.value === state.genre);
    });
  }

  /* ── Mise à jour chirurgicale de la brand grid ── */
  function patchBrandGrid() {
    wrap.querySelectorAll('.sc-brand-btn').forEach(btn => {
      const active = btn.dataset.value === state.sourceBrand;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });
  }

  /* ── Mise à jour chirurgicale de la section tailles ── */
  function patchSizeSection() {
    const section = wrap.querySelector('#sc-size-section');
    if (!state.sourceBrand) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) {
      section.style.display = '';
      section.querySelector('.sc-size-grid').innerHTML = scGetSizes(state.sourceBrand, state.genre).map(([label]) =>
        `<button class="sc-size-btn ${state.sourceSize === label ? 'active' : ''}" aria-pressed="${state.sourceSize === label}" data-action="size" data-value="${label}">${label}</button>`
      ).join('');
    }
  }

  /* ── Mise à jour chirurgicale des résultats ── */
  function patchResults() {
    const el = wrap.querySelector('#sc-results-section');
    if (!el) return;
    el.innerHTML = (state.sourceBrand && state.sourceSize) ? renderResultsSection() : '';
  }

  /* ── Rendu initial complet (appelé une seule fois + changement de genre) ── */
  function render() {
    const pageBrand = detectedBrand ? SC_BRANDS[detectedBrand] : null;

    const brandsHTML = Object.entries(SC_BRANDS).map(([key, b]) => `
      <button class="sc-brand-btn ${state.sourceBrand === key ? 'active' : ''}" aria-pressed="${state.sourceBrand === key}" data-action="brand" data-value="${key}">
        <img src="${b.logo}" alt="${b.name}" loading="lazy">
        <span class="sc-bname">${b.name}</span>
      </button>
    `).join('');

    const sizesHTML = state.sourceBrand
      ? scGetSizes(state.sourceBrand, state.genre).map(([label]) =>
          `<button class="sc-size-btn ${state.sourceSize === label ? 'active' : ''}" aria-pressed="${state.sourceSize === label}" data-action="size" data-value="${label}">${label}</button>`
        ).join('')
      : '';

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

          <div style="display:flex;gap:4px;background:#e2e8f0;border-radius:10px;padding:3px;">
            <button data-action="genre" data-value="homme" style="flex:1;padding:5px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;">Homme</button>
            <button data-action="genre" data-value="femme" style="flex:1;padding:5px 0;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;">Femme</button>
          </div>

          <div>
            <div class="sc-section-label">Ma marque habituelle</div>
            <div class="sc-brand-grid">${brandsHTML}</div>
          </div>

          <div id="sc-size-section" style="${state.sourceBrand ? '' : 'display:none'}">
            <div class="sc-section-label">Ma pointure habituelle</div>
            <div class="sc-size-grid">${sizesHTML}</div>
          </div>

          <div id="sc-results-section">
            ${state.sourceBrand && state.sourceSize ? renderResultsSection() : ''}
          </div>

          <div class="sc-footer">
            <a href="https://www.sizecheck.fr" target="_blank" rel="noopener">sizecheck.fr</a>
          </div>

        </div>
      </div>

      <button class="sc-fab" data-action="toggle">${fabHTML()}</button>
    `;

    patchGenreToggle();
  }

  /* ══════════════════════════════════════════
     EVENTS — bindEvents() appelé une seule fois
  ══════════════════════════════════════════ */

  function bindEvents() {
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, value } = btn.dataset;

      switch (action) {
        case 'toggle':
          state.open = !state.open;
          wrap.querySelector('#sc-panel').classList.toggle('open', state.open);
          break;

        case 'close':
          state.open = false;
          wrap.querySelector('#sc-panel').classList.remove('open');
          break;

        case 'hide':
          sessionStorage.setItem('__sizecheck_hidden__', '1');
          hostEl.style.setProperty('display', 'none', 'important');
          break;

        case 'genre':
          if (state.genre !== value) {
            state.genre = value;
            state.sourceSize = null;
            state.showAll = false;
            chrome.storage.local.set({ sc_genre: value, sc_source_size: null });
            render(); // wrap.innerHTML remplacé, mais le listener sur wrap survit
          }
          break;

        case 'brand':
          state.sourceBrand = value;
          state.sourceSize = null;
          state.showAll = false;
          chrome.storage.local.set({ sc_source_brand: value, sc_source_size: null });
          patchBrandGrid();
          patchSizeSection();
          patchResults();
          patchFab();
          break;

        case 'size':
          state.sourceSize = value;
          state.showAll = false;
          chrome.storage.local.set({ sc_source_size: value });
          patchSizeSection();
          patchResults();
          patchFab();
          setTimeout(() => {
            const body = wrap.querySelector('.sc-body');
            if (body) body.scrollTop = body.scrollHeight;
          }, 50);
          break;

        case 'toggleAll':
          state.showAll = !state.showAll;
          patchResults();
          break;
      }
    });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */

  chrome.storage.local.get(['sc_source_brand', 'sc_source_size', 'sc_genre'], (data) => {
    if (data.sc_genre === 'homme' || data.sc_genre === 'femme') state.genre = data.sc_genre;
    if (data.sc_source_brand && SC_BRANDS[data.sc_source_brand]) state.sourceBrand = data.sc_source_brand;
    if (state.sourceBrand && data.sc_source_size &&
        scGetCm(state.sourceBrand, data.sc_source_size, state.genre) !== null) {
      state.sourceSize = data.sc_source_size;
    }
    render();
    bindEvents(); // une seule fois — le listener sur wrap survit aux render() suivants
    updateVisibility();
  });

  /* ── Navigation SPA : re-détecter marque et contexte à chaque changement d'URL ── */
  function refreshDetection() {
    const brand = detectBrandFromDomain() || detectBrandFromPage();
    if (brand !== detectedBrand) {
      detectedBrand = brand;
      state.showAll = false;
      render();
    }
    updateVisibility();
  }

  let lastHref = location.href;
  const spaObserver = new MutationObserver(() => {
    if (location.href === lastHref) return;
    lastHref = location.href;
    // Laisser la SPA rendre la nouvelle page avant de re-détecter
    setTimeout(refreshDetection, 600);
  });
  spaObserver.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', () => setTimeout(refreshDetection, 600));

})();
