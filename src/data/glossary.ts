/* Termes de jeu expliqués par une infobulle dans les textes (effets d'objets, idées de build).
   [motif français, motif anglais, clé de l'explication dans `gloss.<clé>` des fichiers de langue].
   Motifs : sources de RegExp sans groupe capturant ; la casse de la première lettre est libre, sauf pour les sigles (PC, PV, FP, HP).
   Ordre : le plus long d'abord, pour que « contre-attaque en garde » passe avant « garde ». */
export const TERMS: [fr: string, en: string, key: string][] = [
  ["contre-attaques? en garde", "guard counters?", "guardCounter"],
  ["coups? critiques?|critiques?", "critical hits?|criticals?|crits?", "crit"],
  ["ripostes?", "ripostes?", "riposte"],
  ["parades?", "parry|parries|parrying", "parry"],
  ["robustesse", "poise", "poise"],
  ["posture", "stance", "stance"],
  ["attaques? chargées?", "charged attacks?", "charged"],
  ["hyper-?armure", "hyper ?armou?r", "hyperarmor"],
  ["cendres? de guerre", "ash(?:es)? of war", "ash"],
  ["charge (?:max(?:imale)?|d'équipement|légère|élevée|lourde)", "equip(?:ment)? load", "load"],
  ["PC", "FP", "fp"],
  ["PV", "HP", "hp"],
  ["endurance", "stamina", "stamina"],
  ["scaling", "scaling", "scaling"],
  ["accumulation", "build-?up", "buildup"],
  ["absorption", "absorption|negation", "absorption"],
  ["hémorragie", "blood loss|bleed(?:ing)?|hemorrhage", "bleed"],
  ["gelure", "frostbite", "frost"],
  ["pourriture(?: écarlate)?", "scarlet rot|rot", "rot"],
  ["poison", "poison", "poison"],
  ["sommeil", "sleep", "sleep"],
  ["folie", "madness", "madness"],
  ["découverte", "discovery", "discovery"],
  ["arcanes?", "arcane", "arcane"],
  ["vigueur", "vigor", "vigor"]
];
