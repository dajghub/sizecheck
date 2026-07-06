#!/usr/bin/env python3
"""Génère les pages de correspondance par paire de marques + le sitemap.

    python3 tools/generate_pages.py

Source des données : extension/sizes.js (via sizedata.py).
Sortie : comparaisons/{a}-vs-{b}.html (28 paires), comparaisons/index.html,
sitemap.xml. Relancer après toute modification des tables.
"""
import html
import itertools
import json
from datetime import date

from sizedata import ROOT, BRAND_NAMES, load_reference

SITE = 'https://www.sizecheck.fr'
OUT = ROOT / 'comparaisons'
TIE = 0.15  # seuil de quasi-égalité (identique au site/extension)
EXT_STORE_URL = ('https://chromewebstore.google.com/detail/sizecheck-%E2%80%94-convertisseur/'
                  'bbbpmlgmpekohknipogacpohfldeieha?hl=fr&utm_source=sizecheck_comparaisons')
LASTMOD = date.today().isoformat()

# Réponses « taille grand ou petit ? » — uniquement les affirmations vérifiées
# (cohérentes avec les tips et la FAQ de l'accueil). Pas de claim pour NB/ASICS/HOKA.
FIT_CLAIMS = {
    'nike': 'Nike taille standard : ses pointures suivent les tailles EU conventionnelles. Un EU 44 Nike correspond à 27,1 cm de longueur de pied selon le guide officiel.',
    'adidas': 'Adidas taille petit, principalement à cause d\'un chaussant plus étroit que la norme. Si vous avez le pied large, prenez la pointure au-dessus de celle recommandée.',
    'converse': 'Converse taille grand : la semelle plate des Chuck Taylor libère de l\'espace en longueur. Converse recommande officiellement de prendre une demi-pointure en dessous de sa pointure habituelle.',
    'vans': 'Vans taille légèrement grand : les modèles classiques (Old Skool, Authentic) ont un chaussant long et généreux, surtout en largeur.',
    'salomon': 'Salomon taille petit : le fit trail est enveloppant, conçu pour maintenir le pied en descente. En cas de doute entre deux pointures, prenez la supérieure.',
}

TIPS = {
    'adidas': 'Adidas taille petit — chaussant plus étroit que la norme. Si tu as le pied large, prends la pointure supérieure à celle recommandée.',
    'converse': 'Converse taille grand — la semelle plate des Chuck Taylor libère de l\'espace en longueur. Données basées sur les Chuck Taylor All Star.',
    'salomon': 'Salomon taille petit — fit trail enveloppant conçu pour maintenir le pied en descente. En cas de doute entre deux pointures, prends la supérieure.',
    'vans': 'Vans taille grand — les modèles classiques (Old Skool, Authentic) ont un last long et généreux, surtout en largeur.',
    'hoka': 'Sur les modèles femme récents (Clifton 10, Arahi 8, Challenger 8), HOKA conseille une demi-pointure en dessous de ta pointure HOKA habituelle.',
}

TABLES = load_reference()


def fmt_cm(cm):
    return f'{cm:g}'.replace('.', ',')


def best_match(target_key, cm, genre):
    """(label, cm, diff) le plus proche + éventuel second sur quasi-égalité."""
    ladder = TABLES[target_key][genre]
    cands = sorted(((l, c, abs(c - cm)) for l, c in ladder), key=lambda x: (x[2], x[1]))
    best = cands[0]
    second = cands[1] if len(cands) > 1 and cands[1][2] - best[2] <= TIE else None
    return best, second


def is_unisex(key):
    return TABLES[key]['homme'] == TABLES[key]['femme']


def conversion_table(a, b, genre):
    """Table HTML : chaque pointure de a → équivalent b (genre donné)."""
    rows = []
    for label, cm in TABLES[a][genre]:
        best, second = best_match(b, cm, genre)
        alt = f' <span class="alt">ou {html.escape(second[0])}</span>' if second else ''
        rows.append(
            f'<tr><td class="eu">EU {html.escape(label)}</td>'
            f'<td class="cm">{fmt_cm(cm)} cm</td>'
            f'<td class="target">EU {html.escape(best[0])}{alt}</td></tr>'
        )
    return (
        f'<table><caption>{BRAND_NAMES[a]} → {BRAND_NAMES[b]}</caption>'
        f'<thead><tr><th>{BRAND_NAMES[a]}</th><th>Pied</th><th>{BRAND_NAMES[b]}</th></tr></thead>'
        f'<tbody>{"".join(rows)}</tbody></table>'
    )


def extension_cta_html(a, b):
    # Titre fixe (indépendant des marques) pour garantir une seule ligne
    # sur mobile quelle que soit la paire ; les marques restent dans le corps.
    na, nb = BRAND_NAMES[a], BRAND_NAMES[b]
    return f'''
    <div class="ext-cta">
      <div class="ext-cta-main">
        <span class="ext-cta-icon">🧩</span>
        <div class="ext-cta-text">
          <strong>Ta pointure directement sur le site</strong>
          <p>Sur {na} comme sur {nb}, l'extension Chrome SizeCheck affiche ta taille sur la page produit — sans revenir ici.</p>
        </div>
      </div>
      <a class="ext-cta-btn" href="{EXT_STORE_URL}" target="_blank" rel="noopener"
         data-umami-event="cta-extension" data-umami-event-paire="{a}-{b}">Installer →</a>
    </div>'''


def fit_comparison(a, b):
    """« Est-ce que A et B taillent pareil ? » — calculé depuis les tables :
    écart moyen de longueur de pied (cm) à pointure EU affichée égale,
    sur les labels communs aux deux marques (grilles homme)."""
    na, nb = BRAND_NAMES[a], BRAND_NAMES[b]
    ta, tb = dict(TABLES[a]['homme']), dict(TABLES[b]['homme'])
    shared = sorted(set(ta) & set(tb), key=lambda l: ta[l])
    if not shared:
        return None
    avg = sum(tb[l] - ta[l] for l in shared) / len(shared)
    d = abs(avg)
    d_txt = f'{d:.1f}'.replace('.', ',')

    q = f'Est-ce que {na} et {nb} taillent pareil ?'
    if d <= 0.15:
        ecart = 'de moins de 0,1 cm' if d < 0.05 else f'de seulement {d_txt} cm'
        r = (f'Oui, quasiment : à pointure EU égale, l\'écart moyen entre {na} et {nb} '
             f'est {ecart} de longueur de pied. Vous pouvez généralement garder '
             f'la même pointure — le tableau ci-dessus donne la correspondance exacte pour chaque taille.')
        return (q, r)

    big, small = (nb, na) if avg > 0 else (na, nb)
    if d <= 0.45:
        steps = 'environ une demi-pointure'
    elif d <= 0.85:
        steps = 'environ une pointure'
    else:
        steps = 'plus d\'une pointure'
    ex_best, _ = best_match(b, ta['42'], 'homme')
    r = (f'Non. À pointure EU affichée égale, {big} chausse en moyenne {d_txt} cm plus long '
         f'que {small} : {big} taille plus grand. Comptez {steps} d\'écart — par exemple, '
         f'un EU 42 {na} homme correspond à un EU {ex_best[0]} {nb}. '
         f'Le tableau ci-dessus donne la correspondance exacte pour chaque pointure.')
    return (q, r)


def faq_items(a, b):
    """Questions/réponses calculées depuis les tables."""
    na, nb = BRAND_NAMES[a], BRAND_NAMES[b]
    items = []

    # « Taillent pareil ? » en premier : c'est la formulation la plus recherchée
    # (People Also Ask) pour les requêtes de comparaison de marques.
    pair_fit = fit_comparison(a, b)
    if pair_fit:
        items.append(pair_fit)

    # « Taille grand ou petit ? » par marque, si affirmation vérifiée disponible
    for key in (a, b):
        if key in FIT_CLAIMS:
            items.append((
                f'Est-ce que {BRAND_NAMES[key]} taille grand ou petit ?',
                FIT_CLAIMS[key],
            ))

    best, second = best_match(b, dict(TABLES[a]['homme'])['42'], 'homme')
    ans = f'EU {best[0]}'
    if second:
        ans += f' (ou EU {second[0]}, les deux tailles sont quasi équivalentes)'
    items.append((
        f'Quelle pointure {nb} pour un EU 42 {na} (homme) ?',
        f'Un EU 42 {na} homme correspond à {fmt_cm(dict(TABLES[a]["homme"])["42"])} cm de longueur de pied, '
        f'soit {ans} chez {nb} selon les guides officiels des deux marques.'
    ))

    best_f, second_f = best_match(b, dict(TABLES[a]['femme'])['38'], 'femme')
    ans_f = f'EU {best_f[0]}'
    if second_f:
        ans_f += f' (ou EU {second_f[0]})'
    items.append((
        f'Quelle pointure {nb} pour un EU 38 {na} (femme) ?',
        f'Un EU 38 {na} femme correspond à {fmt_cm(dict(TABLES[a]["femme"])["38"])} cm de longueur de pied, '
        f'soit {ans_f} chez {nb}.'
    ))

    items.append((
        f'Comment convertir sa pointure entre {na} et {nb} ?',
        f'La méthode fiable est celle des centimètres : chaque pointure correspond à une longueur de pied précise '
        f'dans le guide officiel de chaque marque. On trouve la longueur en cm de sa pointure {na}, puis la pointure '
        f'{nb} la plus proche. SizeCheck automatise ce calcul, y compris pour les demi-pointures et les tiers.'
    ))
    return items


def page_html(a, b):
    na, nb = BRAND_NAMES[a], BRAND_NAMES[b]
    slug = f'{a}-vs-{b}'
    title = f'Pointures {na} vs {nb} : tableau de correspondance | SizeCheck'
    desc = (f'Convertissez votre pointure entre {na} et {nb} : tableaux officiels homme et femme '
            f'en centimètres, avec les demi-pointures réelles. Gratuit et instantané.')

    both_unisex = is_unisex(a) and is_unisex(b)

    # CTA extension placé le plus haut possible sans couper le contenu utile :
    # - paire à deux tableaux : entre le tableau homme et le tableau femme
    #   (coupure naturelle entre deux sections, ~50 % de la page) ;
    # - paire unisexe (un seul tableau) : juste après, la page étant courte.
    cta = extension_cta_html(a, b)

    sections = []
    if both_unisex:
        sections.append('<h2>Tableau de correspondance (homme &amp; femme)</h2>')
        sections.append(f'<p class="note">💡 {na} et {nb} utilisent la même grille EU → cm pour les hommes et les femmes.</p>')
        sections.append(f'<div class="tables">{conversion_table(a, b, "homme")}{conversion_table(b, a, "homme")}</div>')
        sections.append(cta)
    else:
        sections.append('<h2>Correspondance homme</h2>')
        sections.append(f'<div class="tables">{conversion_table(a, b, "homme")}{conversion_table(b, a, "homme")}</div>')
        sections.append(cta)
        sections.append('<h2>Correspondance femme</h2>')
        sections.append(f'<div class="tables">{conversion_table(a, b, "femme")}{conversion_table(b, a, "femme")}</div>')

    tips = [(BRAND_NAMES[k], TIPS[k]) for k in (a, b) if k in TIPS]
    if tips:
        sections.append('<h2>Comment taillent ces marques ?</h2>')
        for name, tip in tips:
            sections.append(f'<div class="tip"><strong>{name}</strong> — {html.escape(tip)}</div>')

    faq = faq_items(a, b)
    faq_html = ''.join(
        f'<details><summary>{html.escape(q)}</summary><p>{html.escape(r)}</p></details>'
        for q, r in faq
    )
    faq_ld = json.dumps({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {'@type': 'Question', 'name': q,
             'acceptedAnswer': {'@type': 'Answer', 'text': r}}
            for q, r in faq
        ],
    }, ensure_ascii=False)

    others = [
        f'<a href="/comparaisons/{x}-vs-{y}.html">{BRAND_NAMES[x]} ↔ {BRAND_NAMES[y]}</a>'
        for x, y in itertools.combinations(BRAND_NAMES, 2)
        if (x, y) != (a, b) and (a in (x, y) or b in (x, y))
    ]

    return f'''<!DOCTYPE html>
<!-- © 2026 Jade Saradesst — SizeCheck. Tous droits réservés / All rights reserved. Reproduction ou réutilisation interdite. https://www.sizecheck.fr -->
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{SITE}/comparaisons/{slug}.html">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" href="/assets/favicon.png" type="image/png" sizes="96x96">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{SITE}/comparaisons/{slug}.html">
  <meta property="og:image" content="{SITE}/assets/og-image.png">
  <link rel="stylesheet" href="/assets/pages.css">
  <script defer src="https://cloud.umami.is/script.js" data-website-id="c924201e-94a1-4c34-ad5a-83154e3cc4f7"></script>
  <script type="application/ld+json">{faq_ld}</script>
</head>
<body>
<div class="wrap">
  <header class="top"><a class="brand" href="/">👟 SizeCheck</a></header>
  <nav class="crumbs"><a href="/">Accueil</a> › <a href="/comparaisons/">Correspondances</a> › {na} ↔ {nb}</nav>

  <h1>Pointures {na} ↔ {nb} : tableau de correspondance</h1>
  <p class="intro">Chaque marque a sa propre grille de tailles : un EU 42 {na} ne correspond pas forcément
  à un EU 42 {nb}. Les tableaux ci-dessous croisent les longueurs de pied en centimètres publiées dans les
  guides officiels des deux marques — y compris les demi-pointures et tiers réellement vendus.</p>
  <p class="updated">Données relevées une à une sur les guides des tailles officiels des deux marques.</p>
  <p><a class="convert-link" href="/?from={a}&size=42&g=homme"
        data-umami-event="lien-convertisseur" data-umami-event-paire="{a}-{b}">Convertir une autre pointure ou marque →</a></p>

  {''.join(sections)}

  <h2>Questions fréquentes</h2>
  <div class="faq">{faq_html}</div>

  <h2>Autres correspondances</h2>
  <div class="links">{''.join(others)}</div>

  <footer>
    <p>SizeCheck — convertisseur de pointures gratuit basé sur la méthode des centimètres.
    <a href="/">Convertisseur</a> · <a href="/comparaisons/">Toutes les correspondances</a> ·
    <a href="/politique-de-confidentialite.html">Politique de confidentialité</a></p>
  </footer>
</div>
</body>
</html>
'''


def index_html(pairs):
    links = ''.join(
        f'<a href="/comparaisons/{a}-vs-{b}.html">{BRAND_NAMES[a]} ↔ {BRAND_NAMES[b]}</a>'
        for a, b in pairs
    )
    title = 'Correspondances de pointures entre marques | SizeCheck'
    desc = ('Tableaux de correspondance des pointures entre Nike, Adidas, New Balance, Converse, Vans, '
            'Salomon, ASICS et HOKA — données officielles en centimètres, homme et femme.')
    return f'''<!DOCTYPE html>
<!-- © 2026 Jade Saradesst — SizeCheck. Tous droits réservés / All rights reserved. Reproduction ou réutilisation interdite. https://www.sizecheck.fr -->
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{SITE}/comparaisons/">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" href="/assets/favicon.png" type="image/png" sizes="96x96">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{SITE}/comparaisons/">
  <meta property="og:image" content="{SITE}/assets/og-image.png">
  <link rel="stylesheet" href="/assets/pages.css">
  <script defer src="https://cloud.umami.is/script.js" data-website-id="c924201e-94a1-4c34-ad5a-83154e3cc4f7"></script>
</head>
<body>
<div class="wrap">
  <header class="top"><a class="brand" href="/">👟 SizeCheck</a></header>
  <nav class="crumbs"><a href="/">Accueil</a> › Correspondances</nav>

  <h1>Correspondances de pointures entre marques</h1>
  <p class="intro">Tous nos tableaux de conversion par paire de marques, construits à partir des longueurs
  de pied en centimètres des guides des tailles officiels de chaque marque.</p>

  <a class="cta" href="/">⚡ Convertis ta pointure en 2 clics
    <span class="go">Ouvrir le convertisseur</span></a>

  <h2>Choisis ta paire de marques</h2>
  <div class="pairs-grid">{links}</div>

  <footer>
    <p>SizeCheck — convertisseur de pointures gratuit basé sur la méthode des centimètres.
    <a href="/">Convertisseur</a> · <a href="/politique-de-confidentialite.html">Politique de confidentialité</a></p>
  </footer>
</div>
</body>
</html>
'''


def sitemap_xml(pairs):
    urls = [
        (f'{SITE}/', 'monthly', '1.0'),
        (f'{SITE}/comparaisons/', 'monthly', '0.8'),
        *((f'{SITE}/comparaisons/{a}-vs-{b}.html', 'monthly', '0.7') for a, b in pairs),
        (f'{SITE}/politique-de-confidentialite.html', 'yearly', '0.3'),
    ]
    entries = ''.join(
        f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{LASTMOD}</lastmod>\n'
        f'    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>\n'
        for loc, freq, prio in urls
    )
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{entries}</urlset>\n'


def main():
    OUT.mkdir(exist_ok=True)
    pairs = list(itertools.combinations(BRAND_NAMES, 2))
    for a, b in pairs:
        (OUT / f'{a}-vs-{b}.html').write_text(page_html(a, b))
    (OUT / 'index.html').write_text(index_html(pairs))
    (ROOT / 'sitemap.xml').write_text(sitemap_xml(pairs))
    print(f'{len(pairs)} pages + index générés dans comparaisons/ — sitemap.xml mis à jour.')


if __name__ == '__main__':
    main()
