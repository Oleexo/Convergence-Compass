// Builds src/data/items.json from the wikitext cached by wiki-fetch.mjs.
// Usage: node scripts/wiki-build.mjs [cacheDir]   (default .wiki-cache)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArmor, parseGear, parseSpell, parseSpirit, parseTalisman } from './wiki-parse.mjs';

const cache = process.argv[2] ?? '.wiki-cache';
const manifest = JSON.parse(readFileSync(join(cache, 'manifest.json'), 'utf8'));
const raw = JSON.parse(readFileSync(join(cache, 'pages.json'), 'utf8'));

// manifest category → parser. Entries are [section | spell kind, title, spell class].
const PARSE = {
  weapons: (t, w, s) => parseGear(t, w, s, 'weapon'),
  shields: (t, w, s) => parseGear(t, w, s, 'shield'),
  tools: (t, w, s) => parseGear(t, w, s, 'tool'),
  armor: (t, w, s) => parseArmor(t, w, s),
  talismans: (t, w, s) => parseTalisman(t, w, s),
  ashes: (t, w) => parseGear(t, w, '', 'ash'),
  tears: (t, w, s) => parseGear(t, w, s, 'consumable'),
  pots: (t, w, s) => parseGear(t, w, s, 'consumable'),
  spirits: (t, w) => parseSpirit(t, w),
  spells: (t, w, kind, cls) => parseSpell(t, w, kind, cls),
};

const items = [];
const skipped = [];
for (const [cat, list] of Object.entries(manifest)) {
  for (const [section, title, extra] of list) {
    const w = raw[title];
    if (w == null) { skipped.push(title); continue; }
    const it = PARSE[cat](title, w, section, extra);
    // Pages that are not items (spirit index links) and stubs (history only) carry nothing worth showing.
    if (!it || (!it.fx && !it.desc && !it.obtain && !it.pieces?.length)) { skipped.push(title); continue; }
    // {{Convergence}} ("Convergence Exclusive Content"): the item only exists in the mod, so base game wikis have no page for it.
    if (/\{\{\s*Convergence\s*[|}]/.test(w)) it.mod = true;
    const map = [...new Set([...w.matchAll(/https:\/\/map\.quack\.boo\/[^\s\]|<)"']+/g)].map(m => m[0]))];
    if (map.length) it.map = map;
    items.push(it);
  }
}

writeFileSync(new URL('../src/data/items.json', import.meta.url), JSON.stringify({ items }) + '\n');

// Name → [kind, name][] lookup used by the class pages to link to item pages without loading items.json.
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '');
const index = {};
for (const it of items) (index[norm(it.name)] ??= []).push([it.kind, it.name]);
writeFileSync(new URL('../src/data/items-index.json', import.meta.url), JSON.stringify(index) + '\n');

// Quality report: what the parser could not fill in.
const by = {};
for (const it of items) {
  const s = (by[it.kind] ??= { n: 0, noFx: 0, noDesc: 0, noObtain: 0, incomplete: 0, noPieces: 0 });
  s.n++;
  if (it.kind !== 'armor' && !it.fx) s.noFx++;
  if (!it.desc) s.noDesc++;
  if (!it.obtain) s.noObtain++;
  if (it.incomplete) s.incomplete++;
  if (it.kind === 'armor' && !it.pieces.length) s.noPieces++;
}
console.table(by);
console.log('items:', items.length, '| skipped:', skipped.length, '\n' + skipped.join('; '));
