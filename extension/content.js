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
    mode: 'brand',   // 'brand' = depuis ma marque, 'cm' = depuis la longueur de mon pied
    sourceBrand: null,
    sourceSize: null,
    footCm: null,
    genre: 'homme',
    open: false,
    showAll: false   // true = afficher toutes les marques, false = focus marque détectée
  };

  /* CM de départ selon le mode actif (null si incomplet) */
  function activeCm() {
    if (state.mode === 'cm') return scIsValidCm(state.footCm) ? state.footCm : null;
    if (!state.sourceBrand || !state.sourceSize) return null;
    return scGetCm(state.sourceBrand, state.sourceSize, state.genre);
  }

  /* ══════════════════════════════════════════
     SHADOW DOM — identité « mètre ruban » (ui.js)
  ══════════════════════════════════════════ */

  const hostEl = document.createElement('div');
  hostEl.id = '__sizecheck_ext__';
  document.body.appendChild(hostEl);

  const shadow = hostEl.attachShadow({ mode: 'open' });

  // Police : chargée en binaire (pas d'URL exposée à la CSP de la page) et
  // ajoutée au document — les @font-face ne fonctionnent pas dans un shadow DOM.
  try {
    fetch(chrome.runtime.getURL(SC_FONT_PATH))
      .then(r => r.arrayBuffer())
      .then(buf => new FontFace(SC_FONT_FAMILY, buf, { weight: '400 900', stretch: '62% 125%' }).load())
      .then(face => document.fonts.add(face))
      .catch(() => { /* repli sur la police système */ });
  } catch { /* idem */ }

  const css = `
    :host {
      all: initial;
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      /* Sans !important : un !important ici l'emporterait sur le display:none
         posé par updateVisibility() / « Masquer » (règle d'encapsulation du shadow DOM). */
      display: block;
      pointer-events: none;
    }
    ${SC_UI_CSS}

    .sc-wrap {
      pointer-events: auto;
      display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
      background: transparent;
    }

    /* Bouton flottant : un bout de mètre */
    .sc-fab {
      display: flex; align-items: center; gap: 10px;
      border: 2px solid var(--ink); border-radius: 4px;
      padding: 13px 8px 9px 14px;
      background-color: var(--tape);
      background-image:
        repeating-linear-gradient(90deg, var(--ink) 0 1.5px, transparent 1.5px 30px),
        repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 6px);
      background-size: 100% 7px, 100% 4px;
      background-repeat: no-repeat;
      font-weight: 800; font-stretch: 74%; font-size: 17px; line-height: 1;
      white-space: nowrap;
    }
    .sc-fab:hover { background-color: #FFD21A; }
    .sc-fab-hide {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; border-radius: 3px;
      font-size: 17px; font-weight: 600; font-stretch: 100%; color: var(--ink); opacity: .6;
    }
    .sc-fab-hide:hover { opacity: 1; background: rgba(32, 35, 38, .12); }

    /* Panneau */
    .sc-panel {
      width: 340px;
      background: var(--alu);
      border: 2px solid var(--ink); border-radius: 6px; overflow: hidden;
      display: none; flex-direction: column;
      max-height: min(560px, calc(100vh - 100px));
    }
    .sc-panel.open { display: flex; }
    .sc-panel .sc-top { flex-shrink: 0; }
    .sc-panel .sc-strip { flex-shrink: 0; }
    .sc-panel .sc-body { overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--alu-deep) transparent; }
    .sc-panel .sc-body > * { flex-shrink: 0; }  /* sinon les blocs s'écrasent quand le panneau déborde */
    .sc-close {
      border: 0; background: none; width: 26px; height: 26px; border-radius: 3px;
      font-size: 20px; line-height: 1; color: var(--ink);
    }
    .sc-close:hover { background: var(--alu-deep); }
    .sc-top-left { display: flex; align-items: baseline; gap: 8px; }
    .sc-top-left .sc-top-aside { color: var(--muted); }
    .sc-foot { font-size: 12px; text-align: center; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  shadow.appendChild(styleEl);

  const wrap = document.createElement('div');
  wrap.className = 'sc-wrap sc-root';
  shadow.appendChild(wrap);

  function updateVisibility() {
    hostEl.style.setProperty('display', shouldShow() ? 'block' : 'none', 'important');
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */

  function renderResultsSection() {
    const cm = activeCm();
    if (cm === null) return '';

    // Mode focus : la pointure de la marque de la page, en grand sur le mètre
    if (detectedBrand && !state.showAll) {
      const b = SC_BRANDS[detectedBrand];
      const matches = scFindBestMatches(detectedBrand, cm, state.genre, 2);
      const best = matches[0];
      const second = scSecondIfTie(matches);

      return `
        <div class="sc-label">
          <div class="sc-label-head">
            <h2>Ta pointure ${b.name}</h2>
            <p>${scSourceText(state, cm)}</p>
          </div>
          <div class="sc-focus">
            <span class="sc-focus-unit">EU</span>
            <span class="sc-focus-size">${scFr(best.label)}</span>
            ${second ? `<span class="sc-focus-alt">ou ${scFr(second.label)}</span>` : ''}
          </div>
          ${b.tip ? `<div class="sc-fits"><h3>Bon à savoir</h3><p>${scTipText(b)}</p></div>` : ''}
        </div>
        <button type="button" class="sc-link-btn" data-action="toggleAll">Voir toutes les marques</button>
      `;
    }

    // Mode toutes marques : l'étiquette du site
    return `
      ${scLabelHTML(state, cm, detectedBrand)}
      ${detectedBrand ? `<button type="button" class="sc-link-btn" data-action="toggleAll">Revenir à ${SC_BRANDS[detectedBrand].name}</button>` : ''}
    `;
  }

  /* ── Bouton flottant : affiche directement la taille convertie quand le profil est connu ── */
  function fabHTML() {
    let label = 'SizeCheck' + (detectedBrand ? ' sur ' + SC_BRANDS[detectedBrand].name : '');
    const cm = detectedBrand ? activeCm() : null;
    if (cm !== null) {
      const best = scFindBestMatches(detectedBrand, cm, state.genre, 1)[0];
      if (best) label = `Ta taille ici : EU ${scFr(best.label)}`;
    }
    return `<span>${label}</span><span class="sc-fab-hide" data-action="hide" role="button" aria-label="Masquer SizeCheck sur cet onglet" title="Masquer SizeCheck sur cet onglet">×</span>`;
  }

  function patchFab() {
    const fab = wrap.querySelector('.sc-fab');
    if (fab) fab.innerHTML = fabHTML();
  }

  /* ── Mises à jour ciblées (pas de re-render : garde le défilement et le focus) ── */
  function patchBrandGrid() {
    wrap.querySelectorAll('.sc-brand').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.value === state.sourceBrand);
    });
  }

  function patchSizeSection() {
    const section = wrap.querySelector('#sc-size-section');
    if (!section) return;
    if (!state.sourceBrand || state.mode !== 'brand') {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    section.querySelector('.sc-step').textContent = `Ta pointure ${SC_BRANDS[state.sourceBrand].name}`;
    section.querySelector('.sc-sizes').innerHTML = scSizesHTML(state);
  }

  /* Amène l'étiquette en haut du panneau quand un résultat existe */
  function scrollToResults() {
    const body = wrap.querySelector('.sc-body');
    const res = wrap.querySelector('#sc-results-section');
    if (!body || !res || activeCm() === null) return;
    requestAnimationFrame(() => {
      body.scrollTop += res.getBoundingClientRect().top - body.getBoundingClientRect().top - 12;
    });
  }

  function patchResults() {
    const el = wrap.querySelector('#sc-results-section');
    if (el) el.innerHTML = renderResultsSection();
  }

  /* ── Rendu complet (initial, changement de genre ou de méthode) ── */
  function render() {
    const pageBrand = detectedBrand ? SC_BRANDS[detectedBrand] : null;
    const brandMode = state.mode === 'brand';

    wrap.innerHTML = `
      <div class="sc-panel ${state.open ? 'open' : ''}" id="sc-panel" role="dialog" aria-label="SizeCheck">
        <div class="sc-top">
          <div class="sc-top-left">
            <span class="sc-wordmark">SizeCheck</span>
            ${pageBrand ? `<span class="sc-top-aside">sur ${pageBrand.name}</span>` : ''}
          </div>
          <button type="button" class="sc-close" data-action="close" aria-label="Fermer">×</button>
        </div>
        <div class="sc-strip" aria-hidden="true"></div>

        <div class="sc-body">
          ${scSegHTML(state.genre)}
          ${scModesHTML(state.mode)}

          <section id="sc-brand-section" ${brandMode ? '' : 'hidden'}>
            <h2 class="sc-step">Ta marque habituelle</h2>
            <div class="sc-brands">${scBrandsHTML(state.sourceBrand)}</div>
          </section>

          <section id="sc-size-section" ${brandMode && state.sourceBrand ? '' : 'hidden'}>
            <h2 class="sc-step">Ta pointure ${state.sourceBrand ? SC_BRANDS[state.sourceBrand].name : ''}</h2>
            <div class="sc-sizes">${state.sourceBrand ? scSizesHTML(state) : ''}</div>
          </section>

          <section id="sc-cm-section" ${brandMode ? 'hidden' : ''}>
            <h2 class="sc-step">Longueur de ton pied</h2>
            ${scCmFieldHTML(state.footCm)}
          </section>

          <div id="sc-results-section">${renderResultsSection()}</div>

          <p class="sc-foot"><a href="https://www.sizecheck.fr" target="_blank" rel="noopener">sizecheck.fr</a></p>
        </div>
      </div>

      <button type="button" class="sc-fab" data-action="toggle" aria-expanded="${state.open}">${fabHTML()}</button>
    `;
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
          btn.setAttribute('aria-expanded', state.open);
          if (state.open) scrollToResults();
          break;

        case 'close':
          state.open = false;
          wrap.querySelector('#sc-panel').classList.remove('open');
          wrap.querySelector('.sc-fab')?.setAttribute('aria-expanded', 'false');
          break;

        case 'hide':
          sessionStorage.setItem('__sizecheck_hidden__', '1');
          hostEl.style.setProperty('display', 'none', 'important');
          break;

        case 'genre':
          if (state.genre !== value) {
            state.genre = value;
            state.showAll = false;
            if (state.mode === 'brand') {
              state.sourceSize = null;
              chrome.storage.local.set({ sc_genre: value, sc_source_size: null });
            } else {
              chrome.storage.local.set({ sc_genre: value });
            }
            render(); // wrap.innerHTML remplacé, mais le listener sur wrap survit
          }
          break;

        case 'mode':
          if (state.mode !== value) {
            state.mode = value;
            state.showAll = false;
            chrome.storage.local.set({ sc_mode: value });
            render();
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
          scrollToResults();
          break;

        case 'toggleAll':
          state.showAll = !state.showAll;
          patchResults();
          break;
      }
    });

    // Saisie de la longueur de pied (mode cm)
    wrap.addEventListener('input', (e) => {
      if (e.target.dataset?.action !== 'cmInput') return;
      state.footCm = scParseCm(e.target.value);
      state.showAll = false;
      chrome.storage.local.set({ sc_foot_cm: state.footCm });
      patchResults();
      patchFab();
    });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */

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
