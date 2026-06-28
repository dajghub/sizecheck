// sizes.js — Données de conversion SizeCheck (module partagé)
// Chargé avant content.js et popup.js

const SC_BRANDS = {
  nike: {
    name: 'Nike', domain: 'nike.com',
    logo: 'https://www.google.com/s2/favicons?domain=nike.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.6, 36:22.0, 37:22.7, 38:23.3, 39:24.1, 40:24.5, 41:25.4, 42:25.8, 43:26.7, 44:27.1, 45:27.9, 46:28.8 },
      femme: { 35:21.6, 36:22.4, 37:23.1, 38:23.7, 39:24.5, 40:25.0, 41:25.8, 42:26.2, 43:27.1, 44:27.5, 45:28.3, 46:29.2 }
    }
  },
  adidas: {
    name: 'Adidas', domain: 'adidas.com',
    logo: 'https://www.google.com/s2/favicons?domain=adidas.com&sz=64',
    fit: 'small',
    tip: 'Chaussant étroit — si pied large, prends la pointure au-dessus de la recommandation.',
    cm: {
      homme: { 35:21.5, 36:22.1, 37:22.7, 38:23.3, 39:24.0, 40:24.6, 41:25.3, 42:25.9, 43:26.5, 44:27.1, 45:28.0, 46:28.4 },
      femme: { 35:21.5, 36:22.1, 37:22.7, 38:23.3, 39:24.0, 40:24.6, 41:25.3, 42:25.9, 43:26.5, 44:27.1, 45:28.0, 46:28.4 }
    }
  },
  newbalance: {
    name: 'New Balance', domain: 'newbalance.com',
    logo: 'https://www.google.com/s2/favicons?domain=newbalance.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.5, 36:22.0, 37:22.5, 38:23.5, 39:24.0, 40:25.0, 41:25.5, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 },
      femme: { 35:22.0, 36:22.5, 37:23.5, 38:24.5, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:29.0, 45:29.5, 46:30.0 }
    }
  },
  converse: {
    name: 'Converse', domain: 'converse.com',
    logo: 'https://www.google.com/s2/favicons?domain=converse.com&sz=64',
    fit: 'large',
    tip: 'Semelle plate qui libère de l\'espace en longueur. Si pied étroit, la taille recommandée convient sans descendre. Données basées sur les Chuck Taylor All Star — les modèles Standard Sneakers peuvent avoir un chaussant légèrement différent.',
    cm: {
      homme: { 35:22.0, 36:22.5, 37:23.5, 38:24.5, 39:24.5, 40:25.5, 41:26.0, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 },
      femme: { 35:22.0, 36:22.5, 37:23.5, 38:24.5, 39:24.5, 40:25.5, 41:26.0, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
    }
  },
  birkenstock: {
    name: 'Birkenstock', domain: 'birkenstock.com',
    logo: 'https://www.google.com/s2/favicons?domain=birkenstock.com&sz=64',
    fit: 'very-large',
    tip: 'CM calibrés sur la semelle liège intérieure, conçue pour que les orteils touchent le bord. La recommandation intègre déjà cette référence.',
    cm: {
      homme: { 35:22.5, 36:23.0, 37:24.0, 38:24.5, 39:25.0, 40:26.0, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.0, 46:30.0 },
      femme: { 35:22.5, 36:23.0, 37:24.0, 38:24.5, 39:25.0, 40:26.0, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.0, 46:30.0 }
    }
  },
  salomon: {
    name: 'Salomon', domain: 'salomon.com',
    logo: 'https://www.google.com/s2/favicons?domain=salomon.com&sz=64',
    fit: 'small',
    tip: 'Fit trail enveloppant. En cas de doute entre deux pointures, prends la supérieure.',
    cm: {
      homme: { 35:21.0, 36:21.5, 37:22.3, 38:23.0, 39:23.8, 40:24.5, 41:25.3, 42:26.0, 43:26.8, 44:27.5, 45:28.3, 46:29.0 },
      femme: { 35:21.0, 36:21.5, 37:22.3, 38:23.0, 39:23.8, 40:24.5, 41:25.3, 42:26.0, 43:26.8, 44:27.5, 45:28.3, 46:29.0 }
    }
  },
  crocs: {
    name: 'Crocs', domain: 'crocs.com',
    logo: 'https://www.google.com/s2/favicons?domain=crocs.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.8, 36:22.1, 37:22.9, 38:23.8, 39:24.6, 40:25.0, 41:25.5, 42:26.3, 43:27.2, 44:27.5, 45:28.0, 46:28.8 },
      femme: { 35:21.8, 36:22.1, 37:22.9, 38:23.8, 39:24.6, 40:25.0, 41:25.5, 42:26.3, 43:27.2, 44:27.5, 45:28.0, 46:28.8 }
    }
  },
  vans: {
    name: 'Vans', domain: 'vans.com',
    logo: 'https://www.google.com/s2/favicons?domain=vans.com&sz=64',
    fit: 'large',
    tip: 'Last long et généreux, surtout en largeur sur les modèles classiques (Old Skool, Authentic).',
    cm: {
      homme: { 35:22.0, 36:22.5, 37:23.5, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 },
      femme: { 35:22.0, 36:22.5, 37:23.5, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
    }
  },
  on: {
    name: 'ON Running', domain: 'on.com',
    logo: 'https://www.google.com/s2/favicons?domain=on.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.5, 36:22.0, 37:23.0, 38:24.0, 39:25.0, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 },
      femme: { 35:21.5, 36:22.0, 37:23.0, 38:24.0, 39:25.0, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 }
    }
  },
  asics: {
    name: 'ASICS', domain: 'asics.com',
    logo: 'https://www.google.com/s2/favicons?domain=asics.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:22.0, 36:22.5, 37:23.0, 38:24.0, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.0, 44:28.0, 45:28.5, 46:29.0 },
      femme: { 35:22.0, 36:22.5, 37:23.0, 38:24.0, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.0, 44:28.0, 45:28.5, 46:29.0 }
    }
  },
  hoka: {
    name: 'HOKA', domain: 'hoka.com',
    logo: 'https://www.google.com/s2/favicons?domain=hoka.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.5, 36:22.0, 37:22.7, 38:23.3, 39:24.0, 40:24.5, 41:25.5, 42:26.0, 43:26.5, 44:27.0, 45:28.0, 46:28.5 },
      femme: { 35:21.5, 36:22.0, 37:22.7, 38:23.3, 39:24.0, 40:24.5, 41:25.5, 42:26.0, 43:26.5, 44:27.0, 45:28.0, 46:28.5 }
    }
  },
  saucony: {
    name: 'Saucony', domain: 'saucony.com',
    logo: 'https://www.google.com/s2/favicons?domain=saucony.com&sz=64',
    fit: 'standard', tip: null,
    cm: {
      homme: { 35:21.0, 36:22.0, 37:22.5, 38:23.5, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 },
      femme: { 35:21.0, 36:22.0, 37:22.5, 38:23.5, 39:24.5, 40:25.0, 41:26.0, 42:26.5, 43:27.5, 44:28.0, 45:29.0, 46:29.5 }
    }
  },
  puma: {
    name: 'Puma', domain: 'puma.com',
    logo: 'https://www.google.com/s2/favicons?domain=puma.com&sz=64',
    fit: 'large',
    tip: 'Last EU plus généreux que la norme, surtout sur les modèles lifestyle (Suede, RS-X).',
    cm: {
      homme: { 35:21.5, 36:22.5, 37:23.0, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 },
      femme: { 35:21.5, 36:22.5, 37:23.0, 38:24.0, 39:25.0, 40:25.5, 41:26.5, 42:27.0, 43:28.0, 44:28.5, 45:29.5, 46:30.0 }
    }
  },
  drmartens: {
    name: 'Dr. Martens', domain: 'drmartens.com',
    logo: 'https://www.google.com/s2/favicons?domain=drmartens.com&sz=64',
    fit: 'small',
    tip: 'Cuir épais et dur — réduit l\'espace interne. Le fit s\'améliore significativement après quelques semaines de rodage.',
    cm: {
      homme: { 35:22.5, 36:23.0, 37:23.5, 38:24.0, 39:24.5, 40:25.0, 41:25.5, 42:26.0, 43:27.0, 44:27.5, 45:28.0, 46:29.0 },
      femme: { 35:22.5, 36:23.0, 37:23.5, 38:24.0, 39:24.5, 40:25.0, 41:25.5, 42:26.0, 43:27.0, 44:27.5, 45:28.0, 46:29.0 }
    }
  }
};

const SC_SIZE_RANGES = {
  homme: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
  femme: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
};

const SC_ALL_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const SC_FIT = {
  standard:     { label: 'Standard',    bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },
  small:        { label: 'Taille petit', bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
  large:        { label: 'Taille grand', bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },
  'very-large': { label: 'Très grand',   bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' }
};

const SC_DOMAIN_MAP = {
  'nike.com': 'nike',           'nike.fr': 'nike',
  'adidas.com': 'adidas',       'adidas.fr': 'adidas',
  'newbalance.com': 'newbalance','newbalance.fr': 'newbalance',
  'converse.com': 'converse',   'converse.fr': 'converse',
  'birkenstock.com': 'birkenstock', 'birkenstock.fr': 'birkenstock',
  'salomon.com': 'salomon',     'salomon.fr': 'salomon',
  'crocs.com': 'crocs',         'crocs.fr': 'crocs',
  'vans.com': 'vans',           'vans.fr': 'vans',
  'on.com': 'on',               'on-running.com': 'on',
  'asics.com': 'asics',         'asics.fr': 'asics',
  'hoka.com': 'hoka',           'hoka.fr': 'hoka',
  'saucony.com': 'saucony',     'saucony.fr': 'saucony',
  'puma.com': 'puma',           'puma.fr': 'puma',
  'drmartens.com': 'drmartens'
};

/** Obtenir les CM pour une marque + pointure + genre donné */
function scGetCm(brand, size, genre) {
  const entry = SC_BRANDS[brand];
  if (!entry) return null;
  const table = entry.cm[genre] ?? entry.cm.homme;
  return table?.[size] ?? null;
}

/** Trouver les N meilleures pointures dans une marque cible pour un CM donné */
function scFindBestSizes(targetBrand, cm, genre, n) {
  const entry = SC_BRANDS[targetBrand];
  if (!entry) return [];
  const table = entry.cm[genre] ?? entry.cm.homme;
  if (!table) return [];
  const candidates = [];
  for (const [size, sizeCm] of Object.entries(table)) {
    candidates.push({ size: parseInt(size), diff: Math.abs(Number(sizeCm) - cm) });
  }
  candidates.sort((a, b) => a.diff - b.diff || a.size - b.size);
  return candidates.slice(0, n || 2).map(c => c.size);
}

/** Trouver la pointure la plus proche dans une marque cible pour un CM donné */
function scFindBestSize(targetBrand, cm, genre) {
  return scFindBestSizes(targetBrand, cm, genre, 1)[0] ?? null;
}
