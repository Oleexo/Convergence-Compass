import type { Det, Row } from "./types";
/* Détails par classe : sets, armes, runes de sorts, objets de classe.
   Source : fiches de classes et pages de runes de sorts de convergencemod.com. */
var NOTE_M = "Capacités d'armure de classe martiale : elles ne fonctionnent que sans arme ni catalyseur à scaling Intelligence ou Foi équipé dans un emplacement actif.";
var NOTE_MK = "Capacités d'armure de la classe : elles ne fonctionnent que sans arme ni catalyseur à scaling Intelligence ou Foi équipé dans un emplacement actif, sauf pour les arcs légers, arcs longs, grands arcs, arbalètes et balistes.";
var NOTE_P = "Les armures notables de cette classe ne fonctionnent pleinement qu'au Rune Level 1, sans monter de niveau.";

var WK: Row[] = [
  ["Commander's Standard", "Commander O'Neil"],
  ["Ghiza's Wheel", "Volcano Manor"],
  ["Osian's Greatsword", "Au nord-est de Gatefront, Limgrave"],
  ["Reaver's Odachi", "Fort Faroth"],
  ["Blade of Valor", "Stormveil"],
  ["Gargoyle's Great Axe", "Leyndell, Capital Outskirts, après Valiant Gargoyle, au nord-est de la grâce Outer Wall Phantom Tree"],
  ["Palm-Ax Twinblade", "Auriza Side Tomb"],
  ["Phalanx Pike", "Castle Morne"],
  ["Composite Bow", "Acheté au marchand de Bellum Highway"],
  ["Pulley Bow", "À l'ouest de First Mt. Gelmir Campsite"],
  ["Greatbow", "Highway Lookout Tower, Altus"],
  ["Bracelet of Gold", "Leyndell, Capital Outskirts, en battant Ulcerated Tree Spirit près de la Minor Erdtree Church"],
  ["Bracelet of Shadow", "Altus Plateau, sommet de Mirage Rise, après l'énigme des environs"],
  ["Smithscript Rosary", "Scadu Altus, Ruined Forge of Starfall Past, sur l'autel au fond de la forge"],
  ["Regal Splitblade", "Crumbling Farum Azula, coffre dans la gueule d'un crâne de dragon, à l'ouest de la grâce Dragonlord's Annex"]
];
var WM: Row[] = [
  ["Red Branch Shortbow", "Au sud-ouest de Caria Manor"],
  ["Shortbow", "Marchand nomade de Mistwood"],
  ["Longbow", "Twin Maiden Husks"],
  ["Black Bow", "Leyndell"],
  ["Pulley Bow", "À l'ouest de First Mt. Gelmir Campsite"],
  ["Greatbow", "Highway Lookout Tower, Altus"],
  ["Golem Greatbow", "Golem de la tour de Castle Morne"],
  ["Crepus's Black-Key Crossbow", "Roundtable Hold"],
  ["Repeating Crossbow", "Au sud de Moorth Ruins"],
  ["Hand Ballista", "Forest Lookout Tower"],
  ["Jar Cannon", "Volcano Cave"],
  ["Bone Bow", "Belurat, Tower Settlement, cadavre d'une salle ronde gardée par deux Monstrous Spider Scorpions"],
  ["Scadu Sapling", "Hinterlands, Shaman Village, cadavre dans l'arbre derrière la petite maison carrée, en haut de la colline"],
  ["Ansbach's Longbow", "Shadow Keep, quête de Sir Ansbach (le battre ou l'aider contre Needle Knight Leda)"],
  ["Devonia's Longbow", "Rauh Ruins, coffre au sommet de Temple Town Ruins"]
];
var WH: Row[] = [
  ["Yura's Kanabo", "Au sud d'Agheel Lake"],
  ["Leaden Maul", "Highroad Cave"],
  ["Axe of Rust", "Subterranean Shunning-Grounds"],
  ["Axe of Godfrey", "Vendu par Enia après Hoarah Loux"],
  ["Sigur's Greatmace", "Leyndell, butin de Sigur, Night's Captain"],
  ["Grafted Blade Greatsword", "Castle Morne"],
  ["War Scythe", "Cimetière au nord de Stormveil"],
  ["Gilded Quarterstaff", "Au nord de Church of Vows"],
  ["Red Branch Shortbow", "Au sud de Caria Manor"],
  ["Longbow", "Vendu par Twin Maiden Husks"],
  ["Golem Greatbow", "Castle Morne"],
  ["Bracelet of Gold", "Leyndell, Capital Outskirts, en battant Ulcerated Tree Spirit près de la Minor Erdtree Church"],
  ["Cragsplitter", "Fort Faroth"]
];
var WD: Row[] = [
  ["Foil of Caddock", "Vendu par Blackguard Big Boggart près de Leyndell"],
  ["Flowing Curved Sword", "Lake of Rot"],
  ["Bloodhound Hookblade", "Au sud-est de Main Academy Gate"],
  ["Carwyn's Épée", "Coffre de la flèche de Castle Morne"],
  ["Sulien's Razors", "Leyndell"],
  ["Emyr's Great Talons", "Volcano Manor, près des Abductor Virgins, avant la longue échelle passé la grâce Bridge of Iniquity"],
  ["Black Bow", "Leyndell"],
  ["Bracelet of Shadow", "Altus Plateau, sommet de Mirage Rise, après l'énigme des environs"],
  ["Nia's Passot", "Scadu Altus, Fog Rift Catacombs, coffre au pied de la statue de Marika, derrière le Godskin Knight"]
];

const DET: Record<string, Det> = {
  /* ---------- Martiales ---------- */
  retainer: {
    set: "Knight Set", note: NOTE_M, wpn: WK,
    armor: [
      ["Godrick Knight Set", "Gauntlets : Stormfoot Catacombs · Greaves : coffre de Stormveil Castle · Armor : Golden Lineage Evergaol · Helm : coffre de Haligtree Town"],
      ["Veteran's Set", "Gauntlets : coffre de Fort Gael · Greaves : butin de Commander O'Neil · Armor : Redmane Castle · Helm : butin de Commander Niall"],
      ["Oathseeker Knight Set", "Gauntlets : Stillwater Cave · Greaves : Caria Manor · Armor : Upper Siofra · Helm : Mohgwyn Palace"],
      ["Leda's Armor", "Church of Benediction"]
    ]
  },
  vanguard: {
    set: "Vanguard Set", note: NOTE_M, wpn: WK,
    armor: [
      ["Ronin Set", "Gauntlets : Murkwater Catacombs · Greaves : donné par Yura en Liurnia après l'invasion · Armor : butin de Violet Bloody Finger Eleonora · Iron Kasa : sur le corps de Yura, après sa possession par Shabriri"],
      ["Scaled Set", "Gauntlets : Coastal Cave · Greaves : butin d'Istvan après l'invasion · Armor : Redmane Castle · Helm : Sanctum of Eiglay, Consecrated Snowfield"],
      ["Night's Cavalry Set", "Gauntlets : Night's Cavalry de Limgrave · Greaves : Night's Cavalry d'East Liurnia · Armor : Leyndell, près de la grâce Erdtree Sanctuary · Helm : Night's Cavalry du Consecrated Snowfield"]
    ]
  },
  marksman: {
    set: "Marksman Set", note: NOTE_MK, wpn: WM,
    armor: [
      ["Page Set", "Gloves : Tombsward Ruins Cellar · Trousers : Redmane Castle · Garb : Shaded Castle · Hood : caravane du Consecrated Snowfield"],
      ["High Page Set", "Gloves : Castle Morne · Trousers : Unsightly Catacombs · Garb : Leyndell · Hood : Miquella's Haligtree"],
      ["Ragged Set", "Gloves : butin d'un Runebear à Mistwood Ruins · Loincloth : Gael Tunnel · Armor : Upper Siofra · Hat : butin de Ralva the Great Red Bear"]
    ]
  },
  berserker: {
    set: "Berserker Set", note: NOTE_M, wpn: WH,
    armor: [
      ["Elden Lord Set", "Bracers : Highroad Cave · Greaves : Stormveil Castle · Armor : Leyndell, près de la grâce Erdtree Sanctuary · Crown : près de Gateway to the Forge"],
      ["Raging Wolf Set", "Gauntlets : Cuckoo Evergaol · Greaves : Gelmir Hero's Grave · Armor : en aidant Bernahl à Leyndell · Helm : Farum Azula, près de la grâce Garden Courtyard"],
      ["Freyja's Set", "Gauntlets : Fort Gael · Greaves : Swamp Lookout Tower · Armor : Castle Sol · Helm : quête de Freyja"]
    ]
  },
  dreadnought: {
    set: "Dreadnought Set", note: NOTE_M, wpn: WH,
    armor: [
      ["Bull-Goat Set", "Gauntlets : vendu par Patches · Greaves : Fort Faroth · Armor : après Great Horned Tragoth · Helm : Farum Azula, près de la grâce Dragon Temple Lift"],
      ["Lionel's Set", "Gauntlets : Summonwater Village · Greaves : Leyndell, près de la grâce Lower Capitol Church · Armor : War-Dead Catacombs · Helm : Deeproot Depths"],
      ["Verdigris Set", "Gauntlets : Tombsward Cave · Greaves : Caelid Waypoint Ruins · Armor : Seethewater Cave · Helm : sur le corps de Moore"]
    ]
  },
  sellsword: {
    set: "Sellsword Set", note: NOTE_M, wpn: WD,
    armor: [
      ["Kaiden Set", "Gauntlets : carriage en Limgrave · Greaves : Shaded Castle · Armor : carriage du Consecrated Snowfield · Helm : coffre d'Elphael"],
      ["Dancer's Set", "Bracer : Caelem Ruins · Trousers : Volcano Manor · Dress : Sanctum of Eiglay · Hood : Southern Nameless Mausoleum"],
      ["Ascetic's Set", "Wrist Guards : Weeping Harborage · Ankle Guards : Perfumer Grotto · Loincloth : butin des Fell Twins · Curseblade Mask : Bonny Gaol"]
    ]
  },
  rogue: {
    set: "Bandit Set", note: NOTE_M, wpn: WD,
    armor: [
      ["Leather Set", "Gloves : Slumbering Wolf Shack · Boots : Volcano Manor, juste passé Temple of Eiglay · Armor : corniche de Gaol Cave · Black Hood : Chelona's Rise"],
      ["Raptor's Set", "Gloves : toits de Stormveil · Boots : Sage's Cave · Black Feathers : Deathrite Bird de Caelid · Skeletal Mask : Giant's Mountaintops Catacombs"],
      ["Braided Cord Set", "Armwraps : Jarburg · Loincloth : Auriza Side Tomb · Robe : Queen's Bedchamber · Caterpillar Mask : sur le corps de Hornsent"],
      ["Blackguard's Iron Mask", "Fin de la quête de Boggart"]
    ]
  },

  /* ---------- Sorcellerie ---------- */
  glint: {
    set: "Glint Sorcerer Set", rune: "Glintstone Rune",
    armor: [
      ["Spellblade Set", "Sur Rogier"],
      ["Preceptor's Set", "Carian Study Hall"],
      ["Carian Knight Set", "Sur Moongrum"],
      ["Queen of the Full Moon Set", "Vendu par Enia après Renalla"],
      ["Rellana's Set", "Vendu par Enia après Rellana"],
      ["Carian Golem Set", "Butin du Carian Golem à Caelid"]
    ],
    wpn: [
      ["Carian Knight's Sword", "The Four Belfries"],
      ["Celestial Blade", "Tour accessible par Academy Crystal Cave"],
      ["Rogier's Rapier", "Sorcerer Rogier"],
      ["Moonveil", "Altus Tunnel"],
      ["Glintstone Cleaver", "Altus Tunnel"],
      ["Crystal Spear", "Academy Crystal Cave"],
      ["Loretta's War Sickle", "Miquella's Haligtree"],
      ["Watchdog's Staff", "Road's End Catacombs"],
      ["Troll Knight's Sword", "Academy of Raya Lucaria"],
      ["Rhys' Swordspear", "Caria Manor, en battant Rhys, Carian Paragon"],
      ["Primeval Splinter", "Cerulean Coast, Finger Ruins of Rhia"],
      ["Crystalline Claw", "Liurnia, Liurnia Highway Minor Erdtree, butin du Giant Crystal Crab"]
    ],
    runes: [
      ["Swift Glintstone Shard; Carian Slicer; Glintstone Arc; Energy Shell", "Liurnia, Academy Gate Town : point de départ"],
      ["Great Glintstone Shard; Scholar's Shield; Scholar's Armament; Carian Piercer; Sorcerer's Lucidity", "Liurnia, Lakeside Crystal Cave : en battant Battlemage Duncan"],
      ["Carian Greatsword; Thops's Barrier; Shard Spiral; Greatblade Phalanx; Carian Acuity", "Liurnia, Academy Crystal Cave : en battant le duo de Crystalians"],
      ["Starlight; Glintstone Cometshard; Carian Phalanx; Loretta's Greatbow; Glintbeam Orb; Gavel of Haima", "Liurnia, sommet de Converted Fringe Tower : après avoir résolu son énigme"],
      ["Comet; Rennala's Full Moon; Loretta's Mastery; Comet Azur; Anima Magica", "Miquella's Haligtree, Haligtree Town : en battant Loretta, Knight of the Haligtree"],
      ["Glintstone Nail; Glintstone Nails", "Hinterlands, Finger Ruins of Dheo : après avoir sonné la cloche"]
    ],
    cat: [["Azur's Glintstone Staff", "Sur Sorcerer Azur"]],
    uniq: ["Glintstone Kris", "Highway Lookout Tower, Liurnia"]
  },
  starcaller: {
    set: "Starcaller Set", rune: "Rune of Gravity",
    armor: [
      ["General Radahn's Set", "Vendu par Enia après General Radahn"],
      ["Redmane Knight Set", "Fort Gael"],
      ["Gaius Set", "Vendu par Enia après Gaius"],
      ["High Priest Set", "Butin de Count Ymir"]
    ],
    wpn: [
      ["Sword of the Cosmos", "Caria Manor"],
      ["Alabaster Lord's Sword", "Alabaster Lord, Redmane Castle"],
      ["Wing of Astel", "Ainsel River"],
      ["Onyx Lord's Greatsword", "Woodfolk Ruins, Altus"],
      ["Meteoric Ore Blade", "Sellia Crystal Tunnel"],
      ["Bastard's Stars", "Acheté après Astel"],
      ["Fallingstar Beast Jaw", "Full-grown Fallingstar Beast, Mt. Gelmir"],
      ["Ruins Greatsword", "Redmane Castle, butin de Dakk, Starcaller Lord"],
      ["Starscourge Greatsword", "Acheté après Radahn"],
      ["Starcaller's Mattock", "Redmane Castle, cadavre au pied d'un grand arbre, à l'est de la grâce Redmane Staging Area"]
    ],
    runes: [
      ["Gravity Well; Shatter Earth; Rock Burst", "Weeping Peninsula, Crater-Pocked Glade : point de départ"],
      ["Rock Sling; Rock Blaster; Gravity Armor; Collapsing Stars", "Weeping Peninsula, Earthbore Cave : en battant la Chanting Winged Dame"],
      ["Meteorite; Implosion; Rock Heave; Distortion Field; Gravitational Missile", "Liurnia, Royal Grave Evergaol : en battant Onyx Lord"],
      ["Meteorite of Astel; Collapsing Nebula; Meteor Sling", "Mt. Gelmir : en battant le Full-Grown Fallingstar Beast"],
      ["Gravity Beam; Stellar Bombardment; Astral Alignment", "Consecrated Snowfield, Yelough Anix Tunnel : en battant Astel, Stars of Darkness"],
      ["Fleeting Microcosm; Cherishing Fingers", "Cerulean Coast, Finger Ruins of Rhia : après avoir sonné la cloche"]
    ],
    cat: [["Meteorite Staff", "Fallingstar Beast du cratère d'Altus"]],
    uniq: ["Rift Shield", "Marchand près de Bellum Church"]
  },
  underworld: {
    set: "Underworld Set", rune: "Rune of the Dragonkin",
    armor: [["Blue Silver Set", "Ordina, Liturgical Town"]],
    wpn: [
      ["Dragonkin Seeker Sword", "Nokron"],
      ["Dragonscale Blade", "Lake of Rot"],
      ["Underworld Greatmace", "Fringefolk Hero's Grave"],
      ["Clayman's Harpoon", "Ainsel River"],
      ["Dragonkin Halberd", "Dragonkin Soldier de Siofra River"],
      ["Daergraf's Opus", "Deeproot Depths"],
      ["Galvanic Culling Blade", "Noxumbra, Eternal City"],
      ["Transcendent Talons", "Vendu par Enia après Daergraf, Underworld Archmage"]
    ],
    runes: [
      ["Frozen Cragbolt; Cragbolt Bubbles; Frozen Lightning Armament; Cragbolt Wisp", "Lower Siofra River : butin d'un Teardrop Scarab sur un pilier, au nord-est de la grâce Siofra River Well Depths"],
      ["Armor of Bubbles; Great Dragonkin Bubble; Cragbolt Mine; Dragonkin Retaliation; Cragbolt Trio", "Lower Siofra River : sur le Dragonkin Soldier du plateau central"],
      ["Cragbolt Upwelling; Frozen Lightning Stake; Great Bubble Volley; Dragonkin Downpour; Underworld Bubbleshield", "Limgrave, Fringefolk Hero's Grave : en battant Ulcerated Tree Spirit"],
      ["Cragbolt Spear; Dragonkin Minefield; Frozen Lightning Storm; Cragbolt Torrent", "Ainsel River : en battant le Dragonkin Soldier of Nokstella"],
      ["Dragonkin Devastation; Strength of the Underworld; Wisdom of the Makers", "Lake of Rot : boss Dragonkin Soldier, en descendant la colline depuis la grâce Shoreside puis à droite au bord du lac, après les grandes statues et une arche"]
    ],
    cat: [["Dragonkin Scepter", "Albinauric Rise"]],
    uniq: ["Underworld Dagger", "Raya Lucaria Crystal Tunnel"]
  },
  volcanist: {
    set: "Volcanist Set", rune: "Rune of Magma",
    armor: [
      ["Consort's Set", "Donné par Tanith après l'invasion d'Istvan"],
      ["Gelmir Knight Set", "Gelmir Hero's Grave"],
      ["Hoslow Set", "Après Juno Hoslow"]
    ],
    wpn: [
      ["Molten Sword", "Gael Tunnel"],
      ["Blasphemous Blade", "Acheté après Rykard"],
      ["Magma Blade", "Tableau « Flightless Bird »"],
      ["Magma Wyrm's Scalesword", "Ruin-Strewn Precipice"],
      ["Devourer's Scepter", "Knight Bernahl"],
      ["Seething Flail", "Volcano Manor"],
      ["Inquisitor's Girandole", "Volcano Manor"],
      ["Magma Whip Candlestick", "Quête de Patches"],
      ["Lodestone of Gelmir", "Après Volcanist Dist, Volcano Manor"]
    ],
    runes: [
      ["Lava Dart; Magma Shot; Molten Stride", "Caelid, au nord de Caelem Ruins : point de départ"],
      ["Burning Rancor; Familial Consumption; Lava Spray", "Caelid, Caelem Ruins : coffre après le boss Mad Pumpkin Head"],
      ["Roiling Magma; Gelmir's Fury; Blasphemer's Outrage; Lava Pool", "Volcano Manor : en battant Inquisitor Ghiza"],
      ["Pyroclasm; Lava Blast; Rykard's Rancor; Lava Bomb", "Mt. Gelmir, Gelmir Hero's Grave : en battant Red Wolf of the Champion"],
      ["Vortex of Eiglay; Magma Missile; Inferno; Embrace the Devourer", "Consecrated Snowfield : en battant Great Wyrm Theodorix"]
    ],
    cat: [["Lavastone Staff", "Après Magma Wyrm, près de Fort Laiedd"]],
    uniq: ["Man-Serpent's Shield", "Volcano Manor"]
  },
  stormcaller: {
    set: "Stormcaller Set", rune: "Rune of the Storm",
    armor: [
      ["Banished Knight Set", "Chapel of Anticipation"],
      ["Divine Beast Set", "Après le Dancing Lion de Belurat"],
      ["Set of Solitude", "Western Nameless Mausoleum"]
    ],
    wpn: [
      ["Banished Knight's Greatsword", "Stormveil Castle"],
      ["Zephyr Blades", "Stormveil Castle"],
      ["Banished Knight's Halberd", "Après Edgar"],
      ["Gargoyle's Greatsword", "Après Valiant Gargoyle, dans Leyndell"],
      ["Gargoyle's Halberd", "Après Valiant Gargoyle, dans Leyndell"],
      ["Gargoyle's Twinblades", "Après Valiant Gargoyle, Altus"],
      ["Dyru's Greatsword", "Acheté à Enia après Dyru, Scavenger King"],
      ["Axe of Godrick", "Acheté après Godrick"],
      ["Eagle's Edge", "Chapel of Anticipation"],
      ["Horned Warrior's Greatsword", "Enir Elim"],
      ["Stormcaller Dirk", "Cliffbottom Catacombs, butin de Stormcaller Taran"]
    ],
    runes: [
      ["Storm Gust; Rebuff; Storm Armament; Air Tax", "Limgrave, Stormhill : point de départ"],
      ["Twister; Storm Arc; Whirlwind; Storm Call", "Limgrave, Stormfoot Catacombs : en battant Erdtree Burial Watchdog"],
      ["Cloud Form; Storm Strike; Gale Blast; Gathering Storm", "Liurnia, Cliffbottom Catacombs : en battant Erdtree Burial Watchdog"],
      ["Cyclone; Dematerialize; Suffocate; Storm Shatter", "Altus Plateau, Sainted Hero's Grave : en battant Ancient Hero of Zamor"],
      ["Tornado; Stormcaller's Sublimity; Tempest Form", "Crumbling Farum Azula : coffre dans une petite salle donnant sur un balcon de toit, gardé par un Banished Knight et des Stormhawks, au nord-ouest de la grâce Garden Courtyard"]
    ],
    cat: [["Tempestcaller's Staff", "Stormcaller Church, Altus"]],
    uniq: ["Blue-White Wooden Shield", "Stormveil Castle"]
  },
  nox: {
    set: "Nox Oracle Set", rune: "Rune of Night",
    armor: [
      ["Black Knife Set", "Sage's Cave"],
      ["Night Maiden Set", "Nokron"],
      ["Nox Monk Set", "Deeproot Depths"],
      ["Nox Swordstress Set", "Sellia Crystal Tunnel"],
      ["Set of Night", "Bonny Gaol"]
    ],
    wpn: [
      ["Quicksilver Rapier", "Lake of Rot"],
      ["Nox Flowing Sword", "West Sellia"],
      ["Nox Flowing Hammer", "Nokron"],
      ["Star Shadow", "Après Nox Oracle Sadia, Sellia"],
      ["Sword of Darkness", "Obtenue en convertissant la Stone-Sheathed Sword ou la Sword of Light"],
      ["Sword of Night", "Iris of Occultation utilisé sur Jolán, Cathedral of Manus Metyr"],
      ["Claws of Night", "Butin de Swordhand of Night Anna, Finger Ruins of Miyr"],
      ["Fingerslayer Blade", "Liurnia, Ranni's Rise, donné par Ranni en échange de la Fingerslayer Blade (quête de Ranni)"],
      ["Quicksilver Fragment", "Noxumbra, Forsaken City, en battant le Quicksilver Husk"]
    ],
    runes: [
      ["Night Shard; Quicksilver Affliction; Night Maiden's Mist; Shadow Bait", "Liurnia, au nord d'Ainsel River Well : coffre au point de départ"],
      ["Darkness; Unseen Blade; Assassin's Approach; Ambush Shard", "Liurnia, Raya Lucaria Crystal Tunnel : en battant un Crystalian"],
      ["Night Stars; Curse of Midnight; Star Swarm; Quicksilver Shard", "Altus Plateau, sommet de Mirage Rise : après l'énigme des environs"],
      ["Eternal Darkness; Night Maiden's Fog; Night Comet; Unseen Form", "Mountaintops of the Giants, Stargazers' Ruins : coffre derrière un sceau brisé avec des cendres de Spirit Jellyfish, près d'Aureliette"],
      ["Stars of Ruin; Quicksilver Comet; Founding Rain of Stars; Oath of Darkness; Attune to the Black Moon", "Deeproot Depths : cadavre dans une salle, juste après avoir vaincu Aled, Knight of Godwyn"]
    ],
    cat: [["Lusat's Night Staff", "Sellia Hideaway"]],
    uniq: ["Midnight Dagger", "Nokron"]
  },
  necromancer: {
    set: "Necromancer Set", rune: "Rune of Necromancy",
    armor: [
      ["Fia's Set", "Leyndell"],
      ["Royal Remains Set", "Après Ensha"],
      ["Mausoleum Knight Set", "Caelid Catacombs"],
      ["Gravebird Set", "Temple Town Ruins"],
      ["Gravebird's Blackquill Armor", "Enir-Ilim"]
    ],
    wpn: [
      ["Death's Poker", "Death Rite Bird, Caelid"],
      ["Helphen's Steeple", "Tibia Mariner, Mountaintops"],
      ["Mantis Blade", "Gelmir Hero's Grave"],
      ["Eclipse Shotel", "Castle Sol"],
      ["Deathrite Dagger", "Necromancer Domo, Stormveil"],
      ["Family Heads", "Sage's Cave"],
      ["Sacrificial Axe", "Death Bird, Weeping Peninsula"],
      ["Rosus Axe", "Black Knife Catacombs"],
      ["Death Ritual Spear", "Death Rite Bird, Mountaintops"],
      ["Rosus' Harvester", "Tibia Mariner, Altus"],
      ["Rancor Touch", "Caelid Catacombs"],
      ["Spirit Glaive", "Cerulean Coast, Charo's Hidden Grave, cadavre dans un champ de lys araignées au nord de la grâce"],
      ["Putrescence Cleaver", "Vendu par Enia après le Putrescent Knight (Stone Coffin Fissure)"]
    ],
    runes: [
      ["Fia's Mist; Tibia's Conversion; Tibia's Summons; Blighted Armament", "Weeping Peninsula, Church of Pilgrimage : point de départ"],
      ["Rancorcall; Lingering Blight; Rally the Legion; Accursed Binding", "Weeping Peninsula, Tombsward Catacombs : en battant Cemetery Shade"],
      ["Ancient Death Rancor; Sacrifice; Curse of Putrefaction; Rancor Bolt", "Liurnia, Black Knife Catacombs : en battant Cemetery Shade"],
      ["Ghostflame Cannon; Wave of Corruption; Rancorstorm; Soul Steal", "Mountaintops of the Giants : en battant Deathrite Bird"],
      ["Ghostflame Embrace; Ritual of Ghostflame; Godwyn's Vengeance; Phoenix of Death", "Deeproot Depths : en battant Blighted Nox Ancestor"],
      ["Mass of Putrescence", "Cerulean Coast, Charo's Hidden Grave : devant une statue de Gravebird, accessible par une colline à l'est de la grâce"]
    ],
    cat: [
      ["Prince of Death's Staff", "Sage's Cave"],
      ["Blightpole", "Crumbling Farum Azula, au pied d'un grand arbre au nord de la grâce Forum Ruins, passé le dragon endormi"]
    ],
    uniq: ["Ghostflame Torch", "Death Bird en Liurnia"]
  },
  frost: {
    set: "Frost Witch Set", rune: "Rune of Frost",
    armor: [
      ["Zamor Set", "Zamor Ruins"],
      ["Snow Witch Set", "Renna's Rise"],
      ["Blaidd's Set", "Après Blaidd, aux Three Sisters"]
    ],
    wpn: [
      ["Dark Moon Greatsword", "Quête de Ranni"],
      ["Frozen Needle", "Kingsrealm Ruins, Liurnia"],
      ["Zamor Curved Sword", "Giant-Conquering Hero's Grave"],
      ["Frozen Twinshards", "Près d'Albinauric Rise, Consecrated Snowfield"],
      ["Zamor Star Mace", "Caria Manor"],
      ["Icerind Hatchet", "Temple Quarter"],
      ["Royal Greatsword", "Butin de Blaidd"],
      ["Rimeheart", "Butin de Borealis"],
      ["Einar's Greathammer", "Acheté après Einar, Ice Guardian"],
      ["Crescent Moons", "Scadu Altus, Fort of Reprimand, en haut de la tour voisine de la grille fermée"]
    ],
    runes: [
      ["Freezing Mist; Ice Dart; Frozen Armament", "Weeping Peninsula : point de départ"],
      ["Icecrag Arrow; Renna's Barrier; Frozen Spikes", "Weeping Peninsula, Weeping Evergaol : en battant Ancient Hero of Zamor"],
      ["Armor of Rime; Icecrag Burst; Ice Shards", "Liurnia, Caria Manor : coffre à côté d'un astrolabe, juste après Rhys, Carian Paragon"],
      ["Adula's Moonblade; Frozen Phalanx; Icecrag Spear", "Liurnia, Ranni's Rise : donné par Ranni après avoir trouvé le Fingerslayer Blade"],
      ["Ranni's Dark Moon; Avalanche; Zamor Ice Storm; Snow Witch's Cunning; Whiteout", "Castle Sol : sur les toits, après avoir battu Commander Niall"]
    ],
    cat: [["Snow Witch Staff", "Heretical Rise"]],
    uniq: ["Ice Crest Shield", "Coffre à Caria Manor"]
  },
  aberrant: {
    set: "Heretic's Set", rune: "Rune of Thorns",
    armor: [
      ["Alberich's Set", "Leyndell"],
      ["Bloodhound Knight Set", "Gelmir Hero's Grave"],
      ["Briar Set", "Après Elemer of the Briar"]
    ],
    wpn: [
      ["Regalia of Eochaid", "Au nord de Zamor Ruins"],
      ["Marais Executioner's Sword", "Shaded Castle"],
      ["Thorn of the Guilty", "Fort Laiedd"],
      ["Crimson Briar-Bough", "Cave of Knowledge"],
      ["Hoslow's Petal Whip", "Après l'invasion de Juno Hoslow"],
      ["Bloodhound Claws", "Volcano Manor"],
      ["Crucifix of Eochaid", "Mohgwyn Palace, près d'un corbeau en feu, en route vers la grâce Dynasty Mausoleum Entrance"]
    ],
    runes: [
      ["Body of Briar; Briars of Sin; Briar-Wrapped Armament", "Liurnia, Artist's Shack : point de départ"],
      ["Close Wound; Strangling Briars; Thorn Burst; Briars of Punishment", "Limgrave, Forlorn Hound Evergaol : en battant Bloodhound Knight Darriwil"],
      ["Telekinetic Shell; Ritual of Desecration; Red Glintstone Razor; Sadistic Glee", "Altus Plateau, Unsightly Catacombs : en battant Perfumer Tricia et Misbegotten Warrior"],
      ["Crimson Rose; Blood Star; Telekinetic Assault; Red Glintstone Shards; Eochaid's Sap", "Altus Plateau, Shaded Castle : coffre sur les remparts supérieurs"],
      ["Blood Comet; Crimson Greatblade; Aberrant Ascension; Blood Revelry", "Mohgwyn Palace : coffre près des ennemis sans tête autour d'un cadavre de Mohgwyn Crow en feu"],
      ["Mantle of Thorns; Impenetrable Thorns", "Shadow Keep, Church District : en battant le Tree Spirit après avoir ouvert le barrage"]
    ],
    cat: [["Staff of the Guilty", "Guardian's Garrison"]],
    uniq: ["Shield of the Guilty", "Camp d'East Liurnia"]
  },

  /* ---------- Incantations ---------- */
  flame: {
    set: "Prophet Set", rune: "Rune of Fell Flame",
    armor: [
      ["Fire Monk Set", "Fort Laiedd"],
      ["Fire Prelate Set", "Mountaintops of the Giants"],
      ["Fire Knight Set", "Shadow Keep, Specimen Storehouse"],
      ["Salza's Hood", "Shadow Keep Bridge"],
      ["Deathmask Helm", "Shadow Keep, Church District"],
      ["Winged Serpent Helm", "Shadow Keep, près de Dark Chamber"],
      ["Messmer's Set", "Acheté après Messmer"]
    ],
    wpn: [
      ["Fell Flame Sword", "Guardians' Garrison"],
      ["Monk's Flamemace", "Guardians' Garrison"],
      ["Sword of the Cyclops", "Après Fire Giant"],
      ["Cranial Vessel Candlestand", "Giant-Conquering Hero's Grave"],
      ["Axe of Fell Prophecy", "Giant-Conquering Hero's Grave"],
      ["Giant's Red Braid", "Acheté après Fire Giant"],
      ["Grafted Dragon", "Acheté après Godrick"],
      ["Prelate's Inferno Crozier", "Camp du sud de Liurnia"],
      ["Monk's Flameblade", "Fort Laiedd"],
      ["Furnace Fists", "Ruins of Unte"],
      ["Glaive of the Crusade", "Gravesite Plain, coffre au sommet de Scorched Ruins"]
    ],
    runes: [
      ["Catch Flame; Flame Sling; Flame Whirl; Flaming Armament", "Caelid, Smoldering Church : point de départ"],
      ["Flame Surge; Great Flame; Giantsflame Protection; Purging Flames", "Caelid, Minor Erdtree Catacombs : en battant le duo d'Erdtree Burial Watchdog"],
      ["Fire's Deadly Sin; Flame Scatter; Flame of the Fell God; Great Flame Sling", "Liurnia, Malefactor's Evergaol : en battant Adan, Thief of Fire"],
      ["Flame Pillars; Flame Strike; Fell Missile; Stoke the Flames", "Mountaintops of the Giants, Guardian's Garrison : en battant Chief Guardian Arghanthy"],
      ["Incinerate; Cyclopean Prophecy; Anger of the Fell God", "Mountaintops of the Giants, Giant-Conquering Hero's Grave : en battant Ancient Hero of Zamor"],
      ["Fire Serpent; Rain of Fire; Messmer's Orb; Serpent Flame Surge; Abyssal Flame Dance", "Shadow Keep, Dark Chamber Entrance : juste avant la grâce, devant une statue"]
    ],
    cat: [["Giant's Seal", "Fort Laiedd"]],
    uniq: ["Smoldering Shield", "Camp du sud de Liurnia"]
  },
  fundamentalist: {
    set: "Fundamentalist Set", rune: "Rune of Order",
    armor: [
      ["Twinned Set", "Sur le corps de D"],
      ["Tree Sentinel Set", "Après le duo de Tree Sentinels, Altus"],
      ["Goldmask's Set", "Donné par Goldmask après avoir découvert le secret de Marika"],
      ["Haligtree Knight Set", "Elphael"],
      ["Young Lion's Set", "Acheté après Promised Consort"],
      ["Dryleaf Set", "Cascade sous Ruins of Unte"],
      ["Circlet of Light", "Après Promised Consort"]
    ],
    wpn: [
      ["Axe of Epiphany", "Leyndell, Divine Bridge, cadavre sur le chemin des Mountaintops"],
      ["Ornamental Straight Sword", "Chapel of Anticipation"],
      ["Guardian's Spearblade", "Plateau d'Altus, près de Minor Erdtree Church"],
      ["Envoy's Horn", "Fortified Manor, Leyndell"],
      ["Coded Sword", "Fortified Manor, Leyndell"],
      ["Hammer of Virtue", "Butin de Fundamentalist Gino, Castle Morne"],
      ["Cleanrot Spear", "War-Dead Catacombs"],
      ["Golden Halberd", "Après Tree Sentinel"],
      ["Halo Scythe", "Stillwater Cave"],
      ["Golden Order Greatsword", "Cave of the Forlorn"],
      ["Scadu Sapling", "Hinterlands, Shaman Village, cadavre dans l'arbre derrière la petite maison carrée, en haut de la colline"]
    ],
    runes: [
      ["Rejection; Rune Shards; Sacred Ground; Blessing of Grace; Immutable Shield", "Limgrave, Third Church of Marika : point de départ"],
      ["Urgent Heal; Discus of Light; Order's Blade; Law of Regression; Blessing of Protection", "Limgrave, Fort Haight : coffre au sommet du fort"],
      ["Wrath of Gold; Triple Rings of Light; Morgott's Spear; Great Heal; Blessing of Wisdom", "Castle Morne : coffre derrière une porte verrouillée jusqu'à l'extinction de deux flammes"],
      ["Law of Causality; Radagon's Rings of Light; Lord's Heal; Blessing of Power", "Leyndell, Erdtree Sanctuary : cadavre accessible depuis une branche juste au-dessus de la grâce Erdtree Sanctuary"],
      ["Golden Spear; Elden Blade; Elden Stars; Elden Benediction", "Elphael, Brace of the Haligtree : cadavre devant un cercueil scellé, après la porte de la chapelle de la crique nord-ouest, au nord de la grâce Drainage Channel"],
      ["Heal from Afar; Minor Erdtree; Wrath from Afar; Multilayered Ring of Light", "Hinterlands, Shaman Village : devant une statue dans un tronc creux"]
    ],
    cat: [["Golden Order Seal", "Sealed Tunnel"]],
    uniq: ["Erdsteel Dagger", "Limgrave, donné par Kenneth Haight une fois Fort Haight nettoyé"]
  },
  bestial: {
    set: "Vulgar Militia Set", rune: "Rune of Beasts",
    armor: [
      ["Beast Clergy Set", "Après Black Blade Kindred"],
      ["Crucible Axe Set", "Farum Azula"],
      ["Crucible Tree Set", "Après Siluria"],
      ["Crucible Hammer-Helm", "Butin de Devonia"],
      ["Beast Champion Set", "Sur le corps de Bernahl"],
      ["Iron Rivet Set", "Northern Nameless Mausoleum"],
      ["Pelt of Ralva", "Butin de Rugalea"],
      ["Divine Bird Set", "Intérieur de Rauh Ruins"]
    ],
    wpn: [
      ["Sword of Hadea", "Vendu par Enia après Skarde"],
      ["Stone Claws", "Hidden Path to the Haligtree"],
      ["Siluria's Tree", "Après Siluria"],
      ["Troll's Hammer", "Old Altus Tunnel"],
      ["Beastman's Curved Sword", "Marchand du sud de Caelid"],
      ["Ordovis's Greatsword", "Auriza Hero's Grave"],
      ["Beastclaw Greathammer", "Dragonbarrow Cave"],
      ["Beastman's Cleaver", "Dragonbarrow Cave"],
      ["Greatsword of Damnation", "Vendu par Enia après Midra, Lord of Frenzied Flame"],
      ["Halberd of Archea", "Crumbling Farum Azula, derrière le Large Hornsent Inquisitor, au nord-est de la grâce Garden Courtyard"],
      ["Devonia's Longbow", "Rauh Ruins, coffre au sommet de Temple Town Ruins"]
    ],
    runes: [
      ["Beast Talons; Gravel Sling; Stone Throw; Crucible Horn; Crucible Feathers", "Limgrave, Groveside Cave : point de départ"],
      ["Savage Lunge; Beast Claw; Crucible Vitality; Earthen Spikes; Crucible Quills", "Limgrave Tunnels : en battant Stonedigger Troll"],
      ["Stone Spears; Bestial Strength; Seismic Instability; Crucible Tail; Stone Skin", "Caelid, Dragonbarrow Cave : en battant Beastman of Farum Azula (Cleaver)"],
      ["Stone of Gurranq; Crucible Spear; Crucible Regeneration; Landslide; Gurranq's Beast Claw", "Altus Plateau, Auriza Hero's Grave : en battant Crucible Knight Ordovis"],
      ["Earthquake; Boulder Volley; Bestial Fervor; Source of Creation; Roar of Rugalea", "Consecrated Snowfield, Hidden Path to the Haligtree : en battant Stray Mimic Tear"],
      ["Crucible Arcs; Giant Crucible Arc; Spira", "Scadu Altus, Darklight Catacombs : en battant Jori, Elder Inquisitor"]
    ],
    cat: [
      ["Earthbreaker Seal", "Auriza Hero's Grave"],
      ["Aegis of Hadea", "Coffre de Hidden Path to the Haligtree", "Catalyseur-arme de rang 2"]
    ],
    uniq: ["Cinquedea", "Caelid, Sanctum Undercroft, au fond du Bestial Sanctum près de la grâce"]
  },
  dragoncultist: {
    set: "Dragon Cult Set", rune: "Rune of Lightning",
    armor: [
      ["Leyndell Knight Set", "Sur un scarabée invisible à Leyndell"],
      ["Malformed Dragon Set", "Butin du Draconic Tree Sentinel, Farum Azula"],
      ["Death Knight Set", "Butin de Death Knight Lenny, Deeproot Depths"],
      ["Priestess Heart", "Donné par la Dragon Communion Priestess au fil de sa quête"]
    ],
    wpn: [
      ["Blades of the Prince", "Plateau d'Altus, près de Rampartside Path"],
      ["Draconic Epitaph", "Fourth Church of Marika"],
      ["Godwyn's Cragblades", "Leyndell, butin de Dragon Cultist Seki, sous la grâce Avenue Balcony"],
      ["Glaive of the Ancients", "Butin de Seera"],
      ["Dragon Greatclaw", "Après Draconic Tree Sentinel"],
      ["Gravelstone Arcblades", "Wyndham Catacombs"],
      ["Dragon King's Cragblade", "Vendu par Enia après Placidusax"],
      ["Bolt of Gransax", "Leyndell"],
      ["Veteran's Prosthesis", "Après Niall"]
    ],
    runes: [
      ["Lightning Channel; Honed Bolt; Lightning Spear; Electrify Armament; Electrocharge", "Limgrave, au sud d'Agheel Lake : point de départ"],
      ["Lightning Strike; Dragonbolt Blessing; Lightning Orb; Static Charge; Knight's Lightning Spear", "Weeping Peninsula, Morne Tunnel : en battant Scaly Misbegotten"],
      ["Ancient Honed Bolt; Ancient Lightning Stake; Ancient Lightning Beacon; Electrocution", "Altus Plateau, au nord-est de Leyndell : en battant Draconic Tree Sentinel"],
      ["Ancient Lightning Strike; Ancient Lightning Spear; Vyke's Dragonbolt; Fortissax's Lightning Stake", "Mountaintops of the Giants, Lord Contender's Evergaol : en battant Roundtable Knight Vyke"],
      ["Time Warp; Ancient Lightning Storm; Dragonbolt of Florissax; Ageless Innervation", "Crumbling Farum Azula, Dragon Temple : en battant Seera, Blade of the Ancients"],
      ["Death Spark; Death Knight's Supplication; Death Lightning Stake; Death Lightning Barrage", "Scadu Altus, Fog Rift Catacombs : en battant le Death Knight"]
    ],
    cat: [["Dragon Cult Seal", "Leyndell"]],
    uniq: ["Crest of the Dragon Cult", "Butin du Leyndell Knight, East Liurnia"]
  },
  godskin: {
    set: "Festive Set", rune: "Rune of Black Flame",
    armor: [
      ["Godskin Apostle Set", "Butin du Godskin Apostle, Divine Tower of Caelid"],
      ["Godskin Noble Set", "Butin du Godskin Noble sur le pont près de Divine Tower of Liurnia"],
      ["Maliketh's Set", "Vendu par Enia après Maliketh"],
      ["Blackflame Monk Set", "Volcano Manor"]
    ],
    wpn: [
      ["Godslayer's Greatsword", "Divine Tower of Caelid"],
      ["Maliketh's Black Blade", "Vendu par Enia après Maliketh"],
      ["Black Knife", "Devant Sainted Hero's Grave"],
      ["Godskin Stitcher", "Volcano Manor"],
      ["Godskin Peeler", "Dominula, Windmill Village"],
      ["Celebrant's Skull", "Altus Plateau, Windmill Heights"],
      ["Celebrant's Cleaver", "Altus Plateau, à l'ouest de Windmill Village"],
      ["Gargoyle's Black Axe", "Forbidden Lands"],
      ["Gargoyle's Black Blades", "Forbidden Lands"],
      ["Celebrant's Rib-Rake", "Deathtouched Catacombs"]
    ],
    runes: [
      ["Black Flame Dart; Black Flame Burst; Black Flame Blade", "Limgrave, Windmill Town : point de départ"],
      ["Black Flame Orb; Scouring Black Flame; Soul Burn; Burrowing Black Flame", "Limgrave, Deathtouched Catacombs : en battant Black Knife Assassin"],
      ["Black Flame Mortar; Blessing of Gloam; Black Flame Ritual; Noble Presence", "Volcano Manor, Temple of Eiglay : en battant Godskin Noble"],
      ["Black Firestorm; Black Flame Wave; Godslayer Sickle; Soul Annihilation", "Mountaintops of the Giants, Spiritcaller Cave : en battant Spiritcaller Snail"],
      ["Dusk Bolt; Deicide; Godslayer's Devotion; Wrath of the Queen", "Liurnia, Divine Tower of Liurnia : en battant Godskin Matriarch"]
    ],
    cat: [["Godslayer's Seal", "Dominula, Windmill Village"]],
    uniq: ["Celebrant's Sickle", "Divine Tower of Caelid"]
  },
  frenzied: {
    set: "Zealot Set", rune: "Rune of Frenzied Flame",
    armor: [
      ["Frenzied Maiden Set", "Après Gaol Cave"],
      ["Fingerprint Set", "Butin de Roundtable Knight Vyke"],
      ["Nomadic Merchant's Set", "Chambres funéraires sous Subterranean Shunning-Grounds"],
      ["Midra's Gaze", "Butin de Midra"]
    ],
    wpn: [
      ["Nomad's Kilij", "Weeping Peninsula, butin de Shabriri's Chosen, evergaol de la côte ouest de Castle Morne Town"],
      ["Three Finger Blade", "Yelough Anix Ruins"],
      ["Vyke's War Spear", "Butin de Festering Fingerprint Vyke"],
      ["Blade of Distant Light", "Abandoned Church"],
      ["Maddening Brand", "Weeping Peninsula, Castle Morne Town, tas de cadavres en feu au pied d'un arbre, à l'ouest de la ville"],
      ["Fingerprint Hexmark", "Frenzied Flame Proscription, en descendant par les poutres depuis la grâce Cathedral of the Forsaken"],
      ["Greatsword of Midra", "Vendu par Enia après Midra, Lord of Frenzied Flame"]
    ],
    runes: [
      ["Frenzied Flare; Touch of Frenzy; The Flame of Frenzy", "Weeping Peninsula, Ailing Village Outskirts : point de départ"],
      ["Frenzied Burst; Mark of Frenzy; Inescapable Frenzy; Deranged Fury", "Weeping Peninsula, Impaler's Catacombs : en battant Frenzied Burial Watchdog"],
      ["Hyetta's Flare; Howl of Shabriri; Mind Melt; Tendrils of Shabriri", "Liurnia, Church of Inhibition : en battant Festering Fingerprint Vyke"],
      ["Three Finger Flare; Unendurable Frenzy; Eye of Frenzy; Disintegration", "Caelid, Gaol Cave : en battant Frenzied Troll"],
      ["Eye of Chaos; Chaos Beam; Heart of Chaos; Three Finger's Embrace; Apocalyptic Flames", "Frenzied Flame Proscription : donné par Hyetta à la fin de sa quête, après avoir embrassé les Three Fingers"]
    ],
    cat: [["Frenzied Flame Seal", "Frenzied Flame Camp, avant Volcano Cave"]],
    uniq: ["Ivory Sickle", "Stormveil Castle"]
  },
  blood: {
    set: "War Surgeon Set", rune: "Rune of Bloodflame",
    armor: [
      ["House Marais Set", "Après Maleigh Marais, castellan de Shaded Castle"],
      ["Sanguine Noble Set", "Mohg's Palace"],
      ["White Reed Set", "Spirit Caller Cave"],
      ["Ansbach's Set", "Butin d'Ansbach"],
      ["Rakshasa Set", "Eastern Nameless Mausoleum"]
    ],
    wpn: [
      ["Reduvia", "Limgrave, invasion de Bloody Finger Nerijus près de Murkwater Cave"],
      ["Bloody Helice", "Writheblood Ruins"],
      ["Morgott's Cursed Sword", "Acheté après Morgott"],
      ["Eleonora's Poleblade", "Altus Plateau, après l'invasion d'Eleonora, Violet Bloody Finger"],
      ["Mohgwyn Censer", "Subterranean Shunning-Grounds, Leyndell Catacombs, en battant Esgar, Priest of Blood"],
      ["Mohgwyn's Sacred Spear", "Vendu par Enia après Mohg"],
      ["Varre's Bouquet", "Après l'invasion de White-Faced Varre"],
      ["Rivers of Blood", "Mountaintops of the Giants, invasion de Bloody Finger Okina devant Church of Repose"],
      ["Bloodflame Kamas", "Sur un Sanguine Noble envahisseur, Consecrated Snowfield"],
      ["Konrad's Bloodletter", "Mohgwyn Palace, butin de Konrad, Pureblood Knight"]
    ],
    runes: [
      ["Blood Seeker; Bloodflame Talons; Siphon the Formless; Bloodflame Blade", "Liurnia, Rose Church : point de départ"],
      ["Bloodboon Spray; Dynastic Replenishment; Boiling Blood; Purifying Cautery", "Liurnia, Road's End Catacombs : en battant Spiritcaller Snail"],
      ["Bloodboon Slash; Sanguine Pull; Bloodflame Outburst; Dynastic Sacrament; Bloodflame Scythe", "Altus Plateau, Writheblood Ruins : coffre après Sanguine Noble"],
      ["Outer Realm's Gift; Hex of Mohgwyn; Bloodflame Missile; Bloodflame Scatter", "Mountaintops of the Giants, Church of Repose : en battant Bloody Finger Okina"],
      ["Blood Rain; Blood Pact; Hidden Mother's Blessing", "Mohgwyn Palace : butin de Konrad, Pureblood Knight"]
    ],
    cat: [["Mohgwyn Seal", "Liurnia, Rose Church, donné par Varre après avoir envahi Magnus the Beast Claw"]],
    uniq: ["Surgeon's Catling", "Second Church of Marika, Altus"]
  },
  rot: {
    set: "Servant of Rot Set", rune: "Rune of Rot",
    armor: [
      ["Cleanrot Knight Set", "Shaded Castle"],
      ["Malenia's Set", "Vendu par Enia après Malenia"],
      ["Millicent's Set", "Haligtree Town"]
    ],
    wpn: [
      ["Scorpion's Stinger", "Lake of Rot"],
      ["Rotten Crystal Sword", "Elphael"],
      ["Antspur Rapier", "Ainsel River"],
      ["Blade of Scarlet Bloom", "Lake of Rot"],
      ["Serpentbone Blade", "Quête de Tanith"],
      ["Hand of Malenia", "Acheté après Malenia"],
      ["Rotten Battle Hammer", "Grave Warden Duelist, Consecrated Snowfield"],
      ["Rotten Crystal Spear", "Sellia Hideaway"],
      ["Rotten Greataxe", "Grave Warden Duelist près d'Ordina"],
      ["Greatstaff of Decay", "Vendu par Enia après Scion of the Sealed God"],
      ["Scarlet Triscythe", "Radahn Festival Battleground"]
    ],
    runes: [
      ["Poison Mist; Poison Orb; Swarm of Flies; Poison Armament", "Caelid, Swamp of Aeonia : cadavre dans une crevasse cachée sur la rive sud-ouest du marais"],
      ["Pest Threads; Chitinous Shell; Blighted Orb; Rotten Mist; Miranda Bloom", "Caelid, Caelid Waypoint Ruins : coffre souterrain"],
      ["Poison Dart; Pest's Tenacity; Carrion Swarm; Convert Corruption", "Caelid, Gowry's Shack : donné par Gowry contre l'Unalloyed Golden Needle"],
      ["Pest Darts; Rotten Burst; Blighted Contagion", "Mt. Gelmir, Seethewater Cave : en battant Kindred of Rot"],
      ["Rot Spray; Aspect of the Scorpion; Blessing of the Sealed God; Pest-Thread Spears", "Lake of Rot : coffre au sud-est de la grâce Grand Cloister"]
    ],
    cat: [["Seal of Rot", "Abandoned Cave, Caelid"]],
    uniq: ["Scorpion Kite Shield", "Swamp of Aeonia"]
  },
  mystic: {
    set: "Mystic Set", rune: "Rune of Ancestors",
    armor: [
      ["Dreamer's Set", "Lake of Rot"],
      ["Great Horned Set", "Butin du Mystic PNJ, Upper Siofra"],
      ["Spiritshaper's Set", "Acheté à Enia après Caimar"],
      ["Thiollier's Set", "Butin de Thiollier"],
      ["St. Trina's Blossom", "Garden of Deep Purple, après Promised Consort"],
      ["Lamenter's Mask", "Lamenter's Gaol"]
    ],
    wpn: [
      ["Sword of St. Trina", "Près de Caelem Ruins"],
      ["Greathorn Hammer", "Siofra River"],
      ["Jawbone Axe", "Siofra River"],
      ["Winged Greathorn", "Vendu par Enia après Regal Ancestor Spirit"],
      ["Spear of Tranquility", "Lake of Rot"],
      ["Caimar's Battlestaff", "Acheté après Spiritshaper Caimar"],
      ["Spear of the Dreaming", "Crumbling Farum Azula, butin de la Mystic Huntress of the Lost Tribe"],
      ["Goras' Claws", "Nokron, butin de Goras, Scourge of Dreams, sur le chemin du Siofra Plateau"],
      ["Velvet Sword of St. Trina", "Cerulean Coast, petite grotte deux plateformes plus bas, au nord-ouest de la grâce Fissure Cross"]
    ],
    runes: [
      ["Soporific Fume; Dream Siphon; Spirit Vapor; Ancestral Conduit", "Liurnia, Uld Palace Ruins : point de départ"],
      ["Dream Cloak; Spirit Link; Spirit Seekers; Blinding Veil", "Siofra River : cadavre pendu à un rebord, près d'Abandoned Merchant"],
      ["Recurring Nightmare; Vapor Spray; Berserk; Psychic Corrosion", "Mt. Gelmir, Volcano Cave : en battant Demi-Human Queen Margot"],
      ["Call to Slumber; Bewitch; Psychic Agony; Seeker Salvo", "Altus Plateau, Old Altus Tunnel : en battant Stonedigger Troll"],
      ["Vapor Wave; Spirit Siphon; Spirit Weaving; Dream Meld", "Crumbling Farum Azula : dans un gazebo des terres ancestrales, au sud-est de la grâce Lost Tribe Spirit Grounds"],
      ["Rings of Spectral Light; Watchful Spirit", "Belurat : donné par la Hornsent Grandam"]
    ],
    cat: [["Spiritshaper Seal", "Coffre en Upper Siofra"]],
    uniq: ["St. Trina's Torch", "Upper Siofra"]
  },

  /* ---------- Atypiques ---------- */
  perfumer: {
    set: "Traveling Perfumer's Set",
    armor: [
      ["Depraved Perfumer Set", "Shaded Castle"],
      ["Omenkiller Set", "Perfumer's Ruins"],
      ["Perfumer Set", "Perfumer's Grotto"]
    ],
    wpn: [
      ["Sword of Milos", "Leyndell, butin du Dung Eater qui envahit dans les douves (quête du Dung Eater)"],
      ["Ripple Blade", "Vendu par Pidia"],
      ["Ripple Crescent Halberd", "Liurnia, îlot au nord-ouest de la grâce Scenic Isle, gardé par trois Albinaurics"],
      ["Firespark Perfume Bottle", "Gravesite Plain, coffre au sud de la grâce Castle Front"],
      ["Chilling Perfume Bottle", "Lamenter's Gaol"],
      ["Frenzyflame Perfume Bottle", "Abyssal Woods"],
      ["Lightning Perfume Bottle", "Au nord-est de la grâce Cerulean Coast"],
      ["Deadly Poison Perfume Bottle", "Acheté à Thiollier"],
      ["Tricia's Pomander", "Quête Tricia's Treasure"],
      ["Pulley Crossbow", "Mt. Gelmir Craftsman's Shack"],
      ["Jar Cannon", "Volcano Cave"]
    ]
  },
  prisoner: {
    set: "Prisoner Set", note: NOTE_P,
    wnote: "Le Prisoner n'a aucune arme propre à la classe.",
    armor: [
      ["Horned Warrior Set", "Gauntlets : Stormveil Castle · Greaves : Hermit Village · Armor : Subterranean Shunning-Grounds · Helm : Belurat, Tower Settlement"],
      ["Eccentric's Set", "Manchettes : Witchbane Ruins · Breeches : Caria Manor · Armor : Redmane Castle · Hood : Heretical Rise"],
      ["All-Knowing Set", "Gauntlets : Fort Haight · Greaves : Academy Crystal Cave · Armor : Leyndell · Helm : donné par Gideon après avoir découvert Mohgwyn Dynasty Mausoleum"]
    ]
  }
};
export default DET;
