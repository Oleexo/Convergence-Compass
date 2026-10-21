import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DMG_KEYS, STAT_KEYS, loadFr, slug, type ByDmg, type ByStat, type Item, type Piece } from './data/items';

export const EXT = { target: '_blank', rel: 'noopener' };
type Tr = (line: string) => string;

/** Translation helpers shared by the item list and the item pages. The French lines are fetched only when the interface is in French. */
export function useItemText() {
  const { t, i18n } = useTranslation();
  const french = i18n.language.startsWith('fr');
  const [fr, setFr] = useState<Record<string, string>>({});
  useEffect(() => { if (french) loadFr().then(setFr, () => setFr({})); }, [french]);
  const tr: Tr = french ? l => fr[l] ?? l : l => l;

  const typeLabel = (ty: string) => {
    const tier = ty.match(/^Tier (\d+)$/);
    return tier ? t('items.tierN', { n: tier[1] }) : t('items.types.' + slug(ty), { defaultValue: ty });
  };
  /** Wiki skill names stay English, but their "(38 FP)" cost follows the interface language. */
  const skillLabel = (s: string) => french ? s.replace(/\bFP\b/g, 'PC') : s;
  const dmgL = (k: string) => t('items.dmg.' + k);
  const statL = (k: string) => k.toUpperCase();
  const pairs = (o: ByDmg | ByStat | undefined, keys: readonly string[], label: (k: string) => string) =>
    keys.filter(k => o && (o as Record<string, unknown>)[k] != null).map(k => label(k) + ' ' + (o as Record<string, unknown>)[k]).join(' · ');
  return { t, french, fr, tr, typeLabel, skillLabel, dmgL, statL, pairs };
}
export type ItemText = ReturnType<typeof useItemText>;

/** Wiki text: "- " lines are bullets (indented two spaces per level), other lines are paragraphs. Each line goes through `tr`. */
export function Lines({ text, tr, className = 'fx' }: { text: string; tr: Tr; className?: string }) {
  return (
    <div className={className}>
      {text.split('\n').map((l, i) => {
        const m = l.match(/^(\s*)- (.*)$/);
        if (m) return <div key={i} className="b" style={{ paddingLeft: 14 + m[1].length * 7 }}>{tr(m[2].trim())}</div>;
        return l.trim() ? <p key={i}>{tr(l.trim())}</p> : null;
      })}
    </div>
  );
}

// Focusable so the explanation also opens on tap and keyboard, where a native `title` never shows.
const fact = (label: string, v: ReactNode, tip?: string) => v ? <><dt>{tip ? <span className="tip" tabIndex={0}>{label}<span role="tooltip">{tip}</span></span> : label}</dt><dd>{v}</dd></> : null;

function PieceView({ p, tr }: { p: Piece; tr: Tr }) {
  return (
    <li>
      <b>{p.name}</b>
      {p.desc && <Lines text={p.desc} tr={tr} className="fx fl" />}
      {p.effect && <Lines text={p.effect} tr={tr} />}
      {p.obtain && <Lines text={p.obtain} tr={tr} className="fx ob" />}
    </li>
  );
}

/** Description, stat table, effects, armor pieces and location of an item: the body of a list row and of a detail page. */
export function ItemBody({ it, x }: { it: Item; x: ItemText }) {
  const { t, tr, typeLabel, skillLabel, dmgL, statL, pairs } = x;
  const status = it.status ? Object.entries(it.status).map(([k, v]) => t('items.status.' + k) + ' ' + v).join(' · ') : '';
  const flags = it.flags?.map(f => t('items.flag.' + f)).join(' · ');
  const f = (k: string, v: ReactNode) => fact(t('items.f.' + k), v, t('items.tip.' + k, { defaultValue: '' }));
  return <>
    {it.desc && <p className="fl">{tr(it.desc)}</p>}
    <dl className="facts">
      {f('class', it.cls)}
      {f('tier', it.kind === 'armor' && it.tier ? typeLabel(it.tier) : undefined)}
      {f('fp', it.fp)}
      {f('slots', it.slots)}
      {f('weight', it.weight)}
      {f('upgrade', it.upgrade)}
      {f('skill', it.skill && skillLabel(it.skill))}
      {f('crit', it.crit)}
      {f('range', it.range)}
      {f('dmg', pairs(it.dmg, DMG_KEYS, dmgL))}
      {f('guard', pairs(it.guard, [...DMG_KEYS, 'boost'], k => k === 'boost' ? t('items.dmg.boost') : dmgL(k)))}
      {f('mul', pairs(it.mul, DMG_KEYS, dmgL))}
      {f('req', pairs(it.req, STAT_KEYS, statL))}
      {f('scale', pairs(it.scale, STAT_KEYS, statL))}
      {f('status', [status, flags].filter(Boolean).join(' · '))}
      {f('debuff', it.debuff && tr(it.debuff))}
      {f('cost', it.cost)}
    </dl>
    {it.fx && <Lines text={it.fx} tr={tr} />}
    {it.pieces && <ul className="pieces">{it.pieces.map(p => <PieceView key={p.name} p={p} tr={tr} />)}</ul>}
    {it.obtain && <p className="ob"><b>{t('items.f.obtain')}</b> {tr(it.obtain)}</p>}
  </>;
}
