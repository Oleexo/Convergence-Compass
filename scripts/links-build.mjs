// Builds src/data/links.json: the places, characters and other proper names found in the site's texts that have a page on
// the mod wiki (`wiki`) or, failing that, on Fextralife (`fextra`). The pages use it to turn those names into links inside the text.
// Run `node scripts/links-build.mjs` after changing the data or the item database. Items and classes are left out: they have their own pages here.
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { runnerImport } from 'vite';

const run = promisify(execFile);
const API = 'https://wiki.convergencemod.com/api.php';
const FEXTRA = 'https://eldenring.wiki.fextralife.com/';
// Both wikis answer 403 to clients without a browser-like User-Agent, and the mod wiki to Node's HTTP client (see wiki-fetch.mjs).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const file = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const json = p => JSON.parse(file(p));

/* ----- Candidate names: runs of capitalised words, optionally joined by "of", "the"… ----- */
const items = json('src/data/items.json').items;
const texts = [
  ...items.flatMap(i => [i.desc, i.fx, i.obtain, ...(i.pieces ?? []).flatMap(p => [p.desc, p.effect, p.obtain])]),
  ...['src/data/det.ts', 'src/data/prec.ts', 'src/data/build.ts', 'src/data/classes.ts', 'src/data/zones.ts', 'src/Remnants.tsx', 'src/locales/fr.json', 'src/locales/en.json'].map(file),
  ...Object.values(json('src/locales/en-data.json')),
].filter(Boolean).join('\n').replace(/’/g, "'");
const W = "[A-Z][A-Za-z0-9'.-]*";
const RUN = new RegExp(W + "(?:(?: (?:of|the|and|to|in|on|at)){0,2} " + W + ")*", 'g');

/** Single words the extraction skips (it keeps multi-word runs only): regions, legacy dungeons and recurring characters. */
const EXTRA = [
  'Limgrave', 'Liurnia', 'Caelid', 'Dragonbarrow', 'Leyndell', 'Stormveil', 'Nokron', 'Nokstella', 'Siofra', 'Ainsel', 'Elphael', 'Mohgwyn', 'Belurat', 'Enir-Ilim', 'Rauh',
  'Enia', 'Rogier', 'Ranni', 'Renna', 'Blaidd', 'Iji', 'Seluvis', 'Sellen', 'Thops', 'Gowry', 'Millicent', 'Hyetta', 'Boc', 'Patches', 'Kalé', 'Varré', 'Nepheli', 'Rya', 'Tanith',
  'Bernahl', 'Gideon', 'Hewg', 'Roderika', 'Corhyn', 'Goldmask', 'Fia', 'Yura', 'Diallos', 'Latenna', 'Jerren', 'Alexander', 'Gurranq', 'Melina', 'Irina', 'Edgar', 'Kenneth',
  'Godrick', 'Rennala', 'Radahn', 'Rykard', 'Malenia', 'Morgott', 'Mohg', 'Maliketh', 'Placidusax', 'Godfrey', 'Radagon', 'Loretta', 'Astel', 'Fortissax', 'Godskin',
  'Messmer', 'Rellana', 'Bayle', 'Gaius', 'Midra', 'Romina', 'Metyr', 'Ansbach', 'Freyja', 'Thiollier', 'Moore', 'Leda', 'Hornsah', 'Dane', 'Ymir', 'Igon', 'Hoslow', 'Dryleaf',
];
/** Pages that exist but are not what the text means, or that are the site itself. */
const SKIP = new Set(['The Convergence', 'Convergence Compass', 'Convergence', 'Elden Ring', 'Rune Level', 'Site of Grace', 'Sites of Grace', 'Spirit Ash', 'Ash of War', 'Ashes of War',
  'Spirit Ashes', 'Spirit Summons', 'Casting Tool', 'Upgrade Materials', 'Smithing Stones', 'Magic Damage', 'Fire Damage', 'Lightning Damage', 'Through and Through']);
/** A run starting with one of these is a sentence opening ("From the Cathedral…"), not a name. */
const OPENERS = /^(?:From|If|Killing|Defeat|Defeating|After|Before|Near|North|South|East|West|Inside|Found|Dropped|Sold|Le|La|Les|Au|Sur|Dans|Après|Près|Butin|Vendu|Donné|Coffre)\b/;

const known = new Set([...items.map(i => i.name), ...(await runnerImport(new URL('../src/data/classes.ts', import.meta.url).pathname)).module.default.C.map(c => c.name)]);
const cands = new Set(EXTRA);
for (const m of texts.matchAll(RUN)) {
  const s = m[0].replace(/[.',]+$/, '');
  if (s.includes(' ') && !s.includes('. ') && s.split(' ').length <= 7 && !OPENERS.test(s)) cands.add(s);
}
for (const s of [...cands]) if (known.has(s) || SKIP.has(s)) cands.delete(s);
const list = [...cands].sort();
console.log(`${list.length} candidates`);

/* ----- Mod wiki first (batched API query), then Fextralife (404 on a missing page) ----- */
async function api(titles) {
  const url = API + '?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', redirects: '1', titles: titles.join('|') });
  for (let i = 0; ; i++) {
    try { return JSON.parse((await run('curl', ['-sS', '--fail', '-A', UA, url], { maxBuffer: 16 << 20 })).stdout); }
    catch (e) { if (i === 3) throw e; await new Promise(r => setTimeout(r, 1000 * (i + 1))); }
  }
}
const wiki = new Set();
for (let i = 0; i < list.length; i += 40) {
  const batch = list.slice(i, i + 40), j = (await api(batch)).query;
  const back = new Map(batch.map(t => [t, t]));
  for (const n of j.normalized ?? []) back.set(n.to, back.get(n.from));
  for (const r of j.redirects ?? []) back.set(r.to, back.get(r.from));
  for (const p of j.pages) if (!p.missing && !p.invalid && back.has(p.title)) wiki.add(back.get(p.title));
  process.stderr.write(`\rmod wiki ${Math.min(i + 40, list.length)}/${list.length}`);
}
process.stderr.write('\n');

const rest = list.filter(s => !wiki.has(s)), fextra = new Set();
let done = 0;
async function worker() {
  while (rest.length) {
    const s = rest.shift();
    const url = FEXTRA + encodeURIComponent(s).replace(/%20/g, '+');
    const code = (await run('curl', ['-sL', '-o', '/dev/null', '-w', '%{http_code}', '-A', UA, url]).catch(() => ({ stdout: '' }))).stdout;
    if (code === '200') fextra.add(s);
    process.stderr.write(`\rfextralife ${++done}`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
process.stderr.write('\n');

const out = { wiki: [...wiki].sort(), fextra: [...fextra].sort() };
writeFileSync(new URL('../src/data/links.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(`mod wiki: ${out.wiki.length}, fextralife: ${out.fextra.length}`);
