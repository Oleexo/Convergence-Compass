import { useEffect, useMemo, useState } from 'react';
import CV from './data/classes';
import F from './data/fiche';
import { PREFER_KIND, findItem, fextraUrl, itemHash, loadItems, wikiUrl, type Item, type ItemKind } from './data/items';
import { EXT, ItemBody, useItemText } from './ItemView';

const MAP_URL = 'https://map.quack.boo/';

interface User { id: string; start: boolean }
let USERS: Map<string, User[]> | undefined;
/** Classes whose page lists the item (starting gear or gear to find), computed once from the class data. */
function usersOf(kind: ItemKind, name: string): User[] {
  if (!USERS) {
    USERS = new Map();
    for (const c of CV.C) {
      const seen = new Map<string, User>();
      for (const e of F.entries(c.id)) {
        for (const n of e.kind === 'Sorts' ? e.spells ?? [] : [e.name]) {
          const h = findItem(n, PREFER_KIND[e.kind]);
          if (!h) continue;
          const key = h.kind + '|' + h.name, u = seen.get(key);
          if (!u) { const nu = { id: c.id, start: e.obt === 'start' }; seen.set(key, nu); USERS.set(key, [...USERS.get(key) ?? [], nu]); }
          else if (e.obt === 'start') u.start = true;
        }
      }
    }
  }
  return USERS.get(kind + '|' + name) ?? [];
}

export default function ItemDetail({ kind, name }: { kind: string; name: string }) {
  const x = useItemText();
  const { t, typeLabel } = x;
  const [all, setAll] = useState<Item[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { loadItems().then(setAll, () => setFailed(true)); }, []);

  const same = useMemo(() => (all ?? []).filter(i => i.kind === kind).sort((a, b) => a.name.localeCompare(b.name)), [all, kind]);
  const at = same.findIndex(i => i.name === name);
  const it = same[at] as Item | undefined;
  useEffect(() => { document.title = (it?.name ?? (all ? t('item.notFound') : 'Convergence Compass')) + (it || all ? ' · Convergence Compass' : ''); }, [it, all, t]);

  const back = <a className="back" href="#items">{t('item.back')}</a>;
  if (!it) return <div className="items"><div className="wrap">{back}<p className="empty">{failed ? t('items.failed') : !all ? t('items.loading') : t('item.notFoundBody')}</p></div></div>;

  const prev = same[(at + same.length - 1) % same.length], next = same[(at + 1) % same.length];
  const users = usersOf(it.kind, it.name);
  const label = it.kind === 'jewel' ? it.cls : typeLabel(it.type);
  const link = (href: string, text: string, hint?: string) => <li key={href}><a className="wk" href={href} {...EXT}>{text} ↗</a>{hint && <span className="hint">{hint}</span>}</li>;

  return (
    <div className="items"><div className="wrap">
      {back}
      <header className="mast">
        <span className="eyebrow">{[t('items.kind.' + it.kind), label].filter(Boolean).join(' · ')}</span>
        <h1>{it.name}</h1>
        {it.mod && <p><span className="badge">{t('item.modOnly')}</span></p>}
      </header>

      <div className="idb-b item-page">
        <ItemBody it={it} x={x} />
        {it.incomplete && <p className="warn">⚠ {t('items.incomplete')}</p>}
      </div>

      {users.length > 0 && <section>
        <h2 className="sub">{t('item.classes')}</h2>
        <ul className="chips">
          {users.map(u => <li key={u.id}><a className="chip" href={'#' + u.id}>{CV.BY[u.id].name}{u.start && <span className="n">{t('item.startGear')}</span>}</a></li>)}
        </ul>
      </section>}

      <section>
        <h2 className="sub">{t('item.links')}</h2>
        <ul className="links">
          {link(wikiUrl(it.name), t('item.link.wiki'), t('item.hint.wiki'))}
          {!it.mod && link(fextraUrl(it.name), t('item.link.fextra'), t('item.hint.fextra'))}
          {it.map?.map((u, i) => link(u, t('item.link.map') + (it.map!.length > 1 ? ' ' + (i + 1) : ''), i === 0 ? t('item.hint.map') : undefined))}
          {!it.map && link(MAP_URL, t('item.link.mapGeneral'), t('item.hint.mapGeneral'))}
        </ul>
      </section>

      {same.length > 1 && <nav className="pager" aria-label={t('item.others')}>
        <a href={itemHash(prev.kind, prev.name)}>← {prev.name}</a><a href={itemHash(next.kind, next.name)}>{next.name} →</a>
      </nav>}
    </div></div>
  );
}
