import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import CV from './data/classes';
import D from './data/det';
import Z from './data/zones';
import F from './data/fiche';
import type { Entry } from './data/types';
import { Bars, famVar, nSpells } from './Home';

const { FAM, C, BY } = CV;
const ZL: Record<string, string> = {}, ZO: Record<string, number> = {};
Z.list.forEach((z, i) => { ZL[z[0]] = z[1]; ZO[z[0]] = i; });
const OBT_L: Record<string, string> = Object.fromEntries(F.OBT);
const REGION_PREFIX = ['Limgrave', 'Liurnia', 'Caelid', 'Weeping Peninsula', 'Altus Plateau', 'Mt. Gelmir', 'Mountaintops of the Giants', 'Consecrated Snowfield', 'Cerulean Coast', 'Scadu Altus', 'Hinterlands'];
const FR_FIRST = ['Après', 'Butin', 'Donné', 'Vendu', 'Acheté', 'Sur', 'Au', 'Quête', 'Fin', 'Obtenue', 'Tableau', 'Coffre', 'Cimetière', 'Chambres', 'Cascade', 'Champ', 'Intérieur', 'Marchand', 'Près', 'Plateau', 'Camp', 'Tour', 'Golem', 'Fallingstar', 'Devant'];
const LOWER_OK = ['of', 'the', 'to', 'and', 'in', 'at'];
const MAP_URL = { mod: 'https://map.quack.boo/', wiki: 'https://wiki.convergencemod.com/' };
const TAB_GROUPS: Record<'armor' | 'wpn', string[]> = { armor: ['Set de départ', 'Sets à trouver'], wpn: ['Catalyseurs', 'Armes', 'Objet de classe'] };
const VIEWS = [['tab', 'Par rubrique'], ['zone', 'Par région'], ['place', 'Itinéraire']] as const;
const WIKI = 'https://wiki.convergencemod.com/wiki/';
const EXT = { target: '_blank', rel: 'noopener' };

type View = typeof VIEWS[number][0];
type Tab = Entry['tab'];
interface State { tab: Tab; v: View; z: string; t: string; q: string; hide: boolean; rs: boolean }

const wiki = (name: string) => 'https://eldenring.wiki.fextralife.com/' + encodeURIComponent(name).replace(/%20/g, '+');
/* Nom anglais propre (pas de texte français) → lien wiki, sinon null. */
function cleanName(s: string): string | null {
  const i = s.indexOf(', ');
  if (i > -1 && REGION_PREFIX.includes(s.slice(0, i))) s = s.slice(i + 2);
  if (s.includes(', ') || /[«»(]/.test(s)) return null;
  const w = s.split(' ');
  if (FR_FIRST.includes(w[0])) return null;
  for (const word of w) {
    if (LOWER_OK.includes(word)) continue;
    const c = word.charAt(0);
    if (c === c.toLowerCase() && c !== c.toUpperCase()) return null;
  }
  return s;
}
function link(label: string, name?: string): ReactNode {
  const n = name && cleanName(name);
  return n ? <a className="wk" href={wiki(n)} {...EXT} title="Page du wiki Fextralife">{label}</a> : label;
}
function nameLink(e: Entry, label = e.name): ReactNode {
  if (e.nolink || e.kind === 'Sorts') return label;
  if (e.prec?.page) return <a className="wk" href={WIKI + e.prec.page} {...EXT} title="Page du wiki Convergence">{label}</a>;
  return link(label, e.name);
}
const textOf = (e: Entry) => [e.name, e.label, e.detail, e.how || '', e.kind, (e.spells || []).join(' '), ZL[e.zone], OBT_L[e.obt], e.prec ? e.prec.note + ' ' + (e.prec.place || '') + ' ' + (e.prec.acc || []).join(' ') : ''].join(' ').toLowerCase();
const none = <p className="empty">Rien ne correspond à ces filtres.</p>;
const badge = (e: Entry) => e.badge && <span className="badge">{e.badge}</span>;
function byZone(list: Entry[]): [string, Entry[]][] {
  const by: Record<string, Entry[]> = {};
  list.forEach(e => { (by[e.zone] ??= []).push(e); });
  return Object.keys(by).sort((a, b) => ZO[a] - ZO[b]).map(z => [z, by[z]]);
}
/* Itinéraire : par région puis par lieu précis, pour tout récupérer en un passage. */
function placeOf(e: Entry): string {
  if (e.prec?.place) return e.prec.place;
  if (e.obt === 'start' && e.kind !== 'Sorts') return 'Équipement de départ';
  if (e.kind === 'Sorts') return e.detail.replace(/^[^,]+,\s*/, '');
  return e.detail;
}

function MapImg({ e, f }: { e: Entry; f: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="pm">
      {broken ? <a className="wk" href={WIKI + 'File:' + f} {...EXT}>Ouvrir l'image sur le wiki du mod ↗</a>
        : <><img loading="lazy" src={WIKI + 'Special:FilePath/' + f} alt={'Carte : ' + e.name} onError={() => setBroken(true)} /><figcaption>Image du wiki du mod</figcaption></>}
    </figure>
  );
}
function Pdet({ e }: { e: Entry }) {
  const p = e.prec;
  if (!p) return null;
  return (
    <details className="pd">
      <summary>Précisions{p.alt && <> <span className="warn" title="Sources divergentes">⚠</span></>}</summary>
      <div className="pd-b">
        <p>{p.note}</p>
        {p.alt && <p className="alt">⚠ {p.alt}</p>}
        {(p.maps || []).map(f => <MapImg key={f} e={e} f={f} />)}
        <p className="src">Source : <a className="wk" href={WIKI + p.page} {...EXT}>wiki du mod</a>. La grâce la plus proche n'est pas indiquée par cette source.</p>
      </div>
    </details>
  );
}
function Tags({ e }: { e: Entry }) {
  return <>
    {e.prec?.acc?.map(a => <span key={a} className="ac">{a}</span>)}
    <span className="zt" data-z={e.zone}>{ZL[e.zone]}</span>
    {e.obt !== 'start' && <span className="ot" title={OBT_L[e.obt]}>{F.OBT_SHORT[e.obt]}</span>}
  </>;
}

export default function Classe({ id }: { id: string }) {
  const x = BY[id], d = D[id];
  const [S, setS] = useState<State>({ tab: 'armor', v: 'tab', z: 'all', t: 'all', q: '', hide: false, rs: false });
  const [, setRev] = useState(0); // progression lives in fiche.ts; bump to re-render after a change
  const set = (p: Partial<State>) => setS(s => ({ ...s, ...p }));
  useEffect(() => { document.title = (x && d ? x.name : 'Classe introuvable') + ' · Convergence Compass'; }, [x, d]);
  useEffect(() => {
    if (!S.rs) return;
    const t = setTimeout(() => set({ rs: false }), 4000);
    return () => clearTimeout(t);
  }, [S.rs]);

  const back = <a className="back" href="#">← Toutes les classes</a>;
  if (!x || !d) return <div className="fiche"><div className="wrap">{back}<p className="empty">Classe introuvable. <a href="#">Retour à la liste des classes</a>.</p></div></div>;

  const ENTS = F.entries(id);
  const done = (e: Entry) => e.check && F.isDone(id, e);
  const doneCls = (base: string, e: Entry) => base + (done(e) ? ' done' : '');
  const q = S.q.trim().toLowerCase();
  const list = ENTS.filter(e => (S.z === 'all' || e.zone === S.z) && (S.t === 'all' || e.obt === S.t) && (!S.hide || !done(e)) && (!q || textOf(e).includes(q)));

  // Render helpers are plain functions, not components: a component declared here would remount on every check and close open <details>.
  const ck = (e: Entry) => e.check
    ? <input type="checkbox" className="ckb" checked={done(e)} onChange={ev => { F.setDone(id, e, ev.target.checked); setRev(r => r + 1); }} aria-label={'Récupéré : ' + e.name + (e.label ? ' (' + e.label + ')' : '')} />
    : <span className="ck0" />;
  const labelled = (e: Entry) => <>{e.label && <><b>{e.label}</b> </>}{e.nolink ? e.detail : link(e.detail, e.detail)}</>;
  const spellLoc = (e: Entry) => <><b>{link(e.detail, e.detail)}</b>{e.how && ' · ' + e.how}<Tags e={e} /></>;

  /* ----- vue par rubrique ----- */
  const piece = (e: Entry) => (
    <li key={e.key} className={doneCls('pc', e)}>{ck(e)}<span className="pc-t">{labelled(e)}</span><Tags e={e} /><Pdet e={e} /></li>
  );
  const row = (items: Entry[], name: string) => {
    const first = items[0];
    const nm = <><span className="txt">{nameLink(first, name)}</span>{badge(first)}</>;
    if (items.length === 1 && !first.label) {
      return (
        <li key={first.key} className={doneCls('it', first)}>
          <div className="nm">{ck(first)}{nm}</div>
          <span className="loc">{labelled(first)}<Tags e={first} /></span>
          <Pdet e={first} />
        </li>
      );
    }
    return <li key={first.key} className="it"><div className="nm"><span className="ck0" />{nm}</div><ul className="pcs">{items.map(piece)}</ul></li>;
  };
  const rune = (e: Entry) => (
    <section key={e.key} className={doneCls('rune', e)}>
      <div className="rh">{ck(e)}<h3 className="txt">{e.name.replace('Palier ', '')}</h3>{e.tier === 5 && <span className="badge">Extension</span>}<span className="mono">{e.spells!.length} sorts</span></div>
      <div className="sps">{e.spells!.map(s => <span key={s} className={'sp' + (q && s.toLowerCase().includes(q) ? ' hit' : '')}>{s}</span>)}</div>
      <p className="loc">{spellLoc(e)}</p>
      <Pdet e={e} />
    </section>
  );
  function viewTab() {
    if (S.tab === 'spells') {
      const es = list.filter(e => e.tab === 'spells');
      return <>
        <p className="note">Les runes de sorts de cette classe ({d.rune}) sont des consommables à usage unique : chaque palier débloque la liste de sorts indiquée.{(d.runes?.length ?? 0) > 5 && ' Le palier Shadow se trouve dans les zones de l\'extension Shadow of the Erdtree.'}</p>
        {es.length ? <div className="runes">{es.map(rune)}</div> : none}
      </>;
    }
    const tab = S.tab, es = list.filter(e => e.tab === tab);
    const groups = TAB_GROUPS[tab].map(g => [g, es.filter(e => e.group === g)] as const).filter(g => g[1].length);
    return <>
      {tab === 'armor' && d.note && <p className="note">{d.note}</p>}
      {tab === 'wpn' && d.wnote && <p className="note">{d.wnote}</p>}
      {groups.map(([g, ge]) => {
        const rows: { name: string; items: Entry[] }[] = [];
        ge.forEach(e => { const last = rows[rows.length - 1]; if (last && last.name === e.name) last.items.push(e); else rows.push({ name: e.name, items: [e] }); });
        return <div key={g}><h2 className="grp">{g}<span className="mono">{ge.length}</span></h2><ul className="its">{rows.map(r => row(r.items, r.name))}</ul></div>;
      })}
      {!groups.length && !(d.wnote && tab === 'wpn') && none}
    </>;
  }

  /* ----- vue par région ----- */
  const flat = (e: Entry) => (
    <li key={e.key} className={doneCls('it', e)}>
      <div className="nm">{ck(e)}<span className="kd">{e.kind}</span><span className="txt">{nameLink(e)}</span>{badge(e)}</div>
      {e.kind === 'Sorts'
        ? <><div className="sps">{e.spells!.map(s => <span key={s} className="sp">{s}</span>)}</div><span className="loc">{spellLoc(e)}</span></>
        : <span className="loc">{labelled(e)}<Tags e={e} /></span>}
      <Pdet e={e} />
    </li>
  );
  const grp = (z: string, n: number) => <h2 className="grp">{ZL[z]}<span className="mono">{n}</span></h2>;
  const viewZones = () => list.length ? byZone(list).map(([z, es]) => <div key={z}>{grp(z, es.length)}<ul className="its">{es.map(flat)}</ul></div>) : none;
  const viewPlaces = () => list.length ? byZone(list).map(([z, es]) => {
    const pl: Record<string, Entry[]> = {}, order: string[] = [];
    es.forEach(e => { const k = placeOf(e); if (!pl[k]) { pl[k] = []; order.push(k); } pl[k].push(e); });
    order.sort((a, b) => pl[b].length - pl[a].length);
    return (
      <div key={z}>{grp(z, es.length)}
        {order.map(k => <div key={k}><h3 className="plc">{k}{pl[k].length > 1 && <span className="mono">{pl[k].length} objets</span>}</h3><ul className="its">{pl[k].map(flat)}</ul></div>)}
      </div>
    );
  }) : none;

  /* ----- panneau de filtres et progression ----- */
  const st: Record<string, { tot: number; dn: number }> = {}, tc: Record<string, number> = {};
  let tot = 0, dn = 0;
  ENTS.forEach(e => {
    const s = st[e.zone] ??= { tot: 0, dn: 0 };
    if (e.check) { s.tot++; tot++; if (done(e)) { s.dn++; dn++; } }
    tc[e.obt] = (tc[e.obt] || 0) + 1;
  });
  const zones: [string, string, string | number][] = [['all', 'Toutes', ENTS.length], ...Object.keys(st).sort((a, b) => ZO[a] - ZO[b]).map((z): [string, string, string] => [z, ZL[z], st[z].tot ? st[z].dn + '/' + st[z].tot : '·'])];
  const types: [string, string, number][] = [['all', 'Tous', ENTS.length], ...F.OBT.filter(o => tc[o[0]]).map((o): [string, string, number] => [o[0], o[1], tc[o[0]]])];
  const names = (tab: Tab) => new Set(ENTS.filter(e => e.tab === tab).map(e => e.name)).size;
  const tabs: [Tab, string, number][] = [['armor', 'Armures', names('armor')], ['wpn', 'Armes', names('wpn')]];
  if (d.runes) tabs.push(['spells', 'Sorts', nSpells(d)]);
  const reset = () => { if (S.rs) { F.reset(id); set({ rs: false }); setRev(r => r + 1); } else set({ rs: true }); };

  const i = x.order, prev = C[(i + C.length - 1) % C.length], next = C[(i + 1) % C.length];
  const nav = (to: string) => (ev: MouseEvent) => { ev.preventDefault(); location.replace('#' + to); };

  return (
    <div className="fiche"><div className="wrap">
      {back}
      <div style={{ '--fam': famVar(x), display: 'flex', flexDirection: 'column', gap: 24 } as CSSProperties}>
        <header className="hero">
          <div className="hero-id">
            <span className="tag">{FAM[x.fam]}</span><h1>{x.name}</h1><p className="blurb">{x.blurb}</p>
            <dl className="facts">
              <dt>Départ</dt><dd>{x.region}, {x.place}</dd><dt>Niveau</dt><dd className="mono">{x.lvl}</dd><dt>Stats clés</dt><dd className="mono">{x.prim}</dd>
              {x.dmg ? <><dt>Dégâts</dt><dd>{x.dmg}{x.theme && ' · ' + x.theme}</dd></> : x.theme && <><dt>Thème</dt><dd>{x.theme}</dd></>}
              {x.armor && <><dt>Armure</dt><dd>{x.armor}</dd></>}
            </dl>
            <p className="maps"><a className="wk" href={MAP_URL.mod} {...EXT}>Carte interactive du mod ↗</a><a className="wk" href={MAP_URL.wiki} {...EXT}>Wiki du mod ↗</a></p>
          </div>
          <aside className="panel">
            <h2>Départ</h2><Bars x={x} />
            <p className="kit"><span><b>Matériel</b> {x.kit.join(' · ')}</span><span><b>Set</b> {d.set}</span>{x.spells && <span><b>Sorts</b> {x.spells.join(' · ')}</span>}</p>
          </aside>
        </header>

        <section className="locate" aria-label="Où chercher">
          <div className="panel filt">
            <div>
              <div className="prog-top"><b>{dn} / {tot} récupérés</b><button className="link" onClick={reset}>{S.rs ? 'Confirmer la remise à zéro' : 'Remettre à zéro'}</button></div>
              <div className="pbar"><i style={{ width: (tot ? dn / tot * 100 : 0) + '%' }} /></div>
              <label className="opt"><input type="checkbox" className="ckb" checked={S.hide} onChange={e => set({ hide: e.target.checked })} /> Masquer ce que j'ai déjà récupéré</label>
            </div>
            <div><span className="eyebrow">Zones</span><div className="chips" role="group" aria-label="Filtrer par zone">
              {zones.map(z => <button key={z[0]} className="chip" aria-pressed={S.z === z[0]} onClick={() => set({ z: z[0] })}>{z[1]}<span className="n mono">{z[2]}</span></button>)}
            </div></div>
            <div><span className="eyebrow">Type d'obtention</span><div className="chips" role="group" aria-label="Filtrer par type d'obtention">
              {types.map(o => <button key={o[0]} className="chip" aria-pressed={S.t === o[0]} onClick={() => set({ t: o[0] })}>{o[1]}<span className="n mono">{o[2]}</span></button>)}
            </div></div>
          </div>
        </section>

        <div className="bar-sticky"><div className="tools">
          <div className="seg" role="group" aria-label="Organisation de la liste">
            {VIEWS.map(v => <button key={v[0]} aria-pressed={S.v === v[0]} onClick={() => set({ v: v[0] })}>{v[1]}</button>)}
          </div>
          <div className="seg" role="group" aria-label="Rubriques" hidden={S.v !== 'tab'}>
            {tabs.map(t => <button key={t[0]} aria-pressed={S.tab === t[0]} onClick={() => set({ tab: t[0] })}>{t[1]}<span className="cnt">{t[2]}</span></button>)}
          </div>
          <input type="search" placeholder="Filtrer par nom ou lieu" aria-label="Filtrer par nom ou lieu" value={S.q} onChange={e => set({ q: e.target.value })} />
        </div></div>

        <main>{S.v === 'zone' ? viewZones() : S.v === 'place' ? viewPlaces() : viewTab()}</main>

        <nav className="pager" aria-label="Autres classes">
          <a href={'#' + prev.id} onClick={nav(prev.id)}>← {prev.name}</a><a href={'#' + next.id} onClick={nav(next.id)}>{next.name} →</a>
        </nav>
        <footer>Sources : fiches de classes et pages de runes de <a href="https://www.convergencemod.com/classes/" {...EXT}>convergencemod.com</a> (19 octobre 2026) ; onglets « Précisions » : <a href="https://wiki.convergencemod.com/" {...EXT}>wiki du mod</a> (20 octobre 2026), disponibles pour l'instant sur Glint Sorcerer. Ces sources se contredisent parfois : le cas est alors signalé par ⚠. Aucune ne donne la grâce la plus proche. Les conditions d'obtention sont traduites, les noms d'objets et de lieux restent en anglais. Les zones et les types d'obtention sont déduits (zones recoupées sur le wiki quand c'était possible, « à préciser » signale un doute). Les cases cochées sont enregistrées dans ton navigateur uniquement. Les armes listées sont celles de la fiche de la classe, pas un guide de build. Les noms d'objets sans précision renvoient vers le wiki Fextralife (jeu de base) ; la carte interactive du mod n'a pas pu être testée depuis ici.</footer>
      </div>
    </div></div>
  );
}
