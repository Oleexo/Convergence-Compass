// Pure parsing helpers for Convergence wiki pages (MediaWiki wikitext → plain item records).
// No I/O here so the same code can be run from Node (wiki-build.mjs) or pasted in a browser console.

/** Index just past the `}}` closing the `{{` at `start`, honouring nesting; -1 when unbalanced. */
function closeOf(s, start) {
  let depth = 0;
  for (let i = start; i < s.length - 1; i++) {
    if (s[i] === '{' && s[i + 1] === '{') { depth++; i++; }
    else if (s[i] === '}' && s[i + 1] === '}') { depth--; i++; if (!depth) return i + 1; }
  }
  return -1;
}

/** Top-level `|key=value` pairs of a template body, splitting only outside nested {{ }}, [[ ]]. */
function params(body) {
  const out = {};
  let depth = 0, cur = '';
  const parts = [];
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === '{{' || two === '[[') { depth++; cur += two; i++; continue; }
    if (two === '}}' || two === ']]') { depth--; cur += two; i++; continue; }
    if (body[i] === '|' && !depth) { parts.push(cur); cur = ''; continue; }
    cur += body[i];
  }
  parts.push(cur);
  for (const p of parts.slice(1)) {
    const eq = p.indexOf('=');
    if (eq > 0) out[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
  }
  return out;
}

/** First template named one of `names`: { name, args } or null. */
export function findTemplate(wikitext, names) {
  const re = new RegExp('\\{\\{\\s*(' + names.join('|') + ')\\b', 'g');
  const m = re.exec(wikitext);
  if (!m) return null;
  const end = closeOf(wikitext, m.index);
  if (end < 0) return null;
  return { name: m[1], args: params(wikitext.slice(m.index + 2, end - 2)), start: m.index, end };
}

/** Wiki ({| |}) and HTML (<table>) tables → one "a | b | c" line per row. */
function flattenTables(s) {
  return s
    .replace(/\{\|[\s\S]*?\n\|\}/g, tbl => tbl.split('\n')
      .filter(l => /^[!|]/.test(l) && !/^\|[-}+]/.test(l))
      .map(l => l.slice(1).split(/!!|\|\|/).map(c => c.trim()).join(' | ')).join('\n') + '\n')
    .replace(/<table\b[\s\S]*?<\/table>/gi, tbl => tbl
      .replace(/\s*\n\s*/g, ' ').replace(/<\/tr>/gi, '\n').replace(/<t[dh]\b[^>]*>/gi, ' | ').replace(/<\/?[a-z][^>]*>/gi, '')
      .split('\n').map(l => l.replace(/\s+/g, ' ').replace(/^\s*\|\s*/, '').trim()).filter(Boolean).join('\n') + '\n');
}

/** Wikitext → readable plain text (links, bold/italic, files, html and templates removed). */
export function plain(s) {
  if (!s) return '';
  let t = flattenTables(s);
  for (let n = 0; n < 6 && /\{\{/.test(t); n++) {
    // drop template calls innermost-first; their content is infobox/navbox noise
    t = t.replace(/\{\{(?:(?!\{\{)[\s\S])*?\}\}/g, '');
  }
  return t
    .replace(/\{\{[^\n]*/g, '') // unclosed template left by a wiki typo
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^a?<ref[^>]*>[\s\S]*?<\/ref>\s*$/gm, '') // stray editor note in one spell page
    .replace(/\s*\[cite:[^\]]*\]/g, '') // "[cite: 1]" markers pasted into some armor pages
    .replace(/\[\[(?:File|Image|Category):[^\]]*\]\]/gi, '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[(?:https?:\/\/)[^\s\]]+\s+([^\]]+)\]/g, '$1')
    .replace(/\[(?:https?:\/\/)[^\s\]]+\]/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(?:div|small|span|center|blockquote|u|sup|sub|p)\b[^>]*>/gi, '')
    .replace(/'''''|'''|''/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Bullet lines kept as "- text" (nested bullets indented); other lines unchanged. */
function bullets(s) {
  return s.split('\n').map(l => {
    const m = l.match(/^(\*+)\s*(.*)$/);
    return m ? '  '.repeat(m[1].length - 1) + '- ' + m[2] : l;
  }).join('\n');
}

/** `== Heading ==` sections: { '': intro, 'Heading': text }. */
export function sections(wikitext) {
  const out = { '': '' };
  let cur = '';
  for (const line of wikitext.split('\n')) {
    const h = line.match(/^(=+)\s*([^=]+?)\s*\1\s*$/);
    if (h) { cur = h[2].trim(); out[cur] = (out[cur] ?? '') ; continue; }
    out[cur] += line + '\n';
  }
  return out;
}

const num = v => (v == null || v === '' ? undefined : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v);
const pick = (args, map) => {
  const o = {};
  for (const [to, from] of Object.entries(map)) {
    const keys = Array.isArray(from) ? from : [from];
    for (const k of keys) if (args[k] != null && args[k] !== '') { o[to] = num(args[k]); break; }
  }
  return o;
};

const STATS = ['str', 'dex', 'int', 'fth', 'arc'];
const stat = (args, prefix) => {
  const o = {};
  for (const s of STATS) {
    const keys = prefix === 'req' ? ['req_' + s, s === 'fth' ? 'req_fai' : null] : ['scale_' + s, 'scale_' + s + '_0', s === 'fth' ? 'scale_fai' : null, s === 'fth' ? 'scale_fai_0' : null];
    const k = keys.find(k => k && args[k] != null && args[k] !== '');
    if (k) o[s] = num(args[k]);
  }
  return o;
};

/** Parse the infobox (Item / Shield / ToolInfo / DualScalingCatalyst) of a weapon-like page. */
function gear(args) {
  const r = { weight: num(args.weight), upgrade: args.upgrade_material || undefined, skill: args.skill || undefined, crit: args.crit || undefined };
  const dmg = pick(args, { phy: ['physical', 'phys'], mag: ['magic'], fire: 'fire', ltn: ['lightning'], hol: 'holy' });
  if (Object.keys(dmg).length) r.dmg = dmg;
  const guard = pick(args, { phy: 'guard_phy', mag: 'guard_mag', fire: 'guard_fire', ltn: 'guard_ltng', hol: 'guard_holy', boost: 'guard_boost' });
  if (Object.keys(guard).length) r.guard = guard;
  const mul = pick(args, { phy: 'phys_mul', mag: 'mag_mul', fire: 'fire_mul', ltn: 'lit_mul', hol: 'hol_mul' });
  if (Object.keys(mul).length) r.mul = mul;
  const status = pick(args, { bleed: 'bleed', frost: 'frost', rot: 'rot', poison: 'poison', sleep: 'sleep', madness: 'madness', death: 'death' });
  const flags = ['soul_burn', 'immolation', 'rend', 'concussion', 'quicksilver'].filter(k => args[k]);
  if (Object.keys(status).length) r.status = status;
  if (flags.length) r.flags = flags;
  const req = stat(args, 'req'), sc = stat(args, 'scale');
  if (Object.keys(req).length) r.req = req;
  if (Object.keys(sc).length) r.scale = sc;
  if (args.range) r.range = num(args.range);
  for (const k of Object.keys(r)) if (r[k] === undefined) delete r[k];
  return r;
}

/** Description (first blockquote, flavour text) of a page. */
function flavour(w) {
  const m = w.match(/<blockquote>?([\s\S]*?)<\/blockquote>/); // a few pages forget the ">"
  return m ? plain(m[1]).replace(/\n+/g, ' ').trim() : '';
}

/** Prose that explains the item's effects: page text outside infobox/blockquote/Obtaining/History/Moveset. */
function effectText(w, skip = []) {
  const secs = sections(w.replace(/<blockquote>?[\s\S]*?<\/blockquote>/, ''));
  const drop = new Set(['Obtaining', 'How to Obtain', 'History', 'Moveset', 'Related Tools', ...skip]);
  const parts = [];
  for (const [name, body] of Object.entries(secs)) {
    if (drop.has(name)) continue;
    const t = plain(bullets(body.replace(/^\s*\{\{[^\n]*\}\}\s*$/gm, ''))).trim();
    if (!t) continue;
    parts.push(name && name !== 'Description' ? name + '\n' + t : t);
  }
  return parts.join('\n\n').trim();
}

function obtain(w) {
  const secs = sections(w);
  const t = secs['Obtaining'] ?? secs['How to Obtain'] ?? '';
  return plain(t).replace(/\s*\bMap Link\b/g, '').replace(/\n+/g, ' ').trim();
}

const WEAPON_TPL = ['Item', 'Shield', 'ToolInfo', 'DualScalingCatalyst'];

/** Record for a weapon, shield or casting tool page. */
export function parseGear(title, w, section, kind) {
  const tpl = findTemplate(w, WEAPON_TPL);
  const rec = { name: title, kind, type: section };
  if (tpl) Object.assign(rec, gear(tpl.args));
  const f = flavour(w);
  if (f) rec.desc = f;
  const fx = effectText(w, ['Information']);
  const info = plain(bullets((sections(w)['Information'] ?? '').replace(/\{\{ScalingTable[\s\S]*?\}\}/g, '')));
  const text = [fx, info].filter(Boolean).join('\n\n').trim();
  if (text) rec.fx = text;
  const o = obtain(w);
  if (o) rec.obtain = o;
  if (/\{\{\s*Incomplete/i.test(w)) rec.incomplete = true;
  return rec;
}

/** Record for a talisman (TalismanItem) or class jewel (JewelPage). */
export function parseTalisman(title, w, section) {
  const jewel = findTemplate(w, ['JewelPage', 'JewelItem']);
  const tal = findTemplate(w, ['TalismanItem']);
  const rec = { name: title, kind: jewel ? 'jewel' : 'talisman', type: section };
  const a = (jewel ?? tal)?.args ?? {};
  if (a.weight) rec.weight = num(a.weight);
  if (a.class) rec.cls = plain(a.class);
  const f = flavour(w);
  if (f) rec.desc = f;
  if (jewel) {
    rec.fx = plain(bullets(a.information ?? '')).trim();
    const o = plain(a.intro ?? '').replace(/\n+/g, ' ');
    if (o) rec.obtain = o;
  } else {
    const secs = sections(w.replace(/<blockquote>?[\s\S]*?<\/blockquote>/, ''));
    const lines = plain(bullets(secs[''] ?? '')).split('\n').map(l => l.trim()).filter(Boolean);
    const from = lines.filter(l => /^Obtained (by|from)/i.test(l));
    const fx = lines.filter(l => !/^Obtained (by|from)/i.test(l));
    if (fx.length) rec.fx = fx.join('\n');
    if (from.length) rec.obtain = from.join(' ');
    // Pages that put the effect under their own headings
    for (const [name, body] of Object.entries(secs)) {
      if (!name || ['History', 'Obtaining', 'How to Obtain'].includes(name)) continue;
      const t = plain(bullets(body)).trim();
      if (t) rec.fx = (rec.fx ? rec.fx + '\n\n' : '') + name + '\n' + t;
    }
  }
  if (/\{\{\s*Incomplete/i.test(w)) rec.incomplete = true;
  return rec;
}

const PIECE_RE = /^piece(\d+)_(\w+)$/;

/** A set's pieces: [{ name, desc, effect, obtain? }] from the wikitable or ArmorSetTable formats. */
function armorPieces(w) {
  const pieces = [];
  const tbl = findTemplate(w, ['ArmorSetTable']);
  if (tbl) {
    const byN = {};
    for (const [k, v] of Object.entries(tbl.args)) {
      const m = k.match(PIECE_RE);
      if (m) (byN[m[1]] ??= {})[m[2]] = v;
    }
    for (const n of Object.keys(byN).sort((a, b) => a - b)) {
      const p = byN[n];
      if (!p.name) continue;
      pieces.push({ name: plain(p.name), desc: plain(p.desc ?? '').replace(/\n+/g, ' '), effect: plain(p.effect ?? '') });
    }
    return { pieces, location: plain(bullets(tbl.args.location ?? '')) };
  }
  const t = w.match(/\{\|[\s\S]*?\n\|\}/);
  if (!t) return { pieces, location: '' };
  const header = (t[0].match(/^!.*$/m) ?? [''])[0];
  const withObtain = /How to Obtain/.test(header);
  const attrs = /^\s*(?:\w+="[^"]*"\s*)+\|(?!\|)/;
  for (const row of t[0].split(/\n\|-[^\n]*\n/).slice(1)) {
    // A line starting with "|" opens one cell (or several, separated by "||"); other lines continue the previous cell.
    const cs = [];
    for (const line of row.split('\n')) {
      if (/^\|[}-]/.test(line)) continue;
      if (line.startsWith('|')) cs.push(...line.slice(1).split('||'));
      else if (cs.length) cs[cs.length - 1] += '\n' + line;
    }
    const cells = cs.map(c => c.replace(attrs, '').trim());
    if (cells.length < 2) continue;
    if (withObtain) {
      // [image + piece name][description & effects][how to obtain]
      const bold = cells[0].match(/'''([^']+)'''/);
      const name = plain(bold ? bold[1] : cells[0].replace(/\[\[File:[^\]]*\]\]/gi, '')).replace(/\s+/g, ' ').trim();
      pieces.push({ name, desc: '', effect: plain(cells[1]), obtain: plain(cells[2] ?? '') });
    } else if (cells.length >= 4) {
      // [image][piece][description][passive effect]
      pieces.push({ name: plain(cells[1]), desc: plain(cells[2]), effect: plain(cells[3]) });
    }
  }
  return { pieces, location: '' };
}

/** Record for an armor set page. */
export function parseArmor(title, w, section) {
  const info = findTemplate(w, ['ArmorSetInfo'])?.args ?? {};
  const rec = { name: title, kind: 'armor', type: section };
  if (info.class) rec.cls = plain(info.class);
  if (info.tier) rec.tier = plain(info.tier);
  const secs = sections(w);
  const lead = (w.match(/^The '''[\s\S]*?(?=\n\n|\n==)/m) ?? [''])[0];
  if (lead) rec.desc = plain(lead).replace(/\n+/g, ' ');
  const { pieces, location } = armorPieces(w);
  rec.pieces = pieces;
  const how = plain(secs['How to Obtain'] ?? '').replace(/\n+/g, ' ');
  const obtain = location || how;
  if (obtain) rec.obtain = obtain;
  if (/\{\{\s*Incomplete/i.test(w)) rec.incomplete = true;
  return rec;
}

/** Record for a spell page (SpellPage or SpellItem layout); `type` is Sorcery/Incantation, `cls` the class heading of the index. */
export function parseSpell(title, w, type, cls) {
  const tpl = findTemplate(w, ['SpellPage', 'SpellItem']);
  const a = tpl?.args ?? {};
  const rec = { name: title, kind: 'spell', type };
  const c = cls && cls !== 'Classless' ? cls : a.class ? plain(a.class) : '';
  if (c) rec.cls = c;
  if (a.fp) rec.fp = num(a.fp);
  if (a.slots) rec.slots = num(a.slots);
  const req = stat(a, 'req');
  if (Object.keys(req).length) rec.req = req;
  const f = flavour(w);
  if (f) rec.desc = f;
  const info = a.information ?? sections(w)['Information'] ?? '';
  const text = [tpl?.name === 'SpellPage' ? plain(a.intro ?? '') : effectText(w, ['Information']), plain(bullets(info))].filter(Boolean).join('\n\n').trim();
  if (text) rec.fx = text;
  if (/\{\{\s*Incomplete/i.test(w)) rec.incomplete = true;
  return rec;
}

/** Record for a spirit ash page (SpiritAshInfo); null for other pages linked from the index. */
export function parseSpirit(title, w) {
  const a = findTemplate(w, ['SpiritAshInfo'])?.args;
  if (!a) return null;
  const rec = { name: title, kind: 'spirit', type: a.tier ? plain(a.tier) : '' };
  if (a.debuff) rec.debuff = plain(a.debuff);
  if (a.upgrade_material) rec.upgrade = plain(a.upgrade_material);
  if (a.base_cost) rec.cost = plain(a.base_cost);
  const sum = w.match(/^''([^'][^\n]*?)''\s*$/m);
  if (sum) rec.desc = plain(sum[1]);
  const fx = effectText(w, [title]);
  if (fx) rec.fx = fx;
  const o = obtain(w);
  if (o) rec.obtain = o;
  if (/\{\{\s*Incomplete/i.test(w)) rec.incomplete = true;
  return rec;
}
