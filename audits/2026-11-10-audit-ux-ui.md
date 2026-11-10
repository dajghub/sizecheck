# SizeCheck — Audit UX/UI

**Périmètre** accueil (convertisseur, 2 modes) + page `comparaisons/nike-vs-adidas.html` · **Comptes** aucun · **Fenêtres testées** 375×812, 375×600, 390×664, 768×1024, 1280×720, 1280×800 · **Date** 10 nov. 2026 · **Méthode** skill `ux-ui-audit` (probes core, heuristics, perception, ltr, focus), lecture intégrale des textes, calcul exhaustif sur les tables (`tools/sizedata.py`)

Référentiel : l'identité « mètre ruban » de `CLAUDE.md` prime sur les recommandations génériques des probes (ex. le « 24 boutons au style primaire » remonté par le probe correspond aux grilles de marques et de pointures, c'est voulu).

## Synthèse

| | Nombre |
|---|---|
| Corrigé pendant l'audit | 1 |
| Critique | 1 |
| Majeur | 2 |
| Accessibilité | 2 |
| Note | 2 |
| Points solides | 6 |

Les fondations sont saines : contraste, focus, performances, taille des cibles tactiles, structure des titres. Les problèmes sont dans le **sens** des résultats : le site affiche une pointure à +38 mm comme s'il s'agissait d'une correspondance normale, montre un conseil femme dans le rayon homme, et reste muet quand une mesure en cm est refusée. Les scripts ne voient rien de tout cela : ces défauts sont apparus à la relecture des textes et au calcul exhaustif sur les tables.

---

## Constats

### 01 · Corrigé · accueil, mode « Avec ma pointure »

**Après le choix d'une pointure, la page sautait au mauvais endroit et l'étiquette sortait de l'écran.**

L'ancien code calait le **mètre** en haut de l'écran. Sur ordinateur, l'étiquette (plus haute que l'écran) partait au-dessus : on ne voyait plus que la ligne HOKA et les conseils. Sur mobile, le saut faisait disparaître la grille des pointures, et le mètre occupait 144 px au-dessus de l'étiquette.

```
1280×720, clic sur Nike 43           AVANT        APRÈS
  défilement                          +869 px      0 à +19 px
  haut de l'étiquette                 −522 px      +44 à +133 px (visible)
  tableau entier visible              non          oui
375×812 / 390×664                     mètre en haut  étiquette en haut, 7 lignes visibles
768×1024                              —            mètre + tableau entiers
```

**Correction appliquée** (`bringIntoView`, index.html) : on fait défiler juste assez pour voir tout le tableau, sans jamais pousser le titre de l'étiquette hors de l'écran. Le mètre reste entier s'il tient avec le tableau, sinon il sort complètement de l'écran au lieu d'être coupé. Si l'étiquette est déjà lisible, la page ne bouge pas. Même règle en mode cm.

---

### 02 · Critique · accueil, les deux modes

**Quand une marque n'a pas la pointure, le résultat propose une chaussure bien trop grande ou trop petite, présentée comme une correspondance normale.**

Le convertisseur retient toujours la pointure la plus proche, même quand elle est à plusieurs centimètres. Exemple : HOKA homme commence à 24,3 cm, donc tout pied plus petit reçoit « HOKA 39⅓ ». Le site promet une conversion fiable ; ici, il conseille un achat qui sera retourné.

```
Mode marque — 1 981 combinaisons (source × cible × rayon)
  écart ≥ 10 mm : 111 (5,6 %)
  par cible : HOKA homme 34 · HOKA femme 15 · ASICS femme 13 · Adidas homme 12 · Adidas femme 12 …
  pires cas : New Balance 34 H (20,5 cm) → HOKA 39⅓   +38 mm
              Vans 47 F (31 cm)          → HOKA 45⅓   −31 mm
  affiché sur l'accueil : « Nike 36 homme … HOKA 39⅓ · 24,3 cm · +23 mm »

Mode cm — le mètre accepte 18 à 35 cm, les grilles couvrent 20,5 à 31 cm
  pied de 19 cm : les 8 marques entre +15 et +53 mm (HOKA 39⅓ +53 mm)
```

**Correction proposée :** à partir de 10 mm d'écart (seuil à confirmer), remplacer la pointure par « Hors grille » suivi de la limite du guide (« le guide HOKA homme commence à 24,3 cm »). Garder la ligne pour que l'étiquette reste complète. Option : réduire la plage du mètre à 20–32 cm. Cela recoupe l'item du backlog « Grands pieds hors grille », mais le problème touche aussi les **petits** pieds, et c'est HOKA homme qui en concentre le plus.

---

### 03 · Majeur · accueil, rayon homme

**Le conseil HOKA réservé aux modèles femme s'affiche dans le rayon homme.**

Les conseils sont définis par marque, pas par rayon. Un homme lit donc une consigne qui ne le concerne pas, juste sous sa pointure HOKA.

```
Rayon : homme · Nike 36
« HOKA. Sur les modèles femme récents (Clifton 10, Arahi 8, Challenger 8),
  HOKA conseille une demi-pointure en dessous de ta pointure HOKA habituelle. »
Source : extension/sizes.js:125 et index.html (tip unique, sans genre)
```

**Correction proposée :** afficher ce conseil seulement si `S.gender === 'femme'`, par exemple avec un champ `tipGender: 'femme'` lu par le site, le widget et le popup, et contrôlé par `check_sync.py`.

---

### 04 · Majeur · accueil, mode « Avec mon pied en cm »

**Une mesure refusée ne donne aucun message, et l'étiquette vide parle d'une pointure à choisir.**

Si on tape 15, 40 ou « abc », le résultat disparaît sans explication : le texte d'aide ne change pas et le champ n'est pas marqué en erreur. Sur ordinateur, l'étiquette vide dit « dès que tu as choisi ta pointure », alors qu'on est en mode cm. Sur mobile, l'étiquette vide est masquée : on ne voit rien du tout.

```
saisie   texte d'aide (inchangé)                                       aria-invalid   étiquette
15       « Fais glisser le mètre ou saisis ta mesure en centimètres. »   absent         vide
40       idem                                                           absent         vide
abc      idem                                                           absent         vide
sous-titre de l'étiquette vide : « Elles s'affichent ici dès que tu as choisi ta pointure. »
plage acceptée : isValidCm, 18 ≤ v ≤ 35 (index.html:729)
```

**Correction proposée :** si la saisie est invalide, texte d'aide « Entre une longueur entre 18 et 35 cm » et `aria-invalid="true"`. En mode cm, sous-titre « dès que tu as indiqué la longueur de ton pied ».

---

### 05 · Accessibilité · accueil — SC 2.4.3 (Focus Order)

**Au clavier, choisir une marque ou une pointure renvoie le focus en haut de la page.**

`renderSizes()` et `renderSourceBrands()` reconstruisent les boutons (`innerHTML = ''`) à chaque clic. Le bouton qui avait le focus disparaît et le focus retombe sur `<body>`. Le Tab suivant repart du logo : il faut 15 tabulations pour revenir aux pointures.

```
Tab ×16 → focus sur « 36 » → Entrée
document.activeElement : BODY   (attendu : le bouton « 36 »)
```

**Correction proposée :** mettre à jour `aria-pressed` sur les boutons existants au lieu de les recréer. Si le changement de marque oblige à reconstruire, remettre le focus sur le bouton de même libellé.

---

### 06 · Accessibilité · accueil — SC 4.1.3 (Status Messages)

**La zone annoncée aux lecteurs d'écran contient toute l'étiquette : 1 939 caractères relus à chaque changement.**

`#result` porte `aria-live="polite"` et englobe le tableau, la note et tous les conseils. Chaque clic sur une pointure fait relire l'ensemble par VoiceOver ou NVDA, soit plusieurs dizaines de secondes.

```
<div id="result" aria-live="polite">  → textContent.length = 1939
```

**Correction proposée :** sortir `aria-live` de `#result` et l'attacher à une courte phrase dédiée, du type « Nike 43 homme, 26,7 cm : 7 équivalences ». Le tableau reste consultable normalement.

---

### 07 · Note · en-tête et pied de page

**Deux liens isolés font moins de 24 px de haut.**

Ils passent le SC 2.5.8 grâce à l'exception d'espacement (rien n'est à côté), mais ils sont loin des 44 px recommandés au doigt.

```
« Tableaux par marque » (en-tête)       144 × 23
« Politique de confidentialité » (pied) 162 × 21
« Convertir une autre pointure ou marque » (comparaisons) 278 × 23
```

**Correction proposée :** `padding-block: 10px` sur ces liens. Le texte ne bouge pas, seule la zone cliquable grandit.

---

### 08 · Note · CSS de l'accueil

**12 tailles de police et 20 valeurs d'espacement distinctes.**

L'écart n'est pas visible à l'œil (une seule famille, 4 couleurs de texte, 3 rayons d'angle), mais certaines valeurs n'apparaissent qu'une fois. C'est la dérive typique d'un CSS écrit à la main.

```
tailles : 16 ×91 · 19 ×25 · 14 ×24 · 15 ×23 · 13 ×16 · 32 ×10 · 17 ×8 · 24, 45, 46, 20, 22 ×1
```

**Correction proposée :** au prochain passage sur le CSS, regrouper les tailles et espacements dans des variables `--fs-*` et `--sp-*`, à côté des couleurs déjà en variables. Rien d'urgent.

---

## Suivi

| Constat | État |
|---|---|
| 01 Défilement vers le résultat | Corrigé et en ligne le 10 nov. |
| 03 Conseil HOKA femme en rayon homme | Corrigé le 10 nov. (`tipGender`, site + extension) |
| 04 Saisie cm refusée muette | Corrigé le 10 nov. |
| 05 Focus perdu au clavier | Corrigé le 10 nov. (vérifié : focus sur « Adidas » puis « 36⅔ » après Entrée) |
| 06 `aria-live` trop bavard | Corrigé le 10 nov. (phrase courte dans `#result-status`) |
| 07 Petits liens | Corrigé le 10 nov. (23 → 43 px de zone cliquable, texte immobile) |
| 02 Pieds hors grille | **Ouvert** : choix du seuil et du libellé à faire |
| 08 Tokens CSS | Ouvert, sans urgence |

## Points solides

- **Contraste** : 144/144 textes conformes sur l'accueil, 302/302 sur `nike-vs-adidas`, aucun échec.
- **Focus clavier** : contour `3px solid` sur `#E3E5E6`, contraste 12,5:1 (SC 1.4.11 demande 3:1), épaisseur conforme au SC 2.4.13.
- **Cibles tactiles du parcours principal** : pointures 64×48, marques 81×58, Homme/Femme 170×46. Toutes au-dessus de 44 px de haut et à portée de pouce selon le probe Fitts.
- **Structure** : un seul H1, aucun niveau de titre sauté sur les deux pages, `lang="fr"`, balises Open Graph complètes (10).
- **Poids** : 3 requêtes, 16 Ko, DOMContentLoaded en 26 ms (serveur local, ordre de grandeur seulement).
- **Rédaction** : 9 textes d'aide sur 9 ponctués de la même façon, virgule décimale partout, aucun texte provisoire trouvé. Aucun débordement horizontal (seul le mètre défile, c'est voulu).

## Par où commencer (impact ÷ effort)

1. **03** : conseil HOKA femme filtré par rayon (quelques lignes, site + extension).
2. **05** : focus conservé au clavier (mise à jour d'`aria-pressed` au lieu de reconstruire).
3. **04** : message d'erreur en mode cm + sous-titre adapté.
4. **06** : zone `aria-live` réduite à une phrase.
5. **02** : « Hors grille » au-delà d'un seuil. Le plus d'impact, mais il faut d'abord choisir le seuil et le texte, puis reporter le changement dans l'extension et les pages de comparaison.
6. **07**, **08** : au fil de l'eau.

Non couvert : extension Chrome (popup et widget), page légale, vrais lecteurs d'écran (l'annonce du 06 est déduite du balisage, pas écoutée), vrai téléphone (les défilements animés ont été mesurés en mode instantané, le panneau du navigateur étant masqué).
