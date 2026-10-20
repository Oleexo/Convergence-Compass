# Convergence Compass

**Convergence Compass** : guide interactif (en français) des 27 classes du mod Elden Ring **The Convergence** : comparatif des statistiques et des styles de jeu, fiche détaillée par classe (armures, armes, catalyseurs, runes de sorts), localisation des objets, filtres par zone et par type d'obtention, cases à cocher avec progression.

Projet de fan, non officiel. Site statique : HTML, CSS et JavaScript, sans build ni dépendance (seules les polices viennent de Google Fonts).

## Structure

| Fichier | Rôle |
| --- | --- |
| `index.html` | Comparatif des classes (cartes, tableau, feuille de comparaison) |
| `classe.html` | Fiche d'une classe, routée par le hash (`classe.html#glint`) |
| `classes.js` | Données des 27 classes (`window.CV`) |
| `det.js` | Équipement et localisations par classe (`window.DET`) |
| `zones.js` | Classement des lieux par région (`window.ZONES`) |
| `prec.js` | Précisions par objet issues du wiki du mod (`window.PREC`), pour l'instant Glint Sorcerer uniquement |
| `fiche.js` | Entrées d'une fiche, types d'obtention, progression (`window.FICHE`) |

La progression (cases cochées) est enregistrée dans le `localStorage` du navigateur, sous la clé `cv-done-v1`.

## Développement local

```sh
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Déploiement

Le workflow `.github/workflows/pages.yml` publie le site sur GitHub Pages à chaque push sur `main`. Dans le dépôt : **Settings → Pages → Source : GitHub Actions** (à activer une fois).

## Sources et limites

- Fiches de classes et pages de runes : [convergencemod.com](https://www.convergencemod.com/classes/).
- Précisions d'emplacement : [wiki du mod](https://wiki.convergencemod.com/). Les textes sont traduits, les noms d'objets et de lieux restent en anglais.
- Les zones et les types d'obtention sont déduits des textes d'emplacement et peuvent contenir des erreurs. Quand deux sources se contredisent, la fiche le signale par ⚠.
- Aucune source consultée ne donne la grâce la plus proche de chaque objet.
