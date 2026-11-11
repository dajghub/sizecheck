# STATUS — SizeCheck

_Dernière mise à jour : 11 novembre 2026_

## ⏸️ Projet en pause depuis le 11 nov. 2026

Pour reprendre, dans l'ordre :
1. **Pousser les commits locaux** (`git push`) : les correctifs rapides de l'audit UX/UI (conseil HOKA par rayon, erreur en mode cm, focus clavier, annonce lecteurs d'écran, petits liens) ne sont **pas encore en ligne**. Vérifier ensuite avec `gh run list --workflow=deploy.yml`.
2. **Publier l'extension v1.2.0** : le zip a été reconstruit le 10 nov. (voir Backlog).
3. **Nouvelles marques** : décider de l'ajout d'UGG, Puma et Birkenstock (+ Crocs en option) — voir « Nouvelles marques — analyse Google Trends » plus bas. UGG culmine en nov.–déc.
4. **Pieds hors grille** (audit, critique) : choisir le seuil (10 mm proposé) et le libellé « Hors grille ».
5. Backlinks et relevé Search Console (voir « En cours »).

---

## ✅ En ligne / opérationnel

- **Défilement vers le résultat corrigé + audit UX/UI (10 nov., en ligne)** — après le choix d'une pointure, la page calait le *mètre* en haut : sur un écran d'ordinateur de 720 px, l'étiquette partait au-dessus de l'écran (haut à −522 px après un saut de 869 px). `bringIntoView()` fait maintenant défiler juste assez pour voir tout le tableau, sans jamais couper le titre de l'étiquette ni le mètre (vérifié en 375×812, 375×600, 390×664, 768×1024, 1280×720). Audit complet dans `audits/2026-11-10-audit-ux-ui.md` (skill ux-ui-audit) : 1 critique, 2 majeurs, 2 accessibilité, 2 notes.
  - **Corrigés dans la foulée (10 nov.)** : conseil HOKA « modèles femme » masqué en rayon homme (champ `tipGender`, site + extension via `scHasTip()`, contrôlé par `check_sync.py`) · mode cm : message « Entre une longueur entre 18 et 35 cm » + `aria-invalid` quand la saisie est refusée (pas pendant la frappe de « 2 » vers « 26 »), sous-titre de l'étiquette vide adapté · focus clavier conservé après le choix d'une marque/pointure (boutons mis à jour au lieu d'être recréés) · lecteurs d'écran : une phrase courte annoncée (« Nike 43 homme, soit 26,7 cm : 7 équivalences affichées. ») au lieu des 1 939 caractères de l'étiquette · zones cliquables des petits liens agrandies à ~44 px sans déplacer le texte (en-tête, pied de page, page légale, lien « Convertir » des pages de comparaison).
  - **Zip de l'extension reconstruit** (`marketing/chrome-store/sizecheck-extension.zip`) : l'ancien datait du 9 nov. 00:55 et n'avait ni les 15 pointures ajoutées ce jour-là ni ces correctifs.
  - **Reste ouvert** : pieds hors grille (critique, décision de seuil requise) et note CSS 08.

- **Refonte visuelle (8 nov., en ligne — commit `1bd7e10`)** — identité « mètre ruban » sur tout le site : accueil, 28 pages + hub, page légale. Mètre jaune interactif (pivot EU → cm → EU, curseur glissable + clavier en mode cm), résultat en étiquette de boîte (tableau, ordre de marques fixe, écart en mm), police Archivo **auto-hébergée** (`assets/fonts/`, woff2 latin + latin étendu, licence OFL jointe ; aucun appel à Google, conforme à la politique de confidentialité), CSS écrit à la main. FAQ de l'accueil désormais **visible** (elle n'existait qu'en JSON-LD). Saisie cm acceptant la virgule (`type=text inputmode=decimal`). Tailwind retiré (`assets/tailwind.css` supprimé ; la page légale chargeait le CDN de dev Tailwind). Détails dans CLAUDE.md, section « Identité visuelle ».

- **Cohérence des conseils + visuels (9 nov.)** — Converse et Vans : un seul message partout (accueil, FAQ, pages SEO) : ils taillent grand, mais leur guide officiel en cm l'intègre déjà, donc la pointure convertie est la bonne, **sans descendre en plus** (l'ancien « Converse recommande ½ pointure en dessous » faisait compter l'écart deux fois ; vérifié sur converse.com : US 8 = 26,5 cm contre US 8,5 chez Nike). FAQ « A et B taillent pareil ? » des pages SEO : calculée sur les grilles homme **et** femme, réponse par genre quand la conclusion diffère (6 paires, dont Nike/Adidas : ~0 cm homme, 0,4 cm femme). Accueil : le nom de marque n'est plus répété dans « Bon à savoir ». `og-image`, `favicon` et `apple-touch-icon` refaits dans l'identité mètre ruban via `tools/render_brand_assets.py` (Chrome headless + police du site).

- **Extension v1.2.0 — refonte (9 nov., prête, pas encore publiée sur le store)** : popup et widget dans l'identité mètre ruban, avec la même étiquette de résultat que le site (`extension/ui.js` partagé). Police embarquée, icônes refaites, logos et appels au service favicon de Google supprimés. Conseils de chaussant recopiés du site et désormais contrôlés par `check_sync.py`. Corrigé au passage : pointures du widget affichées avec un point (« 42.5 ») ; saisie cm refusant la virgule ; bouton « Masquer » (et masquage sur les pages panier/paiement) inopérant à cause d'un `display: block !important` dans le shadow DOM. Le widget s'ouvre directement sur le résultat.

- **Audit des tables (9 nov.)** : les **265 valeurs** (8 marques × homme/femme) sont **identiques aux guides officiels**, relevés via Firecrawl et le navigateur. Sources : nike.com/size-fit (affichage « Metric » ; les pages /fr/size-fit sont en 404), adidas.com/us size_charts (homme = femme), newbalance.fr/fr/size-guide.html, converse.com/size-chart-guide (Chuck Taylor ; le doublon 38 = 39 = 24,5 cm vient du guide Converse lui-même), vans.com/fr-fr/aide/tableau-des-tailles, salomon.com sizingchart (homme = femme), asics.com/fr (homme) + asics.com/my et /nz (femme), hoka.com/fr/fr/sizing-information.html (bloque les robots : lu dans le navigateur). Les écarts homme/femme de Nike à pointure EU égale viennent bien des deux guides Nike. **15 pointures officielles ajoutées** dans la foulée (étaient absentes, pas fausses) : Nike F 33,5/34,5 · NB H 34/35/35,5/46,5 · NB F 34/34,5 · Converse 46,5 · Vans 34,5/47 · Salomon 46⅔ · ASICS H 46,5 · HOKA H 46⅔ → **283/283 valeurs conformes, aucune pointure officielle manquante** (36–47). Effet de bord : la FAQ NB/ASICS homme (écart 0,154 cm, juste au-dessus du seuil 0,15) disait « non, demi-pointure » avec l'exemple EU 42 → EU 42 ; elle dit maintenant « oui, 0,1 cm ».

- **Visuels de partage complétés (9 nov.)** : `favicon.ico` racine ajouté (16/32/48, même dessin ; publié via la whitelist) ; balises `og:image:alt`, `og:site_name`, `og:locale` sur les 31 pages ; la page légale, qui n'avait **aucune** balise de partage, les a toutes ; URL de l'image d'aperçu et des icônes versionnées (`?v=2`) pour forcer le rechargement. Avatars 512×512 refaits dans l'identité (`marketing/avatars/` : jaune, blanc, transparent ; anciens rangés dans `ancien-2026-07/`).

- **8 marques** : Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA. Données **100 % vérifiées en direct** sur les guides officiels, avec les demi-pointures et tiers réellement vendus (Nike 42.5, Adidas 42⅔, Salomon/HOKA en tiers, ASICS en quarts de cm). Structure `[label, cm]` par marque/genre, synchro site ↔ extension verrouillée par `tools/check_sync.py`.
- **Site** (`index.html`) — convertisseur V3 mobile-first, **2 modes** (depuis une marque / depuis la longueur de pied en cm), CSS écrit à la main (Tailwind retiré le 8 nov.), scroll auto vers le résultat, a11y (aria-pressed, contraste AA).
- **28 pages SEO** `/comparaisons/{a}-vs-{b}.html` + index, générées par `tools/generate_pages.py` : tableaux H/F, **FAQ JSON-LD** (dont « taillent pareil ? » / « taille grand ou petit ? » calculées depuis les données), maillage croisé, CTA extension entre les tableaux.
- **Extension Chrome v1.1.0 — LIVE** sur le Chrome Web Store : widget Shadow DOM + popup, persistance profil (marque/pointure/genre/cm), FAB zéro-clic « Ta taille ici : EU X », mode cm, support SPA, masquage panier/checkout.
- **Analytics : Umami Cloud** (cookieless, RGPD, **sans bandeau de consentement**) — sur le site, la page légale et les 28 pages SEO. 5 custom events instrumentés (`selection-marque`, `changement-mode`, `changement-genre`, `cta-extension`, `lien-convertisseur`).
- **SEO technique** : `robots.txt`, `sitemap.xml` (**30 URLs**) soumis à Search Console, propriété GSC de type **Domaine**.
- **Assets graphiques — couverture complète** (10 juil.) : favicon PNG 96×96 (multiple de 48, requis par Google), **`apple-touch-icon` 180×180 à fond opaque** (écran d'accueil iOS — un fond transparent y serait rendu sur noir), `og-image` 1200×630. Balises `og:*` + `og:image:width/height` + `twitter:card` sur l'accueil et les 28 pages SEO (la page légale n'en avait pas : corrigé le 9 nov.) → vignette correcte sur WhatsApp/iMessage/Discord/LinkedIn/X.
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

## 🔎 Nouvelles marques — analyse Google Trends (11 nov. 2026)

Refaite le 11 nov. (une première analyse, menée hors de ce dépôt, n'avait laissé aucune trace). France, 12 derniers mois, recherche Web. Méthode : mots-clés tels qu'on les tape (les « sujets » et le filtre catégorie Chaussures donnaient des résultats incohérents, ex. Salomon 0,06 × New Balance, UGG 0). Google Trends fusionne « X taille » et « taille X » ; « pointure X » est quasi nul hors Nike (47 contre 0–1), donc l'intention de taille se lit sur « taille ».

| Marque | Intérêt marque (New Balance = 1) | Recherches « taille » (« nike taille » = 1) | Requêtes associées | Saison |
|---|---|---|---|---|
| *Repères déjà sur le site* | Vans 0,41 · HOKA 0,29 · Converse 0,24 | Vans 0,37 · Salomon 0,35 · Converse 0,21 · HOKA 0,15 | | |
| **Puma** | 0,57 | 0,34 | « puma taille grand ou petit » | stable (−7 % sur 5 ans) |
| **UGG** | 0,46 | 0,20 | « ugg taille 38 / 39 / 35… », « grand ou petit » | **pic nov.–déc. ×2,9** (+34 % sur 5 ans) |
| **Birkenstock** | 0,41 | 0,18 | « taille grand », « petit ou grand » | pic juin ×2,7 (+19 %) |
| Crocs | 0,52 | 0,54 | surtout tailles enfant (« crocs taille 22 / 23 ») ; double numérotation M/W | pic juin ×1,7 (+198 %) |
| Saucony | 0,31 | 0,15 | aucune | |
| Écartées | Jordan 1,13 (grille Nike ; « taille » = taille de l'acteur Michael B. Jordan) · Lacoste 0,99 (vêtements : aucune requête associée chaussure) · Timberland 0,19 · On running 0,11 · Dr. Martens 0,10 · Reebok 0,09 · Veja 0,07 | | | |

**Recommandation** : ajouter **UGG** (en pleine saison), **Puma** et **Birkenstock** ; Crocs en option (fort et en croissance, mais public surtout enfant et grille M/W). 8 → 11 marques = 28 → 55 pages de comparaison (n(n−1)/2) : à décider si on génère toutes les paires ou seulement les paires utiles.

---

## 📋 Backlog

- [ ] **Publier l'extension v1.2.0 (à faire par Jade)** : envoyer `marketing/chrome-store/sizecheck-extension.zip` (reconstruit le 10 nov.) sur le Chrome Web Store, remplacer `promo-small.png` / `promo-large.png` (déjà refaites), et **refaire les 2 captures 1280×800** (encore l'ancien widget bleu) : installer la v1.2 en « non empaquetée », ouvrir une page produit (ex. nike.fr), capturer le widget fermé puis ouvert.

- [ ] **Pieds hors grille (audit 02, critique)** : le résultat retient toujours la pointure la plus proche, même très loin. **111 combinaisons sur 1 981 (5,6 %) ont un écart ≥ 10 mm**, petits pieds compris (HOKA homme commence à 24,3 cm : NB 34 → HOKA 39⅓ = +38 mm ; Vans 47 F → HOKA 45⅓ = −31 mm). En mode cm, le mètre accepte 18–35 cm alors que les grilles couvrent 20,5–31 cm (19 cm → HOKA +53 mm). Afficher « Hors grille » + la limite du guide au-delà d'un seuil (à choisir), site + extension + pages SEO.
- [ ] **Tokens CSS (audit 08, sans urgence)** : 12 tailles de police et 20 espacements distincts sur l'accueil → variables `--fs-*` / `--sp-*` au prochain passage sur le CSS.
- [ ] **v1.3 extension** : évaluer Amazon/Decathlon, tailles US/UK, widget draggable.
- [ ] og:image à mettre à jour si les marques supportées changent.
- [ ] Duplication des tables `index.html` ↔ `extension/sizes.js` : conservée par choix (single-file), verrouillée par `tools/check_sync.py`.
