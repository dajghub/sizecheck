# STATUS — SizeCheck

_Dernière mise à jour : 30 juin 2026 (fin de session)_

---

## ✅ Fait

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

Rien — projet complet et déployé.

---

## 📋 Prochaines étapes (backlog)

- [ ] Unifier les données CM entre `index.html` et `extension/sizes.js` (source dupliquée)
- [ ] Support SPA dans l'extension (MutationObserver sur changements d'URL)
- [ ] Widget draggable (repositionnable par l'utilisateur)
- [ ] Google AdSense (une fois approuvé)
- [ ] og:image à mettre à jour si les marques supportées changent
