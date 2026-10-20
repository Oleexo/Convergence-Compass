/* Base d'objets (armes, boucliers, catalyseurs, armures, talismans, joyaux) générée depuis le wiki du mod par scripts/wiki-build.mjs. */
import index from './items-index.json';
export type ItemKind = 'weapon' | 'shield' | 'tool' | 'armor' | 'talisman' | 'jewel' | 'spell' | 'ash' | 'spirit' | 'consumable';
export type Num = number | string;
/** Valeurs par type de dégât : phy, mag, fire, ltn (foudre), hol (sacré) ; boost = amélioration de garde. */
export type ByDmg = Partial<Record<'phy' | 'mag' | 'fire' | 'ltn' | 'hol' | 'boost', Num>>;
export type ByStat = Partial<Record<'str' | 'dex' | 'int' | 'fth' | 'arc', Num>>;

export interface Piece { name: string; desc: string; effect: string; obtain?: string }
export interface Item {
  name: string; kind: ItemKind;
  /** Rubrique du wiki : type d'arme, classe d'une armure, catégorie de vestige… */
  type: string;
  weight?: Num; upgrade?: string; skill?: string; crit?: string; range?: Num;
  /** Sorts : coût en PC et emplacements de mémoire. Cendres d'esprit : malus à l'invocation et coût de base. */
  fp?: Num; slots?: Num; debuff?: string; cost?: string;
  dmg?: ByDmg; guard?: ByDmg; mul?: ByDmg; status?: Record<string, Num>; flags?: string[];
  req?: ByStat; scale?: ByStat;
  cls?: string; tier?: string;
  /** Marqué « Convergence Exclusive Content » sur le wiki : l'objet n'existe que dans le mod, donc pas de page dans les wikis du jeu de base. */
  mod?: boolean;
  /** Liens vers la carte interactive du mod (map.quack.boo) cités par la page du wiki. */
  map?: string[];
  desc?: string; fx?: string; obtain?: string; pieces?: Piece[]; incomplete?: boolean;
}

export const KINDS: ItemKind[] = ['weapon', 'shield', 'tool', 'armor', 'talisman', 'jewel', 'spell', 'ash', 'spirit', 'consumable'];
export const STAT_KEYS = ['str', 'dex', 'int', 'fth', 'arc'] as const;
export const DMG_KEYS = ['phy', 'mag', 'fire', 'ltn', 'hol'] as const;

/** English wiki line → French line (scripts/items-i18n.mjs). Fetched only when the interface is in French. */
export const loadFr = (): Promise<Record<string, string>> => import('./items.fr.json').then(m => m.default as Record<string, string>);

export const slug =(s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const wikiUrl = (name: string) => 'https://wiki.convergencemod.com/wiki/' + encodeURIComponent(name.replace(/ /g, '_'));
export const fextraUrl = (name: string) => 'https://eldenring.wiki.fextralife.com/' + encodeURIComponent(name).replace(/%20/g, '+');

let loaded: Promise<Item[]> | undefined;
/** Chargé à la demande (le JSON pèse environ 1 Mo, la page d'accueil n'en a pas besoin) puis gardé : la liste et les pages détail partagent la même promesse. */
export const loadItems = (): Promise<Item[]> => loaded ??= import('./items.json').then(m => (m.default as unknown as { items: Item[] }).items);

/* ----- Liens internes -----
   Les fiches de classe n'ont pas besoin des 1 Mo d'items.json : items-index.json (nom normalisé → [type, nom]) suffit pour savoir si un objet a sa page. */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '');
const INDEX = index as unknown as Record<string, [ItemKind, string][]>;
/** Noms écrits autrement sur les fiches de classe que sur le wiki (clé normalisée → nom du wiki). */
const ALIAS: Record<string, string> = {
  'carian knight sword': "Carian Knight's Sword",
  'palm-ax twinblade': 'Palm-Ax Twinblades',
  'scorpion stinger': "Scorpion's Stinger",
  'alabaster lords greatsword':"Alabaster Lord's Sword",
  'gaius set': "Gaius's Set",
  'hoslow set': "Hoslow's Set",
  'rakshasa set': "Rakshasa's Set",
  'blue and white wooden shield': 'Blue-White Wooden Shield',
  'man-serpent shield': "Man-Serpent's Shield",
};
/** Route d'une page détail : `#item/<type>/<nom>`. */
export const itemHash = (kind: ItemKind, name: string) => '#item/' + kind + '/' + encodeURIComponent(name);
/** Retrouve un objet par son nom ; `prefer` départage les noms portés par plusieurs types (une arme et un catalyseur, par exemple). */
export function findItem(name: string, prefer?: ItemKind): { kind: ItemKind; name: string } | null {
  const k = norm(name), hits = INDEX[norm(ALIAS[k] ?? name)];
  if (!hits) return null;
  const h = hits.find(x => x[0] === prefer) ?? hits[0];
  return { kind: h[0], name: h[1] };
}
/** Type attendu d'un objet selon la rubrique de la fiche de classe (le nom seul est ambigu : une arme et un catalyseur peuvent porter le même). */
export const PREFER_KIND: Record<string, ItemKind> = { Armure: 'armor', Départ: 'armor', Arme: 'weapon', Catalyseur: 'tool', Sorts: 'spell' };
