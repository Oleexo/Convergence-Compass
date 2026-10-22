import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import CV from './data/classes';
import D from './data/det';
import F from './data/fiche';
import type { Cls, Det } from "./data/types";
import { Trans, useTranslation } from "react-i18next";
import i18n, { td } from "./i18n";

const { STATS, STAT_FR, FAM, FAM_VAR, REGIONS, DMGS, C, BY } = CV;

// Names and texts live in locales under home.styles.<id>.
const STYLES = [
  { id:'rempart', ids:['dreadnought','retainer','vanguard'] },
  { id:'brute', ids:['berserker','dreadnought'] },
  { id:'agile', ids:['sellsword','rogue','marksman'] },
  { id:'sorcery', ids:['glint','starcaller','underworld','frost','aberrant'] },
  { id:'hybrid', ids:['volcanist','stormcaller','nox','necromancer','godskin','frenzied'] },
  { id:'priest', ids:['fundamentalist','flame','bestial','dragoncultist'] },
  { id:'status', ids:['rot','mystic','blood','perfumer'] },
  { id:'odd', ids:['prisoner','perfumer'] }
];
const RANGE = STATS.map((k, i) => { const v = C.map(x => x.s[i]); return [Math.min(...v), Math.max(...v)]; });
const LVL = [Math.min(...C.map(x => x.lvl)), Math.max(...C.map(x => x.lvl))];
// Opening state: a ready example comparison so the sheet shows what it does.
type SortKey = "order" | "name" | "lvl" | string;
interface State { fam: string; region: string; dmg: string; style: string | null; sort: SortKey; dir: number; view: "cards" | "table"; sel: string[]; sheet: boolean }
type Set = (p: Partial<State>) => void;

const INIT: State = { fam:'all', region:'all', dmg:'all', style:null, sort:'order', dir:1, view:'cards', sel:['dreadnought', 'glint', 'rot'], sheet:false };

export const famVar = (x: Cls) => 'var(' + FAM_VAR[x.fam] + ')';
export const nSpells = (d: Det) => (d.runes || []).reduce((n, r) => n + r[0].split('; ').length, 0);
const val = (x: Cls, k: SortKey): string | number => k === 'order' ? x.order : k === 'name' ? x.name : k === 'lvl' ? x.lvl : x.s[STATS.indexOf(k)];
const count = (k: "fam" | "region" | "dmg", v: string) => C.filter(x => x[k] === v).length;

export const fam = (x: Cls) => ({ "--fam": famVar(x) }) as CSSProperties;

export const kitList = (x: Cls) => x.kit.map(td).join(' · ');

export function Bars({ x }: { x: Cls }) {
  return (
    <div className="bars">
      {STATS.map((k, i) => (
        <div className="bar" key={k} title={td(STAT_FR[k]) + ' ' + x.s[i]}>
          <span className="k">{k}</span><span className="track"><i style={{ width: Math.min(100, x.s[i] / 18 * 100) + '%' }} /></span><span className="v">{x.s[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Chips({ items, k, S, set }: { items: [string, string][]; k: "fam" | "region" | "dmg"; S: State; set: Set }) {
  return ([["all", i18n.t("f.all")]] as [string, string][]).concat(items).map(it => (
    <button key={it[0]} className="chip" aria-pressed={S[k] === it[0]} onClick={() => set({ [k]: it[0] })}>
      {td(it[1])}{it[0] !== 'all' && <span className="n mono">{count(k, it[0])}</span>}
    </button>
  ));
}

function DmgFacts({ x }: { x: Cls }) {
  return <>
    {x.dmg ? <><dt>{i18n.t('f.dmg')}</dt><dd>{td(x.dmg)}{x.theme && ' · ' + td(x.theme)}</dd></> : x.theme && <><dt>{i18n.t('f.theme')}</dt><dd>{td(x.theme)}</dd></>}
    {x.armor && <><dt>{i18n.t('f.armor')}</dt><dd>{td(x.armor)}</dd></>}
  </>;
}

function Card({ x, on, pick }: { x: Cls; on: boolean; pick: (id: string) => void }) {
  const p = F.progress(x.id), t = i18n.t;
  return (
    <article className={'card' + (on ? ' on' : '')} style={fam(x)}>
      <div className="card-top"><h3>{x.name}</h3><span className="tag">{td(FAM[x.fam])}</span></div>
      <p className="blurb">{td(x.blurb)}</p>
      <dl className="facts">
        <dt>{t('f.keyStats')}</dt><dd className="mono">{td(x.prim)}</dd><dt>{t('f.level')}</dt><dd className="mono">{x.lvl}</dd><dt>{t('f.start')}</dt><dd>{x.region}</dd>
        <DmgFacts x={x} />
      </dl>
      <Bars x={x} />
      <p className="kit">
        <span><b>{t('f.kit')}</b> {kitList(x)}</span><span><b>{t('f.set')}</b> {D[x.id].set}</span>
        {x.spells && <span><b>{t('f.spells')}</b> {x.spells.join(' · ')}</span>}<span><b>{t('f.place')}</b> {td(x.place)}</span>
      </p>
      {p.done > 0 && <p className="prog"><span>{t('home.progress')} <b className="mono">{p.done}/{p.total}</b></span><span className="pb"><i style={{ width: p.done / p.total * 100 + '%' }} /></span></p>}
      <div className="acts">
        <a className="det-btn" href={'#' + x.id}>{t('f.details')}</a>
        <button className="cmp-btn" aria-pressed={on} onClick={() => pick(x.id)}>{on ? t('home.inCompare') : t('home.compare')}</button>
      </div>
    </article>
  );
}

function Table({ rows, S, sortBy, pick }: { rows: Cls[]; S: State; sortBy: (k: SortKey) => void; pick: (id: string) => void }) {
  const t = i18n.t;
  const heat = (v: number, r: number[]) => ((v - r[0]) / (r[1] - r[0] || 1)).toFixed(2);
  const th = (k: SortKey, label: string, title?: string) => (
    <th key={k} scope="col" aria-sort={S.sort === k ? (S.dir === 1 ? 'ascending' : 'descending') : undefined}>
      <button title={title} onClick={() => sortBy(k)}>{label}{S.sort === k ? (S.dir === 1 ? ' ↑' : ' ↓') : ''}</button>
    </th>
  );
  return <>
    <div className="tbl-wrap"><table>
      <thead><tr>
        {th("name", t('home.class'))}<th scope="col">{t('home.family')}</th><th scope="col">{t('f.keyStats')}</th>{th("lvl", t('home.lvlShort'))}
        {STATS.map(k => th(k, k, td(STAT_FR[k])))}
        <th scope="col">{t('f.start')}</th><th scope="col">{t('home.sheet')}</th>
      </tr></thead>
      <tbody>{rows.map(x => {
        const on = S.sel.includes(x.id);
        return (
          <tr key={x.id} className={on ? 'on' : ''} style={fam(x)}>
            <th scope="row"><span className="dot" /><button className="rowbtn" title={on ? t('home.remove') : t('home.add')} onClick={() => pick(x.id)}>{x.name}{on && ' ✓'}</button></th>
            <td>{td(FAM[x.fam])}</td><td className="mono">{td(x.prim)}</td>
            <td className="num heat" style={{ "--p": heat(x.lvl, LVL) } as CSSProperties}>{x.lvl}</td>
            {x.s.map((v, i) => <td key={i} className="num heat" style={{ "--p": heat(v, RANGE[i]) } as CSSProperties}>{v}</td>)}
            <td>{x.region}</td><td><a className="wk" href={'#' + x.id}>{t('f.details')}</a></td>
          </tr>
        );
      })}</tbody>
    </table></div>
    <p className="note" style={{ marginTop: 12 }}>{t('home.tableNote')}</p>
  </>;
}

const lines = (a: string[]) => a.map((s, i) => <span key={i}>{i > 0 && <br />}{s}</span>);

function Sheet({ sel }: { sel: string[] }) {
  const X = sel.map(id => BY[id]), t = i18n.t;
  const txt = (label: string, fn: (x: Cls) => ReactNode) => <tr key={label}><th className="rowh" scope="row">{label}</th>{X.map(x => <td key={x.id}>{fn(x)}</td>)}</tr>;
  const num = (label: string, fn: (x: Cls) => number, max: number) => {
    const vals = X.map(fn), top = Math.max(...vals), best = vals.filter(n => n === top).length < X.length;
    return (
      <tr key={label}><th className="rowh" scope="row">{label}</th>{X.map((x, i) => (
        <td key={x.id}><div className={'cellbar' + (vals[i] === top && best ? ' best' : '')} style={fam(x)}>
          <span className="track"><i style={{ width: Math.min(100, vals[i] / max * 100) + '%' }} /></span><span className="v">{vals[i]}</span>
        </div></td>
      ))}</tr>
    );
  };
  return (
    <table>
      <thead><tr><th className="rowh" />{X.map(x => <th key={x.id} className="col" style={fam(x)}>{x.name}</th>)}</tr></thead>
      <tbody>
        {txt(t('home.family'), x => td(FAM[x.fam]))}
        {txt(t('f.keyStats'), x => <span className="mono">{td(x.prim)}</span>)}
        {txt(t('f.dmg'), x => x.dmg ? td(x.dmg) + (x.theme ? ' · ' + td(x.theme) : '') : (x.theme ? td(x.theme) : '—'))}
        {txt(t('f.armor'), x => x.armor ? td(x.armor) : '—')}
        {num(t('f.level'), x => x.lvl, 15)}
        {STATS.map((k, i) => num(td(STAT_FR[k]), x => x.s[i], 18))}
        {txt(t('f.start'), x => <>{x.region}<br /><span style={{ color: 'var(--muted)', fontSize: 13 }}>{td(x.place)}</span></>)}
        {txt(t('f.kit'), x => lines(x.kit.map(td)))}
        {txt(t('home.startSet'), x => D[x.id].set)}
        {txt(t('home.startSpells'), x => x.spells ? lines(x.spells) : '—')}
        {txt(t('home.runes'), x => { const d = D[x.id]; return d.runes ? t('home.runesVal', { tiers: d.runes.length, spells: nSpells(d) }) : '—'; })}
        {txt(t('home.catalyst'), x => { const d = D[x.id]; return d.cat ? lines(d.cat.map(r => r[0])) : '—'; })}
        {txt(t('home.classItem'), x => { const u = D[x.id].uniq; return u ? u[0] : '—'; })}
      </tbody>
    </table>
  );
}

export default function Home({ active }: { active: boolean }) {
  const { t } = useTranslation();
  const [S, setS] = useState<State>(INIT);
  const set: Set = p => setS(s => ({ ...s, ...p }));
  useEffect(() => { if (active) document.title = 'Convergence Compass'; }, [active]);

  const st = S.style && STYLES.find(s => s.id === S.style)!.ids;
  const rows = C.filter(x => (S.fam === 'all' || x.fam === S.fam) && (S.region === 'all' || x.region === S.region) &&
    (S.dmg === 'all' || x.dmg === S.dmg) && (!st || st.includes(x.id)));
  rows.sort((a, b) => {
    const va = val(a, S.sort), vb = val(b, S.sort);
    const d = typeof va === "string" ? va.localeCompare(vb as string) : va - (vb as number);
    return (d || a.order - b.order) * S.dir;
  });

  const pick = (id: string) => setS(s => {
    const sel = s.sel.includes(id) ? s.sel.filter(x => x !== id) : [...s.sel.slice(s.sel.length < 4 ? 0 : 1), id];
    return { ...s, sel, sheet: s.sheet && sel.length > 1 };
  });
  const sortBy = (k: SortKey) => setS(s => s.sort === k ? { ...s, dir: -s.dir } : { ...s, sort: k, dir: (k === 'name' || k === 'order') ? 1 : -1 });
  const n = S.sel.length;

  return (
    <div className="home">
      <div className="wrap" style={{ paddingBottom: n ? (S.sheet ? '64vh' : '90px') : 0 }}>
        <header className="mast">
          <span className="eyebrow">{t('home.eyebrow')}</span>
          <h1>{t('home.title')}</h1>
          <p>{t('home.intro')}</p>
          <p><a className="det-btn" href="#items">{t('home.itemsLink')}</a></p>
          <p><a className="det-btn" href="#bells">{t('bells.link')}</a></p>
        </header>

        <section aria-labelledby="h-styles">
          <div className="sec-head">
            <h2 id="h-styles">{t('home.stylesTitle')}</h2>
            <p>{t('home.stylesIntro')}</p>
          </div>
          <div className="styles">{STYLES.map(s => (
            <button key={s.id} className="tile" aria-pressed={S.style === s.id} onClick={() => set({ style: S.style === s.id ? null : s.id })}>
              <h3>{t(`home.styles.${s.id}.name`)}</h3><p>{t(`home.styles.${s.id}.text`)}</p>
              <div className="pills">{s.ids.map(id => <span key={id} className="pill" style={fam(BY[id])}>{BY[id].name}</span>)}</div>
            </button>
          ))}</div>
        </section>

        <section aria-labelledby="h-explore" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <h2 id="h-explore">{t('home.allTitle')}</h2>
            <p className="mono">{t('home.count', { n: rows.length, total: C.length })}</p>
          </div>
          <div className="controls">
            <div className="row"><span className="eyebrow lbl">{t('home.family')}</span><div className="row"><Chips items={Object.entries(FAM)} k="fam" S={S} set={set} /></div></div>
            <div className="row"><span className="eyebrow lbl">{t('home.region')}</span><div className="row"><Chips items={REGIONS.map(r => [r, r])} k="region" S={S} set={set} /></div></div>
            <div className="row"><span className="eyebrow lbl">{t('home.dmgFilter')}</span><div className="row"><Chips items={DMGS.map(r => [r, r])} k="dmg" S={S} set={set} /></div></div>
          </div>
          <div className="toolbar">
            <div className="left">
              <label htmlFor="sort" className="eyebrow">{t('home.sortBy')}</label>
              <select id="sort" value={S.sort} onChange={e => { const k = e.target.value; set({ sort: k, dir: (k === 'name' || k === 'order' || k === 'lvl') ? 1 : -1 }); }}>
                {(['order', 'name', 'lvl'] as const).map(k => <option key={k} value={k}>{t('home.sort.' + k)}</option>)}
                {STATS.map(k => <option key={k} value={k}>{td(STAT_FR[k])}</option>)}
              </select>
              <button className="link" onClick={() => set({ fam: 'all', region: 'all', dmg: 'all', style: null })}>{t('home.reset')}</button>
            </div>
            <div className="right">
              <div className="seg" role="group" aria-label={t('home.view')}>
                <button aria-pressed={S.view === 'cards'} onClick={() => set({ view: 'cards' })}>{t('home.cards')}</button>
                <button aria-pressed={S.view === 'table'} onClick={() => set({ view: 'table' })}>{t('home.table')}</button>
              </div>
            </div>
          </div>
          <p className="note">{t('home.martialNote')}</p>
          <div>
            {!rows.length ? <p className="empty">{t('home.empty')}</p>
              : S.view === 'cards' ? <div className="grid">{rows.map(x => <Card key={x.id} x={x} on={S.sel.includes(x.id)} pick={pick} />)}</div>
              : <Table rows={rows} S={S} sortBy={sortBy} pick={pick} />}
          </div>
        </section>

        <footer>
          <Trans i18nKey="home.footer1" components={{ site: <a href="https://www.convergencemod.com/classes/" target="_blank" rel="noopener" /> }} />
          <br /><br />{t('home.footer2')}
        </footer>
      </div>

      {n > 0 && (
        <div className="tray">
          <div className="tray-bar">
            <strong className="mono">{t('home.tray', { n })}</strong>
            <div className="chips">{S.sel.map(id => (
              <span key={id} className="sel" style={fam(BY[id])}>{BY[id].name}<button aria-label={t('home.removeName', { name: BY[id].name })} onClick={() => pick(id)}>×</button></span>
            ))}</div>
            <button className="primary" aria-expanded={S.sheet} disabled={n < 2} title={n < 2 ? t('home.needTwo') : ''} style={{ opacity: n < 2 ? 0.5 : 1 }} onClick={() => set({ sheet: !S.sheet })}>
              {S.sheet ? t('home.hideSheet') : t('home.showSheet')}
            </button>
            <button className="ghost" onClick={() => set({ sel: [], sheet: false })}>{t('home.clear')}</button>
          </div>
          {S.sheet && <div className="sheet"><Sheet sel={S.sel} /></div>}
        </div>
      )}
    </div>
  );
}
