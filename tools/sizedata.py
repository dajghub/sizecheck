"""Lecture des tables de pointures SizeCheck.

Source unique de vérité : extension/sizes.js.
index.html duplique ces tables (contrainte single-file) — check_sync.py
vérifie qu'elles restent identiques.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BRAND_NAMES = {
    'nike': 'Nike', 'adidas': 'Adidas', 'newbalance': 'New Balance',
    'converse': 'Converse', 'salomon': 'Salomon', 'vans': 'Vans',
    'asics': 'ASICS', 'hoka': 'HOKA',
}


def _parse_pairs(s):
    return [(label, float(cm)) for label, cm in re.findall(r"\['([^']+)',\s*([\d.]+)\]", s)]


def load_tables(path):
    """Extrait {brand_key: {'homme': [(label, cm)...], 'femme': [...]}} d'un fichier JS/HTML."""
    src = Path(path).read_text()
    shared = {
        m.group(1): _parse_pairs(m.group(2))
        for m in re.finditer(r'const (\w*(?:ADIDAS|CONVERSE|VANS|SALOMON)_UNISEXE) = \[([\s\S]*?)\];', src)
    }
    brands = {}
    for m in re.finditer(r"(\w+): \{\s*name: '([^']+)'[\s\S]*?sizes: \{([\s\S]*?)\}\s*\}?\s*\},?\n", src):
        key, _name, body = m.groups()
        ref = re.search(r'homme: (\w+_UNISEXE), femme: (\w+_UNISEXE)', body)
        if ref:
            brands[key] = {'homme': shared[ref.group(1)], 'femme': shared[ref.group(2)]}
        else:
            hm = re.search(r'homme: \[([\s\S]*?)\]\s*,\s*femme: \[([\s\S]*?)\]\s*$', body)
            brands[key] = {'homme': _parse_pairs(hm.group(1)), 'femme': _parse_pairs(hm.group(2))}
    return brands


def load_reference():
    """Tables de référence (extension/sizes.js)."""
    return load_tables(ROOT / 'extension' / 'sizes.js')
