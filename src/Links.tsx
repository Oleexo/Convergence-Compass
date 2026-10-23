import { Fragment, type ReactNode } from 'react';
import CV from './data/classes';
import LINKS from './data/links.json';
import { fextraUrl, findItem, itemHash, itemNames, wikiUrl } from './data/items';
import i18n from './i18n';

const EXT = { target: '_blank', rel: 'noopener' };
type Target = () => { href: string; ext: boolean; title: string };
const WORD = /[\p{L}\p{N}]+/gu, LEAD = /^[\p{L}\p{N}]+/u, ALNUM = /[\p{L}\p{N}]/u;
let BY_FIRST: Map<string, [string, Target][]> | undefined;

/** Every name worth a link, grouped by first word, longest first ("Raya Lucaria Crystal Tunnel" before "Raya Lucaria"):
 *  items and classes (their page here), places and characters (mod wiki, or Fextralife when it has no page). */
function names() {
  if (BY_FIRST) return BY_FIRST;
  const m = new Map<string, Target>();
  for (const n of LINKS.fextra) m.set(n, () => ({ href: fextraUrl(n), ext: true, title: i18n.t('cls.wikiFext') }));
  for (const n of LINKS.wiki) m.set(n, () => ({ href: wikiUrl(n), ext: true, title: i18n.t('cls.wikiMod') }));
  for (const n of itemNames()) m.set(n, () => { const h = findItem(n)!; return { href: itemHash(h.kind, h.name), ext: false, title: i18n.t('cls.itemPage') }; });
  for (const c of CV.C) m.set(c.name, () => ({ href: '#' + c.id, ext: false, title: c.name }));
  BY_FIRST = new Map();
  for (const e of m) { const w = e[0].match(LEAD)?.[0]; if (w) BY_FIRST.set(w, [...BY_FIRST.get(w) ?? [], e]); }
  for (const l of BY_FIRST.values()) l.sort((a, b) => b[0].length - a[0].length);
  return BY_FIRST;
}

/** Turns the item, class, place and character names of `text` into links, in place. `self` (the page's own subject) stays plain;
 *  `rest` renders the text between the links (the glossary tooltips, for instance). */
export function linkify(text: string, self?: string, rest: (s: string) => ReactNode = s => s): ReactNode {
  const by = names(), flat = text.replace(/’/g, "'"), out: ReactNode[] = [];
  let last = 0, skip = 0;
  for (const w of flat.matchAll(WORD)) {
    const at = w.index;
    if (at < skip) continue;
    // A name must be a whole word run: no letter right after it ("Caelid" is not linked inside "Caelidian").
    const hit = by.get(w[0])?.find(([n]) => flat.startsWith(n, at) && !ALNUM.test(flat.charAt(at + n.length)));
    if (!hit) continue;
    const end = skip = at + hit[0].length;
    // The page's own subject stays plain, and so do the shorter names inside it ("Rapier" in "Antspur Rapier").
    if (hit[0] === self) continue;
    const t = hit[1]();
    out.push(<Fragment key={last}>{rest(text.slice(last, at))}</Fragment>,
      <a key={at + 'a'} className="wk" href={t.href} title={t.title} {...(t.ext ? EXT : {})}>{text.slice(at, end)}</a>);
    last = end;
  }
  return out.length ? [...out, <Fragment key={last}>{rest(text.slice(last))}</Fragment>] : rest(text);
}
