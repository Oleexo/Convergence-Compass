# Convergence Compass

[![Déploiement](https://github.com/Oleexo/Convergence-Compass/actions/workflows/pages.yml/badge.svg)](https://github.com/Oleexo/Convergence-Compass/actions/workflows/pages.yml)
[![Licence MIT](https://img.shields.io/github/license/Oleexo/Convergence-Compass)](LICENSE)

**Guide interactif (français et anglais) des 27 classes du mod Elden Ring *The Convergence*.**

👉 **<https://oleexo.github.io/Convergence-Compass/>**

- **Comparatif** : cartes ou tableau coloré des stats de départ, filtres par famille, zone de départ et type de dégâts, regroupement par style de jeu, feuille de comparaison jusqu'à quatre classes.
- **Fiche par classe** : armures, armes, catalyseurs, runes de sorts et objet de classe, avec leurs emplacements dans le monde.
- **Où chercher** : filtres par zone et par type d'obtention, recherche, vue par région ou en itinéraire (regroupé par lieu).
- **Progression** : cases à cocher enregistrées dans le navigateur, avec un compteur par zone.

Projet de fan, non officiel. Thème clair et sombre, utilisable sur mobile.

## Stack

React 19, TypeScript, Vite, pnpm. Le site est statique : aucun serveur, aucune API, seules les polices viennent de Google Fonts.

## Développement local

Prérequis : Node.js LTS et pnpm (`npm install -g pnpm`). La version de pnpm attendue est fixée par `packageManager` dans `package.json`.

```sh
pnpm install
pnpm dev
```

| Commande | Effet |
| --- | --- |
| `pnpm dev` | Serveur de développement avec rechargement à chaud |
| `pnpm build` | Vérifie les types (`tsc`) puis produit le site dans `dist/` |
| `pnpm preview` | Sert le build de `dist/` en local |
| `pnpm check:i18n` | Vérifie que chaque texte français des données a sa traduction anglaise, et que `fr.json` et `en.json` ont les mêmes clés |

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/App.tsx` | Routage par le hash : `#` → comparatif, `#glint` → fiche de la classe |
| `src/Home.tsx` | Comparatif des classes (cartes, tableau, feuille de comparaison) |
| `src/Classe.tsx` | Fiche d'une classe |
| `src/styles.css` | Thème clair/sombre et styles, portés par `.home` et `.fiche` |
| `src/data/types.ts` | Types des données |
| `src/data/classes.ts` | Les 27 classes : stats, niveau, matériel, lieu de départ |
| `src/data/det.ts` | Équipement et emplacements par classe |
| `src/data/zones.ts` | Classement des lieux par région |
| `src/data/prec.ts` | Précisions par objet issues du wiki du mod (pour l'instant Glint Sorcerer uniquement) |
| `src/data/fiche.ts` | Entrées d'une fiche, types d'obtention, progression |
| `src/i18n.ts` | Configuration de react-i18next, choix et mémorisation de la langue (`cv-lang`), helper `td` pour les données |
| `src/locales/fr.json`, `en.json` | Textes de l'interface |
| `src/locales/en-data.json` | Traduction anglaise des textes des données, indexée par le texte français |
| `public/classe.html` | Redirige les anciens liens `classe.html#glint` vers `./#glint` |

La progression est enregistrée dans le `localStorage` du navigateur, sous la clé `cv-done-v1`. Chaque case est identifiée par la classe, le nom de l'objet et le texte de son emplacement (voir `entries` dans `src/data/fiche.ts`) : corriger ces textes dans `src/data/det.ts` décoche la case chez les visiteurs qui l'avaient cochée.

### Traductions

Les données (`src/data/*.ts`) restent écrites en français : le classement par zone et par type d'obtention s'appuie sur ce texte. À l'affichage, `td()` remplace chaque texte par sa version de `src/locales/en-data.json` quand la langue est l'anglais. Après avoir ajouté ou modifié un texte français dans les données, ajoute sa traduction dans `en-data.json` et lance `pnpm check:i18n`.

### Ajouter des précisions pour une classe

Les précisions (lien vers le wiki, carte, conditions d'accès, lieu de regroupement) se trouvent dans `src/data/prec.ts`, indexées par l'identifiant de la classe puis par le nom exact de l'objet, ou par `runeN` pour le palier N des runes de sorts (0 = Faint). Le commentaire en tête du fichier décrit chaque champ, et le type `Prec` dans `src/data/types.ts` les vérifie.

## Déploiement

Chaque push sur `main` lance le workflow `.github/workflows/pages.yml`, qui builde le site avec pnpm et le publie sur GitHub Pages. Le site utilise des chemins relatifs et un routage par hash : il fonctionne sous `/Convergence-Compass/` sans configuration de serveur.

Dependabot (`.github/dependabot.yml`) propose chaque semaine les mises à jour des dépendances npm et chaque mois celles des GitHub Actions, regroupées en PR.

## Sources et limites

- Fiches de classes et pages de runes : [convergencemod.com](https://www.convergencemod.com/classes/), consultées le 19 octobre 2026.
- Précisions d'emplacement : [wiki du mod](https://wiki.convergencemod.com/), consulté le 20 octobre 2026. Les textes sont traduits, les noms d'objets et de lieux restent en anglais.
- Les zones et les types d'obtention sont déduits des textes d'emplacement et peuvent contenir des erreurs. Quand deux sources se contredisent, la fiche le signale par ⚠.
- Aucune source consultée ne donne la grâce la plus proche de chaque objet.
- Le mod évolue : un chiffre ou un emplacement peut ne plus correspondre à la dernière version.

## Licence

Le code source est sous licence [MIT](LICENSE).

Elle ne couvre pas le contenu tiers : *Elden Ring* et ses noms (objets, lieux, personnages) appartiennent à FromSoftware et Bandai Namco ; le mod *The Convergence*, ses fiches de classes et son wiki appartiennent à leurs auteurs. Les données de `src/data/` en sont tirées et restent soumises à leurs droits. Ce projet n'est affilié à aucun d'eux.
