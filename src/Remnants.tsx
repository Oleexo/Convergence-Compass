import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { EXT } from './ItemView';
import { wikiUrl } from './data/items';
import { linkify } from './Links';

const WIKI = 'https://wiki.convergencemod.com/index.php?title=Talisman';

/** [location key, region, place]. From the mod wiki's page for each remnant (its "Detailed Locations"). */
type Spot = [string, string, string];
const LI = 'Liurnia of the Lakes', WP = 'Weeping Peninsula', DB = 'Dragonbarrow', AP = 'Altus Plateau', LR = 'Leyndell, Royal Capital', MG = 'Mt. Gelmir',
  FA = 'Crumbling Farum Azula', SR = 'Siofra River', GP = 'Gravesite Plains', SA = 'Scadu Altus', RB = 'Rauh Base', RL = 'Academy of Raya Lucaria';
/** [group key, the remnant's page on the mod wiki, where to find it]. */
const GROUPS: [string, string, Spot[]][] = [
  ['combat', 'Combat Remnant', [
    ['c1', 'Limgrave', 'Murkwater Catacombs'], ['c2', 'Limgrave', 'Highroad Cave'], ['c3', 'Limgrave', 'Mistwood Ruins'], ['c4', 'Limgrave', 'Stormhill'],
    ['c5', 'Limgrave', "Fringefolk Hero's Grave"], ['c6', WP, 'Weeping Evergaol'], ['c7', WP, 'Morne Tunnel'], ['c8', LI, 'Laskyar Ruins'],
    ['c9', LI, 'Black Knife Catacombs'], ['c10', LI, 'Moonlight Altar'], ['c11', LI, 'Village of the Albinaurics'], ['c12', LI, 'Jarburg'],
    ['c13', 'Caelid', 'Northern Caelid'], ['c14', 'Caelid', 'Caelid Catacombs'], ['c15', DB, 'Dragonbarrow Cave'], ['c16', DB, 'Bestial Sanctum'],
    ['c17', AP, 'Lux Ruins'], ['c18', AP, 'Highway Junction Campsite'], ['c19', AP, "Auriza Hero's Grave"], ['c20', LR, 'Avenue Balcony'],
    ['c21', LR, 'Royal Colosseum'], ['c22', MG, 'Wyndham Catacombs'], ['c23', MG, 'Volcano Manor'], ['c24', MG, 'Subterranean Inquisition Chamber'],
    ['c25', MG, 'Hermit Village'], ['c26', FA, 'Dragon Temple Rooftops'], ['c27', "Miquella's Haligtree", 'Elphael, Brace of the Haligtree'], ['c28', SR, 'Ancestral Woods'],
    ['c29', GP, 'Burnt Ruins'], ['c30', GP, 'Castle Ensis'], ['c31', SA, 'Moorth Ruins'], ['c32', SA, 'Ruined Forge of Starfall Past'],
    ['c33', SA, 'Church of the Crusade'], ['c34', SA, 'Highroad Cross'], ['c35', 'Cerulean Coast', 'Garden of Deep Purple'], ['c36', RB, 'Temple Town Ruins'],
    ['c37', 'Ancient Ruins of Rauh', 'Ancient Ruins of Rauh'],
  ]],
  ['enchanted', 'Enchanted Remnant', [
    ['e1', 'Limgrave', 'Summonwater Village'], ['e2', 'Limgrave', 'Sellen'], ['e3', 'Limgrave', 'Stormveil Castle'], ['e4', LI, 'Carian Study Hall'],
    ['e5', LI, 'Lunar Estate Ruins'], ['e6', LI, 'Mausoleum Compound'], ['e7', LI, RL], ['e8', LI, RL], ['e9', LI, 'Caria Manor'],
    ['e10', DB, 'Bestial Sanctum'], ['e11', AP, 'Altus Highway Junction'], ['e12', AP, 'Road to the Shaded Castle'], ['e13', AP, "Sage's Cave"],
    ['e14', FA, 'Beside the Great Bridge'], ['e15', SR, 'Hallowhorn Grounds'], ['e16', SR, 'Below the Well'], ['e17', SR, 'Siofra River'],
    ['e18', 'Ainsel River', 'Nokstella, Eternal City'], ['e19', GP, 'Fog Rift Catacombs'], ['e20', 'Belurat, Tower Settlement', 'Stagefront'],
    ['e21', SA, 'Cathedral of Manus Metyr'], ['e22', RB, 'Scorpion River Catacombs'], ['e23', 'Abyssal Woods', 'Darklight Catacombs'],
  ]],
  ['heirloom', 'Heirloom Remnant', [
    ['h1', WP, 'Demi-Human Forest Ruins'], ['h2', WP, 'Earthbore Cave'], ['h3', LI, 'Black Knife Catacombs'], ['h4', LI, 'Cliffbottom Catacombs'],
    ['h5', LI, 'Purified Ruins'], ['h6', LI, 'Village of the Albinaurics'], ['h7', LI, RL], ['h8', DB, 'Bestial Sanctum'],
    ['h9', 'Caelid', 'Church of the Plague'], ['h10', 'Caelid', 'Sellia, Town of Sorcery'], ['h11', AP, 'Dominula, Windmill Village'], ['h12', AP, 'Old Altus Tunnel'],
    ['h13', AP, 'Wyndham Ruins'], ['h14', LR, 'Divine Bridge'], ['h15', MG, 'Fort Laiedd'], ['h16', MG, 'Volcano Manor'],
    ['h17', FA, "Dragonlord's Annex"], ['h18', SR, 'Siofra River'],
  ]],
  ['warding', 'Warding Remnant', [
    ['w1', 'Limgrave', 'Cave of Knowledge'], ['w2', 'Limgrave', 'Stormveil Castle'], ['w3', WP, 'Witchbane Ruins'], ['w4', LI, "Cuckoo's Evergaol"],
    ['w5', LI, RL], ['w6', LI, 'Caria Manor'], ['w7', 'Caelid', 'Abandoned Cave'], ['w8', DB, 'Fort Faroth'],
    ['w9', 'Caelid', 'Sellia Crystal Tunnel'], ['w10', 'Caelid', 'Redmane Castle'], ['w11', AP, 'Golden Lineage Evergaol'], ['w12', AP, "Perfumer's Ruins"],
    ['w13', LR, 'Avenue Balcony'], ['w14', AP, 'Divine Tower of East Altus'], ['w15', LR, 'Subterranean Shunning-Grounds'], ['w16', MG, 'Volcano Manor'],
    ['w17', 'Consecrated Snowfield', 'Consecrated Snowfield Catacombs'], ['w18', 'Consecrated Snowfield', 'Hidden Path to the Haligtree'], ['w19', FA, "Dragon's Rest"],
    ['w20', SR, 'Siofra River'], ['w21', SR, 'Siofra River Bank'], ['w22', 'Ainsel River', 'Ainsel River Downstream'], ['w23', SA, 'Shadow Keep'],
    ['w24', RB, 'Ancient Ruins Base'], ['w25', 'Ancient Ruins of Rauh', 'Ancient Ruins of Rauh'], ['w26', RB, 'Ruins of Unte'],
  ]],
  ['faint', 'Faint Remnant', [
    ['f1', 'Limgrave', 'Stormveil Castle'], ['f2', WP, 'Castle Morne'], ['f3', LI, RL], ['f4', LI, 'Caria Manor'],
    ['f5', DB, 'Bestial Sanctum'], ['f6', 'Caelid', 'Heart of Aeonia'], ['f7', SR, 'Nokron, Eternal City'], ['f8', SR, 'Siofra River Bank'],
  ]],
  ['shimmering', 'Shimering Remnant', [
    ['s1', 'Limgrave', 'Stormveil Castle'], ['s2', WP, 'Castle Morne'], ['s3', LI, RL], ['s4', LI, 'Caria Manor'],
    ['s5', DB, 'Bestial Sanctum'], ['s6', 'Caelid', 'Redmane Castle'], ['s7', MG, 'Volcano Manor'],
  ]],
  ['glowing', 'Glowing Remnant', [
    ['g1', LI, 'Gate Town North'], ['g2', 'Caelid', 'Astel, Naturalborn of the Void'], ['g3', DB, 'Bestial Sanctum'], ['g4', 'Caelid', 'Redmane Castle'],
    ['g5', LR, 'Elden Throne'], ['g6', MG, 'Volcano Manor'], ['g7', 'Mountaintops of the Giants', 'Foot of the Forge'], ['g8', SR, 'Great Waterfall Basin'],
  ]],
  ['shining', 'Shining Remnant', [
    ['x1', DB, 'Bestial Sanctum'], ['x2', FA, 'Beside the Great Bridge'], ['x3', FA, "Dragonlord's Annex"], ['x4', "Miquella's Haligtree", 'Haligtree Roots'],
    ['x5', 'Ainsel River', 'Grand Cloister'], ['x6', 'Deeproot Depths', "Prince of Death's Throne"], ['x7', 'Mohgwyn Palace', 'Cocoon of the Empyrean'],
  ]],
];

export default function Remnants() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('remnants.docTitle'); }, [t]);
  return (
    <div className="items"><div className="wrap">
      <a className="back" href="#">{t('remnants.back')}</a>
      <header className="mast">
        <span className="eyebrow">{t('home.eyebrow')}</span>
        <h1>{t('remnants.title')}</h1>
        <p>{t('remnants.intro')}</p>
      </header>

      {GROUPS.map(([g, page, spots]) => <section key={g}>
        <h2 className="sub"><a href={wikiUrl(page)} {...EXT}>{t('remnants.group.' + g)}</a> <span className="src">· {t('remnants.count', { count: spots.length })}</span></h2>
        <p className="ob">{t('remnants.crafts.' + g)}</p>
        <ul className="pieces">
          {spots.map(([k, region, place]) => <li key={k}>
            <span><b>{linkify(place)}</b>{place !== region && <span className="src"> · {linkify(region)}</span>}</span>
            <span>{linkify(t('remnants.loc.' + k))}</span>
          </li>)}
        </ul>
      </section>)}

      <footer><Trans i18nKey="remnants.footer" components={{ wiki: <a href={WIKI} {...EXT} /> }} /></footer>
    </div></div>
  );
}
