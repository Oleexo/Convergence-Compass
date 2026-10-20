/* Zones : ordre de progression, libellés et classement des lieux par mots-clés.
   Classement fait de mémoire puis vérifié sur le wiki quand c'était possible ; 'unk' = zone à préciser. */
var LIST: [string, string][] = [
  ['limgrave', 'Limgrave'], ['weeping', 'Weeping Peninsula'], ['liurnia', 'Liurnia'], ['caelid', 'Caelid'],
  ['altus', 'Altus Plateau'], ['gelmir', 'Mt. Gelmir'], ['leyndell', 'Leyndell & Capital Outskirts'], ['under', 'Souterrains'],
  ['mount', 'Mountaintops of the Giants'], ['snow', 'Consecrated Snowfield'], ['hali', 'Haligtree & Elphael'],
  ['farum', 'Crumbling Farum Azula'], ['dlc', 'Shadow of the Erdtree'], ['round', 'Roundtable Hold'],
  ['quest', 'PNJ, boss & quêtes'], ['unk', 'Zone à préciser']
];
/* Atomes entiers dont le classement est connu avec certitude. */
var EXACT: Record<string, string> = {
  'sur le corps de d': 'limgrave', 'après dakk': 'quest', 'après ensha': 'round', 'après draconic tree sentinel': 'altus',
  'castle front': 'unk', 'au sud de la grâce castle front': 'unk', 'weeping harborage': 'unk', 'à l\'ouest de scenic isle': 'unk', 'sanctum undercroft': 'unk',
  'butin de festering fingerprint vyke': 'liurnia', 'butin de roundtable knight vyke': 'mount'
};
/* Préfixe de région explicite : « Liurnia, Rose Church ». */
var PREFIX: [string, string][] = [
  ['limgrave,', 'limgrave'], ['liurnia,', 'liurnia'], ['caelid,', 'caelid'], ['weeping peninsula,', 'weeping'], ['altus plateau,', 'altus'],
  ['mt. gelmir,', 'gelmir'], ['mountaintops of the giants,', 'mount'], ['consecrated snowfield,', 'snow'], ['crumbling farum azula', 'farum'],
  ['farum azula', 'farum'], ['miquella\'s haligtree', 'hali'], ['elphael', 'hali'], ['volcano manor', 'gelmir'],
  ['cerulean coast,', 'dlc'], ['scadu altus,', 'dlc'], ['hinterlands,', 'dlc'], ['shadow keep', 'dlc'], ['leyndell', 'leyndell']
];
/* Suffixe de région : « Tibia Mariner, Altus », « Night's Cavalry de Limgrave ». */
var SUFFIX: [string, string][] = [
  ['east liurnia', 'liurnia'], ['liurnia', 'liurnia'], ['limgrave', 'limgrave'], ['caelid', 'caelid'], ['altus', 'altus'],
  ['mountaintops', 'mount'], ['weeping peninsula', 'weeping'], ['consecrated snowfield', 'snow']
];
var RULES: [string, string[]][] = [
  ['dlc', ['shadow keep', 'scadu altus', 'cerulean coast', 'hinterlands', 'belurat', 'enir', 'finger ruins of', 'cathedral of manus', 'rauh', 'ruins of unte', 'charo', 'jarburg', 'abyssal woods', 'lamenter', 'bonny gaol', 'garden of deep purple', 'promised consort', 'messmer', 'thiollier', 'midra', 'hornsent', 'swordhand of night', 'ansbach', 'moore', 'nameless mausoleum', 'temple town ruins', 'count ymir', 'church of benediction', 'abandoned church', 'moorth ruins']],
  ['round', ['enia', 'roundtable hold', 'acheté après', 'twin maiden']],
  ['quest', ['invasion', 'butin d\'istvan', 'obtenue en convertissant', 'dakk', 'sigur', 'devonia', 'rugalea', 'ralva', 'shabriri', 'bridge of iniquity', 'gateway to the forge', 'seki', 'juno hoslow', 'butin de blaidd', 'eleonora', 'quête', 'donné par', 'en aidant', 'vendu par patches', 'tableau', 'fin de la quête', 'frenzied flame proscription']],
  ['farum', ['farum azula', 'seera']],
  ['hali', ['haligtree', 'elphael']],
  ['snow', ['consecrated snowfield', 'hidden path to the haligtree', 'yelough', 'sanctum of eiglay', 'ordina', 'albinauric rise', 'grave warden duelist', 'cave of the forlorn']],
  ['mount', ['mountaintops', 'giant-conquering', 'guardian', 'castle sol', 'forbidden lands', 'stargazers', 'church of repose', 'spiritcaller cave', 'spirit caller cave', 'lord contender', 'giant\'s mountaintops', 'fire giant', 'borealis', 'black blade kindred', 'commander niall', 'après niall', 'zamor ruins']],
  ['under', ['siluria', 'siofra', 'ainsel', 'nokron', 'deeproot', 'lake of rot', 'mohgwyn', 'mohg\'s', 'subterranean shunning', 'dragonkin soldier']],
  ['leyndell', ['fell twins', 'leyndell', 'erdtree sanctuary', 'fortified manor', 'queen\'s bedchamber', 'sealed tunnel']],
  ['gelmir', ['fort laiedd', 'gelmir', 'volcano', 'seethewater', 'craftsman', 'frenzied flame camp', 'temple of eiglay', 'hermit village']],
  ['altus', ['elemer', 'altus', 'dominula', 'windmill', 'woodfolk', 'rampartside', 'minor erdtree church', 'shaded castle', 'writheblood', 'unsightly', 'sainted hero', 'auriza', 'mirage rise', 'second church of marika', 'stormcaller church', 'highway lookout', 'tree sentinel', 'lift of rold', 'sage\'s cave', 'fallingstar beast du', 'old altus', 'perfumer\'s ruins', 'perfumer\'s grotto', 'perfumer grotto', 'fourth church', 'wyndham', 'golden lineage']],
  ['caelid', ['redmane', 'fort gael', 'gael tunnel', 'fort faroth', 'commander o\'neil', 'caelid', 'caelem', 'dragonbarrow', 'gaol cave', 'swamp of aeonia', 'swamp lookout', 'smoldering', 'divine tower of caelid', 'gowry', 'waypoint ruins', 'minor erdtree catacombs', 'abandoned cave', 'radahn', 'war-dead', 'sellia', 'impaler']],
  ['weeping', ['weeping', 'witchbane', 'forest lookout', 'castle morne', 'morne', 'tombsward', 'earthbore', 'crater-pocked', 'church of pilgrimage', 'ailing village']],
  ['limgrave', ['bernahl', 'great horned tragoth', 'limgrave', 'stormveil', 'stormhill', 'stormfoot', 'groveside', 'gatefront', 'agheel', 'murkwater', 'coastal cave', 'fringefolk', 'third church of marika', 'forlorn hound', 'deathtouched', 'highroad cave', 'fort haight', 'chapel of anticipation', 'mistwood', 'warmaster', 'carriage en limgrave', 'cimetière au nord de stormveil', 'summonwater', 'necromancer domo']],
  ['liurnia', ['liurnia', 'academy', 'raya lucaria', 'caria', 'carian', 'ranni', 'rose church', 'uld palace', 'converted fringe', 'church of inhibition', 'cliffbottom', 'lakeside', 'malefactor', 'royal grave', 'road\'s end', 'black knife', 'kingsrealm', 'four belfries', 'renna\'s rise', 'rogier', 'moongrum', 'azur', 'main academy', 'cuckoo evergaol', 'cave of knowledge', 'chelona', 'stillwater', 'heretical rise', 'temple quarter', 'ruin-strewn', 'east liurnia', 'tour accessible', 'blaidd', 'pidia', 'edgar', 'three sisters', 'bellum', 'church of vows', 'slumbering wolf', 'artist', 'death bird en liurnia']]
];
function zoneOf(atom: string): string | null {
  var a = atom.toLowerCase().trim(), i, j;
  if (EXACT[a]) return EXACT[a];
  for (i = 0; i < PREFIX.length; i++) if (a.indexOf(PREFIX[i][0]) === 0) return PREFIX[i][1];
  for (i = 0; i < SUFFIX.length; i++) { var s = SUFFIX[i][0]; if (a.length > s.length && a.slice(-s.length) === s && /[,\s]/.test(a.charAt(a.length - s.length - 1))) return SUFFIX[i][1]; }
  for (i = 0; i < RULES.length; i++) { var ks = RULES[i][1]; for (j = 0; j < ks.length; j++) if (a.indexOf(ks[j]) > -1) return RULES[i][0]; }
  return null;
}
var api = { list: LIST, zoneOf: zoneOf };
export default api;
