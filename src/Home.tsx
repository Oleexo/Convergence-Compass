import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import CV from './data/classes';
import D from './data/det';
import F from './data/fiche';
import type { Cls, Det } from "./data/types";

const { STATS, STAT_FR, FAM, FAM_VAR, REGIONS, DMGS, C, BY } = CV;

const STYLES = [
  { id:'rempart', name:'Rempart', ids:['dreadnought','retainer','vanguard'], text:'Armure lourde ou moyenne à lourde, Force en tête. Dreadnought démarre avec Vigueur 16 et Endurance 15, les plus hautes valeurs de la liste. Retainer ajoute une arbalète et un bouclier kite.' },
  { id:'brute', name:'Force brute', ids:['berserker','dreadnought'], text:'Grandes armes, peu de finesse. Berserker démarre à Force 18, le maximum de la liste, au niveau 7 avec une grande hache. Dreadnought préfère le maul et le grand bouclier.' },
  { id:'agile', name:'Agilité et précision', ids:['sellsword','rogue','marksman'], text:'Dextérité de 15 à 18, armure légère à moyenne. Sellsword joue les doubles lames, Rogue l\'estoc et l\'arc court, Marksman les armes à distance avec 50 flèches enflammées.' },
  { id:'sorcery', name:'Sorcellerie pure', ids:['glint','starcaller','underworld','frost','aberrant'], text:'Intelligence en stat principale, Esprit entre 12 et 15. Glint Sorcerer part au niveau 6 avec INT 16. Chaque classe a sa spécialité : glintstone, gravité, foudre gelée, givre, ronces.' },
  { id:'hybrid', name:'Mage-guerrier INT + FTH', ids:['volcanist','stormcaller','nox','necromancer','godskin','frenzied'], text:'Deux stats à nourrir, 14 à 16 chacune au départ. Ces classes démarrent entre les niveaux 11 et 15 avec un bâton ou un sceau et une arme : magma, tempête, nuit, esprits, flamme noire, frénésie.' },
  { id:'priest', name:'Prêtre', ids:['fundamentalist','flame','bestial','dragoncultist'], text:'Foi de 16 à 18, un sceau d\'incantation et une arme de corps à corps. Fundamentalist a la Foi la plus haute (18), Flame Prophet démarre au niveau 7 avec 17.' },
  { id:'status', name:'Statuts et corruption', ids:['rot','mystic','blood','perfumer'], text:'Foi et Arcanes conjugués, 14 à 16. Pourriture et poison pour Servant of Rot, sommeil pour Mystic, flamme de sang pour Blood Initiate. Perfumer fabrique ses propres consommables.' },
  { id:'odd', name:'Départs atypiques', ids:['prisoner','perfumer'], text:'Prisoner : niveau 1, 10 partout, un gourdin. Perfumer : niveau 5, parfums, pots et arbalète, sans sorts de départ.' }
];
const SORTS = [['order','Ordre du mod'],['name','Nom'],['lvl','Niveau de départ']].concat(STATS.map(k => [k, STAT_FR[k]]));
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

export function Bars({ x }: { x: Cls }) {
  return (
    <div className="bars">
      {STATS.map((k, i) => (
        <div className="bar" key={k} title={STAT_FR[k] + ' ' + x.s[i]}>
          <span className="k">{k}</span><span className="track"><i style={{ width: Math.min(100, x.s[i] / 18 * 100) + '%' }} /></span><span className="v">{x.s[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Chips({ items, k, S, set }: { items: [string, string][]; k: "fam" | "region" | "dmg"; S: State; set: Set }) {
  return ([["all", "Toutes"]] as [string, string][]).concat(items).map(it => (
    <button key={it[0]} className="chip" aria-pressed={S[k] === it[0]} onClick={() => set({ [k]: it[0] })}>
      {it[1]}{it[0] !== 'all' && <span className="n mono">{count(k, it[0])}</span>}
    </button>
  ));
}

function DmgFacts({ x }: { x: Cls }) {
  return <>
    {x.dmg ? <><dt>Dégâts</dt><dd>{x.dmg}{x.theme && ' · ' + x.theme}</dd></> : x.theme && <><dt>Thème</dt><dd>{x.theme}</dd></>}
    {x.armor && <><dt>Armure</dt><dd>{x.armor}</dd></>}
  </>;
}

function Card({ x, on, pick }: { x: Cls; on: boolean; pick: (id: string) => void }) {
  const p = F.progress(x.id);
  return (
    <article className={'card' + (on ? ' on' : '')} style={fam(x)}>
      <div className="card-top"><h3>{x.name}</h3><span className="tag">{FAM[x.fam]}</span></div>
      <p className="blurb">{x.blurb}</p>
      <dl className="facts">
        <dt>Stats clés</dt><dd className="mono">{x.prim}</dd><dt>Niveau</dt><dd className="mono">{x.lvl}</dd><dt>Départ</dt><dd>{x.region}</dd>
        <DmgFacts x={x} />
      </dl>
      <Bars x={x} />
      <p className="kit">
        <span><b>Matériel</b> {x.kit.join(' · ')}</span><span><b>Set</b> {D[x.id].set}</span>
        {x.spells && <span><b>Sorts</b> {x.spells.join(' · ')}</span>}<span><b>Lieu</b> {x.place}</span>
      </p>
      {p.done > 0 && <p className="prog"><span>Progression <b className="mono">{p.done}/{p.total}</b></span><span className="pb"><i style={{ width: p.done / p.total * 100 + '%' }} /></span></p>}
      <div className="acts">
        <a className="det-btn" href={'#' + x.id}>Détails</a>
        <button className="cmp-btn" aria-pressed={on} onClick={() => pick(x.id)}>{on ? 'Dans le comparatif' : 'Comparer'}</button>
      </div>
    </article>
  );
}

function Table({ rows, S, sortBy, pick }: { rows: Cls[]; S: State; sortBy: (k: SortKey) => void; pick: (id: string) => void }) {
  const heat = (v: number, r: number[]) => ((v - r[0]) / (r[1] - r[0] || 1)).toFixed(2);
  const th = (k: SortKey, label: string, title?: string) => (
    <th key={k} scope="col" aria-sort={S.sort === k ? (S.dir === 1 ? 'ascending' : 'descending') : undefined}>
      <button title={title} onClick={() => sortBy(k)}>{label}{S.sort === k ? (S.dir === 1 ? ' ↑' : ' ↓') : ''}</button>
    </th>
  );
  return <>
    <div className="tbl-wrap"><table>
      <thead><tr>
        {th("name", "Classe")}<th scope="col">Famille</th><th scope="col">Stats clés</th>{th("lvl", "Niv.")}
        {STATS.map(k => th(k, k, STAT_FR[k]))}
        <th scope="col">Départ</th><th scope="col">Fiche</th>
      </tr></thead>
      <tbody>{rows.map(x => {
        const on = S.sel.includes(x.id);
        return (
          <tr key={x.id} className={on ? 'on' : ''} style={fam(x)}>
            <th scope="row"><span className="dot" /><button className="rowbtn" title={on ? 'Retirer du comparatif' : 'Ajouter au comparatif'} onClick={() => pick(x.id)}>{x.name}{on && ' ✓'}</button></th>
            <td>{FAM[x.fam]}</td><td className="mono">{x.prim}</td>
            <td className="num heat" style={{ "--p": heat(x.lvl, LVL) } as CSSProperties}>{x.lvl}</td>
            {x.s.map((v, i) => <td key={i} className="num heat" style={{ "--p": heat(v, RANGE[i]) } as CSSProperties}>{v}</td>)}
            <td>{x.region}</td><td><a className="wk" href={'#' + x.id}>Détails</a></td>
          </tr>
        );
      })}</tbody>
    </table></div>
    <p className="note" style={{ marginTop: 12 }}>Chaque colonne est colorée de la valeur la plus basse à la plus haute de la liste. Clique un nom pour l'ajouter au comparatif.</p>
  </>;
}

const lines = (a: string[]) => a.map((s, i) => <span key={i}>{i > 0 && <br />}{s}</span>);

function Sheet({ sel }: { sel: string[] }) {
  const X = sel.map(id => BY[id]);
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
        {txt("Famille", x => FAM[x.fam])}
        {txt("Stats clés", x => <span className="mono">{x.prim}</span>)}
        {txt("Dégâts", x => x.dmg ? x.dmg + (x.theme ? ' · ' + x.theme : '') : (x.theme || '—'))}
        {txt("Armure", x => x.armor || '—')}
        {num("Niveau", x => x.lvl, 15)}
        {STATS.map((k, i) => num(STAT_FR[k], x => x.s[i], 18))}
        {txt("Départ", x => <>{x.region}<br /><span style={{ color: 'var(--muted)', fontSize: 13 }}>{x.place}</span></>)}
        {txt("Matériel", x => lines(x.kit))}
        {txt("Set de départ", x => D[x.id].set)}
        {txt("Sorts de départ", x => x.spells ? lines(x.spells) : '—')}
        {txt("Runes de sorts", x => { const d = D[x.id]; return d.runes ? d.runes.length + ' paliers · ' + nSpells(d) + ' sorts' : '—'; })}
        {txt("Catalyseur", x => { const d = D[x.id]; return d.cat ? lines(d.cat.map(r => r[0])) : '—'; })}
        {txt("Objet de classe", x => { const u = D[x.id].uniq; return u ? u[0] : '—'; })}
      </tbody>
    </table>
  );
}

export default function Home({ active }: { active: boolean }) {
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
          <span className="eyebrow">Elden Ring · mod The Convergence</span>
          <h1>Classes de Convergence</h1>
          <p>27 classes, 27 points de départ. Compare les stats, le matériel et le style de jeu de chacune. Ouvre la fiche d'une classe pour ses armures, ses armes, ses sorts et leurs emplacements dans le monde, puis sélectionne jusqu'à quatre classes pour les mettre côte à côte.</p>
        </header>

        <section aria-labelledby="h-styles">
          <div className="sec-head">
            <h2 id="h-styles">Styles de jeu</h2>
            <p>Mon regroupement d'après les kits de départ. Clique un style pour filtrer les classes.</p>
          </div>
          <div className="styles">{STYLES.map(s => (
            <button key={s.id} className="tile" aria-pressed={S.style === s.id} onClick={() => set({ style: S.style === s.id ? null : s.id })}>
              <h3>{s.name}</h3><p>{s.text}</p>
              <div className="pills">{s.ids.map(id => <span key={id} className="pill" style={fam(BY[id])}>{BY[id].name}</span>)}</div>
            </button>
          ))}</div>
        </section>

        <section aria-labelledby="h-explore" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <h2 id="h-explore">Toutes les classes</h2>
            <p className="mono">{rows.length} / {C.length} classes</p>
          </div>
          <div className="controls">
            <div className="row"><span className="eyebrow lbl">Famille</span><div className="row"><Chips items={Object.entries(FAM)} k="fam" S={S} set={set} /></div></div>
            <div className="row"><span className="eyebrow lbl">Zone de départ</span><div className="row"><Chips items={REGIONS.map(r => [r, r])} k="region" S={S} set={set} /></div></div>
            <div className="row"><span className="eyebrow lbl">Dégâts (lanceurs)</span><div className="row"><Chips items={DMGS.map(r => [r, r])} k="dmg" S={S} set={set} /></div></div>
          </div>
          <div className="toolbar">
            <div className="left">
              <label htmlFor="sort" className="eyebrow">Trier par</label>
              <select id="sort" value={S.sort} onChange={e => { const k = e.target.value; set({ sort: k, dir: (k === 'name' || k === 'order' || k === 'lvl') ? 1 : -1 }); }}>
                {SORTS.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}
              </select>
              <button className="link" onClick={() => set({ fam: 'all', region: 'all', dmg: 'all', style: null })}>Réinitialiser les filtres</button>
            </div>
            <div className="right">
              <div className="seg" role="group" aria-label="Affichage">
                <button aria-pressed={S.view === 'cards'} onClick={() => set({ view: 'cards' })}>Cartes</button>
                <button aria-pressed={S.view === 'table'} onClick={() => set({ view: 'table' })}>Tableau</button>
              </div>
            </div>
          </div>
          <p className="note">Les classes martiales (mêlée et distance) ont des capacités d'armure qui ne fonctionnent que sans arme ni catalyseur à scaling Intelligence ou Foi équipé. Marksman fait exception pour ses arcs, arbalètes et balistes. Le Prisoner ne profite pleinement de ses armures notables qu'au Rune Level 1.</p>
          <div>
            {!rows.length ? <p className="empty">Aucune classe ne correspond à ces filtres.</p>
              : S.view === 'cards' ? <div className="grid">{rows.map(x => <Card key={x.id} x={x} on={S.sel.includes(x.id)} pick={pick} />)}</div>
              : <Table rows={rows} S={S} sortBy={sortBy} pick={pick} />}
          </div>
        </section>

        <footer>
          Données : fiches de classes du site officiel <a href="https://www.convergencemod.com/classes/" target="_blank" rel="noopener">convergencemod.com</a>, consultées le 19 octobre 2026. Niveaux et stats de départ recopiés des fiches, descriptions traduites. Les regroupements en styles de jeu sont mon interprétation, pas un classement officiel. Le mod évolue : vérifie en jeu si un chiffre te semble décalé.
          <br /><br />Pages de détail : armures, armes, catalyseurs et runes de sorts relevés sur les fiches de classes et les pages de runes du même site. Les conditions d'obtention sont traduites, les noms d'objets et de lieux restent en anglais. Les armes listées sont celles de la fiche de la classe, pas un guide de build. Les pages du site se contredisent parfois sur un lieu (la rune de Blood Initiate, le départ de Mystic) : en cas de doute, fie-toi à ce que tu vois en jeu. Les zones (Limgrave, Liurnia…) sont classées d'après ma connaissance du jeu et recoupées sur le wiki quand c'était possible, « zone à préciser » signale un doute. Les liens ↗ mènent au wiki Fextralife et à Map Genie ; je n'ai pas pu tester les cartes interactives depuis ici.
        </footer>
      </div>

      {n > 0 && (
        <div className="tray">
          <div className="tray-bar">
            <strong className="mono">Comparer {n}/4</strong>
            <div className="chips">{S.sel.map(id => (
              <span key={id} className="sel" style={fam(BY[id])}>{BY[id].name}<button aria-label={'Retirer ' + BY[id].name} onClick={() => pick(id)}>×</button></span>
            ))}</div>
            <button className="primary" aria-expanded={S.sheet} disabled={n < 2} title={n < 2 ? 'Choisis au moins deux classes' : ''} style={{ opacity: n < 2 ? 0.5 : 1 }} onClick={() => set({ sheet: !S.sheet })}>
              {S.sheet ? 'Masquer le comparatif' : 'Voir le comparatif'}
            </button>
            <button className="ghost" onClick={() => set({ sel: [], sheet: false })}>Vider</button>
          </div>
          {S.sheet && <div className="sheet"><Sheet sel={S.sel} /></div>}
        </div>
      )}
    </div>
  );
}
