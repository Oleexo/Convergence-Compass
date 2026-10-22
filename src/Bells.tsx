import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { EXT } from './ItemView';

const WIKI = 'https://wiki.convergencemod.com/index.php?title=Upgrade_Materials';

/** [location key, bearing name, region, items it unlocks: [name, upgrade cap]]. From the mod wiki's Upgrade Materials page. */
type Bell = [string, string, string, [string, number?][]];
const GROUPS: [string, Bell[]][] = [
  ['smithing', [
    ['sm1', "Smithing-Stone Miner's Bell Bearing [1]", 'Liurnia', [['Smithing Stone', 3], ['Glintstone Scrap']]],
    ['sm2', "Smithing-Stone Miner's Bell Bearing [2]", 'Altus Plateau', [['Large Smithing Stone', 6], ['Explosive Stone']]],
    ['sm3', "Smithing-Stone Miner's Bell Bearing [3]", 'Mountaintops of the Giants', [['Great Smithing Stone', 9]]],
    ['sm4', "Smithing-Stone Miner's Bell Bearing [4]", 'Crumbling Farum Azula', [['Ancient Smithing Stone', 10], ['Ruin Fragment']]],
  ]],
  ['somber', [
    ['so1', "Somber Stone Miner's Bell Bearing [1]", 'Caelid', [['Somber Stone', 3]]],
    ['so2', "Somber Stone Miner's Bell Bearing [2]", 'Altus Plateau', [['Large Somber Stone', 5], ['Cracked Crystal']]],
    ['so3', "Somber Stone Miner's Bell Bearing [3]", 'Mountaintops of the Giants', [['Great Somber Stone', 7]]],
    ['so4', "Somber Stone Miner's Bell Bearing [4]", 'Crumbling Farum Azula', [['Colossal Somber Stone', 9], ['Sanctuary Stone']]],
    ['so5', "Somber Stone Miner's Bell Bearing [5]", 'Crumbling Farum Azula', [['Ancient Somber Stone', 10]]],
  ]],
  ['shadow', [
    ['sh1', 'Shadow Stone Bell Bearing [1]', 'Rauh Base', [['Shadow Smithing Stone', 12]]],
    ['sh2', 'Shadow Stone Bell Bearing [2]', 'Scadu Altus', [['Large Shadow Smithing Stone', 14]]],
    ['sh3', 'Shadow Stone Bell Bearing [3]', 'Jagged Peak', [['Primordial Shadow Smithing Stone', 15]]],
  ]],
  ['somberShadow', [
    ['ss1', 'Somber Shadow Stone Bell Bearing [1]', 'Shadow Keep', [['Somber Shadow Stone', 11], ['Large Somber Shadow Stone', 12]]],
    ['ss2', 'Somber Shadow Stone Bell Bearing [2]', 'Ancient Ruins of Rauh', [['Great Somber Shadow Stone', 13], ['Colossal Somber Shadow Stone', 14]]],
    ['ss3', 'Somber Shadow Stone Bell Bearing [3]', 'Enir-Ilim', [['Primordial Somber Shadow Stone', 15]]],
  ]],
];

export default function Bells() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('bells.docTitle'); }, [t]);
  return (
    <div className="items"><div className="wrap">
      <a className="back" href="#">{t('bells.back')}</a>
      <header className="mast">
        <span className="eyebrow">{t('home.eyebrow')}</span>
        <h1>{t('bells.title')}</h1>
        <p>{t('bells.intro')}</p>
      </header>

      {GROUPS.map(([g, bells]) => <section key={g}>
        <h2 className="sub">{t('bells.group.' + g)}</h2>
        <ul className="pieces">
          {bells.map(([k, name, region, items]) => <li key={k}>
            <span><b>{name}</b> <span className="src">· {region}</span></span>
            <span>{t('bells.loc.' + k)}</span>
            <span className="ob">{t('bells.unlocks')} {items.map(([n, cap], i) => <span key={n}>{i > 0 && ', '}<b>{n}</b>{cap && ' (' + t('bells.upTo', { n: cap }) + ')'}</span>)}</span>
          </li>)}
        </ul>
      </section>)}

      <footer><Trans i18nKey="bells.footer" components={{ wiki: <a href={WIKI} {...EXT} /> }} /></footer>
    </div></div>
  );
}
