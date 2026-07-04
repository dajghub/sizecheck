# STATUS — SizeCheck

_Dernière mise à jour : 4 juillet 2026_

---

## ✅ Fait

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

### P2 — Valeur ajoutée
- [ ] Mode « longueur de pied en cm » (site + extension)

### P3 — Croissance & dette technique
- [ ] Pages SEO statiques par paire de marques (générées depuis les tables)
- [ ] Tailwind compilé en statique (remplacer le CDN)
- [ ] Logos hébergés localement (site + extension)
- [ ] Unifier les données entre `index.html` et `extension/sizes.js` (source encore dupliquée)
- [ ] Évaluer Amazon/Decathlon pour l'extension ; tailles US/UK
- [ ] Widget draggable (repositionnable par l'utilisateur)
- [ ] Google AdSense (une fois approuvé)
- [ ] og:image à mettre à jour si les marques supportées changent
