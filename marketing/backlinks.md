# Plan de backlinks — SizeCheck

**Créé le 19 août 2026.** Objectif : débloquer le crawl des 27 pages `/comparaisons/` bloquées en « détectée, actuellement non indexée » depuis le 10 juillet.

---

## Le problème en une phrase

Les 27 pages ne sont **pas rejetées** par Google — elles ne sont **pas encore explorées**. Un domaine de 6 semaines sans aucun lien entrant reçoit un budget de crawl minimal : Google lit l'accueil et le hub, puis s'arrête. Aucune réécriture de contenu ne changera ça. Il faut donner à Google une raison de revenir, et cette raison, ce sont les liens externes.

---

## Ce qu'il ne faut PAS faire

**Les annuaires SEO généralistes** (« 40 annuaires gratuits pour booster votre SEO »). Ces listes circulent encore, mais :

- la quasi-totalité de ces annuaires sont des fermes de liens sans trafic réel ;
- Google les a dévalués depuis des années — au mieux ils sont ignorés ;
- une inscription massive et rapide est un signal de manipulation.

Le temps passé là-dessus est mieux investi ailleurs. On vise **peu de liens, mais réels**.

---

## Tier 1 — Liens à forte valeur (à faire en premier)

### 1. Vérifier que la fiche Chrome Web Store pointe bien vers le site

C'est déjà le meilleur actif : domaine Google, forte autorité, et l'extension est publiée. Vérifier que le champ **« Site web »** de la fiche contient `https://www.sizecheck.fr` — s'il est vide, c'est le gain le plus rapide du plan.

### 2. Plateformes de lancement (backlink dofollow + durée de vie longue)

Contrairement à Product Hunt dont le pic retombe en 24 h, ces plateformes gardent la fiche indexée des mois. Les extensions Chrome y convertissent bien.

| Plateforme | Pourquoi |
|---|---|
| **AlternativeTo** | Référence les alternatives à un outil — SizeCheck se positionne face aux guides de tailles des marques. Trafic sur des années, pas 24 h. |
| **SaaSHub** | Même logique, bonne indexation. |
| **Uneed** | Board de lancement actif, audience indie. |
| **DevHunt** | Spécifiquement orienté outils dev/extensions. |
| **Microlaunch / Fazier** | Petits boards, faible effort, lien permanent. |
| **Smol Launch** | Fenêtre de 7 jours (vs 24 h), bon pour les extensions Chrome. |
| **BetaList** | Moins pertinent ici (orienté pré-lancement), à sauter. |

Étaler sur 2-3 semaines, pas tout le même jour.

### 3. Show HN (Hacker News)

Angle à privilégier : **le problème technique**, pas le produit. « Show HN: I mapped the official cm size charts of 8 shoe brands because EU 42 isn't EU 42 ». Le public HN réagit au constat contre-intuitif et aux données relevées à la main. Un seul essai, pas de relance.

---

## Tier 2 — Communautés (participation réelle, pas dépôt de lien)

Le lien y est souvent `nofollow`, mais il génère du **trafic réel** — et le trafic déclenche le crawl. C'est l'effet recherché.

- **r/Sneakers, r/findfashion, r/running** — répondre aux questions de pointure existantes en donnant la réponse **dans le commentaire**, avec le lien en complément. Déposer un lien nu se fait supprimer.
- **Forums FR running / trail** (Kikourou, forums Salomon/trail) — le sujet « quelle pointure en trail vs route » est récurrent et SizeCheck y répond précisément.
- **Indie Hackers** — post « comment j'ai construit », l'angle data (relever les grilles officielles des 8 marques à la main) est le contenu qui marche.
- **Nolt / groupes Facebook sneakers FR** — plus dispersé, faible priorité.

**Règle** : ne jamais poster un lien seul. La réponse doit être utile même si personne ne clique.

---

## Tier 3 — À plus long terme

- **Contenu qui attire des liens naturellement** : une page « pourquoi un EU 42 n'est pas un EU 42 » avec les écarts chiffrés entre les 8 marques est le type de page que les blogs citent. C'est le seul levier qui compose.
- **Presse spécialisée FR** (sneakers, running) — plus crédible une fois qu'il y a un peu de trafic à montrer.

---

## Ordre d'exécution suggéré

1. Vérifier le champ « Site web » de la fiche Chrome Web Store *(5 min — potentiellement le plus rentable)*
2. AlternativeTo + SaaSHub *(30 min)*
3. Uneed + DevHunt + Microlaunch, étalés sur 2 semaines
4. Show HN, une fois, quand le maillage interne est en place
5. Participation communautaire, en continu et sans forcer

---

## Comment mesurer

Ne pas juger au nombre de liens. Le signal à surveiller dans Search Console :

- **Statistiques d'exploration** (Paramètres → Statistiques sur l'exploration) : le nombre de requêtes/jour de Googlebot doit monter.
- Les 27 pages doivent passer de **« détectée »** à **« explorée »**. C'est ça, la victoire de cette phase.
- Ce n'est qu'**après** ce passage que la question de la qualité du contenu se posera — c'est-à-dire si elles stagnent ensuite en « explorée, actuellement non indexée ». Le point de vigilance noté dans `STATUS.md` le 10/07 vaut pour cette étape-là, pas pour maintenant.

---

## Sources

- [12 Product Hunt Alternatives That Still Drive Real Traffic (2026) — LaunchList](https://getlaunchlist.com/blog/product-hunt-alternatives)
- [20 Best Product Hunt Alternatives to Launch Your Product in 2026 — StartupBase](https://startupbase.io/blog/product-hunt-alternatives)
- [The 15 Best Product Hunt Alternatives in 2026 — Uneed](https://www.uneed.best/blog/uneed-a-product-hunt-alternative)
