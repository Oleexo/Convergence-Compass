import { useEffect, useState } from "react";
import Home from './Home';
import Classe from './Classe';

const hashId = () => decodeURIComponent(location.hash.replace(/^#/, ''));

// Routes: "#" → comparatif, "#<id>" → fiche de la classe.
export default function App() {
  const [id, setId] = useState(hashId);
  useEffect(() => {
    const on = () => { setId(hashId()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return (
    <>
      {/* Home stays mounted so filters and the comparison survive a visit to a fiche. */}
      <div hidden={!!id}><Home active={!id} /></div>
      {id && <Classe key={id} id={id} />}
    </>
  );
}
