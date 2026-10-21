import type { Build } from "./types";
/* Idées de jeu par classe : priorités de statistiques, parcours, talismans et combinaisons d'équipement.
   Talismans limités à ceux du mod (base d'objets, wiki Convergence) ; le reste est une suggestion, pas une source du mod. */

// nom du talisman : [effet, où le trouver]
var TAL: Record<string, [effect: string, where: string]> = {
  "Erdtree's Favor": ["+4 % PV, +10 % endurance, +8 % charge max", "Fabriqué avec un Enchanted Remnant"],
  "Two-Headed Turtle Talisman": ["Récupération d'endurance fortement accrue", "Fabriqué avec un Enchanted Remnant"],
  "Crimson Amber Medallion": ["+6 % de PV max", "Fabriqué avec un Enchanted Remnant"],
  "Cerulean Amber Medallion": ["+7 % de PC max", "Fabriqué avec un Enchanted Remnant"],
  "Claw Talisman": ["+15 % aux attaques sautées", "Fabriqué avec un Combat Remnant"],
  "Warrior Jar Shard": ["+15 % aux compétences d'arme", "Fabriqué avec un Combat Remnant"],
  "Great-Jar's Arsenal": ["+20 % de charge max", "Fabriqué avec un Combat Remnant"],
  "Spear Talisman": ["+15 % aux attaques en garde des armes d'estoc, garde moins coûteuse en endurance", "Fabriqué avec un Combat Remnant"],
  "Curved Sword Talisman": ["+20 % aux contre-attaques en garde, garde moins coûteuse en endurance", "Fabriqué avec un Combat Remnant"],
  "Arrow's Soaring Sting Talisman": ["+65 % de portée des arcs, +10 % aux flèches et carreaux", "Fabriqué avec un Combat Remnant"],
  "Quiver Talisman": ["Plus de munitions consommées, mais les tirs coûtent 15 % d'endurance en plus", "Fabriqué avec un Combat Remnant"],
  "Sharpshot Talisman": ["+10 % aux tirs visés", "Fabriqué avec un Combat Remnant"],
  "Axe Talisman": ["+10 % aux attaques chargées", "Fabriqué avec un Combat Remnant"],
  "Two-Handed Sword Talisman": ["+10 % aux attaques à deux mains", "Fabriqué avec un Combat Remnant"],
  "Godfrey Icon": ["+15 % aux sorts et compétences chargés", "Fabriqué avec un Enchanted Remnant"],
  "Bull-Goat's Talisman": ["+33 % de robustesse", "Fabriqué avec un Combat Remnant"],
  "Dragoncrest Greatshield Talisman": ["+10 % d'absorption physique", "Fabriqué avec un Warding Remnant"],
  "Verdigris Discus": ["Défense accrue avec une charge élevée", "Fabriqué avec un Warding Remnant"],
  "Winged Sword Insignia": ["Attaque accrue sur coups enchaînés (6, 8 puis 13 %)", "Fabriqué avec un Combat Remnant"],
  "Twinblade Talisman": ["+20 % au dernier coup d'un enchaînement", "Fabriqué avec un Combat Remnant"],
  "Blue Dancer Charm": ["+15 % d'attaque avec une charge légère", "Fabriqué avec un Combat Remnant"],
  "Crossed-Tree Talisman": ["+15 % aux attaques après sprint, roulade ou pas en arrière", "Fabriqué avec un Combat Remnant"],
  "Assassin's Curio": ["Les coups critiques rendent PV et PC", "Fabriqué avec un Combat Remnant"],
  "Dagger Talisman": ["+17 % aux coups critiques", "Fabriqué avec un Combat Remnant"],
  "Blade of Mercy": ["+15 % d'attaque pendant 20 s après un coup critique", "Fabriqué avec un Combat Remnant"],
  "Thief's Bauble": ["Déplacements silencieux, invisible accroupi à distance, aucun dégât de chute", "Fabriqué avec un Enchanted Remnant"],
  "Crusade Insignia": ["+15 % d'attaque pendant 20 s après avoir vaincu un ennemi", "Fabriqué avec un Combat Remnant"],
  "Stargazer Heirloom": ["+6 Intelligence", "Fabriqué avec un Heirloom Remnant"],
  "Two Fingers Heirloom": ["+6 Foi", "Fabriqué avec un Heirloom Remnant"],
  "Starscourge Heirloom": ["+6 Force", "Fabriqué avec un Heirloom Remnant"],
  "Prosthesis-Wearer Heirloom": ["+6 Dextérité", "Fabriqué avec un Heirloom Remnant"],
  "Outer God Heirloom": ["+6 Arcanes", "Fabriqué avec un Heirloom Remnant"],
  "Valorous Heirloom": ["+3 Force et Dextérité", "Fabriqué avec un Heirloom Remnant"],
  "Strategist Heirloom": ["+3 Force et Intelligence", "Fabriqué avec un Heirloom Remnant"],
  "Saboteur Heirloom": ["+3 Dextérité et Intelligence", "Fabriqué avec un Heirloom Remnant"],
  "Midnight Heirloom": ["+3 Intelligence et Foi", "Fabriqué avec un Heirloom Remnant"],
  "Forbidden Heirloom": ["+3 Intelligence et Arcanes", "Fabriqué avec un Heirloom Remnant"],
  "Chosen Heirloom": ["+3 Force et Foi", "Fabriqué avec un Heirloom Remnant"],
  "Cloister Heirloom": ["+3 Dextérité et Foi", "Fabriqué avec un Heirloom Remnant"],
  "Scorpion Heirloom": ["+3 Foi et Arcanes", "Fabriqué avec un Heirloom Remnant"],
  "Perfume Heirloom": ["+3 Dextérité et Arcanes", "Fabriqué avec un Heirloom Remnant"],
  "Radagon Icon": ["Sorts lancés plus vite", "Fabriqué avec un Enchanted Remnant"],
  "Primal Glintstone Blade": ["-10 % de PC pour les sorts", "Fabriqué avec un Enchanted Remnant"],
  "Moon of Nokstella": ["+2 emplacements de sorts", "Fabriqué avec un Enchanted Remnant"],
  "Carian Filigreed Crest": ["-25 % de PC pour les compétences", "Fabriqué avec un Enchanted Remnant"],
  "Blessed Blue Dew Talisman": ["Rend 1 PC par seconde", "Fabriqué avec un Enchanted Remnant"],
  "Blessed Dew Talisman": ["Rend 4 PV par seconde", "Fabriqué avec un Warding Remnant"],
  "Old Lord's Talisman": ["Double la durée des sorts de buff", "Fabriqué avec un Enchanted Remnant"],
  "Taker's Cameo": ["Rend PV, PC et endurance à chaque ennemi vaincu", "Fabriqué avec un Warding Remnant"],
  "Dried Bouquet": ["+20 % d'attaque quand une invocation meurt ; les ennemis te ciblent moins", "Fabriqué avec un Enchanted Remnant"],
  "Godskin Swaddling Cloth": ["Les coups enchaînés rendent des PV", "Fabriqué avec un Combat Remnant"],
  "Blasphemer's Crest": ["Immunité aux dégâts de la lave", "Fabriqué avec un Warding Remnant"],
  "Flamedrake Talisman": ["+20 % d'absorption de feu", "Fabriqué avec un Warding Remnant"],
  "Boltdrake Talisman": ["+20 % d'absorption de foudre", "Fabriqué avec un Warding Remnant"],
  "Clarifying Horn Charm": ["Immunité à la folie, mais -4 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Perfumer's Talisman": ["+20 % aux parfums", "Fabriqué avec un Enchanted Remnant"],
  "Companion Jar": ["+20 % aux pots lancés", "Fabriqué avec un Combat Remnant"],
};

var B: Record<string, Build> = {
  retainer: {
    stats: "Vigueur d'abord, puis Force et Dextérité à parts égales ; Endurance pour porter l'armure lourde.",
    plan: [
      "Blade of Valor + Kite Shield : joue derrière le bouclier, l'arbalète sert à attirer les ennemis un par un.",
      "Passe sur Osian's Greatsword ou Reaver's Odachi quand la Force suit ; vise le Godrick Knight Set.",
      "Commander's Standard ou Ghiza's Wheel pour la puissance brute, Leda's Armor en tenue de fin."
    ],
    tal: ["Erdtree's Favor","Valorous Heirloom","Curved Sword Talisman","Warrior Jar Shard","Great-Jar's Arsenal"],
    combo: [
      ["Chevalier au bouclier", "Blade of Valor + Kite Shield + Curved Sword Talisman", "Garde haute en permanence : chaque contre-attaque en garde frappe plus fort et coûte moins d'endurance."],
      ["Porte-étendard", "Commander's Standard + Godrick Knight Set + Warrior Jar Shard", "Grande allonge et compétence de bannière renforcée par Warrior Jar Shard."]
    ]
  },
  vanguard: {
    stats: "Vigueur, Force et Dextérité équilibrées ; Endurance haute pour les enchaînements de lance.",
    plan: [
      "Phalanx Pike : garde la distance et pique en garde ou en poussée.",
      "Ronin Set et Reaver's Odachi pour un style plus mobile.",
      "Night's Cavalry Set + Gargoyle's Great Axe ou Palm-Ax Twinblade contre les groupes."
    ],
    tal: ["Erdtree's Favor","Spear Talisman","Two-Headed Turtle Talisman","Claw Talisman","Valorous Heirloom"],
    combo: [
      ["Phalange", "Phalanx Pike + Scaled Set + Spear Talisman", "Allonge et défense : Spear Talisman renforce les coups portés bouclier levé."],
      ["Cavalier de la nuit", "Gargoyle's Great Axe + Night's Cavalry Set + Claw Talisman", "Gros dégâts de zone, attaques sautées pour casser la posture."]
    ]
  },
  marksman: {
    stats: "Dextérité en priorité pour les arcs, Vigueur ensuite ; un peu de Force pour les grands arcs et la baliste.",
    plan: [
      "Composite Bow à distance, Quality Smithscript Dagger en dépannage ; tire depuis les hauteurs.",
      "Black Bow et Pulley Bow pour la cadence, Repeating Crossbow contre les groupes.",
      "Greatbow ou Golem Greatbow contre les boss, Hand Ballista pour les gros dégâts ponctuels."
    ],
    tal: ["Arrow's Soaring Sting Talisman","Quiver Talisman","Sharpshot Talisman","Prosthesis-Wearer Heirloom","Valorous Heirloom"],
    combo: [
      ["Tireur d'élite", "Longbow + Page Set + Arrow's Soaring Sting Talisman", "+65 % de portée pour éliminer avant d'être vu ; l'armure légère garde la roulade rapide."],
      ["Artillerie lourde", "Greatbow + Sharpshot Talisman + Quiver Talisman", "Tirs visés renforcés et munitions illimitées contre les boss ; surveille l'endurance."]
    ]
  },
  berserker: {
    stats: "Force avant tout, Vigueur juste derrière ; Endurance pour enchaîner les attaques chargées.",
    plan: [
      "Executioner's Heavy Greataxe : attaques chargées pour casser la posture, roule plutôt que de bloquer.",
      "Leaden Maul ou Sigur's Greatmace, Raging Wolf Set pour rester mobile.",
      "Axe of Godfrey et Elden Lord Set pour un build full Force."
    ],
    tal: ["Starscourge Heirloom","Axe Talisman","Two-Handed Sword Talisman","Godfrey Icon","Erdtree's Favor"],
    combo: [
      ["Loup enragé", "Executioner's Heavy Greataxe + Raging Wolf Set + Axe Talisman", "Axe Talisman renforce les attaques chargées ; l'armure légère laisse esquiver entre deux charges."],
      ["Seigneur d'Elden", "Axe of Godfrey + Elden Lord Set + Godfrey Icon", "Godfrey Icon renforce les compétences chargées, idéal pour le cri de l'arme."]
    ]
  },
  dreadnought: {
    stats: "Vigueur et Endurance hautes pour l'armure lourde, Force en statistique principale.",
    plan: [
      "Leaden Maul + Dragon Towershield : avance bouclier levé, frappe dans les ouvertures.",
      "Bull-Goat Set pour la robustesse, Yura's Kanabo pour les enchaînements.",
      "Lionel's Set ou Verdigris Set, Grafted Blade Greatsword en arme finale."
    ],
    tal: ["Bull-Goat's Talisman","Great-Jar's Arsenal","Verdigris Discus","Dragoncrest Greatshield Talisman","Starscourge Heirloom"],
    combo: [
      ["Forteresse", "Dragon Towershield + Bull-Goat Set + Bull-Goat's Talisman", "Tu encaisses sans broncher et tu frappes dans la foulée."],
      ["Bélier", "Grafted Blade Greatsword + Lionel's Set + Great-Jar's Arsenal", "Arsenal permet l'armure la plus lourde avec l'arme la plus lourde sans roulade lente."]
    ]
  },
  sellsword: {
    stats: "Dextérité en priorité, Vigueur ensuite ; Endurance pour les rafales de doubles lames.",
    plan: [
      "Sulien's Razors : enchaîne vite, saute pour les attaques en paire.",
      "Bloodhound Hookblade ou Flowing Curved Sword ; Kaiden Set pour la robustesse.",
      "Emyr's Great Talons et Dancer's Set pour un style dansé."
    ],
    tal: ["Winged Sword Insignia","Twinblade Talisman","Prosthesis-Wearer Heirloom","Blue Dancer Charm","Claw Talisman"],
    combo: [
      ["Tempête de lames", "Sulien's Razors + Winged Sword Insignia + Twinblade Talisman", "L'insigne monte l'attaque à chaque coup, Twinblade Talisman renforce le coup final de l'enchaînement."],
      ["Danseur", "Flowing Curved Sword + Dancer's Set + Blue Dancer Charm", "Charge légère : +15 % d'attaque et mobilité maximale."]
    ]
  },
  rogue: {
    stats: "Dextérité en priorité ; assez de Vigueur pour survivre à une erreur, un peu d'Esprit pour les compétences.",
    plan: [
      "Foil of Caddock + Buckler : pare, puis place un coup critique.",
      "Raptor's Set pour la mobilité, Bloodhound Hookblade pour le saignement.",
      "Black Bow pour ouvrir le combat à distance, Braided Cord Set en tenue d'assassin."
    ],
    tal: ["Dagger Talisman","Assassin's Curio","Blade of Mercy","Thief's Bauble","Crossed-Tree Talisman"],
    combo: [
      ["Parade et riposte", "Foil of Caddock + Buckler + Dagger Talisman", "Dagger Talisman renforce les critiques, Assassin's Curio rend PV et PC à chacun."],
      ["Ombre", "Black Bow + Leather Set + Thief's Bauble", "Silencieux et invisible accroupi : ouvre d'une flèche puis va au contact."]
    ]
  },
  glint: {
    stats: "Intelligence en priorité, Esprit pour les PC, Vigueur à ne pas négliger ; un peu de Dextérité pour les épées cariennes.",
    plan: [
      "Swift Glintstone Shard à distance, Carian Slicer quand ça se rapproche.",
      "Carian Greatsword et Thops's Barrier ; Moonveil en arme Intelligence/Dextérité.",
      "Azur's Glintstone Staff + Comet ou Rennala's Full Moon, Queen of the Full Moon Set."
    ],
    tal: ["Stargazer Heirloom","Saboteur Heirloom","Radagon Icon","Cerulean Amber Medallion","Moon of Nokstella"],
    combo: [
      ["Épéiste carien", "Moonveil + Carian Knight Set + Carian Greatsword", "Arme et sorts d'épée : tout scale sur l'Intelligence."],
      ["Canon à comètes", "Azur's Glintstone Staff + Comet + Stargazer Heirloom", "+6 Intelligence pour la puissance brute ; Cerulean Amber Medallion pour tenir les PC."]
    ]
  },
  starcaller: {
    stats: "Intelligence et Force pour les armes de gravité, Vigueur, un peu d'Esprit.",
    plan: [
      "Gravity Well pour attirer, Meteoric Ore Blade pour finir au contact.",
      "Meteorite Staff + Rock Sling ou Meteorite pour la zone ; Alabaster Lord's Greatsword.",
      "Starscourge Greatsword ou Ruins Greatsword avec General Radahn's Set."
    ],
    tal: ["Strategist Heirloom","Godfrey Icon","Starscourge Heirloom","Primal Glintstone Blade","Erdtree's Favor"],
    combo: [
      ["Gravité au contact", "Meteoric Ore Blade + Gravity Well + Godfrey Icon", "Attire, frappe, recommence : la gravité regroupe, l'épée finit."],
      ["Général de la gravité", "Starscourge Greatsword + General Radahn's Set + Starscourge Heirloom", "Hommage à Radahn : grosse arme de gravité, Starscourge Heirloom pour la Force."]
    ]
  },
  underworld: {
    stats: "Intelligence et Dextérité, Vigueur ; Esprit pour enchaîner les bulles.",
    plan: [
      "Frozen Cragbolt à distance, Dragonkin Seeker Sword avec Frozen Lightning Armament au contact.",
      "Armor of Bubbles et Cragbolt Mine pour piéger ; Dragonscale Blade.",
      "Dragonkin Scepter + Frozen Lightning Storm, Blue Silver Set."
    ],
    tal: ["Saboteur Heirloom","Moon of Nokstella","Radagon Icon","Primal Glintstone Blade","Boltdrake Talisman"],
    combo: [
      ["Lame gelée", "Dragonscale Blade + Frozen Lightning Armament + Saboteur Heirloom", "Infuse la foudre gelée ; l'Heirloom monte Intelligence et Dextérité à la fois."],
      ["Champ de mines", "Dragonkin Scepter + Cragbolt Mine + Moon of Nokstella", "Pose les mines, recule, laisse exploser ; Nokstella pour équiper plus de sorts."]
    ]
  },
  volcanist: {
    stats: "Intelligence et Foi à parts égales, Esprit, Vigueur.",
    plan: [
      "Lava Dart et Magma Shot, Molten Sword en secours.",
      "Gelmir Knight Set, Magma Blade, Lava Pool pour contrôler le terrain.",
      "Lavastone Staff + Rykard's Rancor, Blasphemous Blade pour les soins."
    ],
    tal: ["Midnight Heirloom","Blasphemer's Crest","Taker's Cameo","Flamedrake Talisman","Primal Glintstone Blade"],
    combo: [
      ["Chevalier de Gelmir", "Magma Blade + Gelmir Knight Set + Blasphemer's Crest", "Mêlée de feu, et tu te bats dans la lave sans dégâts."],
      ["Blasphémateur", "Blasphemous Blade + Consort's Set + Taker's Cameo", "Chaque ennemi vaincu rend PV, PC et endurance : enchaîne les groupes."]
    ]
  },
  stormcaller: {
    stats: "Intelligence et Foi, Force pour la hallebarde, Vigueur.",
    plan: [
      "Banished Knight's Halberd au contact, Storm Gust et Rebuff pour repousser.",
      "Storm Armament et Whirlwind ; Banished Knight Set.",
      "Tempestcaller Staff + Tornado, Cloud Form pour te repositionner."
    ],
    tal: ["Midnight Heirloom","Godfrey Icon","Radagon Icon","Erdtree's Favor","Two-Headed Turtle Talisman"],
    combo: [
      ["Chevalier banni", "Banished Knight's Halberd + Banished Knight Set + Storm Armament", "Hallebarde enchantée de vent : allonge et contrôle de foule."],
      ["Œil du cyclone", "Tempestcaller Staff + Twister + Divine Beast Set", "Garde les ennemis à distance et frappe en tempête."]
    ]
  },
  nox: {
    stats: "Intelligence et Foi, Dextérité pour Quicksilver Rapier, Esprit.",
    plan: [
      "Night Shard à distance, Quicksilver Rapier au contact, Night Maiden's Mist en zone.",
      "Darkness et Unseen Blade pour l'embuscade ; Nox Flowing Sword.",
      "Lusat's Night Staff + Night Comet, Set of Night."
    ],
    tal: ["Midnight Heirloom","Thief's Bauble","Assassin's Curio","Moon of Nokstella","Cerulean Amber Medallion"],
    combo: [
      ["Assassin nocturne", "Black Knife Set + Unseen Blade + Thief's Bauble", "Invisible et silencieux : un critique d'ouverture puis repli."],
      ["Épéiste Nox", "Nox Flowing Sword + Nox Swordstress Set + Midnight Heirloom", "Épée-fouet à longue portée, Intelligence et Foi montées ensemble."]
    ]
  },
  necromancer: {
    stats: "Intelligence et Foi, Esprit élevé pour les invocations, Vigueur.",
    plan: [
      "Tibia's Summons pour occuper les ennemis, Fia's Mist en zone, Spirit Sword au contact.",
      "Rally the Legion et Sacrifice ; Mantis Blade ou Death's Poker.",
      "Prince of Death's Staff + Ghostflame Cannon, Gravebird Set."
    ],
    tal: ["Dried Bouquet","Midnight Heirloom","Taker's Cameo","Radagon Icon","Cerulean Amber Medallion"],
    combo: [
      ["Légion", "Tibia's Summons + Rally the Legion + Dried Bouquet", "Les invocations encaissent ; quand l'une tombe, +20 % d'attaque, et les ennemis te ciblent moins."],
      ["Flamme fantôme", "Death's Poker + Gravebird Set + Midnight Heirloom", "Givre fantôme au contact, Intelligence et Foi montées ensemble."]
    ]
  },
  frost: {
    stats: "Intelligence et Arcanes, Esprit, Vigueur.",
    plan: [
      "Ice Dart et Freezing Mist pour accumuler le gel, Frozen Needle au contact.",
      "Renna's Barrier et Icecrag Spear ; Zamor Curved Sword.",
      "Snow Witch Staff + Ranni's Dark Moon, Dark Moon Greatsword."
    ],
    tal: ["Forbidden Heirloom","Carian Filigreed Crest","Stargazer Heirloom","Cerulean Amber Medallion","Radagon Icon"],
    combo: [
      ["Lame lunaire", "Dark Moon Greatsword + Blaidd's Set + Carian Filigreed Crest", "La compétence de l'épée coûte moins cher et gèle."],
      ["Tempête de givre", "Snow Witch Staff + Freezing Mist + Snow Witch Set", "Accumule le gel puis éclate tout : idéal contre les gros ennemis."]
    ]
  },
  aberrant: {
    stats: "Intelligence et Arcanes pour le saignement, Vigueur, Esprit.",
    plan: [
      "Briars of Sin et Body of Briar, Regalia of Eochaid au contact.",
      "Thorn of the Guilty, Red Glintstone Razor ; Bloodhound Knight Set pour la mobilité.",
      "Staff of the Guilty + Blood Comet, Alberich's Set."
    ],
    tal: ["Forbidden Heirloom","Outer God Heirloom","Godfrey Icon","Radagon Icon","Erdtree's Favor"],
    combo: [
      ["Ronces maudites", "Staff of the Guilty + Briars of Sin + Alberich's Set", "Alberich's Set renforce les sorts de ronces."],
      ["Chien de chasse", "Bloodhound Claws + Bloodhound Knight Set + Outer God Heirloom", "Saignement rapide, et +6 Arcanes pour l'accumuler encore plus vite."]
    ]
  },
  flame: {
    stats: "Foi en priorité, Esprit, Vigueur ; Force pour les armes du Fell God.",
    plan: [
      "Flame Sling à distance, Catch Flame et Fell Flame Sword au contact.",
      "Flaming Armament ; Fire Monk Set et Monk's Flamemace.",
      "Giant's Seal + Flame of the Fell God, Fire Prelate Set et Prelate's Inferno Crozier."
    ],
    tal: ["Two Fingers Heirloom","Chosen Heirloom","Flamedrake Talisman","Radagon Icon","Erdtree's Favor"],
    combo: [
      ["Prélat", "Prelate's Inferno Crozier + Fire Prelate Set + Chosen Heirloom", "Grosse masse de feu à Force et Foi, armure lourde pour encaisser."],
      ["Feu des géants", "Giant's Seal + Flame of the Fell God + Fire Monk Set", "Giant's Seal renforce les incantations de feu des géants."]
    ]
  },
  fundamentalist: {
    stats: "Foi en priorité, Esprit, Vigueur.",
    plan: [
      "Rune Shards à distance, Rejection pour respirer, Axe of Epiphany au contact.",
      "Order's Blade ; Golden Halberd ou Hammer of Virtue, Tree Sentinel Set.",
      "Golden Order Seal + Elden Stars, Golden Order Greatsword."
    ],
    tal: ["Two Fingers Heirloom","Blessed Dew Talisman","Radagon Icon","Primal Glintstone Blade","Erdtree's Favor"],
    combo: [
      ["Sentinelle de l'arbre", "Golden Halberd + Tree Sentinel Set + Order's Blade", "Hallebarde sacrée et armure lourde : un tank lumineux."],
      ["Ordre doré", "Golden Order Seal + Elden Stars + Two Fingers Heirloom", "Pose Elden Stars et laisse faire ; +6 Foi pour la puissance."]
    ]
  },
  bestial: {
    stats: "Foi et Force, Vigueur ; Endurance pour les attaques bestiales.",
    plan: [
      "Beast Talons et Gravel Sling, Bestial Beast Claw au contact.",
      "Beast Claw et Stone Skin ; Beastclaw Greathammer, Beast Champion Set.",
      "Earthbreaker Seal + Stone of Gurranq, Crucible Axe Set."
    ],
    tal: ["Old Lord's Talisman","Chosen Heirloom","Two Fingers Heirloom","Claw Talisman","Erdtree's Favor"],
    combo: [
      ["Champion bestial", "Beastclaw Greathammer + Beast Champion Set + Old Lord's Talisman", "Bestial Strength et Stone Skin durent plus longtemps : frappe sous buffs."],
      ["Creuset", "Siluria's Tree + Crucible Tree Set + Claw Talisman", "Grande lance et attaques sautées, thème du Creuset."]
    ]
  },
  dragoncultist: {
    stats: "Foi en priorité, Force ou Dextérité selon l'arme, Vigueur.",
    plan: [
      "Lightning Spear à distance, Draconic Epitaph + Electrify Armament au contact.",
      "Lightning Strike, Leyndell Knight Set ; Dragon Greatclaw.",
      "Dragon Cult Seal + Ancient Lightning Spear, Bolt of Gransax."
    ],
    tal: ["Two Fingers Heirloom","Cloister Heirloom","Spear Talisman","Boltdrake Talisman","Erdtree's Favor"],
    combo: [
      ["Chevalier de Leyndell", "Bolt of Gransax + Leyndell Knight Set + Spear Talisman", "Lance de foudre et compétence à très longue portée."],
      ["Électrocution", "Draconic Epitaph + Electrify Armament + Cloister Heirloom", "Infuse, frappe : Dextérité et Foi montées ensemble."]
    ]
  },
  godskin: {
    stats: "Foi et Intelligence, Esprit, Vigueur.",
    plan: [
      "Black Flame Dart à distance, Celebrant's Cleaver + Black Flame Blade au contact.",
      "Godskin Peeler, Scouring Black Flame ; Godskin Apostle Set.",
      "Godslayer Seal + Black Flame Wave, Godslayer's Greatsword."
    ],
    tal: ["Godskin Swaddling Cloth","Midnight Heirloom","Godfrey Icon","Radagon Icon","Erdtree's Favor"],
    combo: [
      ["Apôtre", "Godskin Peeler + Godskin Apostle Set + Godskin Swaddling Cloth", "La glaive tournoie en flamme noire, chaque enchaînement soigne."],
      ["Tueur de dieux", "Godslayer's Greatsword + Godslayer Seal + Midnight Heirloom", "Flamme noire, Foi et Intelligence montées ensemble ; dégâts sur la durée contre les boss."]
    ]
  },
  frenzied: {
    stats: "Foi et Intelligence, Esprit élevé, Vigueur.",
    plan: [
      "Frenzied Flare à bout portant, Nomad's Kilij en secours.",
      "Howl of Shabriri et Mind Melt ; Fingerprint Set pour encaisser.",
      "Frenzied Flame Seal + Disintegration ou Chaos Beam, Three Finger Blade."
    ],
    tal: ["Clarifying Horn Charm","Midnight Heirloom","Cerulean Amber Medallion","Flamedrake Talisman","Radagon Icon"],
    combo: [
      ["Flamme jaune", "Frenzied Flame Seal + Howl of Shabriri + Clarifying Horn Charm", "Folie et feu sans risque : le charme t'immunise contre la folie, au prix de 4 Vigueur."],
      ["Gardien des doigts", "Three Finger Blade + Fingerprint Set + Erdtree's Favor", "Armure lourde et PV en plus pour tenir au contact."]
    ]
  },
  blood: {
    stats: "Arcanes et Foi, Vigueur, Dextérité pour Reduvia.",
    plan: [
      "Reduvia (compétence à distance), Bloodflame Talons ; pare avec le Red Thorn Roundshield.",
      "Bloody Helice ou Morgott's Cursed Sword, Sanguine Noble Set.",
      "Mohgwyn Seal + Bloodflame Missile, Rivers of Blood ou Mohgwyn's Sacred Spear."
    ],
    tal: ["Scorpion Heirloom","Outer God Heirloom","Taker's Cameo","Crusade Insignia","Erdtree's Favor"],
    combo: [
      ["Seigneur du sang", "Rivers of Blood + House Marais Set + Outer God Heirloom", "Saignement continu, +6 Arcanes pour l'accumuler plus vite."],
      ["Lance sanguine", "Mohgwyn's Sacred Spear + Bloodflame Blade + Scorpion Heirloom", "Feu et saignement sur une lance à grande allonge ; Foi et Arcanes montées ensemble."]
    ]
  },
  rot: {
    stats: "Arcanes et Foi, Vigueur, Dextérité pour Antspur Rapier.",
    plan: [
      "Poison Mist et Swarm of Flies, Antspur Rapier pour la pourriture.",
      "Chitinous Shell, Rotten Crystal Sword ; Cleanrot Knight Set.",
      "Seal of Rot + Rot Spray, Hand of Malenia et Malenia's Set."
    ],
    tal: ["Scorpion Heirloom","Perfume Heirloom","Winged Sword Insignia","Crusade Insignia","Erdtree's Favor"],
    combo: [
      ["Valkyrie", "Hand of Malenia + Malenia's Set + Winged Sword Insignia", "Enchaînements rapides, l'insigne monte l'attaque à chaque coup."],
      ["Peste", "Seal of Rot + Poison Mist + Scorpion Heirloom", "Zone et usure ; Foi et Arcanes montées ensemble."]
    ]
  },
  mystic: {
    stats: "Foi et Arcanes, Esprit, Vigueur.",
    plan: [
      "Soporific Fume pour endormir, Spear of Tranquility au contact, Horn Bow à distance.",
      "Dream Cloak et Spirit Seekers ; Greathorn Hammer.",
      "Spiritshaper Seal + Vapor Wave, Sword of St. Trina."
    ],
    tal: ["Scorpion Heirloom","Old Lord's Talisman","Blessed Blue Dew Talisman","Cerulean Amber Medallion","Two-Headed Turtle Talisman"],
    combo: [
      ["Marchand de sable", "Sword of St. Trina + Soporific Fume + St. Trina's Blossom", "Endors, puis frappe un ennemi sans défense."],
      ["Chaman ancestral", "Spiritshaper Seal + Spiritshaper's Set + Blessed Blue Dew Talisman", "Sorts d'esprit et PC qui remontent tout seuls."]
    ]
  },
  perfumer: {
    stats: "Arcanes en priorité, Vigueur, Esprit pour les parfums ; Dextérité pour les épées.",
    plan: [
      "Firespark Perfume Bottle et pots de feu ; Pulley Crossbow pour attirer.",
      "Récolte, fabrique en masse ; Ripple Blade pour la mêlée Arcanes.",
      "Deadly Poison Perfume Bottle et Jar Cannon ; Omenkiller Set."
    ],
    tal: ["Perfumer's Talisman","Companion Jar","Perfume Heirloom","Outer God Heirloom","Erdtree's Favor"],
    combo: [
      ["Grenadier", "Perfumer Set + Perfumer's Talisman + Companion Jar", "Pots et parfums plus forts : vide l'arène avant d'approcher."],
      ["Bourreau parfumé", "Ripple Crescent Halberd + Omenkiller Set + Deadly Poison Perfume Bottle", "Arme Arcanes, puis poison pour l'usure."]
    ]
  },
  prisoner: {
    stats: "Défi au niveau 1 : ne monte pas de niveau pour garder les armures de classe ; les Heirlooms donnent des statistiques sans monter de niveau.",
    plan: [
      "Club et roulade : apprends les attaques des ennemis, ne monte pas de niveau.",
      "Améliore une arme sans exigence de statistiques ; Horned Warrior Set.",
      "Eccentric's Set ou All-Knowing Set ; le build repose sur les talismans."
    ],
    tal: ["Valorous Heirloom","Erdtree's Favor","Two-Headed Turtle Talisman","Crimson Amber Medallion","Great-Jar's Arsenal"],
    combo: [
      ["Évadé", "Club + Horned Warrior Set + Valorous Heirloom", "+3 Force et Dextérité sans monter de niveau : précieux au niveau 1."],
      ["Survivant", "Eccentric's Set + Erdtree's Favor + Crimson Amber Medallion", "La survie d'abord : PV et endurance en plus."]
    ]
  },
};

export default { TAL: TAL, B: B };
