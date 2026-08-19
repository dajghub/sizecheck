# STATUS — SizeCheck

_Dernière mise à jour : 19 août 2026_

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
- **Indexation Search Console** — ⚠️ **CRAWL BLOQUÉ, seuil d'alerte franchi** (constaté le 19 août 2026, 6 semaines après la découverte du 08/07). **2 indexées** (accueil + hub `/comparaisons/`), **31 non indexées**.
  - Ventilation : **27 « détectée, non indexée »** = *jamais crawlées* en 6 semaines · **1 « explorée, actuellement non indexée »** = `nike-vs-adidas.html`, **crawlée puis NON retenue** · 2 « page avec redirection » (apex → www, validation en **Échec** — normal et non corrigeable : le 301 apex→www doit exister) · 1 « exclue par noindex » = page légale (correct).
  - **Site revérifié le 19/08, aucune régression** : pages 200 · `index, follow` · sitemap 30 URLs `www` · canoniques `www` · robots OK. **Le problème n'est pas technique.**
  - **Deux mécanismes distincts, tous deux réels :**
    1. **Budget de crawl / absence d'autorité** (dominant) → explique les 27 jamais explorées. Un domaine jeune sans lien entrant reçoit un budget minimal : Google lit l'accueil + le hub, puis s'arrête. **Aucune modification de contenu ne débloque ça** — il faut des signaux externes.
    2. **Évaluation du contenu** (n=1, signal négatif) → la seule page-feuille que Google ait réellement évaluée, il ne l'a **pas indexée**. Insuffisant pour condamner le contenu, insuffisant aussi pour le déclarer bon.
  - **Mesure de similarité des 28 pages (5-grammes, 19/08)** : seulement **13,5 % du contenu de chaque page lui est strictement propre** (86,5 % partagé avec au moins une page sœur) · similarité médiane entre paires **18,5 %** (max 51,4 %) · sur ~900 mots : **49 % de tableaux**, 27 % de FAQ, 220 mots d'intro/nav/pied. → Signature classique du **SEO programmatique**, déprioritisé sur un domaine sans autorité.
  - **Plan d'action arrêté le 19/08 (ordre impératif) :**
    1. **Backlinks d'abord** (`marketing/backlinks.md`) — sans crawl, toute amélioration de contenu est invisible pour Google. Tier 1 : fiche Chrome Web Store → site, plateformes de lancement, Show HN. Tier 2 : communautés (jamais de lien nu). Tier 3 : contenu citable + presse.
    2. ✅ **FAIT (19/08)** — **8 paires enrichies** (`PRIORITY_PAIRS` dans `tools/generate_pages.py`). Section « Ce qui change vraiment entre A et B » **entièrement calculée depuis les tables vérifiées** : décompte pointures même longueur / vraie différence / simple relibellé · écart moyen homme vs femme · amplitude de l'écart (min/max avec les pointures concernées) · 6 correspondances courantes · finesse comparée des grilles. **Aucun fait saisi à la main.** Les 20 autres pages restent au gabarit standard = **témoin**.
       - ⚠️ **Leçon mesurée** : la 1ʳᵉ version ajoutait 361 mots dont **84 % de prose générique partagée** → elle a rendu les 8 pages **plus similaires entre elles** (26,6 % vs 19,3 % pour les témoins). **On ne corrige pas du contenu templatisé avec plus de contenu templatisé.** Réécrite en supprimant toute phrase sans chiffre propre à la paire.
       - **Résultat après correction** : unicité **13,6 % → 17,4 %** · similarité entre les 8 ramenée à **22,0 %** (témoins 19,3 %) · 1058 mots/page (contre 849).
       - 📏 **Règle d'écriture inscrite dans le code** : toute phrase de la section doit porter un chiffre propre à la paire ; les phrases d'explication générique sont proscrites.
  - 📌 Rappels : ne pas viser zéro page non indexée (redirections + noindex volontaires = bruit permanent) · ne pas re-demander l'indexation en boucle · ne jamais écrire « indexée » sans l'avoir constaté par Inspection d'URL.
  - **Point de contrôle passé** : rappel Agenda du 5 août relevé avec 2 semaines de retard (19/08). Prochain relevé utile : **~4 semaines après les premiers backlinks réels**, pour juger si le crawl repart.
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
