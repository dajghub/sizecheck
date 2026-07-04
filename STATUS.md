# STATUS — SizeCheck

_Dernière mise à jour : 4 juillet 2026 (soir)_

---

## ✅ Fait

- **Vérification Salomon close** (4 juil. 2026, soir) : la plage basse EU 36–39⅓ (seul point non confirmé en direct) a été validée valeur par valeur sur la grille officielle « Chaussures unisexe » de salomon.com, qui liste explicitement les équivalents hommes (« 4 M ») dès EU 36 — conserver ces pointures en mode homme est légitime. Échelle EU→CM identique sur les 3 grilles officielles (homme/femme/unisexe). **Les 8 marques sont désormais 100 % vérifiées en direct sur les guides officiels.** Aucune modification de données nécessaire.

- **P3 audit — croissance & dette technique** (4 juil. 2026) :
  - **28 pages SEO** `/comparaisons/{a}-vs-{b}.html` + index, générées par `tools/generate_pages.py` depuis les tables (tableaux H/F complets, FAQ JSON-LD calculée, maillage croisé) ; sitemap.xml régénéré ; lien interne depuis l'accueil
  - **Tailwind précompilé** : CDN remplacé par `assets/tailwind.css` (13,7 KB, extrait du JIT, couverture des classes vérifiée par script)
  - **Logos auto-hébergés** sur le site (`assets/logos/`) — extension inchangée (zip v1.1.0 figé)
  - **`tools/check_sync.py`** : contrôle automatique synchro + monotonie des tables site ↔ extension
  - CLAUDE.md mis à jour (nouveaux composants : comparaisons/, tools/, CSS statique)
- **P2 audit — mode « longueur de pied en cm »** (4 juil. 2026) :
  - Second point d'entrée sur le site (tabs Marque / Pied (cm) dans l'étape 1) : saisie directe en cm + mini-guide de mesure, résultats sur les 8 marques, partage `?g=&cm=`
  - Widget + popup extension : toggle « Depuis ma marque / Depuis mon pied », mesure persistée (`sc_foot_cm`, `sc_mode`), FAB zéro-clic aussi depuis la mesure
  - Fiche store mise à jour (description longue + justification storage)
- **P1 audit — friction utilisateur** (4 juil. 2026) :
  - Extension : pointure + genre persistés (`chrome.storage.local`), partagés entre widget et popup
  - Extension : le FAB affiche directement « Ta taille ici : EU X » quand le profil est connu (zéro clic)
  - Extension : support SPA (re-détection à chaque changement d'URL), FAB masqué sur panier/checkout, bouton ✕ pour masquer (session)
  - Site : scroll automatique vers le résultat après sélection de la pointure (avec fallback reduced-motion)
  - Site : bannière extension masquée sur mobile (`hidden md:flex`)
  - Contraste AA (slate-400 → slate-500, blue-200/300 → blue-100) + `aria-pressed` sur tous les toggles (site + extension)
  - Tri des résultats unifié : par proximité CM partout (P2.10 fait au passage)
- **P0 audit — grilles officielles avec demi-pointures/tiers** (4 juil. 2026) :
  - Les 8 grilles re-relevées sur les guides officiels avec les pointures réellement vendues (Nike 42.5, Adidas 42⅔, Salomon/HOKA en tiers, ASICS en quarts de cm…)
  - Nouvelle structure de données `[label, cm]` par marque et par genre (site + extension synchronisés)
  - HOKA : échelles homme/femme désormais distinctes (officiel) ; ASICS femme corrigée (s'arrête à EU 45) ; Salomon/Adidas/Converse/Vans confirmés unisexes
  - Seuil du second choix « ou X » resserré (quasi-égalité ≤ 0.15 cm) : affiché dans 19 % des conversions au lieu de 70 %
  - Message générique « Entre deux tailles — prends la plus grande » supprimé (contradictoire avec les tips par marque)
  - Extension passée en v1.1.0 (à re-soumettre au Chrome Web Store)
- **Audit UX/UI complet** (4 juil. 2026) — plan d'action P0→P3 (P0 fait, voir backlog pour P1+)
- **Bannière extension** mise à jour sur le site : lien vers le Chrome Web Store avec badge « Installer »
- **Favicon** : basket seule, sans carré bleu

- **8 marques supportées** : Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA (retrait Birkenstock + Saucony)
- **Données CM vérifiées** depuis les guides officiels des 8 marques (Nike, Converse, HOKA, ASICS corrigés sur sources officielles)
- **Site web** (`index.html`) — V3 complète, mobile-first, Tailwind CDN
- **Extension Chrome** — widget Shadow DOM + popup, Manifest V3
- **Cohérence graphique** site ↔ extension (logos 128px, Converse SVG local)
- **og:image** 1200×630 créée et déployée (prévisualisation WhatsApp/réseaux sociaux)
- **Chrome Web Store — assets prêts** :
  - `promo-small.png` (440×280)
  - `promo-large.png` (1400×560) — Nike EU42 → ASICS EU43 avec logos 128px
  - `screenshot-store-1.png` / `screenshot-store-3.png` (1280×800)
  - `store-listing.md` — description sans noms de marques (éviter rejet)
  - `sizecheck-extension.zip` — build prêt à soumettre
- **Section "Comment ça marche"** mise à jour (suppression référence obsolète à l'écart en mm)
- **Extension Chrome Web Store** — soumise, examinée et **live**
- **Description courte store** — sans noms de marques (version live : "Trouvez votre pointure dans n'importe quelle marque de chaussures.")
- **RGPD** — tarteaucitron.js v1.16.0, Google Analytics `G-X3S5MS25P0`

---

## 🔄 En cours / À faire

- [ ] **Re-soumettre l'extension v1.1.0** au Chrome Web Store (nouvelles grilles + demi-pointures)

---

## 📋 Prochaines étapes (backlog — issu de l'audit UX/UI du 4 juil. 2026)

### Reste au backlog
- [ ] **v1.2 extension** : logos embarqués localement, évaluer Amazon/Decathlon, tailles US/UK, widget draggable
- [ ] Soumettre les nouvelles pages `/comparaisons/` à Google Search Console (sitemap déjà à jour)
- [ ] Google AdSense (une fois approuvé)
- [ ] og:image à mettre à jour si les marques supportées changent
- [ ] Duplication des tables index.html ↔ sizes.js : conservée par choix (single-file), verrouillée par `tools/check_sync.py`
