export type Fam = 'martial' | 'sorcery' | 'incant' | 'special';
export interface Cls {
  id: string; name: string; fam: Fam; prim: string; dmg: string | null; theme: string | null; armor: string | null;
  region: string; place: string; lvl: number; s: number[]; kit: string[]; spells: string[] | null; blurb: string; order: number;
}
/** [nom de l'objet, emplacements « Pièce : lieu · … », badge] */
export type Row = [name: string, loc: string, badge?: string];
export interface Det {
  set: string; note?: string; wnote?: string; rune?: string;
  wpn?: Row[]; armor?: Row[]; cat?: Row[]; uniq?: Row;
  /** [sorts séparés par « ; », « lieu : comment »] */
  runes?: [spells: string, loc: string][];
}
export interface Prec { page: string; note: string; place?: string; acc?: string[]; maps?: string[]; alt?: string; zone?: string }
export type Obt = 'start' | 'boss' | 'shop' | 'trade' | 'quest' | 'invasion' | 'chest';
export interface Entry {
  kind: string; tab: 'armor' | 'wpn' | 'spells'; group: string; name: string; label: string; detail: string;
  zone: string; obt: Obt; check: boolean; key: string;
  badge?: string; nolink?: boolean; how?: string; spells?: string[]; tier?: number; prec?: Prec;
}
