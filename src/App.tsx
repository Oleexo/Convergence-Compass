import { useEffect, useRef, useState } from "react";
import Home from './Home';
import Classe from './Classe';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Bells from './Bells';
import Remnants from './Remnants';
import { useTranslation } from 'react-i18next';
import { LANGS } from './i18n';

const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
const hashRaw = () => location.hash.replace(/^#/, '');

// Routes: "#" → comparatif, "#items" → base d'objets, "#item/<type>/<nom>" → page d'un objet, "#bells" → bell bearings, "#remnants" → remnants, "#<id>" → fiche de la classe.
export default function App() {
  const [raw, setRaw] = useState(hashRaw);
  const [seenItems, setSeenItems] = useState(false);
  const itemsY = useRef(0); // scroll position of the item list, restored when coming back from an item page
  const rawRef = useRef(raw);
  useEffect(() => {
    const on = () => {
      const was = rawRef.current, now = hashRaw();
      if (was === 'items') itemsY.current = window.scrollY;
      rawRef.current = now;
      setRaw(now);
      if (now === 'items' && was.startsWith('item/')) requestAnimationFrame(() => window.scrollTo(0, itemsY.current));
      else window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const item = raw.match(/^item\/([^/]+)\/(.+)$/);
  const id = item ? '' : dec(raw);
  const onItems = id === 'items';
  if (onItems && !seenItems) setSeenItems(true);
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className="lang" role="group" aria-label={t('lang.label')}>
        {LANGS.map(l => <button key={l} lang={l} aria-pressed={i18n.language === l} onClick={() => i18n.changeLanguage(l)}>{l.toUpperCase()}</button>)}
      </div>
      {/* Home and the item list stay mounted so filters, search and the comparison survive a visit to a fiche or an item page. */}
      <div hidden={!!raw}><Home active={!raw} /></div>
      {seenItems && <div hidden={!onItems}><Items active={onItems} /></div>}
      {item ? <ItemDetail key={raw} kind={dec(item[1])} name={dec(item[2])} /> : id === 'bells' ? <Bells /> : id === 'remnants' ? <Remnants /> : id && !onItems && <Classe key={id} id={id} />}
    </>
  );
}
