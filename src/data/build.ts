import type { Build } from "./types";
/* Idées de jeu par classe : priorités de statistiques, parcours, talismans utiles (avec le pourquoi) et combinaisons d'équipement.
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
  "Ritual Shield Talisman": ["+30 % de défense quand les PV sont au max", "Fabriqué avec un Warding Remnant"],
  "Lance Talisman": ["+15 % aux attaques à cheval", "Fabriqué avec un Combat Remnant"],
  "Red-Feathered Branchsword": ["+20 % d'attaque sous 20 % de PV", "Fabriqué avec un Combat Remnant"],
  "Pearl Shield Talisman": ["+20 % d'absorption non physique en garde", "Fabriqué avec un Warding Remnant"],
  "Hammer Talisman": ["+20 % de dégâts d'endurance contre une garde", "Fabriqué avec un Combat Remnant"],
  "Talisman of Lord's Bestowal": ["Robustesse après une fiole, invulnérable pendant que tu bois", "Fabriqué avec un Warding Remnant"],
  "Prince of Death's Cyst": ["Immunité à la mort, mais -4 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Warming Horn Charm": ["Immunité au gel, mais -3 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Stalwart Horn Charm": ["Immunité au saignement, mais -5 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Curative Horn Charm": ["Immunité à la pourriture, mais -5 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Immunizing Horn Charm": ["Immunité au poison, mais -3 Vigueur", "Fabriqué avec un Warding Remnant"],
  "Shattered Stone Talisman": ["+10 % aux coups de pied et piétinements", "Fabriqué avec un Combat Remnant"],
  "Silver Scarab": ["+75 % de découverte d'objets", "Fabriqué avec un Enchanted Remnant"],
  "Viridian Amber Medallion": ["+11 % d'endurance max", "Fabriqué avec un Enchanted Remnant"],
  "Talisman of All Crucibles": ["Roulades améliorées, moins de dégâts critiques subis, mais +25 % de dégâts subis", "Fabriqué avec un Warding Remnant"],
};

// tal : [nom, pourquoi pour cette classe, 1 = selon la situation] ; combo : [titre, objets séparés par « + », explication]
var B: Record<string, Build> = {
  retainer: {
    stats: "Vigueur d'abord, puis Force et Dextérité à parts égales ; Endurance pour porter l'armure lourde.",
    plan: [
      "Blade of Valor + Kite Shield : joue derrière le bouclier, l'arbalète sert à attirer les ennemis un par un.",
      "Passe sur Osian's Greatsword ou Reaver's Odachi quand la Force suit ; vise le Godrick Knight Set.",
      "Commander's Standard ou Ghiza's Wheel pour la puissance brute, Leda's Armor en tenue de fin."
    ],
    tal: [
      ["Curved Sword Talisman", "Ton style repose sur le bouclier : contre-attaques en garde +20 % et blocages moins coûteux en endurance."],
      ["Valorous Heirloom", "+3 Force et Dextérité, tes deux statistiques d'attaque."],
      ["Erdtree's Favor", "PV, endurance et charge : tout ce dont une armure lourde a besoin."],
      ["Warrior Jar Shard", "Les compétences de Blade of Valor et des grandes épées frappent plus fort."],
      ["Great-Jar's Arsenal", "Pour porter Leda's Armor ou le Godrick Knight Set avec une grande arme sans roulade lente.", 1],
      ["Ritual Shield Talisman", "+30 % de défense à PV pleins : rentable si tu bloques proprement.", 1],
      ["Dragoncrest Greatshield Talisman", "Contre les boss qui frappent fort au physique.", 1],
      ["Two-Handed Sword Talisman", "Quand tu passes à Osian's Greatsword ou Reaver's Odachi à deux mains.", 1]
    ],
    combo: [
      ["Chevalier au bouclier", "Blade of Valor + Kite Shield + Knight Set + Curved Sword Talisman", "Lève le bouclier, encaisse, puis riposte en garde : le talisman renforce exactement cette contre-attaque. Ajoute Ritual Shield Talisman si tu restes souvent à PV pleins."],
      ["Porte-étendard", "Commander's Standard + Godrick Knight Set + Warrior Jar Shard", "La bannière donne de l'allonge et une compétence de soutien ; Warrior Jar Shard la rend aussi offensive. Très bon en coopération."],
      ["Samouraï lourd", "Reaver's Odachi + Veteran's Set + Two-Handed Sword Talisman", "À deux mains, l'odachi enchaîne vite pour une arme lourde et le talisman renforce chaque coup. Le Veteran's Set garde assez de robustesse pour ne pas être interrompu."],
      ["Roue sanglante", "Ghiza's Wheel + Leda's Armor + Great-Jar's Arsenal", "La roue accumule le saignement pendant sa compétence. Arsenal permet de la porter avec une armure lourde sans roulade lente."]
    ]
  },
  vanguard: {
    stats: "Vigueur, Force et Dextérité équilibrées ; Endurance haute pour les enchaînements de lance.",
    plan: [
      "Phalanx Pike : garde la distance et pique en garde ou en poussée.",
      "Ronin Set et Reaver's Odachi pour un style plus mobile.",
      "Night's Cavalry Set + Gargoyle's Great Axe ou Palm-Ax Twinblade contre les groupes."
    ],
    tal: [
      ["Spear Talisman", "Phalanx Pike est une arme d'estoc : piques en garde +15 % et garde moins coûteuse."],
      ["Valorous Heirloom", "+3 Force et Dextérité, tes deux statistiques d'attaque."],
      ["Two-Headed Turtle Talisman", "Les enchaînements de lance vident l'endurance : elle remonte bien plus vite."],
      ["Erdtree's Favor", "PV et endurance pour tenir la ligne de front."],
      ["Claw Talisman", "Les attaques sautées des haches et hallebardes cassent vite la posture.", 1],
      ["Lance Talisman", "+15 % à cheval : à prendre avec le Night's Cavalry Set.", 1],
      ["Crossed-Tree Talisman", "Pour le style Ronin : frapper juste après une roulade.", 1],
      ["Warrior Jar Shard", "Renforce les compétences de Palm-Ax Twinblade et Gargoyle's Great Axe.", 1]
    ],
    combo: [
      ["Phalange", "Phalanx Pike + Scaled Set + Spear Talisman", "Reste bouclier levé et pique par-dessus : c'est l'attaque que le talisman renforce, et la garde coûte moins d'endurance."],
      ["Cavalier de la nuit", "Gargoyle's Great Axe + Night's Cavalry Set + Lance Talisman", "Monte sur Torrent et frappe en passant, comme les Night's Cavalry : +15 % à cheval avec une grande hache."],
      ["Ronin", "Reaver's Odachi + Ronin Set + Crossed-Tree Talisman", "Roule à travers l'attaque et frappe à la sortie : c'est ce coup que le talisman renforce. L'armure légère garde la roulade rapide."],
      ["Tourbillon", "Palm-Ax Twinblade + Scaled Set + Warrior Jar Shard", "Les doubles lames tournoient au milieu des groupes ; Warrior Jar Shard renforce la compétence."]
    ]
  },
  marksman: {
    stats: "Dextérité en priorité pour les arcs, Vigueur ensuite ; un peu de Force pour les grands arcs et la baliste.",
    plan: [
      "Composite Bow à distance, Quality Smithscript Dagger en dépannage ; tire depuis les hauteurs.",
      "Black Bow et Pulley Bow pour la cadence, Repeating Crossbow contre les groupes.",
      "Greatbow ou Golem Greatbow contre les boss, Hand Ballista pour les gros dégâts ponctuels."
    ],
    tal: [
      ["Arrow's Soaring Sting Talisman", "+65 % de portée et +10 % aux flèches : le talisman de base de l'archer."],
      ["Quiver Talisman", "Plus besoin de racheter des flèches ; en échange, gère ton endurance."],
      ["Prosthesis-Wearer Heirloom", "+6 Dextérité, ta statistique de dégâts principale."],
      ["Sharpshot Talisman", "+10 % si tu tires en visant à l'épaule."],
      ["Valorous Heirloom", "Pour les grands arcs et la baliste qui demandent de la Force.", 1],
      ["Two-Headed Turtle Talisman", "Avec Quiver Talisman, chaque tir coûte plus d'endurance.", 1],
      ["Thief's Bauble", "Tire depuis l'ombre sans être repéré.", 1],
      ["Crossed-Tree Talisman", "Roule puis frappe avec la dague quand on te colle.", 1]
    ],
    combo: [
      ["Tireur d'élite", "Longbow + Page Set + Arrow's Soaring Sting Talisman", "Portée maximale pour éliminer avant d'être vu ; l'armure légère garde la roulade rapide si on te repère."],
      ["Artillerie lourde", "Greatbow + Sharpshot Talisman + Quiver Talisman", "Vise, tire, recommence : tirs visés renforcés et munitions illimitées contre les boss. Surveille l'endurance."],
      ["Sniper fantôme", "Black Bow + Ragged Set + Thief's Bauble", "Accroupi, tu restes invisible à distance : ouvre chaque combat d'une flèche dans le dos."],
      ["Mitrailleur", "Repeating Crossbow + High Page Set + Quiver Talisman", "Rafales continues contre les groupes ; Quiver Talisman règle le problème des carreaux."]
    ]
  },
  berserker: {
    stats: "Force avant tout, Vigueur juste derrière ; Endurance pour enchaîner les attaques chargées.",
    plan: [
      "Executioner's Heavy Greataxe : attaques chargées pour casser la posture, roule plutôt que de bloquer.",
      "Leaden Maul ou Sigur's Greatmace, Raging Wolf Set pour rester mobile.",
      "Axe of Godfrey et Elden Lord Set pour un build full Force."
    ],
    tal: [
      ["Starscourge Heirloom", "+6 Force, ta seule statistique d'attaque."],
      ["Axe Talisman", "+10 % aux attaques chargées, le cœur de ton style."],
      ["Two-Handed Sword Talisman", "Tu joues ta hache à deux mains : +10 % sur chaque coup."],
      ["Erdtree's Favor", "PV et endurance pour encaisser en armure légère."],
      ["Godfrey Icon", "Renforce les compétences chargées, comme le cri de l'Axe of Godfrey.", 1],
      ["Claw Talisman", "Attaque sautée avec une arme lourde : la posture casse vite.", 1],
      ["Bull-Goat's Talisman", "Pour ne pas être interrompu en pleine charge.", 1],
      ["Red-Feathered Branchsword", "+20 % sous 20 % de PV : risqué, mais dans l'esprit berserker.", 1]
    ],
    combo: [
      ["Loup enragé", "Executioner's Heavy Greataxe + Raging Wolf Set + Axe Talisman", "Charge, relâche, roule : l'armure légère permet d'esquiver entre deux attaques chargées renforcées."],
      ["Seigneur d'Elden", "Axe of Godfrey + Elden Lord Set + Godfrey Icon", "Charge la compétence de l'arme : Godfrey Icon la renforce de 15 %. L'armure lourde encaisse pendant la charge."],
      ["Briseur de posture", "Leaden Maul + Freyja's Set + Claw Talisman", "Saute et écrase : les attaques sautées d'un marteau lourd cassent la posture très vite, puis place un critique."],
      ["Rage du désespoir", "Grafted Blade Greatsword + Raging Wolf Set + Red-Feathered Branchsword", "Sous 20 % de PV, +20 % d'attaque : pour finir un boss quand tout va mal. À retirer en exploration."]
    ]
  },
  dreadnought: {
    stats: "Vigueur et Endurance hautes pour l'armure lourde, Force en statistique principale.",
    plan: [
      "Leaden Maul + Dragon Towershield : avance bouclier levé, frappe dans les ouvertures.",
      "Bull-Goat Set pour la robustesse, Yura's Kanabo pour les enchaînements.",
      "Lionel's Set ou Verdigris Set, Grafted Blade Greatsword en arme finale."
    ],
    tal: [
      ["Bull-Goat's Talisman", "+33 % de robustesse : tu ne bronches plus."],
      ["Great-Jar's Arsenal", "Armure et arme les plus lourdes sans roulade lente."],
      ["Verdigris Discus", "La défense monte avec la charge : fait pour ta classe."],
      ["Starscourge Heirloom", "+6 Force pour Leaden Maul et les grandes armes."],
      ["Dragoncrest Greatshield Talisman", "-10 % de dégâts physiques en plus contre les boss lourds.", 1],
      ["Pearl Shield Talisman", "Contre les mages : -20 % de dégâts non physiques en garde avec le Dragon Towershield.", 1],
      ["Hammer Talisman", "Casse plus vite les gardes ennemies à la masse.", 1],
      ["Talisman of Lord's Bestowal", "Robustesse et invulnérabilité pendant que tu bois une fiole.", 1]
    ],
    combo: [
      ["Forteresse", "Dragon Towershield + Bull-Goat Set + Bull-Goat's Talisman", "Tu encaisses sans broncher et tu frappes dans la foulée : la robustesse fait tout le travail."],
      ["Bélier", "Grafted Blade Greatsword + Lionel's Set + Great-Jar's Arsenal", "Arsenal permet l'armure la plus lourde avec l'arme la plus lourde sans roulade lente."],
      ["Mur élémentaire", "Leaden Maul + Dragon Towershield + Pearl Shield Talisman", "Bouclier levé contre les sorts : le talisman réduit encore les dégâts non physiques en garde. Riposte à la masse."],
      ["Briseur de garde", "Yura's Kanabo + Verdigris Set + Hammer Talisman", "Frappe les ennemis à bouclier : leur garde cède plus vite. Verdigris Discus ajoute de la défense."]
    ]
  },
  sellsword: {
    stats: "Dextérité en priorité, Vigueur ensuite ; Endurance pour les rafales de doubles lames.",
    plan: [
      "Sulien's Razors : enchaîne vite, saute pour les attaques en paire.",
      "Bloodhound Hookblade ou Flowing Curved Sword ; Kaiden Set pour la robustesse.",
      "Emyr's Great Talons et Dancer's Set pour un style dansé."
    ],
    tal: [
      ["Winged Sword Insignia", "L'attaque monte à chaque coup enchaîné : parfait pour les doubles lames."],
      ["Twinblade Talisman", "+20 % au dernier coup d'un enchaînement."],
      ["Prosthesis-Wearer Heirloom", "+6 Dextérité, ta statistique principale."],
      ["Blue Dancer Charm", "+15 % d'attaque en charge légère, que ton armure respecte déjà."],
      ["Claw Talisman", "Les doubles lames ont d'excellentes attaques sautées.", 1],
      ["Two-Headed Turtle Talisman", "Plus de rafales avant de devoir souffler.", 1],
      ["Crossed-Tree Talisman", "Roulade puis rafale renforcée.", 1],
      ["Godskin Swaddling Cloth", "Les enchaînements rendent des PV.", 1]
    ],
    combo: [
      ["Tempête de lames", "Sulien's Razors + Winged Sword Insignia + Twinblade Talisman", "L'insigne monte l'attaque à chaque coup, Twinblade renforce le dernier : vise les longues séquences."],
      ["Danseur", "Flowing Curved Sword + Dancer's Set + Blue Dancer Charm", "Charge légère : +15 % d'attaque et mobilité maximale pour tourner autour des ennemis."],
      ["Chasseur", "Bloodhound Hookblade + Kaiden Set + Crossed-Tree Talisman", "Roule derrière l'ennemi et frappe à la sortie ; le saignement fait le reste."],
      ["Rafale qui soigne", "Emyr's Great Talons + Ascetic's Set + Godskin Swaddling Cloth", "Chaque enchaînement rend des PV : tu restes au contact plus longtemps."]
    ]
  },
  rogue: {
    stats: "Dextérité en priorité ; assez de Vigueur pour survivre à une erreur, un peu d'Esprit pour les compétences.",
    plan: [
      "Foil of Caddock + Buckler : pare, puis place un coup critique.",
      "Raptor's Set pour la mobilité, Bloodhound Hookblade pour le saignement.",
      "Black Bow pour ouvrir le combat à distance, Braided Cord Set en tenue d'assassin."
    ],
    tal: [
      ["Dagger Talisman", "+17 % aux coups critiques : le cœur de la parade-riposte."],
      ["Assassin's Curio", "Chaque critique rend PV et PC."],
      ["Blade of Mercy", "+15 % pendant 20 s après un critique : enchaîne parade puis combo."],
      ["Prosthesis-Wearer Heirloom", "+6 Dextérité, ta statistique principale."],
      ["Thief's Bauble", "Silencieux et invisible accroupi : pour les attaques dans le dos.", 1],
      ["Crossed-Tree Talisman", "Roulade puis estoc renforcé.", 1],
      ["Curved Sword Talisman", "Si tu préfères bloquer et contrer au Buckler plutôt que parer.", 1],
      ["Sharpshot Talisman", "Tirs visés au Shortbow ou au Black Bow.", 1]
    ],
    combo: [
      ["Parade et riposte", "Foil of Caddock + Buckler + Dagger Talisman", "Pare, puis place un critique renforcé ; Assassin's Curio rend PV et PC à chacun."],
      ["Ombre", "Black Bow + Leather Set + Thief's Bauble", "Silencieux et invisible accroupi : ouvre d'une flèche puis va au contact."],
      ["Assassin", "Bloodhound Hookblade + Raptor's Set + Blade of Mercy", "Critique dans le dos, puis 20 s de bonus pour remplir la jauge de saignement."],
      ["Contre-garde", "Flowing Curved Sword + Buckler + Curved Sword Talisman", "Bloque au lieu de parer : contre-attaque renforcée de 20 % et garde moins coûteuse. Plus sûr pour débuter."]
    ]
  },
  glint: {
    stats: "Intelligence en priorité, Esprit pour les PC, Vigueur à ne pas négliger ; un peu de Dextérité pour les épées cariennes.",
    plan: [
      "Swift Glintstone Shard à distance, Carian Slicer quand ça se rapproche.",
      "Carian Greatsword et Thops's Barrier ; Moonveil en arme Intelligence/Dextérité.",
      "Azur's Glintstone Staff + Comet ou Rennala's Full Moon, Queen of the Full Moon Set."
    ],
    tal: [
      ["Stargazer Heirloom", "+6 Intelligence : tes sorts et ton bâton scalent dessus."],
      ["Radagon Icon", "Les sorts partent plus vite : moins d'ouvertures pour l'ennemi."],
      ["Cerulean Amber Medallion", "Plus de PC pour lancer plus longtemps."],
      ["Moon of Nokstella", "Tes paliers débloquent beaucoup de sorts : 2 emplacements en plus."],
      ["Saboteur Heirloom", "Si tu joues Moonveil ou Carian Knight Sword (Intelligence et Dextérité).", 1],
      ["Godfrey Icon", "Charge Comet ou Carian Greatsword pour 15 % de plus.", 1],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers en PC.", 1],
      ["Carian Filigreed Crest", "La compétence de Moonveil coûte 25 % de PC en moins.", 1]
    ],
    combo: [
      ["Épéiste carien", "Moonveil + Carian Knight Set + Carian Filigreed Crest", "La compétence de Moonveil coûte 25 % de PC en moins : enchaîne-la entre deux Carian Greatsword."],
      ["Canon à comètes", "Azur's Glintstone Staff + Comet + Stargazer Heirloom", "+6 Intelligence pour la puissance brute ; Cerulean Amber Medallion pour tenir les PC que le bâton consomme."],
      ["Pleine lune", "Queen of the Full Moon Set + Rennala's Full Moon + Godfrey Icon", "Charge la lune pour 15 % de dégâts en plus, puis enchaîne avec des éclats rapides."],
      ["Lancier de cristal", "Crystal Spear + Spellblade Set + Saboteur Heirloom", "Lance Intelligence/Dextérité au contact, Carian Slicer en relais ; l'Heirloom monte les deux statistiques."]
    ]
  },
  starcaller: {
    stats: "Intelligence et Force pour les armes de gravité, Vigueur, un peu d'Esprit.",
    plan: [
      "Gravity Well pour attirer, Meteoric Ore Blade pour finir au contact.",
      "Meteorite Staff + Rock Sling ou Meteorite pour la zone ; Alabaster Lord's Greatsword.",
      "Starscourge Greatsword ou Ruins Greatsword avec General Radahn's Set."
    ],
    tal: [
      ["Strategist Heirloom", "+3 Force et Intelligence, tes deux statistiques."],
      ["Godfrey Icon", "Gravity Well, Rock Sling et compétences chargées +15 %."],
      ["Starscourge Heirloom", "+6 Force pour les grandes épées de gravité."],
      ["Primal Glintstone Blade", "Sorts de gravité 10 % moins chers."],
      ["Erdtree's Favor", "Tu joues souvent au contact : PV et endurance en plus.", 1],
      ["Two-Handed Sword Talisman", "Grandes épées à deux mains.", 1],
      ["Claw Talisman", "Attaques sautées avec les grandes épées.", 1],
      ["Moon of Nokstella", "Pour garder sorts de zone et de contrôle équipés en même temps.", 1]
    ],
    combo: [
      ["Gravité au contact", "Meteoric Ore Blade + Gravity Well + Godfrey Icon", "Attire, frappe, recommence : la gravité regroupe, l'épée finit."],
      ["Général", "Starscourge Greatsword + General Radahn's Set + Starscourge Heirloom", "Hommage à Radahn : grosse arme de gravité, Starscourge Heirloom pour la Force."],
      ["Pluie de météores", "Meteorite Staff + Meteorite + Moon of Nokstella", "Bombardement de zone à distance ; les emplacements en plus gardent Gravity Well en secours."],
      ["Seigneur d'albâtre", "Alabaster Lord's Greatsword + Gaius Set + Two-Handed Sword Talisman", "Grande épée à deux mains avec projection de gravité ; le talisman renforce chaque coup."]
    ]
  },
  underworld: {
    stats: "Intelligence et Dextérité, Vigueur ; Esprit pour enchaîner les bulles.",
    plan: [
      "Frozen Cragbolt à distance, Dragonkin Seeker Sword avec Frozen Lightning Armament au contact.",
      "Armor of Bubbles et Cragbolt Mine pour piéger ; Dragonscale Blade.",
      "Dragonkin Scepter + Frozen Lightning Storm, Blue Silver Set."
    ],
    tal: [
      ["Saboteur Heirloom", "+3 Dextérité et Intelligence, tes deux statistiques."],
      ["Moon of Nokstella", "Bulles, mines et éclairs : 2 emplacements en plus."],
      ["Radagon Icon", "Cragbolts lancés plus vite."],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers en PC."],
      ["Godfrey Icon", "Pour charger Cragbolt Spear.", 1],
      ["Winged Sword Insignia", "Les lames dragonkin enchaînent vite.", 1],
      ["Boltdrake Talisman", "Contre les ennemis à foudre (dragons, ancêtres).", 1],
      ["Cerulean Amber Medallion", "Plus de PC pour les longs combats.", 1]
    ],
    combo: [
      ["Lame gelée", "Dragonscale Blade + Frozen Lightning Armament + Saboteur Heirloom", "Infuse la foudre gelée et frappe ; l'Heirloom monte Intelligence et Dextérité à la fois."],
      ["Champ de mines", "Dragonkin Scepter + Cragbolt Mine + Moon of Nokstella", "Pose les mines, recule, laisse exploser ; Nokstella pour équiper plus de sorts."],
      ["Bulle offensive", "Underworld Greatmace + Armor of Bubbles + Blue Silver Set", "La bulle encaisse pendant que la masse frappe : joue agressif."],
      ["Harponneur", "Clayman's Harpoon + Frozen Cragbolt + Winged Sword Insignia", "Harpon rapide qui monte l'attaque à chaque coup, éclair gelé pour finir à distance."]
    ]
  },
  volcanist: {
    stats: "Intelligence et Foi à parts égales, Esprit, Vigueur.",
    plan: [
      "Lava Dart et Magma Shot, Molten Sword en secours.",
      "Gelmir Knight Set, Magma Blade, Lava Pool pour contrôler le terrain.",
      "Lavastone Staff + Rykard's Rancor, Blasphemous Blade pour les soins."
    ],
    tal: [
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Primal Glintstone Blade", "Sorts de magma 10 % moins chers."],
      ["Taker's Cameo", "PV, PC et endurance rendus à chaque ennemi vaincu."],
      ["Radagon Icon", "Sorts lancés plus vite."],
      ["Blasphemer's Crest", "Les lacs de lave de Mt. Gelmir ne te blessent plus.", 1],
      ["Flamedrake Talisman", "Contre les ennemis de feu du volcan.", 1],
      ["Godfrey Icon", "Pour charger Magma Shot et les gros sorts.", 1],
      ["Moon of Nokstella", "Garder sorts de zone et de mêlée équipés.", 1]
    ],
    combo: [
      ["Chevalier de Gelmir", "Magma Blade + Gelmir Knight Set + Blasphemer's Crest", "Mêlée de feu, et tu te bats dans la lave sans dégâts : attire les ennemis dedans."],
      ["Blasphémateur", "Blasphemous Blade + Consort's Set + Taker's Cameo", "Chaque ennemi vaincu rend PV, PC et endurance : enchaîne les groupes."],
      ["Artilleur de magma", "Lavastone Staff + Rykard's Rancor + Godfrey Icon", "Charge les gros sorts de magma pour 15 % de plus, puis recule le temps qu'ils frappent."],
      ["Fouet volcanique", "Magma Whip Candlestick + Hoslow Set + Flamedrake Talisman", "Fouet de feu à grande allonge ; Flamedrake réduit les dégâts de feu des ennemis du volcan."]
    ]
  },
  stormcaller: {
    stats: "Intelligence et Foi, Force pour la hallebarde, Vigueur.",
    plan: [
      "Banished Knight's Halberd au contact, Storm Gust et Rebuff pour repousser.",
      "Storm Armament et Whirlwind ; Banished Knight Set.",
      "Tempestcaller Staff + Tornado, Cloud Form pour te repositionner."
    ],
    tal: [
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Godfrey Icon", "Charge Storm Gust et les compétences de hallebarde."],
      ["Radagon Icon", "Sorts de vent lancés plus vite."],
      ["Two-Headed Turtle Talisman", "Hallebarde et sorts au contact demandent de l'endurance."],
      ["Erdtree's Favor", "PV et endurance pour le contact.", 1],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers.", 1],
      ["Claw Talisman", "Attaques sautées à la hallebarde.", 1],
      ["Moon of Nokstella", "Garder sorts de contrôle et d'attaque équipés.", 1]
    ],
    combo: [
      ["Chevalier banni", "Banished Knight's Halberd + Banished Knight Set + Storm Armament", "Hallebarde enchantée de vent : allonge et contrôle de foule."],
      ["Œil du cyclone", "Tempestcaller Staff + Twister + Divine Beast Set", "Garde les ennemis à distance et frappe en tempête."],
      ["Lames du zéphyr", "Zephyr Blades + Set of Solitude + Two-Headed Turtle Talisman", "Lames rapides portées par le vent ; l'endurance remonte vite entre deux rafales."],
      ["Gargouille", "Gargoyle's Halberd + Divine Beast Set + Claw Talisman", "Saute et frappe, puis Storm Gust pour repousser."]
    ]
  },
  nox: {
    stats: "Intelligence et Foi, Dextérité pour Quicksilver Rapier, Esprit.",
    plan: [
      "Night Shard à distance, Quicksilver Rapier au contact, Night Maiden's Mist en zone.",
      "Darkness et Unseen Blade pour l'embuscade ; Nox Flowing Sword.",
      "Lusat's Night Staff + Night Comet, Set of Night."
    ],
    tal: [
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Thief's Bauble", "Silencieux et invisible accroupi : le style Nox."],
      ["Assassin's Curio", "Les critiques d'embuscade rendent PV et PC."],
      ["Moon of Nokstella", "Beaucoup de sorts de nuit : 2 emplacements en plus."],
      ["Cerulean Amber Medallion", "Plus de PC.", 1],
      ["Dagger Talisman", "Critiques plus forts avec Midnight Dagger ou la rapière.", 1],
      ["Blade of Mercy", "Bonus d'attaque après un critique d'ouverture.", 1],
      ["Radagon Icon", "Sorts lancés plus vite.", 1]
    ],
    combo: [
      ["Assassin nocturne", "Black Knife Set + Unseen Blade + Thief's Bauble", "Invisible et silencieux : un critique d'ouverture, puis repli."],
      ["Épéiste Nox", "Nox Flowing Sword + Nox Swordstress Set + Midnight Heirloom", "Épée-fouet à longue portée, Intelligence et Foi montées ensemble."],
      ["Vif-argent", "Quicksilver Rapier + Night Maiden Set + Dagger Talisman", "Estoc rapide pour placer des critiques ; Assassin's Curio rend PV et PC."],
      ["Pluie d'étoiles", "Lusat's Night Staff + Night Comet + Cerulean Amber Medallion", "Comètes difficiles à voir, lancées à distance ; les PC en plus tiennent le combat."]
    ]
  },
  necromancer: {
    stats: "Intelligence et Foi, Esprit élevé pour les invocations, Vigueur.",
    plan: [
      "Tibia's Summons pour occuper les ennemis, Fia's Mist en zone, Spirit Sword au contact.",
      "Rally the Legion et Sacrifice ; Mantis Blade ou Death's Poker.",
      "Prince of Death's Staff + Ghostflame Cannon, Gravebird Set."
    ],
    tal: [
      ["Dried Bouquet", "+20 % d'attaque quand une invocation tombe, et les ennemis te ciblent moins."],
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Cerulean Amber Medallion", "Les invocations coûtent cher en PC."],
      ["Taker's Cameo", "PV, PC et endurance rendus à chaque ennemi vaincu."],
      ["Radagon Icon", "Sorts lancés plus vite.", 1],
      ["Moon of Nokstella", "Garder invocations et attaques équipées.", 1],
      ["Old Lord's Talisman", "Blighted Armament dure deux fois plus longtemps.", 1],
      ["Prince of Death's Cyst", "Immunité à la mort contre les ennemis qui l'infligent ; coûte 4 Vigueur.", 1]
    ],
    combo: [
      ["Légion", "Tibia's Summons + Rally the Legion + Dried Bouquet", "Les invocations encaissent ; quand l'une tombe, +20 % d'attaque, et les ennemis te ciblent moins."],
      ["Flamme fantôme", "Death's Poker + Gravebird Set + Midnight Heirloom", "Givre fantôme au contact, Intelligence et Foi montées ensemble."],
      ["Arme maudite", "Mantis Blade + Blighted Armament + Old Lord's Talisman", "L'enchantement dure deux fois plus longtemps : reste au contact sans relancer."],
      ["Faucheur", "Rosus' Harvester + Gravebird Set + Taker's Cameo", "Fauche les groupes ; chaque ennemi vaincu rend PV, PC et endurance."]
    ]
  },
  frost: {
    stats: "Intelligence et Arcanes, Esprit, Vigueur.",
    plan: [
      "Ice Dart et Freezing Mist pour accumuler le gel, Frozen Needle au contact.",
      "Renna's Barrier et Icecrag Spear ; Zamor Curved Sword.",
      "Snow Witch Staff + Ranni's Dark Moon, Dark Moon Greatsword."
    ],
    tal: [
      ["Forbidden Heirloom", "+3 Intelligence et Arcanes, tes deux statistiques."],
      ["Stargazer Heirloom", "+6 Intelligence pour les sorts de givre."],
      ["Cerulean Amber Medallion", "Plus de PC pour accumuler le gel."],
      ["Radagon Icon", "Sorts lancés plus vite."],
      ["Carian Filigreed Crest", "Compétence de Dark Moon Greatsword moins chère.", 1],
      ["Godfrey Icon", "Charge Adula's Moonblade et les compétences.", 1],
      ["Moon of Nokstella", "Garder sorts de contrôle et d'attaque équipés.", 1],
      ["Warming Horn Charm", "Immunité au gel contre les ennemis de givre ; coûte 3 Vigueur.", 1]
    ],
    combo: [
      ["Lame lunaire", "Dark Moon Greatsword + Blaidd's Set + Carian Filigreed Crest", "La compétence de l'épée coûte 25 % de PC en moins et gèle."],
      ["Tempête de givre", "Snow Witch Staff + Freezing Mist + Snow Witch Set", "Accumule le gel puis éclate tout : idéal contre les gros ennemis."],
      ["Zamor", "Zamor Curved Sword + Zamor Set + Godfrey Icon", "Charge la compétence de la lame Zamor pour 15 % de plus, gel au contact."],
      ["Marteau d'Einar", "Einar's Hammer + Frozen Armament + Forbidden Heirloom", "Gel sur une arme lourde ; l'Heirloom monte Intelligence et Arcanes ensemble."]
    ]
  },
  aberrant: {
    stats: "Intelligence et Arcanes pour le saignement, Vigueur, Esprit.",
    plan: [
      "Briars of Sin et Body of Briar, Regalia of Eochaid au contact.",
      "Thorn of the Guilty, Red Glintstone Razor ; Bloodhound Knight Set pour la mobilité.",
      "Staff of the Guilty + Blood Comet, Alberich's Set."
    ],
    tal: [
      ["Forbidden Heirloom", "+3 Intelligence et Arcanes, tes deux statistiques."],
      ["Outer God Heirloom", "+6 Arcanes pour accumuler le saignement plus vite."],
      ["Radagon Icon", "Sorts de ronces lancés plus vite."],
      ["Godfrey Icon", "Charge les sorts et compétences pour 15 % de plus."],
      ["Erdtree's Favor", "Body of Briar te met au contact : PV en plus.", 1],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers.", 1],
      ["Winged Sword Insignia", "Fouet et griffes enchaînent vite.", 1],
      ["Stalwart Horn Charm", "Immunité au saignement contre les autres adeptes du sang ; coûte 5 Vigueur.", 1]
    ],
    combo: [
      ["Ronces maudites", "Staff of the Guilty + Briars of Sin + Alberich's Set", "Alberich's Set renforce les sorts de ronces ; ronces et saignement à distance."],
      ["Chien de chasse", "Bloodhound Claws + Bloodhound Knight Set + Outer God Heirloom", "Saignement rapide, et +6 Arcanes pour l'accumuler encore plus vite."],
      ["Fouet à pétales", "Hoslow's Petal Whip + Briar Set + Winged Sword Insignia", "Fouet rapide à grande allonge ; l'attaque monte à chaque coup."],
      ["Exécuteur", "Marais Executioner's Sword + Briar-Wrapped Armament + Outer God Heirloom", "Grande épée enveloppée de ronces : saignement massif à chaque coup."]
    ]
  },
  flame: {
    stats: "Foi en priorité, Esprit, Vigueur ; Force pour les armes du Fell God.",
    plan: [
      "Flame Sling à distance, Catch Flame et Fell Flame Sword au contact.",
      "Flaming Armament ; Fire Monk Set et Monk's Flamemace.",
      "Giant's Seal + Flame of the Fell God, Fire Prelate Set et Prelate's Inferno Crozier."
    ],
    tal: [
      ["Two Fingers Heirloom", "+6 Foi, ta statistique principale."],
      ["Chosen Heirloom", "+3 Force et Foi pour les armes du Fell God."],
      ["Radagon Icon", "Incantations lancées plus vite."],
      ["Flamedrake Talisman", "Tu te bats souvent dans le feu : -20 % de dégâts de feu."],
      ["Erdtree's Favor", "PV et endurance pour le contact.", 1],
      ["Godfrey Icon", "Charge Flame of the Fell God.", 1],
      ["Primal Glintstone Blade", "Incantations 10 % moins chères.", 1],
      ["Old Lord's Talisman", "Flaming Armament dure deux fois plus longtemps.", 1]
    ],
    combo: [
      ["Prélat", "Prelate's Inferno Crozier + Fire Prelate Set + Chosen Heirloom", "Grosse masse de feu à Force et Foi ; armure lourde pour encaisser."],
      ["Feu des géants", "Giant's Seal + Flame of the Fell God + Fire Monk Set", "Giant's Seal renforce les incantations de feu des géants."],
      ["Moine de feu", "Monk's Flamemace + Fire Monk Set + Old Lord's Talisman", "Flaming Armament dure deux fois plus longtemps sur une masse rapide."],
      ["Poings de fournaise", "Furnace Fists + Fire Knight Set + Flamedrake Talisman", "Corps à corps à coups de poing enflammés ; Flamedrake protège de ton propre brasier."]
    ]
  },
  fundamentalist: {
    stats: "Foi en priorité, Esprit, Vigueur.",
    plan: [
      "Rune Shards à distance, Rejection pour respirer, Axe of Epiphany au contact.",
      "Order's Blade ; Golden Halberd ou Hammer of Virtue, Tree Sentinel Set.",
      "Golden Order Seal + Elden Stars, Golden Order Greatsword."
    ],
    tal: [
      ["Two Fingers Heirloom", "+6 Foi, ta statistique principale."],
      ["Radagon Icon", "Incantations lancées plus vite."],
      ["Primal Glintstone Blade", "Incantations 10 % moins chères."],
      ["Blessed Dew Talisman", "Régénère des PV en continu, pour économiser les soins."],
      ["Erdtree's Favor", "PV et endurance.", 1],
      ["Chosen Heirloom", "Pour Hammer of Virtue ou Golden Halberd (Force et Foi).", 1],
      ["Old Lord's Talisman", "Les bénédictions durent deux fois plus longtemps.", 1],
      ["Cerulean Amber Medallion", "Plus de PC.", 1]
    ],
    combo: [
      ["Sentinelle de l'arbre", "Golden Halberd + Tree Sentinel Set + Order's Blade", "Hallebarde sacrée et armure lourde : un tank lumineux."],
      ["Ordre doré", "Golden Order Seal + Elden Stars + Two Fingers Heirloom", "Pose Elden Stars et laisse faire ; +6 Foi pour la puissance."],
      ["Marteau de la vertu", "Hammer of Virtue + Haligtree Knight Set + Chosen Heirloom", "Arme Force/Foi, l'Heirloom monte les deux ; Blessing of Power avant les gros coups."],
      ["Faux auréolée", "Halo Scythe + Goldmask's Set + Old Lord's Talisman", "Blessing of Protection dure deux fois plus longtemps pendant que la faux fait saigner."]
    ]
  },
  bestial: {
    stats: "Foi et Force, Vigueur ; Endurance pour les attaques bestiales.",
    plan: [
      "Beast Talons et Gravel Sling, Bestial Beast Claw au contact.",
      "Beast Claw et Stone Skin ; Beastclaw Greathammer, Beast Champion Set.",
      "Earthbreaker Seal + Stone of Gurranq, Crucible Axe Set."
    ],
    tal: [
      ["Old Lord's Talisman", "Bestial Strength et Stone Skin durent deux fois plus longtemps."],
      ["Chosen Heirloom", "+3 Force et Foi, tes deux statistiques."],
      ["Two Fingers Heirloom", "+6 Foi pour les incantations bestiales."],
      ["Claw Talisman", "Attaques sautées avec les grandes armes bestiales."],
      ["Erdtree's Favor", "PV et endurance pour le contact.", 1],
      ["Bull-Goat's Talisman", "Robustesse pour ne pas être interrompu.", 1],
      ["Two-Headed Turtle Talisman", "Les attaques bestiales vident l'endurance.", 1],
      ["Shattered Stone Talisman", "Coups de pied et piétinements +10 %.", 1]
    ],
    combo: [
      ["Champion bestial", "Beastclaw Greathammer + Beast Champion Set + Old Lord's Talisman", "Bestial Strength et Stone Skin durent plus longtemps : frappe sous buffs."],
      ["Creuset", "Siluria's Tree + Crucible Tree Set + Claw Talisman", "Grande lance et attaques sautées, thème du Creuset."],
      ["Troll", "Troll's Hammer + Iron Rivet Set + Bull-Goat's Talisman", "Marteau énorme et robustesse : avec Stone Skin, rien ne t'interrompt."],
      ["Épée du sanctuaire", "Ordovis's Greatsword + Crucible Hammer-Helm + Chosen Heirloom", "Grande épée Force/Foi, l'Heirloom monte les deux ; Beast Claw en relais."]
    ]
  },
  dragoncultist: {
    stats: "Foi en priorité, Force ou Dextérité selon l'arme, Vigueur.",
    plan: [
      "Lightning Spear à distance, Draconic Epitaph + Electrify Armament au contact.",
      "Lightning Strike, Leyndell Knight Set ; Dragon Greatclaw.",
      "Dragon Cult Seal + Ancient Lightning Spear, Bolt of Gransax."
    ],
    tal: [
      ["Two Fingers Heirloom", "+6 Foi pour la foudre."],
      ["Cloister Heirloom", "+3 Dextérité et Foi pour les armes de foudre."],
      ["Radagon Icon", "Lightning Spear part plus vite."],
      ["Spear Talisman", "Bolt of Gransax et les lances : piques en garde renforcées."],
      ["Erdtree's Favor", "PV et endurance.", 1],
      ["Boltdrake Talisman", "Contre les dragons et les ennemis à foudre.", 1],
      ["Godfrey Icon", "Charge les lances de foudre.", 1],
      ["Old Lord's Talisman", "Electrify Armament dure deux fois plus longtemps.", 1]
    ],
    combo: [
      ["Chevalier de Leyndell", "Bolt of Gransax + Leyndell Knight Set + Spear Talisman", "Lance de foudre et compétence à très longue portée."],
      ["Électrocution", "Draconic Epitaph + Electrify Armament + Cloister Heirloom", "Infuse, frappe : Dextérité et Foi montées ensemble."],
      ["Griffe du dragon", "Dragon Greatclaw + Malformed Dragon Set + Old Lord's Talisman", "Electrify Armament deux fois plus long sur une arme lourde."],
      ["Lance des anciens", "Dragon Cult Seal + Ancient Lightning Spear + Godfrey Icon", "Charge la lance pour 15 % de plus, à distance de sécurité."]
    ]
  },
  godskin: {
    stats: "Foi et Intelligence, Esprit, Vigueur.",
    plan: [
      "Black Flame Dart à distance, Celebrant's Cleaver + Black Flame Blade au contact.",
      "Godskin Peeler, Scouring Black Flame ; Godskin Apostle Set.",
      "Godslayer Seal + Black Flame Wave, Godslayer's Greatsword."
    ],
    tal: [
      ["Godskin Swaddling Cloth", "Les enchaînements rendent des PV : idéal au contact."],
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Radagon Icon", "Flamme noire lancée plus vite."],
      ["Godfrey Icon", "Charge les sorts et compétences."],
      ["Erdtree's Favor", "PV et endurance.", 1],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers.", 1],
      ["Old Lord's Talisman", "Black Flame Blade dure deux fois plus longtemps.", 1],
      ["Two Fingers Heirloom", "+6 Foi si tu montes surtout la Foi.", 1]
    ],
    combo: [
      ["Apôtre", "Godskin Peeler + Godskin Apostle Set + Godskin Swaddling Cloth", "La glaive tournoie en flamme noire, chaque enchaînement soigne."],
      ["Tueur de dieux", "Godslayer's Greatsword + Godslayer Seal + Midnight Heirloom", "Flamme noire, Foi et Intelligence montées ensemble ; dégâts sur la durée contre les boss."],
      ["Fléau noir", "Black Knife + Blackflame Monk Set + Old Lord's Talisman", "Black Flame Blade sur une dague rapide, deux fois plus longtemps."],
      ["Lame de Maliketh", "Maliketh's Black Blade + Maliketh's Set + Godfrey Icon", "Charge la compétence de la lame noire pour 15 % de plus."]
    ]
  },
  frenzied: {
    stats: "Foi et Intelligence, Esprit élevé, Vigueur.",
    plan: [
      "Frenzied Flare à bout portant, Nomad's Kilij en secours.",
      "Howl of Shabriri et Mind Melt ; Fingerprint Set pour encaisser.",
      "Frenzied Flame Seal + Disintegration ou Chaos Beam, Three Finger Blade."
    ],
    tal: [
      ["Clarifying Horn Charm", "Immunité à la folie : tes propres sorts ne te rendent plus fou. Coûte 4 Vigueur."],
      ["Midnight Heirloom", "+3 Intelligence et Foi, tes deux statistiques."],
      ["Cerulean Amber Medallion", "Sorts de folie gourmands en PC."],
      ["Radagon Icon", "Frenzied Flare part plus vite."],
      ["Flamedrake Talisman", "Contre les ennemis de feu.", 1],
      ["Erdtree's Favor", "PV pour compenser la Vigueur perdue.", 1],
      ["Primal Glintstone Blade", "Sorts 10 % moins chers.", 1],
      ["Spear Talisman", "Pour Vyke's War Spear en garde.", 1]
    ],
    combo: [
      ["Flamme jaune", "Frenzied Flame Seal + Howl of Shabriri + Clarifying Horn Charm", "Folie et feu sans risque : le charme t'immunise contre la folie, au prix de 4 Vigueur."],
      ["Gardien des doigts", "Three Finger Blade + Fingerprint Set + Erdtree's Favor", "Armure lourde et PV en plus pour tenir au contact."],
      ["Lance de Vyke", "Vyke's War Spear + Frenzied Maiden Set + Spear Talisman", "Lance de folie : pique en garde, avec une compétence qui inflige la folie."],
      ["Lumière lointaine", "Blade of Distant Light + Fingerprint Set + Primal Glintstone Blade", "Sorts 10 % moins chers pour enchaîner la folie entre deux coups."]
    ]
  },
  blood: {
    stats: "Arcanes et Foi, Vigueur, Dextérité pour Reduvia.",
    plan: [
      "Reduvia (compétence à distance), Bloodflame Talons ; pare avec le Red Thorn Roundshield.",
      "Bloody Helice ou Morgott's Cursed Sword, Sanguine Noble Set.",
      "Mohgwyn Seal + Bloodflame Missile, Rivers of Blood ou Mohgwyn's Sacred Spear."
    ],
    tal: [
      ["Scorpion Heirloom", "+3 Foi et Arcanes, tes deux statistiques."],
      ["Outer God Heirloom", "+6 Arcanes pour le saignement."],
      ["Taker's Cameo", "Tes sorts de sang coûtent des PV : chaque ennemi vaincu les rend."],
      ["Crusade Insignia", "+15 % pendant 20 s après chaque ennemi vaincu."],
      ["Erdtree's Favor", "PV pour payer les sorts de sang.", 1],
      ["Radagon Icon", "Sorts lancés plus vite.", 1],
      ["Old Lord's Talisman", "Bloodflame Blade dure deux fois plus longtemps.", 1],
      ["Stalwart Horn Charm", "Immunité au saignement contre les autres adeptes du sang ; coûte 5 Vigueur.", 1]
    ],
    combo: [
      ["Seigneur du sang", "Rivers of Blood + House Marais Set + Outer God Heirloom", "Saignement continu, +6 Arcanes pour l'accumuler plus vite."],
      ["Lance sanguine", "Mohgwyn's Sacred Spear + Bloodflame Blade + Scorpion Heirloom", "Feu et saignement sur une lance à grande allonge ; Foi et Arcanes montées ensemble."],
      ["Chirurgien", "Reduvia + War Surgeon Set + Old Lord's Talisman", "Bloodflame Blade deux fois plus longtemps sur une dague rapide."],
      ["Moisson", "Bloodflame Kamas + Sanguine Noble Set + Crusade Insignia", "Chaque ennemi vaincu donne +15 % d'attaque : enchaîne les groupes."]
    ]
  },
  rot: {
    stats: "Arcanes et Foi, Vigueur, Dextérité pour Antspur Rapier.",
    plan: [
      "Poison Mist et Swarm of Flies, Antspur Rapier pour la pourriture.",
      "Chitinous Shell, Rotten Crystal Sword ; Cleanrot Knight Set.",
      "Seal of Rot + Rot Spray, Hand of Malenia et Malenia's Set."
    ],
    tal: [
      ["Scorpion Heirloom", "+3 Foi et Arcanes, tes deux statistiques."],
      ["Perfume Heirloom", "+3 Dextérité et Arcanes pour Antspur Rapier et les armes de pourriture."],
      ["Winged Sword Insignia", "Les armes rapides montent l'attaque à chaque coup."],
      ["Crusade Insignia", "+15 % après chaque ennemi vaincu."],
      ["Curative Horn Charm", "Immunité à la pourriture dans Caelid et le Lake of Rot ; coûte 5 Vigueur.", 1],
      ["Immunizing Horn Charm", "Immunité au poison des marais ; coûte 3 Vigueur.", 1],
      ["Erdtree's Favor", "PV et endurance.", 1],
      ["Old Lord's Talisman", "Poison Armament dure deux fois plus longtemps.", 1]
    ],
    combo: [
      ["Valkyrie", "Hand of Malenia + Malenia's Set + Winged Sword Insignia", "Enchaînements rapides, l'insigne monte l'attaque à chaque coup."],
      ["Peste", "Seal of Rot + Poison Mist + Scorpion Heirloom", "Zone et usure ; Foi et Arcanes montées ensemble."],
      ["Chevalier immaculé", "Rotten Crystal Spear + Cleanrot Knight Set + Curative Horn Charm", "Traverse les marais de pourriture sans craindre le terrain ni ton arme."],
      ["Dard du scorpion", "Scorpion Stinger + Millicent's Set + Perfume Heirloom", "Dague à pourriture qui scale sur Dextérité et Arcanes."]
    ]
  },
  mystic: {
    stats: "Foi et Arcanes, Esprit, Vigueur.",
    plan: [
      "Soporific Fume pour endormir, Spear of Tranquility au contact, Horn Bow à distance.",
      "Dream Cloak et Spirit Seekers ; Greathorn Hammer.",
      "Spiritshaper Seal + Vapor Wave, Sword of St. Trina."
    ],
    tal: [
      ["Scorpion Heirloom", "+3 Foi et Arcanes, tes deux statistiques."],
      ["Old Lord's Talisman", "Dream Cloak et les buffs durent deux fois plus longtemps."],
      ["Blessed Blue Dew Talisman", "Les PC remontent tout seuls."],
      ["Cerulean Amber Medallion", "Plus de PC pour les vapeurs."],
      ["Two-Headed Turtle Talisman", "Pour le Greathorn Hammer et le contact.", 1],
      ["Radagon Icon", "Sorts lancés plus vite.", 1],
      ["Dried Bouquet", "Avec Spirit Seekers et des invocations.", 1],
      ["Taker's Cameo", "PV et PC rendus à chaque ennemi vaincu.", 1]
    ],
    combo: [
      ["Marchand de sable", "Sword of St. Trina + Soporific Fume + St. Trina's Blossom", "Endors, puis frappe un ennemi sans défense."],
      ["Chaman ancestral", "Spiritshaper Seal + Spiritshaper's Set + Blessed Blue Dew Talisman", "Sorts d'esprit et PC qui remontent tout seuls."],
      ["Marteau cornu", "Greathorn Hammer + Great Horned Set + Two-Headed Turtle Talisman", "Endors avec Soporific Fume, puis gros coups de marteau."],
      ["Lance du rêve", "Spear of the Dreaming + Dreamer's Set + Old Lord's Talisman", "Dream Cloak deux fois plus long pendant que tu piques."]
    ]
  },
  perfumer: {
    stats: "Arcanes en priorité, Vigueur, Esprit pour les parfums ; Dextérité pour les épées.",
    plan: [
      "Firespark Perfume Bottle et pots de feu ; Pulley Crossbow pour attirer.",
      "Récolte, fabrique en masse ; Ripple Blade pour la mêlée Arcanes.",
      "Deadly Poison Perfume Bottle et Jar Cannon ; Omenkiller Set."
    ],
    tal: [
      ["Perfumer's Talisman", "+20 % aux parfums, ton arme principale."],
      ["Companion Jar", "+20 % aux pots lancés."],
      ["Perfume Heirloom", "+3 Dextérité et Arcanes."],
      ["Outer God Heirloom", "+6 Arcanes : parfums et Ripple Blade scalent dessus."],
      ["Erdtree's Favor", "PV et endurance.", 1],
      ["Cerulean Amber Medallion", "Les parfums consomment des PC.", 1],
      ["Silver Scarab", "Plus de matériaux pour fabriquer.", 1],
      ["Quiver Talisman", "Carreaux illimités pour la Pulley Crossbow.", 1]
    ],
    combo: [
      ["Grenadier", "Perfumer Set + Perfumer's Talisman + Companion Jar", "Pots et parfums plus forts : vide l'arène avant d'approcher."],
      ["Bourreau parfumé", "Ripple Crescent Halberd + Omenkiller Set + Deadly Poison Perfume Bottle", "Arme Arcanes, puis poison pour l'usure."],
      ["Lames ondoyantes", "Ripple Blade + Depraved Perfumer Set + Outer God Heirloom", "Arme qui scale fort en Arcanes : +6 se sent tout de suite."],
      ["Arbalétrier", "Pulley Crossbow + Traveling Perfumer's Set + Quiver Talisman", "Carreaux illimités pour attirer et affaiblir avant le parfum."]
    ]
  },
  prisoner: {
    stats: "Défi au niveau 1 : ne monte pas de niveau pour garder les armures de classe ; les Heirlooms donnent des statistiques sans monter de niveau.",
    plan: [
      "Club et roulade : apprends les attaques des ennemis, ne monte pas de niveau.",
      "Améliore une arme sans exigence de statistiques ; Horned Warrior Set.",
      "Eccentric's Set ou All-Knowing Set ; le build repose sur les talismans."
    ],
    tal: [
      ["Valorous Heirloom", "+3 Force et Dextérité sans monter de niveau."],
      ["Erdtree's Favor", "PV, endurance et charge : vital au niveau 1."],
      ["Crimson Amber Medallion", "+6 % de PV max."],
      ["Two-Headed Turtle Talisman", "Endurance qui remonte vite pour rouler plus souvent."],
      ["Great-Jar's Arsenal", "Pour porter une armure plus lourde sans Endurance.", 1],
      ["Viridian Amber Medallion", "+11 % d'endurance max.", 1],
      ["Ritual Shield Talisman", "+30 % de défense à PV pleins.", 1],
      ["Talisman of All Crucibles", "Roulades plus efficaces, mais +25 % de dégâts subis : pour les experts.", 1]
    ],
    combo: [
      ["Évadé", "Club + Horned Warrior Set + Valorous Heirloom", "+3 Force et Dextérité sans monter de niveau : précieux au niveau 1."],
      ["Survivant", "Eccentric's Set + Erdtree's Favor + Crimson Amber Medallion", "La survie d'abord : PV et endurance en plus."],
      ["Roulade parfaite", "Club + All-Knowing Set + Talisman of All Crucibles", "Roulades plus efficaces ; à réserver si tu maîtrises les esquives, chaque coup fait mal."],
      ["Mur", "Horned Warrior Set + Ritual Shield Talisman + Crimson Amber Medallion", "Reste à PV pleins pour +30 % de défense ; le médaillon donne de la marge."]
    ]
  },
};

export default { TAL: TAL, B: B };
