# STATUS — SizeCheck

_Dernière mise à jour : 5 juillet 2026_

---

## ✅ En ligne / opérationnel

- **8 marques** : Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA. Données **100 % vérifiées en direct** sur les guides officiels, avec les demi-pointures et tiers réellement vendus (Nike 42.5, Adidas 42⅔, Salomon/HOKA en tiers, ASICS en quarts de cm). Structure `[label, cm]` par marque/genre, synchro site ↔ extension verrouillée par `tools/check_sync.py`.
- **Site** (`index.html`) — convertisseur V3 mobile-first, **2 modes** (depuis une marque / depuis la longueur de pied en cm), **Tailwind précompilé statique** (`assets/tailwind.css`), scroll auto vers le résultat, a11y (aria-pressed, contraste AA).
- **28 pages SEO** `/comparaisons/{a}-vs-{b}.html` + index, générées par `tools/generate_pages.py` : tableaux H/F, **FAQ JSON-LD** (dont « taillent pareil ? » / « taille grand ou petit ? » calculées depuis les données), maillage croisé, CTA extension entre les tableaux.
- **Extension Chrome v1.1.0 — LIVE** sur le Chrome Web Store : widget Shadow DOM + popup, persistance profil (marque/pointure/genre/cm), FAB zéro-clic « Ta taille ici : EU X », mode cm, support SPA, masquage panier/checkout.
- **Analytics : Umami Cloud** (cookieless, RGPD, **sans bandeau de consentement**) — sur le site, la page légale et les 28 pages SEO. 5 custom events instrumentés (`selection-marque`, `changement-mode`, `changement-genre`, `cta-extension`, `lien-convertisseur`).
- **SEO technique** : favicon PNG (rendu correct dans Google), `og-image` 1200×630, `robots.txt`, `sitemap.xml` (31 URL) soumis à Search Console.
- **Assets marketing** (`marketing/`, non déployés) : `chrome-store/` (promo 440×280 + 1400×560, 2 captures 1280×800, `store-listing.md`, zip v1.1.0) et `avatars/` (photos de profil Awin/réseaux, gardées en local).

---

## 🔄 En cours (attente externe — rien à coder)

- **Affiliation Awin** : compte actif, candidatures soumises pour **Zalando, Adidas, JD Sports** — en attente d'approbation annonceur. (Nike absent d'Awin FR ; Zalando/JD couvrent déjà la marque.)
- **Indexation Search Console** des pages `/comparaisons/` : sitemap lu, indexation en cours (délai normal ~1-2 semaines).
- **Favicon Google** : re-crawl en attente côté Google (quelques semaines) avant affichage dans les résultats.

---

## ▶️ Prochaines actions (dès signal)

- **Dès la 1ère approbation Awin** → câbler les boutons « Acheter dans cette taille » (résultats du site + widget extension) avec le format de lien affilié, + event Umami `clic-acheter` pour mesurer le tunnel.
- **Suivre Umami** (`selection-marque`, `changement-mode: cm`, `cta-extension`) après quelques semaines → décisions data-driven (marques à prioriser, usage réel du mode cm, conversion du CTA).

---

## 📌 Décisions clés

- **Monétisation** : AdSense **abandonné** (sessions courtes, RPM faible, dégrade vitesse/SEO, friction bandeau). On monétise l'**intention d'achat** par l'**affiliation**, pas l'attention par la pub. B2B « réduction des retours » gardé en horizon long.
- **Expansion géo** : rester **FR** tant que le modèle n'est pas validé (SEO qui ranke + affiliation qui convertit). Ensuite, pays par pays (**Allemagne** d'abord — tailles EU, données réutilisables telles quelles), pas « anglais pour l'Europe ».

---

## 📋 Backlog

- [ ] **v1.2 extension** : logos embarqués localement (aujourd'hui via le service favicon Google), évaluer Amazon/Decathlon, tailles US/UK, widget draggable.
- [ ] **Déploiement** : migrer du pipeline Jekyll « legacy » (builds Pages capricieux, rebuild forcé récurrent) vers **GitHub Actions** — fiabiliserait les déploiements.
- [ ] og:image à mettre à jour si les marques supportées changent.
- [ ] Duplication des tables `index.html` ↔ `extension/sizes.js` : conservée par choix (single-file), verrouillée par `tools/check_sync.py`.
