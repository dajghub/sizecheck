// sizes.js — Données de conversion SizeCheck (module partagé)
// Chargé avant content.js et popup.js
//
// Grilles officielles relevées en juillet 2026 sur les guides des tailles
// des marques (nike.com, adidas.fr, newbalance.fr, converse.com, vans.com,
// salomon.com, asics.com, hoka.com), avec les demi-pointures et tiers réels.
// Chaque entrée : [label EU affiché, longueur de pied en cm].
// Les échelles étant propres à chaque marque, certaines pointures entières
// n'existent pas (ex. pas de EU 43 chez Adidas, pas de EU 41 chez ASICS).

const SC_ADIDAS_UNISEXE = [
  ['36', 22.1], ['36⅔', 22.5], ['37⅓', 22.9], ['38', 23.3], ['38⅔', 23.8],
  ['39⅓', 24.2], ['40', 24.6], ['40⅔', 25.0], ['41⅓', 25.5], ['42', 25.9],
  ['42⅔', 26.3], ['43⅓', 26.7], ['44', 27.1], ['44⅔', 27.6], ['45⅓', 28.0],
  ['46', 28.4]
];

const SC_CONVERSE_UNISEXE = [
  ['35', 22.0], ['36', 22.5], ['36.5', 23.0], ['37', 23.5], ['37.5', 24.0],
  ['38', 24.5], ['39', 24.5], ['39.5', 25.0], ['40', 25.5], ['41', 26.0],
  ['41.5', 26.5], ['42', 27.0], ['42.5', 27.5], ['43', 28.0], ['44', 28.5],
  ['44.5', 29.0], ['45', 29.5], ['46', 30.0]
];

const SC_VANS_UNISEXE = [
  ['35', 22.0], ['36', 22.5], ['36.5', 23.0], ['37', 23.5], ['38', 24.0],
  ['38.5', 24.5], ['39', 25.0], ['40', 25.5], ['40.5', 26.0], ['41', 26.5],
  ['42', 27.0], ['42.5', 27.5], ['43', 28.0], ['44', 28.5], ['44.5', 29.0],
  ['45', 29.5], ['46', 30.0]
];

const SC_SALOMON_UNISEXE = [
  ['36', 21.5], ['36⅔', 22.0], ['37⅓', 22.5], ['38', 23.0], ['38⅔', 23.5],
  ['39⅓', 24.0], ['40', 24.5], ['40⅔', 25.0], ['41⅓', 25.5], ['42', 26.0],
  ['42⅔', 26.5], ['43⅓', 27.0], ['44', 27.5], ['44⅔', 28.0], ['45⅓', 28.5],
  ['46', 29.0]
];

const SC_BRANDS = {
  nike: {
    name: 'Nike', domain: 'nike.com',
    logo: 'https://www.google.com/s2/favicons?domain=nike.com&sz=128',
    tip: null,
    sizes: {
      homme: [
        ['35.5', 21.6], ['36', 22.0], ['36.5', 22.4], ['37.5', 22.9],
        ['38', 23.3], ['38.5', 23.7], ['39', 24.1], ['40', 24.5],
        ['40.5', 25.0], ['41', 25.4], ['42', 25.8], ['42.5', 26.2],
        ['43', 26.7], ['44', 27.1], ['44.5', 27.5], ['45', 27.9],
        ['45.5', 28.3], ['46', 28.8]
      ],
      femme: [
        ['35', 21.6], ['35.5', 22.0], ['36', 22.4], ['36.5', 22.9],
        ['37.5', 23.3], ['38', 23.7], ['38.5', 24.1], ['39', 24.5],
        ['40', 25.0], ['40.5', 25.4], ['41', 25.8], ['42', 26.2],
        ['42.5', 26.7], ['43', 27.1], ['44', 27.5], ['44.5', 27.9],
        ['45', 28.3], ['45.5', 28.8], ['46', 29.2]
      ]
    }
  },
  adidas: {
    name: 'Adidas', domain: 'adidas.com',
    logo: 'https://www.google.com/s2/favicons?domain=adidas.com&sz=128',
    tip: 'Chaussant étroit — si pied large, prends la pointure au-dessus de la recommandation.',
    sizes: { homme: SC_ADIDAS_UNISEXE, femme: SC_ADIDAS_UNISEXE }
  },
  newbalance: {
    name: 'New Balance', domain: 'newbalance.com',
    logo: 'https://www.google.com/s2/favicons?domain=newbalance.com&sz=128',
    tip: null,
    sizes: {
      homme: [
        ['36', 22.0], ['37', 22.5], ['37.5', 23.0], ['38', 23.5],
        ['38.5', 24.0], ['39.5', 24.5], ['40', 25.0], ['40.5', 25.5],
        ['41.5', 26.0], ['42', 26.5], ['42.5', 27.0], ['43', 27.5],
        ['44', 28.0], ['44.5', 28.5], ['45', 29.0], ['45.5', 29.5]
      ],
      femme: [
        ['35', 22.0], ['36', 22.5], ['36.5', 23.0], ['37', 23.5],
        ['37.5', 24.0], ['38', 24.5], ['39', 25.0], ['40', 25.5],
        ['40.5', 26.0], ['41', 26.5], ['41.5', 27.0], ['42.5', 27.5],
        ['43', 28.0], ['43.5', 28.5], ['44', 29.0], ['45', 29.5],
        ['45.5', 30.0], ['46', 30.5]
      ]
    }
  },
  converse: {
    name: 'Converse', domain: 'converse.com',
    logo: 'https://www.google.com/s2/favicons?domain=converse.com&sz=128',
    tip: 'Semelle plate qui libère de l\'espace en longueur. Si pied étroit, la taille recommandée convient sans descendre. Données basées sur les Chuck Taylor All Star — les modèles Standard Sneakers peuvent avoir un chaussant légèrement différent.',
    sizes: { homme: SC_CONVERSE_UNISEXE, femme: SC_CONVERSE_UNISEXE }
  },
  salomon: {
    name: 'Salomon', domain: 'salomon.com',
    logo: 'https://www.google.com/s2/favicons?domain=salomon.com&sz=128',
    tip: 'Fit trail enveloppant. En cas de doute entre deux pointures, prends la supérieure.',
    sizes: { homme: SC_SALOMON_UNISEXE, femme: SC_SALOMON_UNISEXE }
  },
  vans: {
    name: 'Vans', domain: 'vans.com',
    logo: 'https://www.google.com/s2/favicons?domain=vans.com&sz=128',
    tip: 'Last long et généreux, surtout en largeur sur les modèles classiques (Old Skool, Authentic).',
    sizes: { homme: SC_VANS_UNISEXE, femme: SC_VANS_UNISEXE }
  },
  asics: {
    name: 'ASICS', domain: 'asics.com',
    logo: 'https://www.google.com/s2/favicons?domain=asics.com&sz=128',
    tip: null,
    sizes: {
      homme: [
        ['35.5', 22.25], ['36', 22.5], ['37', 23.0], ['37.5', 23.5],
        ['38', 24.0], ['39', 24.5], ['39.5', 25.0], ['40', 25.25],
        ['40.5', 25.5], ['41.5', 26.0], ['42', 26.5], ['42.5', 27.0],
        ['43.5', 27.5], ['44', 28.0], ['44.5', 28.25], ['45', 28.5],
        ['46', 29.0]
      ],
      femme: [
        ['35.5', 22.5], ['36', 22.75], ['37', 23.0], ['37.5', 23.5],
        ['38', 24.0], ['39', 24.5], ['39.5', 25.0], ['40', 25.5],
        ['40.5', 25.75], ['41.5', 26.0], ['42', 26.5], ['42.5', 27.0],
        ['43.5', 27.5], ['44', 28.0], ['44.5', 28.5], ['45', 28.75]
      ]
    }
  },
  hoka: {
    name: 'HOKA', domain: 'hoka.com',
    logo: 'https://www.google.com/s2/favicons?domain=hoka.com&sz=128',
    tip: 'Sur les modèles femme récents (Clifton 10, Arahi 8, Challenger 8), HOKA conseille une demi-pointure en dessous de ta pointure HOKA habituelle.',
    sizes: {
      homme: [
        ['39⅓', 24.3], ['40', 24.7], ['40⅔', 25.1], ['41⅓', 25.6],
        ['42', 26.0], ['42⅔', 26.4], ['43⅓', 26.8], ['44', 27.2],
        ['44⅔', 27.7], ['45⅓', 28.1], ['46', 28.5]
      ],
      femme: [
        ['35⅓', 21.5], ['36', 22.0], ['36⅔', 22.4], ['37⅓', 22.9],
        ['38', 23.3], ['38⅔', 23.7], ['39⅓', 24.1], ['40', 24.5],
        ['40⅔', 25.0], ['41⅓', 25.4], ['42', 25.8], ['42⅔', 26.2],
        ['43⅓', 26.7], ['44', 27.1], ['44⅔', 27.5], ['45⅓', 27.9]
      ]
    }
  },
};

const SC_DOMAIN_MAP = {
  'nike.com': 'nike',           'nike.fr': 'nike',
  'adidas.com': 'adidas',       'adidas.fr': 'adidas',
  'newbalance.com': 'newbalance','newbalance.fr': 'newbalance',
  'converse.com': 'converse',   'converse.fr': 'converse',
  'salomon.com': 'salomon',     'salomon.fr': 'salomon',
  'vans.com': 'vans',           'vans.fr': 'vans',
  'asics.com': 'asics',         'asics.fr': 'asics',
  'hoka.com': 'hoka',           'hoka.fr': 'hoka'
};

/** Échelle de pointures d'une marque pour un genre donné */
function scGetSizes(brand, genre) {
  const entry = SC_BRANDS[brand];
  if (!entry) return [];
  return entry.sizes[genre] ?? entry.sizes.homme;
}

/** Obtenir les CM pour une marque + label de pointure + genre donné */
function scGetCm(brand, sizeLabel, genre) {
  const row = scGetSizes(brand, genre).find(([label]) => label === sizeLabel);
  return row ? row[1] : null;
}

/** Les N meilleures correspondances dans une marque cible pour un CM donné.
    Retourne [{ label, cm, diff }] trié par proximité. */
function scFindBestMatches(targetBrand, cm, genre, n) {
  const candidates = scGetSizes(targetBrand, genre)
    .map(([label, sizeCm]) => ({ label, cm: sizeCm, diff: Math.abs(sizeCm - cm) }))
    .sort((a, b) => a.diff - b.diff || a.cm - b.cm);
  return candidates.slice(0, n || 2);
}

/** Le second choix n'est proposé que sur quasi-égalité avec le premier. */
const SC_TIE_THRESHOLD = 0.15;

function scSecondIfTie(matches) {
  if (matches.length < 2) return null;
  return (matches[1].diff - matches[0].diff) <= SC_TIE_THRESHOLD ? matches[1] : null;
}

/** Trouver la pointure la plus proche dans une marque cible pour un CM donné */
function scFindBestSize(targetBrand, cm, genre) {
  return scFindBestMatches(targetBrand, cm, genre, 1)[0]?.label ?? null;
}

/** Longueur de pied plausible (mode « depuis mon pied ») */
function scIsValidCm(v) {
  return typeof v === 'number' && v >= 18 && v <= 35;
}

// Patch Converse logo avec le SVG local (même qualité que le site)
if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
  SC_BRANDS.converse.logo = chrome.runtime.getURL('converse.svg');
}
