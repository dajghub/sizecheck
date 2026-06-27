// sizes.js — Données de conversion SizeCheck (module partagé)
// Chargé avant content.js et popup.js

const SC_BRANDS = {
  nike: {
    name: 'Nike', domain: 'nike.com',
    logo: 'https://www.google.com/s2/favicons?domain=nike.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:22.0, 36:23.0, 37:23.5, 38:24.0, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:30.0 }
  },
  adidas: {
    name: 'Adidas', domain: 'adidas.com',
    logo: 'https://www.google.com/s2/favicons?domain=adidas.com&sz=64',
    fit: 'small',
    tip: 'Taille petit — prends ½ à 1 pointure au-dessus.',
    cm: { 35:21.5, 36:22.1, 37:22.7, 38:23.3, 39:24.0, 40:24.6, 41:25.3, 42:25.9, 43:26.5, 44:27.1, 45:28.0, 46:28.4 }
  },
  newbalance: {
    name: 'New Balance', domain: 'newbalance.com',
    logo: 'https://www.google.com/s2/favicons?domain=newbalance.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:22.0, 36:23.0, 37:23.5, 38:24.0, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:30.0 }
  },
  converse: {
    name: 'Converse', domain: 'converse.com',
    logo: 'https://www.google.com/s2/favicons?domain=converse.com&sz=64',
    fit: 'large',
    tip: 'Taille grand — prends ½ à 1 pointure en dessous.',
    cm: { 35:22.0, 36:22.5, 37:23.5, 38:24.5, 39:25.0, 40:25.5, 41:26.0, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
  },
  birkenstock: {
    name: 'Birkenstock', domain: 'birkenstock.com',
    logo: 'https://www.google.com/s2/favicons?domain=birkenstock.com&sz=64',
    fit: 'very-large',
    tip: 'Taille très grand — prends 1 pointure en dessous.',
    cm: { 35:23.0, 36:23.5, 37:24.0, 38:24.5, 39:25.0, 40:26.0, 41:26.5, 42:27.5, 43:28.0, 44:29.0, 45:30.0, 46:30.5 }
  },
  salomon: {
    name: 'Salomon', domain: 'salomon.com',
    logo: 'https://www.google.com/s2/favicons?domain=salomon.com&sz=64',
    fit: 'small',
    tip: 'Taille petit — prends ½ pointure au-dessus.',
    cm: { 35:21.5, 36:22.0, 37:22.7, 38:23.3, 39:24.0, 40:24.7, 41:25.3, 42:26.0, 43:26.7, 44:27.3, 45:28.0, 46:28.7 }
  },
  crocs: {
    name: 'Crocs', domain: 'crocs.com',
    logo: 'https://www.google.com/s2/favicons?domain=crocs.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:21.8, 36:22.1, 37:22.9, 38:23.8, 39:24.6, 40:25.0, 41:25.5, 42:26.3, 43:27.2, 44:27.5, 45:28.0, 46:28.8 }
  },
  vans: {
    name: 'Vans', domain: 'vans.com',
    logo: 'https://www.google.com/s2/favicons?domain=vans.com&sz=64',
    fit: 'large',
    tip: 'Taille grand — prends ½ à 1 pointure en dessous.',
    cm: { 35:22.0, 36:22.5, 37:23.5, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
  },
  on: {
    name: 'ON Running', domain: 'on.com',
    logo: 'https://www.google.com/s2/favicons?domain=on.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:21.5, 36:22.0, 37:23.0, 38:24.0, 39:25.0, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 }
  },
  asics: {
    name: 'ASICS', domain: 'asics.com',
    logo: 'https://www.google.com/s2/favicons?domain=asics.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:22.0, 36:22.5, 37:23.0, 38:24.0, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.0, 44:28.0, 45:28.5, 46:29.0 }
  },
  hoka: {
    name: 'HOKA', domain: 'hoka.com',
    logo: 'https://www.google.com/s2/favicons?domain=hoka.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:21.5, 36:22.0, 37:23.0, 38:23.5, 39:24.0, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 }
  },
  saucony: {
    name: 'Saucony', domain: 'saucony.com',
    logo: 'https://www.google.com/s2/favicons?domain=saucony.com&sz=64',
    fit: 'standard', tip: null,
    cm: { 35:21.0, 36:22.0, 37:22.5, 38:23.5, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 }
  },
  puma: {
    name: 'Puma', domain: 'puma.com',
    logo: 'https://www.google.com/s2/favicons?domain=puma.com&sz=64',
    fit: 'large',
    tip: 'Taille grand — prends ½ pointure en dessous.',
    cm: { 35:21.5, 36:22.5, 37:23.0, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
  },
  drmartens: {
    name: 'Dr. Martens', domain: 'drmartens.com',
    logo: 'https://www.google.com/s2/favicons?domain=drmartens.com&sz=64',
    fit: 'small',
    tip: 'Taille petit à partir du 41 — prends ½ à 1 pointure au-dessus.',
    cm: { 35:22.5, 36:23.0, 37:23.5, 38:24.0, 39:24.5, 40:25.0, 41:25.5, 42:26.0, 43:27.0, 44:27.5, 45:28.0, 46:29.0 }
  }
};

const SC_SIZE_RANGES = {
  homme: [38, 39, 40, 41, 42, 43, 44, 45, 46],
  femme: [35, 36, 37, 38, 39, 40, 41, 42]
};

// Range unifié sans distinction de genre (méthode CM = gender-agnostic)
const SC_ALL_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const SC_FIT = {
  standard:     { label: 'Standard',    bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },
  small:        { label: 'Taille petit', bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
  large:        { label: 'Taille grand', bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },
  'very-large': { label: 'Très grand',   bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' }
};

/** Trouver la pointure la plus proche dans une marque cible pour un CM donné */
function scFindBestSize(targetBrand, cm) {
  const table = SC_BRANDS[targetBrand].cm;
  let best = null, bestDiff = Infinity;
  for (const [size, sizeCm] of Object.entries(table)) {
    const diff = Math.abs(Number(sizeCm) - cm);
    if (diff < bestDiff) { bestDiff = diff; best = parseInt(size); }
  }
  return best;
}

/** Obtenir les CM pour une marque + pointure donnée */
function scGetCm(brand, size) {
  return SC_BRANDS[brand]?.cm[size] ?? null;
}
