# Convergence Compass

**Convergence Compass** : guide interactif (en français) des 27 classes du mod Elden Ring **The Convergence** : comparatif des statistiques et des styles de jeu, fiche détaillée par classe (armures, armes, catalyseurs, runes de sorts), localisation des objets, filtres par zone et par type d'obtention, cases à cocher avec progression.

Projet de fan, non officiel. Application React 19 + TypeScript, construite avec Vite et pnpm, publiée en site statique sur GitHub Pages (seules les polices viennent de Google Fonts).

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/App.tsx` | Routage par le hash : `#` → comparatif, `#glint` → fiche de la classe |
| `src/Home.tsx` | Comparatif des classes (cartes, tableau, feuille de comparaison) |
| `src/Classe.tsx` | Fiche d'une classe |
| `src/styles.css` | Thème clair/sombre et styles, portés par `.home` et `.fiche` |
| `src/data/types.ts` | Types des données |
| `src/data/classes.ts` | Données des 27 classes |
| `src/data/det.ts` | Équipement et localisations par classe |
| `src/data/zones.ts` | Classement des lieux par région |
| `src/data/prec.ts` | Précisions par objet issues du wiki du mod, pour l'instant Glint Sorcerer uniquement |
| `src/data/fiche.ts` | Entrées d'une fiche, types d'obtention, progression |
| `public/classe.html` | Redirige les anciens liens `classe.html#glint` vers `./#glint` |

La progression (cases cochées) est enregistrée dans le `localStorage` du navigateur, sous la clé `cv-done-v1`.

## Développement local

```sh
pnpm install
pnpm dev
```

`pnpm build` vérifie les types puis produit le site dans `dist/` ; `pnpm preview` le sert en local.

## Déploiement

Le workflow `.github/workflows/pages.yml` publie le site sur GitHub Pages à chaque push sur `main`. Dans le dépôt : **Settings → Pages → Source : GitHub Actions** (à activer une fois).

## Sources et limites

- Fiches de classes et pages de runes : [convergencemod.com](https://www.convergencemod.com/classes/).
- Précisions d'emplacement : [wiki du mod](https://wiki.convergencemod.com/). Les textes sont traduits, les noms d'objets et de lieux restent en anglais.
- Les zones et les types d'obtention sont déduits des textes d'emplacement et peuvent contenir des erreurs. Quand deux sources se contredisent, la fiche le signale par ⚠.
- Aucune source consultée ne donne la grâce la plus proche de chaque objet.

## Licence

Le code source est sous licence [MIT](LICENSE).

Elle ne couvre pas le contenu tiers : *Elden Ring* et ses noms (objets, lieux, personnages) appartiennent à FromSoftware et Bandai Namco ; le mod *The Convergence*, ses fiches de classes et son wiki appartiennent à leurs auteurs. Les données de `src/data/` en sont tirées et restent soumises à leurs droits. Ce projet n'est affilié à aucun d'eux.
