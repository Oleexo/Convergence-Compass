// Fails if a French data string shown in the UI has no entry in en-data.json, or if fr.json and en.json keys differ.
import { runnerImport } from 'vite';
import { readFileSync } from 'node:fs';

const load = async p => (await runnerImport(new URL('../' + p, import.meta.url).pathname)).module.default;
const json = p => JSON.parse(readFileSync(new URL('../' + p, import.meta.url), 'utf8'));
const [CV, F, D, Z, B] = await Promise.all(['src/data/classes.ts', 'src/data/fiche.ts', 'src/data/det.ts', 'src/data/zones.ts', 'src/data/build.ts'].map(load));
const EN = json('src/locales/en-data.json');

const shown = new Set();
const add = s => { if (s) shown.add(s); };
Object.values(CV.STAT_FR).forEach(add); Object.values(CV.FAM).forEach(add); CV.DMGS.forEach(add);
F.OBT.forEach(o => add(o[1])); Object.values(F.OBT_SHORT).forEach(add); Z.list.forEach(z => add(z[1]));
for (const x of CV.C) { [x.prim, x.dmg, x.theme, x.armor, x.place, x.blurb].forEach(add); x.kit.forEach(add); }
for (const id in D) { add(D[id].note); add(D[id].wnote); }
Object.values(B.TAL).forEach(t => t.forEach(add));
for (const b of Object.values(B.B)) { add(b.stats); b.plan.forEach(add); b.tal.forEach(x => add(x[1])); b.combo.forEach(c => { add(c[0]); add(c[2]); }); }
for (const x of CV.C) for (const e of F.entries(x.id)) {
  [e.name, e.detail, e.how, e.kind, e.group, e.badge].forEach(add);
  if (e.prec) { [e.prec.note, e.prec.alt, e.prec.place].forEach(add); (e.prec.acc || []).forEach(add); }
}
// French tell-tales: accents, or common French words. Proper names are English already.
const FR = /[àâçéèêëîïôûùœ«»]|\b(de|du|des|la|le|les|au|aux|en|sur|dans|près|après|butin|coffre|vendu|donné|quête|par|une?|et|Magie|Physique|Foudre|Feu|Lourde|Nuit|Givre|Ronces|Ordre|Aucune|Ascenseur|Cloche|Devant|Sur|Arme|Objet|Sorts|Armes|Palier|Marchand|Esprit|Force|Foi|Arcanes)\b/;
const missing = [...shown].filter(s => FR.test(s) && !(s in EN));

const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => typeof v === 'object' ? keys(v, p + k + '.') : [p + k]);
const fr = new Set(keys(json('src/locales/fr.json'))), en = new Set(keys(json('src/locales/en.json')));
const diff = [...fr].filter(k => !en.has(k)).map(k => 'en.json missing ' + k).concat([...en].filter(k => !fr.has(k)).map(k => 'fr.json missing ' + k));

missing.forEach(s => console.error('en-data.json missing: ' + JSON.stringify(s)));
diff.forEach(s => console.error(s));
if (missing.length || diff.length) process.exit(1);
console.log(`i18n OK: ${shown.size} data strings checked, ${fr.size} UI keys.`);
