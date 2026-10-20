# Convergence Compass

[![Deploy](https://github.com/Oleexo/Convergence-Compass/actions/workflows/pages.yml/badge.svg)](https://github.com/Oleexo/Convergence-Compass/actions/workflows/pages.yml)
[![MIT License](https://img.shields.io/github/license/Oleexo/Convergence-Compass)](LICENSE)

**Interactive guide (French and English) to the 27 classes of the Elden Ring mod *The Convergence*.**

👉 **<https://oleexo.github.io/Convergence-Compass/>**

- **Comparison**: cards or a color-coded table of starting stats, filters by family, starting area and damage type, grouping by playstyle, and a comparison sheet for up to four classes.
- **Class page**: armor, weapons, catalysts, spell runes and class item, with their locations in the world.
- **Where to look**: filters by area and by acquisition type, search, view by region or as a route (grouped by location).
- **Progress**: checkboxes saved in the browser, with a counter per area.

Unofficial fan project. Light and dark themes, mobile friendly.

## Stack

React 19, TypeScript, Vite, pnpm. The site is static: no server, no API; only the fonts come from Google Fonts.

## Local development

Requirements: Node.js LTS and pnpm (`npm install -g pnpm`). The expected pnpm version is pinned by `packageManager` in `package.json`.

```sh
pnpm install
pnpm dev
```

| Command | Effect |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Type-checks (`tsc`), then builds the site into `dist/` |
| `pnpm preview` | Serves the `dist/` build locally |
| `pnpm check:i18n` | Checks that every French data string has an English translation, and that `fr.json` and `en.json` have the same keys |

## Structure

| File | Role |
| --- | --- |
| `src/App.tsx` | Hash routing: `#` → comparison, `#glint` → class page |
| `src/Home.tsx` | Class comparison (cards, table, comparison sheet) |
| `src/Classe.tsx` | Class page |
| `src/styles.css` | Light/dark theme and styles, scoped under `.home` and `.fiche` |
| `src/data/types.ts` | Data types |
| `src/data/classes.ts` | The 27 classes: stats, level, gear, starting location |
| `src/data/det.ts` | Equipment and locations per class |
| `src/data/zones.ts` | Mapping of locations to regions |
| `src/data/prec.ts` | Per-item details taken from the mod wiki (Glint Sorcerer only for now) |
| `src/data/fiche.ts` | Class page entries, acquisition types, progress |
| `src/i18n.ts` | react-i18next setup, language selection and persistence (`cv-lang`), `td` helper for data |
| `src/locales/fr.json`, `en.json` | UI strings |
| `src/locales/en-data.json` | English translation of data strings, keyed by the French text |
| `public/classe.html` | Redirects old `classe.html#glint` links to `./#glint` |

Progress is stored in the browser's `localStorage` under the key `cv-done-v1`. Each checkbox is identified by the class, the item name and its location text (see `entries` in `src/data/fiche.ts`): editing those texts in `src/data/det.ts` unchecks the box for visitors who had checked it.

### Translations

The data (`src/data/*.ts`) stays written in French: grouping by area and by acquisition type relies on that text. At render time, `td()` replaces each string with its version from `src/locales/en-data.json` when the language is English. After adding or changing a French string in the data, add its translation to `en-data.json` and run `pnpm check:i18n`.

### Adding details for a class

Details (wiki link, map, access conditions, grouping location) live in `src/data/prec.ts`, keyed by class identifier, then by exact item name, or by `runeN` for spell rune tier N (0 = Faint). The comment at the top of the file describes each field, and the `Prec` type in `src/data/types.ts` checks them.

## Deployment

Every push to `main` runs the `.github/workflows/pages.yml` workflow, which builds the site with pnpm and publishes it to GitHub Pages. The site uses relative paths and hash routing, so it works under `/Convergence-Compass/` without any server configuration.

Dependabot (`.github/dependabot.yml`) opens grouped PRs for npm dependency updates weekly and GitHub Actions updates monthly.

## Sources and limitations

- Class pages and rune pages: [convergencemod.com](https://www.convergencemod.com/classes/), accessed October 19, 2026.
- Location details: [mod wiki](https://wiki.convergencemod.com/), accessed October 20, 2026. Text is translated; item and place names stay in English.
- Areas and acquisition types are inferred from location text and may contain errors. When two sources disagree, the class page flags it with ⚠.
- None of the sources consulted gives the nearest Site of Grace for each item.
- The mod keeps evolving: a number or location may no longer match the latest version.

## License

The source code is licensed under the [MIT](LICENSE) license.

It does not cover third-party content: *Elden Ring* and its names (items, places, characters) belong to FromSoftware and Bandai Namco; the mod *The Convergence*, its class pages and its wiki belong to their authors. The data in `src/data/` is derived from them and remains subject to their rights. This project is not affiliated with any of them.
