# CLAUDE.md — SizeCheck

## Vue d'ensemble
SizeCheck est un outil gratuit de conversion de pointures de chaussures entre marques, basé sur la **méthode des centimètres** (EU → CM → EU). Il permet de trouver l'équivalent de sa pointure dans une autre marque en passant par la longueur de pied en cm.

**8 marques supportées :** Nike, Adidas, New Balance, Converse, Vans, Salomon, ASICS, HOKA.

**URL de production :** https://www.sizecheck.fr

---

## Stack technique

### Site web (`index.html`)
- Single-file HTML — Tailwind CSS via CDN + JavaScript Vanilla
- Aucun framework, aucun bundler, aucun backend
- Mobile-first (`max-w-md mx-auto px-4`)
- tarteaucitron.js v1.16.0 pour le consentement cookies (RGPD)
- Google Analytics via gtag `G-X3S5MS25P0` (activé après consentement)

### Extension Chrome (`extension/`)
- Manifest V3
- `sizes.js` — données de conversion partagées (source unique de vérité)
- `content.js` — widget injecté via Shadow DOM sur les pages produit
- `popup.html` / `popup.js` — interface manuelle accessible depuis la barre Chrome
- Détection automatique de la marque sur 21 domaines (sites officiels + JD Sports, Zalando, Foot Locker, Courir)

---

## Hébergement & domaine
- **Hébergement :** GitHub Pages (dépôt `jadesaradesst/sizecheck`)
- **Domaine :** Infomaniak (registrar + DNS)
- **CNAME :** `www.sizecheck.fr`
- **Déploiement :** push sur `main` → GitHub Pages auto-deploy

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `index.html` | App web complète (V3) |
| `politique-de-confidentialite.html` | Page légale RGPD |
| `sitemap.xml` | Sitemap soumis à Google Search Console |
| `CNAME` | Domaine custom GitHub Pages |
| `assets/converse.svg` | Logo Converse (SVG local, source Wikipedia) |
| `assets/og-image.png` | Image Open Graph 1200×630 (prévisualisation WhatsApp/réseaux) |
| `STATUS.md` | Suivi d'avancement par session |
| `extension/sizes.js` | **Source unique des données de conversion** |
| `extension/manifest.json` | Config extension Chrome |
| `extension/content.js` | Widget injecté sur pages produit |
| `extension/popup.html/js` | Popup fallback |
| `extension/converse.svg` | Copie locale du logo Converse pour l'extension (web_accessible_resources) |

---

## Conventions à respecter
- **Source unique pour les données :** toute modification des tables de correspondance CM doit se faire dans `extension/sizes.js` ET dans `index.html` (les deux sont encore séparés — une future tâche serait de les unifier)
- Tout ajout de marque ou de système de tailles passe par ces deux fichiers
- Mobile-first en priorité absolue
- Single-file HTML pour le site web (pas de séparation CSS/JS)
- Commits git clairs après chaque session de travail

---

## Ce qu'il ne faut jamais toucher sans instruction explicite
- Les tables de correspondance CM dans `extension/sizes.js` et `index.html`
- La config tarteaucitron et l'ID Google Analytics (`G-X3S5MS25P0`)
- Le fichier `CNAME`

---

## Suivi de session

En fin de session, ou quand demandé explicitement, mettre à jour `STATUS.md` avec un résumé de l'avancement (fait / en cours / bloquant / prochaines étapes).

---

## Améliorations en cours / à venir
- [ ] Unifier les données de conversion (éviter la duplication entre `index.html` et `extension/sizes.js`)
- [ ] Support SPA dans l'extension (MutationObserver sur changements d'URL)
- [ ] Widget draggable (repositionnable par l'utilisateur)
- [ ] Publication de l'extension sur le Chrome Web Store
- [ ] Intégration Google AdSense (une fois approuvé)
