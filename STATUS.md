# STATUS — SizeCheck

_Dernière mise à jour : 10 juillet 2026_

---

## ✅ En ligne / opérationnel

- **8 marques** : Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA. Données **100 % vérifiées en direct** sur les guides officiels, avec les demi-pointures et tiers réellement vendus (Nike 42.5, Adidas 42⅔, Salomon/HOKA en tiers, ASICS en quarts de cm). Structure `[label, cm]` par marque/genre, synchro site ↔ extension verrouillée par `tools/check_sync.py`.
- **Site** (`index.html`) — convertisseur V3 mobile-first, **2 modes** (depuis une marque / depuis la longueur de pied en cm), **Tailwind précompilé statique** (`assets/tailwind.css`), scroll auto vers le résultat, a11y (aria-pressed, contraste AA).
- **28 pages SEO** `/comparaisons/{a}-vs-{b}.html` + index, générées par `tools/generate_pages.py` : tableaux H/F, **FAQ JSON-LD** (dont « taillent pareil ? » / « taille grand ou petit ? » calculées depuis les données), maillage croisé, CTA extension entre les tableaux.
- **Extension Chrome v1.1.0 — LIVE** sur le Chrome Web Store : widget Shadow DOM + popup, persistance profil (marque/pointure/genre/cm), FAB zéro-clic « Ta taille ici : EU X », mode cm, support SPA, masquage panier/checkout.
- **Analytics : Umami Cloud** (cookieless, RGPD, **sans bandeau de consentement**) — sur le site, la page légale et les 28 pages SEO. 5 custom events instrumentés (`selection-marque`, `changement-mode`, `changement-genre`, `cta-extension`, `lien-convertisseur`).
- **SEO technique** : `robots.txt`, `sitemap.xml` (**30 URLs**) soumis à Search Console, propriété GSC de type **Domaine**.
- **Assets graphiques — couverture complète** (10 juil.) : favicon PNG 96×96 (multiple de 48, requis par Google), **`apple-touch-icon` 180×180 à fond opaque** (écran d'accueil iOS — un fond transparent y serait rendu sur noir), `og-image` 1200×630. Balises `og:*` + `og:image:width/height` + `twitter:card` sur l'accueil, la page légale et les 28 pages SEO → vignette correcte sur WhatsApp/iMessage/Discord/LinkedIn/X.
- **Cohérence des URLs — tout en `www`** (10 juil.) : canoniques (accueil, page légale, hub, 28 pages), champ `url` du JSON-LD `WebApplication`, liens internes. Plus aucune référence à l'apex dans les fichiers servis ; `sizecheck.fr` → `www` en 301.
- **Sitemap assaini** (10 juil.) : la page légale (`noindex, follow`) **retirée du sitemap** — l'y déclarer envoyait à Google deux instructions contradictoires et dépensait du budget de crawl pour une page qu'on ne veut pas indexer. 31 → 30 URLs. La page reste liée en pied de page (donc accessible et parcourable via `follow`).
- **Déploiement via GitHub Actions** (`.github/workflows/deploy.yml`, 6 juil.) : publie une **whitelist** du site uniquement → builds fiables (~20-30 s, fini les rebuilds forcés du Jekyll legacy) **et** fichiers internes (STATUS.md, CLAUDE.md, tools/, marketing/, extension/) **non servis** sur le domaine.
- **Assets marketing** (`marketing/`, non déployés) : `chrome-store/` (promo 440×280 + 1400×560, 2 captures 1280×800, `store-listing.md`, zip v1.1.0) et `avatars/` (photos de profil Awin/réseaux, gardées en local).

---

## 🔄 En cours (attente externe — rien à coder)

- **Affiliation Awin** : compte réseau actif. **Zalando : refusé. Adidas : refusé. JD Sports : en attente** (10 juil. 2026). Cause quasi certaine : **trafic nul** (site lancé, pages SEO déployées le 4-5 juil.) — pas un jugement sur le produit. (Nike absent d'Awin FR ; Zalando/JD couvrent déjà la marque.)
- **Indexation Search Console** des pages `/comparaisons/` : **découvertes mais jamais explorées** (vérifié le 10 juil. 2026). Google a lu le sitemap le **08/07** et y a découvert les **31 URLs**. L'inspection de `nike-vs-adidas.html` renvoie « non indexée », bloc Exploration entièrement « Sans objet » = **jamais crawlée**. Donc **aucun rejet qualitatif** (Google n'a pas lu la page) — c'est du **budget de crawl** sur un domaine jeune. Attendu à ce stade.
  - Chaîne technique vérifiée maillon par maillon, **rien de cassé** : pages en 200 · `robots.txt: Allow: /` · `meta robots: index, follow` · canonique auto-référente en `www` · sitemap XML valide (toutes URLs en `www`, `Content-Type: application/xml`) · apex → `www` en 301 · propriété GSC de type **Domaine** (couvre apex + www). *(Le sitemap comptait 31 URLs lors de la lecture Google du 08/07 ; ramené à 30 le 10/07, cf. « Sitemap assaini ».)*
  - ⚠️ Ne jamais écrire « indexées » sans l'avoir constaté. Le rapport **Sitemaps** fait autorité sur la *découverte* ; l'**Inspection d'URL** sur l'*exploration/indexation*. Un « Aucun sitemap référent détecté » dans l'Inspection ne contredit pas le rapport Sitemaps : sans crawl, l'URL n'a pas de fiche d'index, donc tous les champs sortent à « Sans objet ».
  - **Seuil d'alerte : ~4 semaines.** Si les pages restent « jamais explorées » alors qu'elles sont découvertes depuis le 08/07 → investiguer. Pas avant.
- **Rapport « Pourquoi des pages ne sont pas indexées »** (lu le 10 juil., données de l'état d'avant les pages SEO) : 2 lignes, **toutes deux bénignes et désormais traitées**.
  - *Page avec redirection* (2 pages) → les URLs en apex qui redirigent en 301 vers `www`. Cause supprimée par l'unification des canoniques/JSON-LD sur `www`.
  - *Détectée, actuellement non indexée* (1 page) → la page légale, en `noindex` **volontaire**. **Ce n'est pas une erreur à corriger** : cette page ne doit pas être indexée. Le seul défaut était sa présence au sitemap ; retirée le 10/07.
  - 📌 Ne pas chercher à ramener ce rapport à zéro : redirections et `noindex` volontaires y figureront toujours. C'est du bruit normal, pas de la dette. Validations lancées côté GSC — laisser Google repasser, ne pas les relancer.
- **Favicon Google** : re-crawl en attente côté Google (quelques semaines) avant affichage dans les résultats.

---

## ▶️ Prochaines actions (dès signal)

- **Dès la 1ère approbation Awin** → câbler les boutons « Acheter dans cette taille » (résultats du site + widget extension) avec le format de lien affilié, + event Umami `clic-acheter` pour mesurer le tunnel.
- **Suivre Umami** (`selection-marque`, `changement-mode: cm`, `cta-extension`) après quelques semaines → décisions data-driven (marques à prioriser, usage réel du mode cm, conversion du CTA).
- **Vérifier l'indexation** (à faire, 2 min) : Search Console → Inspection d'URL sur `/comparaisons/nike-vs-adidas.html` → « Tester l'URL en direct ». Alternative : rapport Sitemaps (pages découvertes) ou `site:sizecheck.fr` sur Google.

---

## 📈 Suivi SEO — plan de lecture (démarré ~5 juil. 2026)

**Bon outil pour le bon signal :**
- **Google Search Console** = instrument de la **santé SEO** (requêtes, positions, impressions, clics). C'est là qu'on juge si le SEO décolle — bien avant qu'Umami ne voie du trafic.
- **Umami** = trafic **qui arrive** + comportement une fois sur le site (pas le « pourquoi » du référencement).

**Le SEO ne se juge pas à une date-verdict, mais à une séquence de signaux :**

| Signal (Search Console) | Quand | Ce que ça dit |
|---|---|---|
| Indexation (rapport Pages) | 1-4 sem. | Les pages sont-elles dans l'index ? |
| **Impressions** (Performances) | **1-2 mois** | Les pages commencent-elles à apparaître (même page 4-5) ? **1er vrai signal.** |
| Positions qui montent | 2-6 mois | Progression page 5 → 3 → 1 |
| Clics / trafic | 3-6 mois+ | Résultat final : visites réelles |

**Checkpoints / déclencheurs :**
- **~4 sem.** : pages **indexées** — sinon, diagnostiquer un souci technique.
- **~2-3 mois** : **impressions qui montent** attendues. Zéro impression = signal d'alerte (contenu qui ne matche pas / domaine trop jeune).
- **~6 mois** : **verdict fiable**. Impressions + positions en hausse → ça marche, laisser mûrir. Stagnation en page 4-5 → autre levier requis (liens entrants, contenu renforcé).

**Point de référence « jour 0 » (rapport Couverture du 6 juil., données ≤ 30 juin — donc AVANT les 28 pages SEO) :** accueil **indexé** (1 page), impressions 1-4/jour, base technique **saine** (pas d'erreur noindex/crawl/serveur). « Problèmes » bénins : 2 pages en redirection (canonique `sizecheck.fr` → `www`, normal) + 1 « détectée, non indexée » (lag jeune site). Les pages `/comparaisons/` sont trop récentes pour y figurer. Sitemaps rangés : un seul (`/sitemap.xml`), le doublon `/sitemap` supprimé de Search Console.

**Prochain relevé : ~2-3 semaines** → rapport **Performances** (impressions par requête = signal de traction) + rapport **Pages** (les 28 passent de « découvertes » à « indexées »).

**À garder en tête :** ne rien conclure avant ~3 mois. Le contenu est un pari raisonnable (répond à de vraies requêtes, longue traîne peu concurrentielle) : le risque est le **temps / l'autorité du domaine**, pas l'adéquation contenu/recherche. Niche → succès = trafic **qualifié et cumulatif**, pas du volume brut.

---

## 📌 Décisions clés

- **Monétisation** : AdSense **abandonné** (sessions courtes, RPM faible, dégrade vitesse/SEO, friction bandeau). On monétise l'**intention d'achat** par l'**affiliation**, pas l'attention par la pub. B2B « réduction des retours » gardé en horizon long.
- **Expansion géo** : rester **FR** tant que le modèle n'est pas validé (SEO qui ranke + affiliation qui convertit). Ensuite, pays par pays (**Allemagne** d'abord — tailles EU, données réutilisables telles quelles), pas « anglais pour l'Europe ».
- **Pub payante (Google Ads, social…)** : **prématurée** (6 juil. 2026). L'économie unitaire ne tient pas — on paierait pour des visiteurs qui rapportent ~0 € (affiliation pas encore active), et sans donnée de conversion on serait aveugle. Prérequis avant tout test payant : affiliation active + trackée → connaître le **revenu par visiteur** → alors seulement un petit test mesuré (Search longue traîne / retargeting), jamais du Google Ads large.
- **Monétisation gelée 3-6 mois** (10 juil. 2026, suite aux refus Zalando/Adidas). Les trois portes — AdSense, pub payante, affiliation — se ferment sur le **même verrou : l'absence de trafic**. Le goulot d'étranglement n'est pas la monétisation, c'est l'audience. Toute l'énergie va au trafic (SEO + installs extension) jusqu'à ce que ce verrou saute.
  - **Ne pas recandidater à vide.** Awin autorise techniquement une nouvelle candidature annonceur (bouton « + » sous le logo, en contactant d'abord l'annonceur pour expliquer ce qui a changé), mais re-postuler avec les mêmes chiffres = 2ᵉ refus + crédibilité grillée auprès du manager. Le délai de 60 j d'Awin concerne le refus de la *candidature réseau*, pas les programmes annonceurs — le compte n'est donc pas bloqué.
  - **Ne pas s'éparpiller** sur d'autres réseaux (Rakuten, Effiliation, Kwanko…) : même filtre trafic, on ne collectionnerait que des refus.
  - **Seuil de recandidature** : ~**500-1 000 visiteurs/mois** ou quelques centaines d'installs actives. Argumentaire à ce moment-là : audience 100 % FR sur des requêtes d'**intention d'achat** (« pointure Nike Adidas »), stats Umami à l'appui.
  - **Amazon Partenaires** = premier palier accessible (accepte presque tout le monde à l'entrée), mais le filtre est **à la sortie** : quelques ventes qualifiantes sous 180 j sinon compte fermé. À garder pour les premiers clics réels, pas maintenant.

---

## 📋 Backlog

- [ ] **v1.2 extension** : logos embarqués localement (aujourd'hui via le service favicon Google), évaluer Amazon/Decathlon, tailles US/UK, widget draggable.
- [ ] og:image à mettre à jour si les marques supportées changent.
- [ ] Duplication des tables `index.html` ↔ `extension/sizes.js` : conservée par choix (single-file), verrouillée par `tools/check_sync.py`.
