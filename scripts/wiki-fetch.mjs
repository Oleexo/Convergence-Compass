// Downloads the wikitext of every item page listed on the Convergence wiki index pages (weapons, shields, casting tools,
// armor, talismans, ashes of war, spirit ashes, spells, pots and physick tears) into a local cache directory.
// Run `node scripts/wiki-fetch.mjs [cacheDir]`, then `node scripts/wiki-build.mjs [cacheDir]` to generate src/data/items.json.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://wiki.convergencemod.com/api.php';
// The wiki answers 403 to clients without a browser-like User-Agent.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const cache = process.argv[2] ?? '.wiki-cache';
mkdirSync(cache, { recursive: true });

async function api(params, tries = 4) {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  let err;
  for (let i = 0; i < tries; i++) {
    try {
      // curl rather than fetch(): the wiki answers 403 to Node's HTTP client but not to curl.
      return JSON.parse(execFileSync('curl', ['-sS', '--fail', '-A', UA, url], { encoding: 'utf8', maxBuffer: 64 << 20 }));
    } catch (e) { err = e; }
    await new Promise(res => setTimeout(res, 1000 * (i + 1)));
  }
  throw new Error(`API failed: ${url}\n${err?.message}`);
}

async function pages(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const j = await api({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', redirects: '1', titles: titles.slice(i, i + 40).join('|') });
    const redirect = {};
    for (const r of j.query.redirects ?? []) redirect[r.to] = r.from;
    for (const p of j.query.pages) {
      const from = redirect[p.title] ?? p.title;
      out[from] = p.missing ? null : p.revisions[0].slots.main.content;
    }
    process.stderr.write(`\r${Math.min(i + 40, titles.length)}/${titles.length}`);
  }
  process.stderr.write('\n');
  return out;
}

const headingText = s => s.replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, '').replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1').trim();
const HEADING = /^(=+)\s*(.+?)\s*\1\s*$/;

/** [section heading, item title] for every item an index page lists (gallery cells, templates, bullet lists). */
function listed(wikitext) {
  const res = [];
  let sec = '';
  for (const line of wikitext.split('\n')) {
    const h = line.match(HEADING);
    if (h) { sec = headingText(h[2]); continue; }
    for (const m of line.matchAll(/\{\{(?:ToolBox|ArmorInfo|ArmorSet)\s*\|\s*name\s*=\s*([^|}]+)/g)) res.push([sec, m[1].trim()]);
    for (const m of line.matchAll(/<small>\s*(?:'''\s*)?\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) res.push([sec, m[1].trim()]);
    const b = line.match(/^\*\s*\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
    if (b) res.push([sec, b[1].trim()]);
  }
  return res;
}

/** Every [[link]] of a prose page, with its section (Throwing Pots, Spirit Summons); files and History skipped. */
function links(wikitext) {
  const res = [];
  let sec = '';
  for (const line of wikitext.split('\n')) {
    const h = line.match(HEADING);
    if (h) { sec = headingText(h[2]); continue; }
    if (sec === 'History') break;
    for (const m of line.replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, '').matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) res.push([sec, m[1].trim()]);
  }
  return res;
}

/** Spells index: "== Sorceries ==" / "== Incantations ==" then one "=== Class ===" per gallery → [kind, title, class]. */
function spells(wikitext) {
  const res = [];
  let kind = '', cls = '';
  for (const line of wikitext.split('\n')) {
    const h = line.match(HEADING);
    if (h) {
      const t = headingText(h[2]);
      if (h[1].length === 2) { kind = /sorcer/i.test(t) ? 'Sorcery' : /incant/i.test(t) ? 'Incantation' : ''; cls = ''; }
      else if (h[1].length === 3) cls = t;
      continue;
    }
    if (!kind) continue;
    // Early classes use a gallery of <small> links, the others a <li> list.
    for (const m of line.matchAll(/(?:<small>\s*(?:'''\s*)?|<li>\s*)\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) res.push([kind, m[1].trim(), cls]);
  }
  return res;
}

const INDEX = {
  weapons: ['Weapons', listed], shields: ['Shields', listed], tools: ['Casting Tools', listed], armor: ['Armor', listed], talismans: ['Talisman', listed],
  ashes: ['Ash of War', listed], tears: ['Physick Remnants', listed], pots: ['Throwing Pots', links], spirits: ['Spirit Summons', links], spells: ['Spells', spells],
};
const idx = await pages(Object.values(INDEX).map(([t]) => t));
const manifest = {};
for (const [cat, [title, fn]] of Object.entries(INDEX)) {
  const seen = new Set();
  manifest[cat] = fn(idx[title]).filter(e => !seen.has(e[1]) && seen.add(e[1]));
}
const titles = [...new Set(Object.values(manifest).flatMap(l => l.map(e => e[1])))];
const raw = await pages(titles);
writeFileSync(join(cache, 'manifest.json'), JSON.stringify(manifest, null, 1));
writeFileSync(join(cache, 'pages.json'), JSON.stringify(raw));
const missing = titles.filter(t => raw[t] == null);
console.log(Object.entries(manifest).map(([c, l]) => `${c}: ${l.length}`).join(', '), `| pages: ${titles.length}, missing: ${missing.length}`);
if (missing.length) console.log('missing:', missing.join('; '));
