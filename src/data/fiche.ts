/* Entrées d'une fiche de classe (armures, armes, sorts), types d'obtention et progression stockée dans le navigateur. */
import CV from "./classes";
import D from "./det";
import Z from "./zones";
import PREC from "./prec";
import type { Entry, Obt, Row } from "./types";

var BY = CV.BY;
var TIERS = ['Faint', 'Shimmering', 'Glowing', 'Shining', 'Radiant', 'Shadow'];
var START_ZONE: Record<string, string> = { 'Limgrave': 'limgrave', 'Weeping Peninsula': 'weeping', 'Liurnia': 'liurnia', 'Caelid': 'caelid', 'Siofra': 'under' };
var OBT: [Obt, string][] = [['start', 'Départ'], ['boss', 'Butin (boss, PNJ)'], ['shop', 'Marchand'], ['trade', 'Échange chez Enia'], ['quest', 'Quête / PNJ'], ['invasion', 'Invasion'], ['chest', 'Coffre / sur place']];
var OBT_SHORT: Record<Obt, string> = { start: 'Départ', boss: 'Butin', shop: 'Marchand', trade: 'Enia', quest: 'Quête', invasion: 'Invasion', chest: 'Sur place' };

function zoneOf(a: string) { return Z.zoneOf(a) || 'unk'; }
function atoms(loc: string) {
  return loc.split(' · ').map(function (p) { var i = p.indexOf(' : '); return i < 0 ? { label: '', atom: p } : { label: p.slice(0, i), atom: p.slice(i + 3) }; });
}
function runeParts(r: [string, string]) {
  var cut = r[1].indexOf(' : ');
  return { sp: r[0].split('; '), place: cut < 0 ? r[1] : r[1].slice(0, cut), how: cut < 0 ? '' : r[1].slice(cut + 3) };
}
/* Type d'obtention déduit du texte d'emplacement (français). */
function obtOf(t: string): Obt {
  t = t.toLowerCase();
  if (/^(coffre|cadavre)/.test(t)) return 'chest';
  if (/enia|acheté après/.test(t)) return 'trade';
  if (t.indexOf('invasion') > -1) return 'invasion';
  if (/en battant|boss /.test(t)) return 'boss';
  if (/quête|donné par|en aidant|tableau|énigme|iris of|obtenue en|après avoir (résolu|sonné|embrassé|trouvé|découvert|ouvert|envahi)|dragon communion/.test(t)) return 'quest';
  if (/vendu|acheté|marchand|twin maiden/.test(t)) return 'shop';
  if (/butin|après |sur le |sur un |sur les |sur sorcerer|sur rogier|sur moongrum|commander o'neil|night's cavalry|golem|alabaster lord|dragonkin soldier|fallingstar beast|tibia mariner|death ?rite bird|death bird|necromancer domo|bernahl|gargoyle|tree sentinel|grave warden|sanguine noble|full-grown|rogier/.test(t)) return 'boss';
  return 'chest';
}

var cache: Record<string, Entry[]> = {};
function entries(id: string): Entry[] {
  if (cache[id]) return cache[id];
  var d = D[id], x = BY[id], out: Entry[] = [];
  out.push({ kind: 'Départ', tab: 'armor', group: 'Set de départ', name: d.set, label: '', detail: 'Équipé dès le début de la partie.', zone: START_ZONE[x.region] || 'unk', obt: 'start', nolink: true, check: false, key: 'start' });
  ([['Armure', 'armor', 'Sets à trouver', d.armor], ['Arme', 'wpn', 'Armes', d.wpn], ['Catalyseur', 'wpn', 'Catalyseurs', d.cat], ['Objet', 'wpn', 'Objet de classe', d.uniq ? [d.uniq] : null]] as [string, Entry['tab'], string, Row[] | null | undefined][]).forEach(function (g) {
    (g[3] || []).forEach(function (r) {
      atoms(r[1]).forEach(function (a) {
        out.push({ kind: g[0], tab: g[1], group: g[2], name: r[0], label: a.label, detail: a.atom, zone: zoneOf(a.atom), obt: obtOf(a.atom), badge: r[2], check: true, key: [g[0], r[0], a.label, a.atom].join('|') });
      });
    });
  });
  (d.runes || []).forEach(function (r, i) {
    var p = runeParts(r), given = i === 0 && p.how === 'point de départ';
    out.push({ kind: 'Sorts', tab: 'spells', group: 'Sorts', name: 'Palier ' + TIERS[i], label: '', detail: p.place, how: p.how, spells: p.sp, tier: i, zone: zoneOf(p.place), obt: given ? 'start' : obtOf(p.how), check: !given, key: 'Sorts|' + i });
  });
  var P = PREC[id];
  if (P) out.forEach(function (e) {
    var p = P[e.kind === 'Sorts' ? 'rune' + e.tier : e.name];
    if (!p) return;
    e.prec = p;
    if (p.zone) e.zone = p.zone;
  });
  return (cache[id] = out);
}

/* Progression : objets cochés, par navigateur. */
var KEY = 'cv-done-v1', mem: Record<string, 1> = {}, loaded = false;
function load() {
  if (loaded) return;
  loaded = true;
  try { var s = window.localStorage.getItem(KEY); if (s) mem = JSON.parse(s) || {}; } catch (e) { mem = {}; }
}
function save() { try { window.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* stockage indisponible : la coche reste en mémoire pour cette page */ } }
function isDone(id: string, e: Pick<Entry, "key">) { load(); return !!mem[id + '|' + e.key]; }
function setDone(id: string, e: Pick<Entry, "key">, v: boolean) { load(); if (v) mem[id + '|' + e.key] = 1; else delete mem[id + '|' + e.key]; save(); }
function progress(id: string) {
  load();
  var t = 0, n = 0;
  entries(id).forEach(function (e) { if (e.check) { t++; if (mem[id + '|' + e.key]) n++; } });
  return { done: n, total: t };
}
function reset(id: string) {
  load();
  Object.keys(mem).forEach(function (k) { if (k.indexOf(id + '|') === 0) delete mem[k]; });
  save();
}

export default { TIERS: TIERS, OBT: OBT, OBT_SHORT: OBT_SHORT, START_ZONE: START_ZONE, zoneOf: zoneOf, atoms: atoms, runeParts: runeParts, obtOf: obtOf, entries: entries, isDone: isDone, setDone: setDone, progress: progress, reset: reset };
