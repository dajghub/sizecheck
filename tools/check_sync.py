#!/usr/bin/env python3
"""Vérifie que les tables de pointures restent saines et synchronisées.

À lancer avant chaque commit qui touche les données :
    python3 tools/check_sync.py

Contrôles :
1. index.html et extension/sizes.js contiennent exactement les mêmes tables.
2. Les 8 marques attendues sont présentes des deux côtés.
3. Chaque table est croissante (jamais décroissante) en cm.
4. Les conseils de chaussant (« tip ») sont identiques sur le site et dans l'extension.
"""
import re
import sys

from sizedata import ROOT, BRAND_NAMES, load_tables, load_reference


def load_tips(path):
    """{brand_key: texte du conseil ou 'null'} tel qu'écrit dans le fichier."""
    src = path.read_text()
    return {m.group(1): m.group(2) for m in re.finditer(
        r"\n\s+(\w+): \{\s*name: '[^']+'[\s\S]*?\n\s+tip: (null|'(?:[^'\\]|\\.)*'),", src)}


def main():
    ref = load_reference()
    site = load_tables(ROOT / 'index.html')
    errors = []

    for key in BRAND_NAMES:
        if key not in ref:
            errors.append(f'{key} absent de extension/sizes.js')
        if key not in site:
            errors.append(f'{key} absent de index.html')

    for key in sorted(set(ref) | set(site)):
        for genre in ('homme', 'femme'):
            r = ref.get(key, {}).get(genre)
            s = site.get(key, {}).get(genre)
            if r != s:
                errors.append(f'{key} {genre} : tables différentes entre site et extension')
            for table, origin in ((r, 'sizes.js'), (s, 'index.html')):
                if not table:
                    continue
                for (l1, c1), (l2, c2) in zip(table, table[1:]):
                    if c2 < c1:
                        errors.append(f'{key} {genre} ({origin}) : {l1}={c1} > {l2}={c2} (décroissant)')

    tips_site = load_tips(ROOT / 'index.html')
    tips_ext = load_tips(ROOT / 'extension' / 'sizes.js')
    for key in BRAND_NAMES:
        if tips_site.get(key) != tips_ext.get(key):
            errors.append(f'{key} : conseil de chaussant différent entre site et extension')

    if errors:
        print('ÉCHEC — données incohérentes :')
        for e in errors:
            print(f'  - {e}')
        sys.exit(1)
    print(f'OK — {len(ref)} marques, tables et conseils identiques site/extension, tables monotones.')


if __name__ == '__main__':
    main()
