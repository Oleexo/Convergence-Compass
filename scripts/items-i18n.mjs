// Translation workflow for the item database (English wiki text → French).
//   node scripts/items-i18n.mjs extract <dir> [--obtain]   writes <dir>/en-NNN.txt chunks ("id|English line", unique lines in order of appearance)
//   node scripts/items-i18n.mjs merge <dir> [--obtain]     reads <dir>/fr-NNN.txt ("id|Texte français") and writes src/data/items.fr.json
//   node scripts/items-i18n.mjs missing                    lists lines of items.json that items.fr.json does not translate yet
// The UI looks every line up in items.fr.json (English line → French line); bullets ("- ") are not part of the key.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = p => new URL('../' + p, import.meta.url);
const [cmd, dir] = process.argv.slice(2);
const withObtain = process.argv.includes('--obtain');
const { items } = JSON.parse(readFileSync(here('src/data/items.json'), 'utf8'));
const CHUNK = 220;

/** Text lines of an item the UI shows translated: flavour, effect lines, armor pieces, and optionally the obtain text. */
export function* linesOf(it) {
  const block = function* (s) {
    for (const l of (s ?? '').split('\n')) {
      const t = l.replace(/^\s*- /, '').trim();
      if (t) yield t;
    }
  };
  yield* block(it.desc);
  yield* block(it.fx);
  yield* block(it.debuff);
  for (const p of it.pieces ?? []) { yield* block(p.desc); yield* block(p.effect); if (withObtain) yield* block(p.obtain); }
  if (withObtain) yield* block(it.obtain);
}

const unique = () => {
  const seen = new Map();
  for (const it of items) for (const l of linesOf(it)) if (!seen.has(l)) seen.set(l, seen.size);
  return [...seen.keys()];
};

if (cmd === 'extract') {
  mkdirSync(dir, { recursive: true });
  const all = unique();
  for (let i = 0; i < all.length; i += CHUNK) {
    const n = String(i / CHUNK).padStart(3, '0');
    writeFileSync(join(dir, `en-${n}.txt`), all.slice(i, i + CHUNK).map((l, k) => `${i + k}|${l}`).join('\n') + '\n');
  }
  const chars = all.reduce((a, l) => a + l.length, 0);
  console.log(`${all.length} unique lines, ${chars} chars, ${Math.ceil(all.length / CHUNK)} chunks of ${CHUNK}`);
} else if (cmd === 'merge') {
  const all = unique();
  const fr = {};
  for (const f of readdirSync(dir).filter(f => /^fr-\d+\.txt$/.test(f)).sort()) {
    for (const line of readFileSync(join(dir, f), 'utf8').split('\n')) {
      const m = line.match(/^(\d+)\|(.*)$/);
      if (m && m[2].trim()) fr[all[+m[1]]] = m[2].trim();
    }
  }
  // The wiki sometimes leaves "[cite: 1]" markers in its text; the parser strips them, so the keys must match.
  const clean = s => s.replace(/\s*\[cite:[^\]]*\]/g, '');
  const out = {};
  for (const l of all) if (fr[l]) out[clean(l)] = fr[l];
  writeFileSync(here('src/data/items.fr.json'), JSON.stringify(out) + '\n');
  console.log(`translated ${Object.keys(out).length}/${all.length} lines`);
} else if (cmd === 'missing') {
  const fr = JSON.parse(readFileSync(here('src/data/items.fr.json'), 'utf8'));
  const miss = unique().filter(l => !fr[l]);
  console.log(miss.length + ' lines without translation');
  miss.slice(0, 30).forEach(l => console.log(' -', l));
} else {
  console.log('usage: items-i18n.mjs extract|merge <dir> [--obtain] | missing');
}
