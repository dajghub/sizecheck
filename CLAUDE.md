# CLAUDE.md — SizeCheck

## Vue d'ensemble
SizeCheck est un outil gratuit de conversion de pointures de chaussures entre marques, basé sur la **méthode des centimètres** (EU → CM → EU). Il permet de trouver l'équivalent de sa pointure dans une autre marque en passant par la longueur de pied en cm.

**8 marques supportées :** Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA.

**URL de production :** https://www.sizecheck.fr

---

## Stack technique

### Site web (`index.html`)
- Single-file HTML — CSS écrit à la main dans un `<style>` + JavaScript Vanilla (Tailwind retiré lors de la refonte du 8 nov. 2026)
- Aucun framework, aucun bundler, aucun backend
- Mobile-first ; sur desktop (≥ 900 px) deux colonnes : formulaire à gauche, étiquette de résultat collante à droite
- **Analytics : Umami Cloud** (cookieless, RGPD, sans bandeau de consentement) — `data-website-id` `c924201e-94a1-4c34-ad5a-83154e3cc4f7`, sur le site, la page légale et les 28 pages SEO. (Remplace l'ancien duo Google Analytics + tarteaucitron, retirés le 05/07/2026.)
- Deux modes de conversion : depuis une marque, ou depuis la longueur de pied en cm

### Pages SEO (`comparaisons/`)
- 28 pages statiques générées (une par paire de marques) + index, via `tools/generate_pages.py`
- CSS dédié `assets/pages.css` (mêmes jetons de couleur que l'accueil)
- **Ne jamais éditer ces pages à la main** — relancer le générateur après toute modification des tables

### Extension Chrome (`extension/`)
- Manifest V3
- `sizes.js` — données de conversion partagées (source unique de vérité), conseils de chaussant **identiques au site** (contrôlé par `check_sync.py`)
- `ui.js` — identité « mètre ruban » partagée par le popup et le widget : jetons, composants (rayon, méthode, marques, pointures, champ cm) et **étiquette de résultat identique à celle du site**. Toute évolution visuelle du site doit y être reportée.
- `content.js` — widget injecté via Shadow DOM sur les pages produit (police chargée en binaire via `FontFace`, car `@font-face` ne marche pas dans un shadow DOM)
- `popup.html` / `popup.js` — interface manuelle accessible depuis la barre Chrome
- `fonts/` — Archivo embarquée (nom `SizeCheck Archivo`, pour ne pas entrer en conflit avec les pages visitées). Plus aucun logo ni appel à un service externe.
- Détection automatique de la marque sur 21 domaines (sites officiels + JD Sports, Zalando, Foot Locker, Courir)

---

## Identité visuelle (refonte du 8 nov. 2026)
- **Idée :** le mètre ruban. Le mètre jaune rend visible le pivot EU → cm → EU : il se cale sur la longueur de la pointure choisie, et sert de curseur en mode « pied en cm ». C'est l'unique élément audacieux, tout le reste reste sobre.
- **Couleurs** (déclarées en variables CSS dans `index.html`, `assets/pages.css`, page légale) : aluminium `#E3E5E6` (fond), papier `#FFFFFF`, encre `#202326`, gris texte `#575D62`, jaune mètre `#F6C500`, rouge aiguille `#D42A1C` (aiguille du mètre uniquement).
- **Typo :** une seule famille, **Archivo** (axe de largeur `wdth`). Étroite et grasse (`font-stretch` 64–74 %) pour titres et pointures, normale pour le texte. **Auto-hébergée** dans `assets/fonts/` (woff2 variables latin + latin étendu, `OFL.txt`) : `@font-face` dans le `<style>` de `index.html` et de la page légale, en tête de `assets/pages.css`, plus un `preload` du fichier latin. **Ne jamais réintroduire Google Fonts** (l'IP des visiteurs partirait chez Google, contraire à la politique de confidentialité).
- **Le résultat** = une étiquette de boîte à chaussures : vrai `<table>`, marques dans un ordre fixe, écart en mm par rapport au pied.
- **Partage (messageries, réseaux)** : toutes les pages ont `og:title/description/url/image(+width/height/alt)/site_name/locale` et `twitter:card`. Après tout changement de `og-image.png` ou des icônes, **incrémenter le `?v=`** de leurs URL (index.html, page légale, `generate_pages.py`) pour forcer WhatsApp & co à recharger l'image.
- **À éviter** pour rester dans l'identité : cartes arrondies avec ombre, dégradés, emojis, étiquettes en majuscules, « → » ajouté aux boutons, animations d'apparition sur chaque bloc.

## Hébergement & domaine
- **Hébergement :** GitHub Pages (dépôt `jadesaradesst/sizecheck`)
- **Domaine :** Infomaniak (registrar + DNS)
- **CNAME :** `www.sizecheck.fr`
- **Déploiement :** push sur `main` → **GitHub Actions** (`.github/workflows/deploy.yml`) publie une **whitelist** du site uniquement (`index.html`, `politique-de-confidentialite.html`, `favicon.ico`, `assets/`, `comparaisons/`, `sitemap.xml`, `robots.txt`, `CNAME`). Les fichiers internes (`STATUS.md`, `CLAUDE.md`, `tools/`, `marketing/`, `extension/`) restent versionnés mais **ne sont pas servis** sur le domaine.
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
| `favicon.ico` | Favicon racine (16/32/48), demandé par défaut par navigateurs et services — généré par `tools/render_brand_assets.py` |
| `comparaisons/` | Pages SEO générées par paire de marques (ne pas éditer à la main) |
| `assets/pages.css` | CSS des pages de comparaison |
| `assets/logos/` | Logos de marques auto-hébergés (site) |
| `assets/converse.svg` | Logo Converse (SVG local, source Wikipedia) — plus affiché depuis la refonte |
| `assets/og-image.png` | Image Open Graph 1200×630 (prévisualisation WhatsApp/réseaux) — générée par `tools/render_brand_assets.py` |
| `marketing/chrome-store/` | Assets Chrome Web Store (promo, captures 1280×800, `store-listing.md`, zip) — non déployés |
| `marketing/avatars/` | Photos de profil 512×512 (Awin/réseaux) : `jaune`, `blanc`, `transparent`, générées par `tools/render_brand_assets.py` — gardées **en local** (gitignorées), non déployées ; anciennes versions bleues dans `ancien-2026-07/` |
| `tools/sizedata.py` | Lecture des tables (module partagé des scripts) |
| `tools/check_sync.py` | Contrôle synchro/monotonie des tables et synchro des conseils site ↔ extension |
| `tools/generate_pages.py` | Générateur des pages de comparaison + sitemap |
| `tools/render_brand_assets.py` | Régénère `og-image.png`, `favicon.png`, `apple-touch-icon.png` (Chrome headless + Archivo du site) |
| `STATUS.md` | Suivi d'avancement par session |
| `audits/` | Rapports d'audit datés (UX/UI…) — non déployés |
| `extension/sizes.js` | **Source unique des données de conversion** |
| `extension/manifest.json` | Config extension Chrome |
| `extension/content.js` | Widget injecté sur pages produit |
| `extension/popup.html/js` | Popup fallback |
| `extension/ui.js` | Style et rendu partagés popup + widget (identité du site) |
| `extension/fonts/` | Archivo embarquée (web_accessible_resources, limitée aux domaines du widget) |
| `tools/render_brand_assets.py` | (voir plus haut) génère aussi `extension/icons/` et les bannières `marketing/chrome-store/promo-*.png` |

---

## Conventions à respecter
- **Source unique pour les données :** toute modification des tables de correspondance doit se faire dans `extension/sizes.js` ET dans `index.html` (structure `[label, cm]` par marque/genre)
- **Après toute modification des tables** : lancer `python3 tools/check_sync.py` (contrôle) puis `python3 tools/generate_pages.py` (régénère pages + sitemap)
- Tout ajout de marque ou de système de tailles passe par ces deux fichiers + régénération
- **Séparation données / affichage (virgule décimale FR)** : les tables stockent les libellés **bruts avec un point** (`'41.5'`) — c'est le libellé des guides officiels **et la clé** utilisée par le localStorage, `chrome.storage`, les paramètres d'URL (`?size=42.5`), les `data-value` et les comparaisons d'égalité. La virgule ne s'applique **qu'au rendu**, via un formateur dédié : `fmt_label()` / `fmt_cm()` dans `tools/generate_pages.py`, `fr()` dans `index.html`, `scFr()` dans `extension/sizes.js` (partagé par `content.js` et `popup.js`). **Ne jamais virguler la donnée elle-même** : cela casserait la restauration d'état et les liens partagés.
- Mobile-first en priorité absolue
- Single-file HTML pour le site web (CSS et JS intégrés à `index.html`)
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
