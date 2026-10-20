import { useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { DMG_KEYS, KINDS, STAT_KEYS, itemHash, loadItems, type Item, type ItemKind, type Piece } from './data/items';
import { EXT, ItemBody, useItemText } from './ItemView';

const PAGE = 60;
const SORTS = ['name', 'weight'] as const;
/** Kinds whose rows are worth filtering by class (spells, jewels). Armor already uses the class as its type. */
const BY_CLASS: ItemKind[] = ['spell'];

interface State { kind: ItemKind; type: string; cls: string; q: string; sort: typeof SORTS[number]; shown: number }

const wnum = (v: Item['weight']) => (typeof v === 'number' ? v : Number.parseFloat(String(v)) || 0);
const strip = (l: string) => l.replace(/^\s*- /, '').trim();
const pieceTexts = (p: Piece) => [p.name, p.desc, p.effect, p.obtain];
/** Searchable text: the English wiki text plus its French translation, so both languages find the same items. */
const haystack = (it: Item, fr: Record<string, string>) => {
  const raw = [it.name, it.type, it.cls, it.skill, it.desc, it.fx, it.debuff, it.obtain, ...(it.pieces ?? []).flatMap(pieceTexts)].filter(Boolean).join('\n');
  const tr = raw.split('\n').map(l => fr[strip(l)]).filter(Boolean).join('\n');
  return (raw + '\n' + tr).toLowerCase();
};

export default function Items({ active = true }: { active?: boolean }) {
  const x = useItemText();
  const { t, french, fr, tr, typeLabel, dmgL, statL, pairs } = x;
  const [all, setAll] = useState<Item[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [S, setS] = useState<State>({ kind: 'weapon', type: 'all', cls: 'all', q: '', sort: 'name', shown: PAGE });
  const set = (p: Partial<State>) => setS(s => ({ ...s, shown: PAGE, ...p }));
  useEffect(() => { if (active) document.title = t('items.docTitle'); }, [t, active]);
  useEffect(() => { loadItems().then(setAll, () => setFailed(true)); }, []);

  const index = useMemo(() => all?.map(it => [it, haystack(it, french ? fr : {})] as const) ?? [], [all, fr, french]);
  const counts = useMemo(() => {
    const c: Partial<Record<ItemKind, number>> = {};
    all?.forEach(it => { c[it.kind] = (c[it.kind] ?? 0) + 1; });
    return c;
  }, [all]);
  const ofKind = useMemo(() => (all ?? []).filter(it => it.kind === S.kind), [all, S.kind]);
  const types = useMemo(() => [...new Set(ofKind.map(it => it.type).filter(Boolean))], [ofKind]);
  const classes = useMemo(() => BY_CLASS.includes(S.kind) ? [...new Set(ofKind.map(it => it.cls).filter(Boolean) as string[])] : [], [ofKind, S.kind]);

  const q = S.q.trim().toLowerCase();
  const list = useMemo(() => {
    const out = index.filter(([it, h]) => it.kind === S.kind && (S.type === 'all' || it.type === S.type) && (S.cls === 'all' || it.cls === S.cls) && (!q || h.includes(q))).map(([it]) => it);
    if (S.sort === 'weight') out.sort((a, b) => wnum(a.weight) - wnum(b.weight) || a.name.localeCompare(b.name));
    else out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [index, S.kind, S.type, S.cls, S.sort, q]);

  /** One-line digest shown next to the name when the row is collapsed. */
  const digest = (it: Item): string => {
    switch (it.kind) {
      case 'weapon': return [pairs(it.dmg, DMG_KEYS, dmgL), pairs(it.scale, STAT_KEYS, statL)].filter(Boolean).join(' · ');
      case 'shield': return [pairs(it.guard, ['phy'], k => t('items.guardShort', { k: dmgL(k) })), pairs(it.scale, STAT_KEYS, statL)].filter(Boolean).join(' · ');
      case 'tool': return pairs(it.scale, STAT_KEYS, statL);
      case 'armor': return [it.tier && typeLabel(it.tier), t('items.nPieces', { count: it.pieces?.length ?? 0 })].filter(Boolean).join(' · ');
      case 'spell': return [it.cls, it.fp != null ? t('items.fpShort', { n: it.fp }) : '', pairs(it.req, STAT_KEYS, statL)].filter(Boolean).join(' · ');
      case 'spirit': return [it.debuff, it.cost].filter(Boolean).map(s => tr(s!)).join(' · ');
      case 'consumable': return pairs(it.dmg, DMG_KEYS, dmgL);
      default: return '';
    }
  };
  /** Short effect line shown under the name for kinds whose effect fits on a line. */
  const oneLine = (it: Item) => it.kind === 'talisman' || it.kind === 'jewel' || it.kind === 'ash' || it.kind === 'consumable' && !it.dmg
    ? (it.fx ?? (it.kind === 'ash' ? it.obtain : '') ?? '').split('\n').find(l => l.trim())?.replace(/^\s*- /, '') : undefined;

  const body = (it: Item) => (
    <div className="idb-b">
      <ItemBody it={it} x={x} />
      <p className="src"><a className="wk" href={itemHash(it.kind, it.name)}>{t('items.openPage')}</a>{it.incomplete && <> · <span className="warn">⚠ {t('items.incomplete')}</span></>}</p>
    </div>
  );
  const row = (it: Item) => {
    const d = digest(it), one = oneLine(it);
    const label = it.kind === 'jewel' ? it.cls : typeLabel(it.type);
    return (
      <li key={it.kind + it.name} className="idb-it">
        <details>
          <summary>
            <span className="top"><b className="nm">{it.name}</b>{label && <span className="ty">{label}</span>}{d && <span className="sum mono">{d}</span>}</span>
            {one && <span className="one">{tr(one)}</span>}
          </summary>
          {body(it)}
        </details>
      </li>
    );
  };

  return (
    <div className="items"><div className="wrap">
      <a className="back" href="#">{t('items.back')}</a>
      <header className="mast">
        <span className="eyebrow">{t('home.eyebrow')}</span>
        <h1>{t('items.title')}</h1>
        <p>{t('items.intro')}</p>
      </header>

      {failed ? <p className="empty">{t('items.failed')}</p> : !all ? <p className="empty">{t('items.loading')}</p> : <>
        <div className="bar-sticky"><div className="tools">
          <div className="seg" role="group" aria-label={t('items.kinds')}>
            {KINDS.map(k => <button key={k} aria-pressed={S.kind === k} onClick={() => set({ kind: k, type: 'all', cls: 'all' })}>{t('items.kind.' + k)}<span className="cnt">{counts[k] ?? 0}</span></button>)}
          </div>
          <input type="search" placeholder={t('items.search')} aria-label={t('items.search')} value={S.q} onChange={e => set({ q: e.target.value })} />
          {types.length > 1 && (
            <select aria-label={t('items.typeFilter')} value={S.type} onChange={e => set({ type: e.target.value })}>
              <option value="all">{t('items.allTypes')}</option>
              {types.map(ty => <option key={ty} value={ty}>{typeLabel(ty)}</option>)}
            </select>
          )}
          {classes.length > 1 && (
            <select aria-label={t('items.classFilter')} value={S.cls} onChange={e => set({ cls: e.target.value })}>
              <option value="all">{t('items.allClasses')}</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select aria-label={t('items.sortBy')} value={S.sort} onChange={e => set({ sort: e.target.value as State['sort'] })}>
            {SORTS.map(s => <option key={s} value={s}>{t('items.sort.' + s)}</option>)}
          </select>
        </div></div>

        <p className="count mono">{t('items.count', { count: list.length })}</p>
        {list.length ? <ul className="idb">{list.slice(0, S.shown).map(row)}</ul> : <p className="empty">{t('items.none')}</p>}
        {list.length > S.shown && <button className="more" onClick={() => setS(s => ({ ...s, shown: s.shown + PAGE }))}>{t('items.more', { n: Math.min(PAGE, list.length - S.shown) })}</button>}
      </>}

      <footer><Trans i18nKey="items.footer" components={{ wiki: <a href="https://wiki.convergencemod.com/" {...EXT} /> }} /></footer>
    </div></div>
  );
}
