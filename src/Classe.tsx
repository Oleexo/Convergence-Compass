import { Fragment, useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import CV from './data/classes';
import D from './data/det';
import Z from './data/zones';
import F from './data/fiche';
import B from './data/build';
import type { Entry } from './data/types';
import { Bars, famVar, kitList, nSpells } from './Home';
import { Trans, useTranslation } from 'react-i18next';
import i18n, { td } from './i18n';
import { PREFER_KIND, findItem, itemHash } from './data/items';
import { useGloss } from './Gloss';
import { linkify } from './Links';

const { FAM, C, BY } = CV;
const ZL: Record<string, string> = {}, ZO: Record<string, number> = {};
Z.list.forEach((z, i) => { ZL[z[0]] = z[1]; ZO[z[0]] = i; });
const OBT_L: Record<string, string> = Object.fromEntries(F.OBT);
const REGION_PREFIX = ['Limgrave', 'Liurnia', 'Caelid', 'Weeping Peninsula', 'Altus Plateau', 'Mt. Gelmir', 'Mountaintops of the Giants', 'Consecrated Snowfield', 'Cerulean Coast', 'Scadu Altus', 'Hinterlands'];
const FR_FIRST = ['Après', 'Butin', 'Donné', 'Vendu', 'Acheté', 'Sur', 'Au', 'Quête', 'Fin', 'Obtenue', 'Tableau', 'Coffre', 'Cimetière', 'Chambres', 'Cascade', 'Champ', 'Intérieur', 'Marchand', 'Près', 'Plateau', 'Camp', 'Tour', 'Golem', 'Fallingstar', 'Devant'];
const LOWER_OK = ['of', 'the', 'to', 'and', 'in', 'at'];
const MAP_URL = { mod: 'https://map.quack.boo/', wiki: 'https://wiki.convergencemod.com/' };
const TAB_GROUPS: Record<'armor' | 'wpn', string[]> = { armor: ['Set de départ', 'Sets à trouver'], wpn: ['Catalyseurs', 'Armes', 'Objet de classe'] };
const VIEWS = ['tab', 'zone', 'place'] as const;
const WIKI = 'https://wiki.convergencemod.com/wiki/';
const EXT = { target: '_blank', rel: 'noopener' };

type View = typeof VIEWS[number];
type Tab = Entry['tab'];
interface State { tab: Tab; v: View; z: string; t: string; q: string; hide: boolean; rs: boolean }

const wiki = (name: string) => 'https://eldenring.wiki.fextralife.com/' + encodeURIComponent(name).replace(/%20/g, '+');
/* Nom anglais propre (pas de texte français) → lien wiki, sinon null. Reçoit toujours le texte source français. */
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
  return n ? <a className="wk" href={wiki(n)} {...EXT} title={i18n.t('cls.wikiFext')}>{label}</a> : linkify(label);
}
/* Lien vers la page interne de l'objet quand la base d'objets le connaît. */
function inLink(label: ReactNode, name: string, kind?: string, cls = 'wk'): ReactNode {
  const h = findItem(name, kind ? PREFER_KIND[kind] : undefined);
  return h ? <a className={cls} href={itemHash(h.kind, h.name)} title={i18n.t('cls.itemPage')}>{label}</a> : null;
}
function nameLink(e: Entry, label = td(e.name)): ReactNode {
  if (e.kind === 'Sorts') return label;
  const own = inLink(label, e.name, e.kind);
  if (own) return own;
  if (e.nolink) return label;
  if (e.prec?.page) return <a className="wk" href={WIKI + e.prec.page} {...EXT} title={i18n.t('cls.wikiMod')}>{label}</a>;
  return link(label, e.name);
}
const textOf = (e: Entry) => [e.name, e.label, e.detail, e.how || '', e.kind, (e.spells || []).join(' '), ZL[e.zone], OBT_L[e.obt], e.prec ? e.prec.note + ' ' + (e.prec.place || '') + ' ' + (e.prec.acc || []).join(' ') : ''].map(td).join(' ').toLowerCase();
const none = () => <p className="empty">{i18n.t('cls.none')}</p>;
const badge = (e: Entry) => e.badge && <span className="badge">{td(e.badge)}</span>;
function byZone(list: Entry[]): [string, Entry[]][] {
  const by: Record<string, Entry[]> = {};
  list.forEach(e => { (by[e.zone] ??= []).push(e); });
  return Object.keys(by).sort((a, b) => ZO[a] - ZO[b]).map(z => [z, by[z]]);
}
/* Itinéraire : par région puis par lieu précis, pour tout récupérer en un passage. */
function placeOf(e: Entry): string {
  if (e.prec?.place) return e.prec.place;
  if (e.obt === 'start' && e.kind !== 'Sorts') return i18n.t('cls.startGear');
  if (e.kind === 'Sorts') return td(e.detail).replace(/^[^,]+,\s*/, '');
  return td(e.detail);
}

function MapImg({ e, f }: { e: Entry; f: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="pm">
      {broken ? <a className="wk" href={WIKI + 'File:' + f} {...EXT}>{i18n.t('cls.openImg')}</a>
        : <><img loading="lazy" src={WIKI + 'Special:FilePath/' + f} alt={i18n.t('cls.mapAlt', { name: e.name })} onError={() => setBroken(true)} /><figcaption>{i18n.t('cls.imgCaption')}</figcaption></>}
    </figure>
  );
}
function Pdet({ e }: { e: Entry }) {
  const p = e.prec;
  if (!p) return null;
  return (
    <details className="pd">
      <summary>{i18n.t('cls.prec')}{p.alt && <> <span className="warn" title={i18n.t('cls.diverge')}>⚠</span></>}</summary>
      <div className="pd-b">
        <p>{linkify(td(p.note))}</p>
        {p.alt && <p className="alt">⚠ {linkify(td(p.alt))}</p>}
        {(p.maps || []).map(f => <MapImg key={f} e={e} f={f} />)}
        <p className="src"><Trans i18nKey="cls.precSource" components={{ wiki: <a className="wk" href={WIKI + p.page} {...EXT} /> }} /></p>
      </div>
    </details>
  );
}
function Tags({ e }: { e: Entry }) {
  return <>
    {e.prec?.acc?.map(a => <span key={a} className="ac">{td(a)}</span>)}
    <span className="zt" data-z={e.zone}>{td(ZL[e.zone])}</span>
    {e.obt !== 'start' && <span className="ot" title={td(OBT_L[e.obt])}>{td(F.OBT_SHORT[e.obt])}</span>}
  </>;
}

export default function Classe({ id }: { id: string }) {
  const { t } = useTranslation();
  const g = useGloss();
  /** Names become links, game terms get an explanation (each term once per text). */
  const gl = (s: string) => { const seen = new Set<string>(); return linkify(s, undefined, x => g(x, seen)); };
  const x = BY[id], d = D[id];
  const [S, setS] = useState<State>({ tab: 'armor', v: 'tab', z: 'all', t: 'all', q: '', hide: false, rs: false });
  const [, setRev] = useState(0); // progression lives in fiche.ts; bump to re-render after a change
  const set = (p: Partial<State>) => setS(s => ({ ...s, ...p }));
  useEffect(() => { document.title = (x && d ? x.name : t('cls.notFound')) + ' · Convergence Compass'; }, [x, d, t]);
  useEffect(() => {
    if (!S.rs) return;
    const t = setTimeout(() => set({ rs: false }), 4000);
    return () => clearTimeout(t);
  }, [S.rs]);

  const back = <a className="back" href="#">{t('cls.back')}</a>;
  if (!x || !d) return <div className="fiche"><div className="wrap">{back}<p className="empty"><Trans i18nKey="cls.notFoundBody" components={{ home: <a href="#" /> }} /></p></div></div>;

  const ENTS = F.entries(id);
  const b = B.B[id], talDone = b ? b.tal.filter(([n]) => F.isDone(id, { key: 'tal|' + n })).length : 0;
  const done = (e: Entry) => e.check && F.isDone(id, e);
  const doneCls = (base: string, e: Entry) => base + (done(e) ? ' done' : '');
  const q = S.q.trim().toLowerCase();
  const list = ENTS.filter(e => (S.z === 'all' || e.zone === S.z) && (S.t === 'all' || e.obt === S.t) && (!S.hide || !done(e)) && (!q || textOf(e).includes(q)));

  // Render helpers are plain functions, not components: a component declared here would remount on every check and close open <details>.
  const ck = (e: Entry) => e.check
    ? <input type="checkbox" className="ckb" checked={done(e)} onChange={ev => { F.setDone(id, e, ev.target.checked); setRev(r => r + 1); }} aria-label={t('cls.got', { name: td(e.name) + (e.label ? ' (' + e.label + ')' : '') })} />
    : <span className="ck0" />;
  const labelled = (e: Entry) => <>{e.label && <><b>{e.label}</b> </>}{e.nolink ? linkify(td(e.detail)) : link(td(e.detail), e.detail)}</>;
  const spellLoc = (e: Entry) => <><b>{link(td(e.detail), e.detail)}</b>{e.how && <> · {linkify(td(e.how))}</>}<Tags e={e} /></>;

  /* ----- vue par rubrique ----- */
  const piece = (e: Entry) => (
    <li key={e.key} className={doneCls('pc', e)}>{ck(e)}<span className="pc-t">{labelled(e)}</span><Tags e={e} /><Pdet e={e} /></li>
  );
  const row = (items: Entry[], name: string) => {
    const first = items[0];
    const nm = <><span className="txt">{nameLink(first, td(name))}</span>{badge(first)}</>;
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
  const spell = (s: string, hit = false) => inLink(s, s, 'Sorts', 'sp in' + (hit ? ' hit' : '')) ?? <span className={'sp' + (hit ? ' hit' : '')}>{s}</span>;
  const rune = (e: Entry) => (
    <section key={e.key} className={doneCls('rune', e)}>
      <div className="rh">{ck(e)}<h3 className="txt">{e.name.replace('Palier ', '')}</h3>{e.tier === 5 && <span className="badge">{t('cls.ext')}</span>}<span className="mono">{t('cls.nSpells', { n: e.spells!.length })}</span></div>
      <div className="sps">{e.spells!.map(s => <Fragment key={s}>{spell(s, !!q && s.toLowerCase().includes(q))}</Fragment>)}</div>
      <p className="loc">{spellLoc(e)}</p>
      <Pdet e={e} />
    </section>
  );
  function viewTab() {
    if (S.tab === 'spells') {
      const es = list.filter(e => e.tab === 'spells');
      return <>
        <p className="note">{t('cls.runesNote', { rune: d.rune })}{(d.runes?.length ?? 0) > 5 && t('cls.shadowNote')}</p>
        {es.length ? <div className="runes">{es.map(rune)}</div> : none()}
      </>;
    }
    const tab = S.tab, es = list.filter(e => e.tab === tab);
    const groups = TAB_GROUPS[tab].map(g => [g, es.filter(e => e.group === g)] as const).filter(g => g[1].length);
    return <>
      {tab === 'armor' && d.note && <p className="note">{linkify(td(d.note))}</p>}
      {tab === 'wpn' && d.wnote && <p className="note">{linkify(td(d.wnote))}</p>}
      {groups.map(([g, ge]) => {
        const rows: { name: string; items: Entry[] }[] = [];
        ge.forEach(e => { const last = rows[rows.length - 1]; if (last && last.name === e.name) last.items.push(e); else rows.push({ name: e.name, items: [e] }); });
        return <div key={g}><h2 className="grp">{td(g)}<span className="mono">{ge.length}</span></h2><ul className="its">{rows.map(r => row(r.items, r.name))}</ul></div>;
      })}
      {!groups.length && !(d.wnote && tab === 'wpn') && none()}
    </>;
  }

  /* ----- vue par région ----- */
  const flat = (e: Entry) => (
    <li key={e.key} className={doneCls('it', e)}>
      <div className="nm">{ck(e)}<span className="kd">{td(e.kind)}</span><span className="txt">{nameLink(e)}</span>{badge(e)}</div>
      {e.kind === 'Sorts'
        ? <><div className="sps">{e.spells!.map(s => <Fragment key={s}>{spell(s)}</Fragment>)}</div><span className="loc">{spellLoc(e)}</span></>
        : <span className="loc">{labelled(e)}<Tags e={e} /></span>}
      <Pdet e={e} />
    </li>
  );
  const grp = (z: string, n: number) => <h2 className="grp">{td(ZL[z])}<span className="mono">{n}</span></h2>;
  const viewZones = () => list.length ? byZone(list).map(([z, es]) => <div key={z}>{grp(z, es.length)}<ul className="its">{es.map(flat)}</ul></div>) : none();
  const viewPlaces = () => list.length ? byZone(list).map(([z, es]) => {
    const pl: Record<string, Entry[]> = {}, order: string[] = [];
    es.forEach(e => { const k = placeOf(e); if (!pl[k]) { pl[k] = []; order.push(k); } pl[k].push(e); });
    order.sort((a, b) => pl[b].length - pl[a].length);
    return (
      <div key={z}>{grp(z, es.length)}
        {order.map(k => <div key={k}><h3 className="plc">{linkify(k)}{pl[k].length > 1 && <span className="mono">{t('cls.nItems', { n: pl[k].length })}</span>}</h3><ul className="its">{pl[k].map(flat)}</ul></div>)}
      </div>
    );
  }) : none();

  /* ----- panneau de filtres et progression ----- */
  const st: Record<string, { tot: number; dn: number }> = {}, tc: Record<string, number> = {};
  let tot = 0, dn = 0;
  ENTS.forEach(e => {
    const s = st[e.zone] ??= { tot: 0, dn: 0 };
    if (e.check) { s.tot++; tot++; if (done(e)) { s.dn++; dn++; } }
    tc[e.obt] = (tc[e.obt] || 0) + 1;
  });
  const zones: [string, string, string | number][] = [['all', t('f.all'), ENTS.length], ...Object.keys(st).sort((a, b) => ZO[a] - ZO[b]).map((z): [string, string, string] => [z, td(ZL[z]), st[z].tot ? st[z].dn + '/' + st[z].tot : '·'])];
  const types: [string, string, number][] = [['all', t('cls.allTypes'), ENTS.length], ...F.OBT.filter(o => tc[o[0]]).map((o): [string, string, number] => [o[0], td(o[1]), tc[o[0]]])];
  const names = (tab: Tab) => new Set(ENTS.filter(e => e.tab === tab).map(e => e.name)).size;
  const tabs: [Tab, number][] = [['armor', names('armor')], ['wpn', names('wpn')]];
  if (d.runes) tabs.push(['spells', nSpells(d)]);
  const reset = () => { if (S.rs) { F.reset(id); set({ rs: false }); setRev(r => r + 1); } else set({ rs: true }); };

  const i = x.order, prev = C[(i + C.length - 1) % C.length], next = C[(i + 1) % C.length];
  const nav = (to: string) => (ev: MouseEvent) => { ev.preventDefault(); location.replace('#' + to); };

  return (
    <div className="fiche"><div className="wrap">
      {back}
      <div style={{ '--fam': famVar(x), display: 'flex', flexDirection: 'column', gap: 24 } as CSSProperties}>
        <header className="hero">
          <div className="hero-id">
            <span className="tag">{td(FAM[x.fam])}</span><h1>{x.name}</h1><p className="blurb">{linkify(td(x.blurb), x.name)}</p>
            <dl className="facts">
              <dt>{t('f.start')}</dt><dd>{linkify(x.region)}, {linkify(td(x.place))}</dd><dt>{t('f.level')}</dt><dd className="mono">{x.lvl}</dd><dt>{t('f.keyStats')}</dt><dd className="mono">{td(x.prim)}</dd>
              {x.dmg ? <><dt>{t('f.dmg')}</dt><dd>{td(x.dmg)}{x.theme && ' · ' + td(x.theme)}</dd></> : x.theme && <><dt>{t('f.theme')}</dt><dd>{td(x.theme)}</dd></>}
              {x.armor && <><dt>{t('f.armor')}</dt><dd>{td(x.armor)}</dd></>}
            </dl>
            <p className="maps"><a className="wk" href={MAP_URL.mod} {...EXT}>{t('cls.modMap')}</a><a className="wk" href={MAP_URL.wiki} {...EXT}>{t('cls.modWiki')}</a></p>
          </div>
          <aside className="panel">
            <h2>{t('f.start')}</h2><Bars x={x} />
            <p className="kit"><span><b>{t('f.kit')}</b> {linkify(kitList(x))}</span><span><b>{t('f.set')}</b> {linkify(d.set)}</span>{x.spells && <span><b>{t('f.spells')}</b> {linkify(x.spells.join(' · '))}</span>}</p>
          </aside>
        </header>

        {b && <section className="build" aria-labelledby="play">
          <h2 id="play" className="sec">{t('cls.play', { name: x.name })}</h2>
          <div className="panel">
            <span className="eyebrow">{t('cls.stats')}</span><p className="lead">{gl(td(b.stats))}</p>
            <span className="eyebrow">{t('cls.route')}</span>
            <ol className="plan">{b.plan.map((p, i) => <li key={i}><b>{t('cls.phase.' + i)}</b>{gl(td(p))}</li>)}</ol>
          </div>
          <div className="prog-top"><span className="eyebrow">{t('cls.tal')}</span><span className="mono">{talDone} / {b.tal.length}</span></div>
          <div className="bgrid">
            {[false, true].map(alt => (
              <div key={String(alt)} className="panel">
                <h3 className="tal-h">{t(alt ? 'cls.talAlt' : 'cls.talCore')}</h3>
                <ul className="tals">{b.tal.filter(x => !!x[2] === alt).map(([n, why]) => {
                  const k = { key: 'tal|' + n }, on = F.isDone(id, k), [fx, where] = B.TAL[n];
                  return <li key={n} className={on ? 'done' : ''}>
                    <input type="checkbox" className="ckb" checked={on} onChange={ev => { F.setDone(id, k, ev.target.checked); setRev(r => r + 1); }} aria-label={t('cls.got', { name: n })} />
                    <div>
                      <span className="txt">{inLink(n, n) ?? link(n, n)}</span>
                      <p className="why">{gl(td(why))}</p>
                      <span className="loc">{gl(td(fx))} · <i>{linkify(td(where))}</i></span>
                    </div>
                  </li>;
                })}</ul>
              </div>
            ))}
          </div>
          <span className="eyebrow">{t('cls.combos')}</span>
          <div className="combos">{b.combo.map(([title, items, why]) => (
            <article key={title} className="combo">
              <h3>{td(title)}</h3>
              <div className="sps">{items.split(' + ').map(s => <span key={s} className="sp">{inLink(s, s) ?? link(s, s)}</span>)}</div>
              <p className="loc">{gl(td(why))}</p>
            </article>
          ))}</div>
          <p className="note">{t('cls.buildNote')}</p>
        </section>}

        <h2 className="sec">{t('cls.collect')}</h2>
        <section className="locate" aria-label={t('cls.where')}>
          <div className="panel filt">
            <div>
              <div className="prog-top"><b>{t('cls.progress', { dn, tot })}</b><button className="link" onClick={reset}>{S.rs ? t('cls.confirmReset') : t('cls.reset')}</button></div>
              <div className="pbar"><i style={{ width: (tot ? dn / tot * 100 : 0) + '%' }} /></div>
              <label className="opt"><input type="checkbox" className="ckb" checked={S.hide} onChange={e => set({ hide: e.target.checked })} /> {t('cls.hideDone')}</label>
            </div>
            <div><span className="eyebrow">{t('cls.zones')}</span><div className="chips" role="group" aria-label={t('cls.filterZone')}>
              {zones.map(z => <button key={z[0]} className="chip" aria-pressed={S.z === z[0]} onClick={() => set({ z: z[0] })}>{z[1]}<span className="n mono">{z[2]}</span></button>)}
            </div></div>
            <div><span className="eyebrow">{t('cls.obtType')}</span><div className="chips" role="group" aria-label={t('cls.filterObt')}>
              {types.map(o => <button key={o[0]} className="chip" aria-pressed={S.t === o[0]} onClick={() => set({ t: o[0] })}>{o[1]}<span className="n mono">{o[2]}</span></button>)}
            </div></div>
          </div>
        </section>

        <div className="bar-sticky"><div className="tools">
          <div className="seg" role="group" aria-label={t('cls.listOrg')}>
            {VIEWS.map(v => <button key={v} aria-pressed={S.v === v} onClick={() => set({ v })}>{t('cls.views.' + v)}</button>)}
          </div>
          <div className="seg" role="group" aria-label={t('cls.sections')} hidden={S.v !== 'tab'}>
            {tabs.map(([k, n]) => <button key={k} aria-pressed={S.tab === k} onClick={() => set({ tab: k })}>{t('cls.tabs.' + k)}<span className="cnt">{n}</span></button>)}
          </div>
          <input type="search" placeholder={t('cls.search')} aria-label={t('cls.search')} value={S.q} onChange={e => set({ q: e.target.value })} />
        </div></div>

        <main>{S.v === 'zone' ? viewZones() : S.v === 'place' ? viewPlaces() : viewTab()}</main>

        <nav className="pager" aria-label={t('cls.others')}>
          <a href={'#' + prev.id} onClick={nav(prev.id)}>← {prev.name}</a><a href={'#' + next.id} onClick={nav(next.id)}>{next.name} →</a>
        </nav>
        <footer><Trans i18nKey="cls.footer" components={{ site: <a href="https://www.convergencemod.com/classes/" {...EXT} />, wiki: <a href="https://wiki.convergencemod.com/" {...EXT} /> }} /></footer>
      </div>
    </div></div>
  );
}
