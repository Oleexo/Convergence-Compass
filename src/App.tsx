import { useEffect, useState } from "react";
import Home from './Home';
import Classe from './Classe';
import { useTranslation } from 'react-i18next';
import { LANGS } from './i18n';

const hashId = () => decodeURIComponent(location.hash.replace(/^#/, ''));

// Routes: "#" → comparatif, "#<id>" → fiche de la classe.
export default function App() {
  const [id, setId] = useState(hashId);
  useEffect(() => {
    const on = () => { setId(hashId()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className="lang" role="group" aria-label={t('lang.label')}>
        {LANGS.map(l => <button key={l} lang={l} aria-pressed={i18n.language === l} onClick={() => i18n.changeLanguage(l)}>{l.toUpperCase()}</button>)}
      </div>
      {/* Home stays mounted so filters and the comparison survive a visit to a fiche. */}
      <div hidden={!!id}><Home active={!id} /></div>
      {id && <Classe key={id} id={id} />}
    </>
  );
}
