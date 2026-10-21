import type { ReactNode, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TERMS } from './data/glossary';

/** Keeps the bubble inside the screen: a term near the right edge would otherwise push it past the viewport. */
function fit(e: SyntheticEvent<HTMLElement>) {
  const b = e.currentTarget.querySelector<HTMLElement>('[role="tooltip"]');
  if (!b) return;
  b.style.left = '';
  const over = b.getBoundingClientRect().right - (document.documentElement.clientWidth - 16);
  if (over > 0) b.style.left = -over + 'px';
}

/** A term with its explanation, shown on hover, tap or keyboard focus (a native `title` never shows on touch or focus). */
export function Tip({ children, tip }: { children: ReactNode; tip: string }) {
  return <span className="tip" tabIndex={0} onPointerEnter={fit} onFocus={fit}>{children}<span role="tooltip">{tip}</span></span>;
}

/** Lets each top-level alternative of a pattern start with a capital ("Hémorragie" at the start of a sentence). Acronyms keep their case. */
function anyCase(s: string) {
  if (/^[A-Z]{2}$/.test(s)) return s;
  let depth = 0, out = '', start = true;
  for (const c of s) {
    if (start) { out += '[' + c.toUpperCase() + c.toLowerCase() + ']'; start = false; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    out += c;
    if (c === '|' && depth === 0) start = true;
  }
  return out;
}
const RX: Record<string, RegExp> = {};
/** One regex per language: each term is a capturing group, so the group index gives the term. Letters on either side mean it is part of a longer word. */
function regex(fr: boolean) {
  const k = fr ? 'fr' : 'en';
  return RX[k] ??= new RegExp('(?<![\\p{L}\\p{N}])(?:' + TERMS.map(x => '(' + anyCase(x[fr ? 0 : 1]) + ')').join('|') + ')(?![\\p{L}\\p{N}])', 'gu');
}

/** Wraps the first occurrence of each glossary term in `text`; `seen` is shared by the lines of one text so a term is explained once. */
export function useGloss() {
  const { t, i18n } = useTranslation();
  const fr = i18n.language.startsWith('fr');
  return (text: string, seen = new Set<string>()): ReactNode => {
    const out: ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(regex(fr))) {
      const key = TERMS[m.slice(1).findIndex(g => g !== undefined)][2];
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(text.slice(last, m.index), <Tip key={m.index} tip={t('gloss.' + key)}>{m[0]}</Tip>);
      last = m.index! + m[0].length;
    }
    return out.length ? [...out, text.slice(last)] : text;
  };
}
