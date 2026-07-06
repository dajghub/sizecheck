# CLAUDE.md — SizeCheck

## Vue d'ensemble
SizeCheck est un outil gratuit de conversion de pointures de chaussures entre marques, basé sur la **méthode des centimètres** (EU → CM → EU). Il permet de trouver l'équivalent de sa pointure dans une autre marque en passant par la longueur de pied en cm.

**8 marques supportées :** Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA.

**URL de production :** https://www.sizecheck.fr

---

## Stack technique

### Site web (`index.html`)
- Single-file HTML — Tailwind précompilé statique (`assets/tailwind.css`) + JavaScript Vanilla
- Aucun framework, aucun bundler, aucun backend
- Mobile-first (`max-w-md mx-auto px-4`)
- **Analytics : Umami Cloud** (cookieless, RGPD, sans bandeau de consentement) — `data-website-id` `c924201e-94a1-4c34-ad5a-83154e3cc4f7`, sur le site, la page légale et les 28 pages SEO. (Remplace l'ancien duo Google Analytics + tarteaucitron, retirés le 05/07/2026.)
- Deux modes de conversion : depuis une marque, ou depuis la longueur de pied en cm

### Pages SEO (`comparaisons/`)
- 28 pages statiques générées (une par paire de marques) + index, via `tools/generate_pages.py`
- CSS dédié `assets/pages.css` (indépendant de Tailwind)
- **Ne jamais éditer ces pages à la main** — relancer le générateur après toute modification des tables

### Extension Chrome (`extension/`)
- Manifest V3
- `sizes.js` — données de conversion partagées (source unique de vérité)
- `content.js` — widget injecté via Shadow DOM sur les pages produit
- `popup.html` / `popup.js` — interface manuelle accessible depuis la barre Chrome
- Détection automatique de la marque sur 21 domaines (sites officiels + JD Sports, Zalando, Foot Locker, Courir)

---

## Hébergement & domaine
- **Hébergement :** GitHub Pages (dépôt `jadesaradesst/sizecheck`)
- **Domaine :** Infomaniak (registrar + DNS)
- **CNAME :** `www.sizecheck.fr`
- **Déploiement :** push sur `main` → **GitHub Actions** (`.github/workflows/deploy.yml`) publie une **whitelist** du site uniquement (`index.html`, `politique-de-confidentialite.html`, `assets/`, `comparaisons/`, `sitemap.xml`, `robots.txt`, `CNAME`). Les fichiers internes (`STATUS.md`, `CLAUDE.md`, `tools/`, `marketing/`, `extension/`) restent versionnés mais **ne sont pas servis** sur le domaine.
- **Ajouter un fichier/dossier au site déployé** = l'ajouter à la whitelist dans `deploy.yml` (sinon il ne sera pas publié).
- **`.nojekyll` : NE PAS retirer.** Testé le 6 juil. 2026 : son retrait a fait échouer le déploiement Actions (« Deployment failed ») deux fois de suite ; sa restauration a redéployé au vert immédiatement. Il reste nécessaire même sous Actions (le workflow le copie dans l'artefact).
- Vérifier un déploiement : `gh run list --workflow=deploy.yml`. (Historique : l'ancien build Jekyll « legacy » était capricieux — remplacé par Actions le 6 juil. 2026.)

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `index.html` | App web complète (V3) |
| `politique-de-confidentialite.html` | Page légale RGPD |
| `sitemap.xml` | Sitemap (régénéré par `tools/generate_pages.py`) |
| `CNAME` | Domaine custom GitHub Pages |
| `comparaisons/` | Pages SEO générées par paire de marques (ne pas éditer à la main) |
| `assets/tailwind.css` | CSS Tailwind précompilé du site (extrait du JIT) |
| `assets/pages.css` | CSS des pages de comparaison |
| `assets/logos/` | Logos de marques auto-hébergés (site) |
| `assets/converse.svg` | Logo Converse (SVG local, source Wikipedia) |
| `assets/og-image.png` | Image Open Graph 1200×630 (prévisualisation WhatsApp/réseaux) |
| `marketing/chrome-store/` | Assets Chrome Web Store (promo, captures 1280×800, `store-listing.md`, zip) — non déployés |
| `marketing/avatars/` | Photos de profil (Awin/réseaux) — gardées **en local** (gitignorées), non déployées |
| `tools/sizedata.py` | Lecture des tables (module partagé des scripts) |
| `tools/check_sync.py` | Contrôle synchro/monotonie des tables site ↔ extension |
| `tools/generate_pages.py` | Générateur des pages de comparaison + sitemap |
| `STATUS.md` | Suivi d'avancement par session |
| `extension/sizes.js` | **Source unique des données de conversion** |
| `extension/manifest.json` | Config extension Chrome |
| `extension/content.js` | Widget injecté sur pages produit |
| `extension/popup.html/js` | Popup fallback |
| `extension/converse.svg` | Copie locale du logo Converse pour l'extension (web_accessible_resources) |

---

## Conventions à respecter
- **Source unique pour les données :** toute modification des tables de correspondance doit se faire dans `extension/sizes.js` ET dans `index.html` (structure `[label, cm]` par marque/genre)
- **Après toute modification des tables** : lancer `python3 tools/check_sync.py` (contrôle) puis `python3 tools/generate_pages.py` (régénère pages + sitemap)
- Tout ajout de marque ou de système de tailles passe par ces deux fichiers + régénération
- Mobile-first en priorité absolue
- Single-file HTML pour le site web (pas de séparation JS ; le CSS Tailwind est précompilé dans `assets/tailwind.css` — régénérer via le CDN si de nouvelles classes sont ajoutées)
- Commits git clairs après chaque session de travail

---

## Ce qu'il ne faut jamais toucher sans instruction explicite
- Les tables de correspondance CM dans `extension/sizes.js` et `index.html`
- Le `data-website-id` Umami (`c924201e-94a1-4c34-ad5a-83154e3cc4f7`)
- Le fichier `CNAME`

---

## Suivi de session

En fin de session, ou quand demandé explicitement, mettre à jour `STATUS.md` avec un résumé de l'avancement (fait / en cours / bloquant / prochaines étapes).

---

## Améliorations en cours / à venir
Voir le backlog dans `STATUS.md` (section « Prochaines étapes »).
