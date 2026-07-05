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
- **Déploiement :** push sur `main` → GitHub Pages auto-deploy
- **`.nojekyll`** : présent à la racine — désactive le traitement Jekyll (site 100 % statique). Ne pas supprimer : sans lui, les builds Pages échouaient par intermittence (« Page build failed »). Vérifier le déploiement avec `gh api repos/dajghub/sizecheck/pages/builds`.

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
