import { HearthstoneCard } from "@/types";

export const CARDS: HearthstoneCard[] = [
  // === WARRIOR ===
  { id: "WW_001", name: "Shield Slam", nameZh: "盾牌猛击", cardClass: "WARRIOR", rarity: "EPIC", type: "SPELL", cost: 1, text: "Deal damage to a minion equal to your Armor.", spellSchool: "FIRE", mechanics: ["armor"], set: "Classic" },
  { id: "WW_002", name: "Execute", nameZh: "斩杀", cardClass: "WARRIOR", rarity: "RARE", type: "SPELL", cost: 1, text: "Destroy a damaged enemy minion.", spellSchool: "NONE", mechanics: ["destroy"], set: "Classic" },
  { id: "WW_003", name: "Whirlwind", nameZh: "旋风斩", cardClass: "WARRIOR", rarity: "COMMON", type: "SPELL", cost: 1, text: "Deal 1 damage to all minions.", spellSchool: "FIRE", mechanics: ["aoe"], set: "Classic" },
  { id: "WW_004", name: "Armorsmith", nameZh: "铸甲师", cardClass: "WARRIOR", rarity: "RARE", type: "MINION", cost: 2, attack: 1, health: 4, text: "Whenever a friendly minion takes damage, gain 1 Armor.", race: "NONE", mechanics: ["trigger"], set: "Classic" },
  { id: "WW_005", name: "Battle Rage", nameZh: "战斗怒火", cardClass: "WARRIOR", rarity: "COMMON", type: "SPELL", cost: 2, text: "Draw a card for each damaged friendly character.", spellSchool: "NONE", mechanics: ["draw"], set: "Classic" },
  { id: "WW_006", name: "Slam", nameZh: "猛击", cardClass: "WARRIOR", rarity: "COMMON", type: "SPELL", cost: 2, text: "Deal 2 damage to a minion. If it survives, draw a card.", spellSchool: "NONE", mechanics: ["draw"], set: "Classic" },
  { id: "WW_007", name: "Frothing Berserker", nameZh: "暴怒的狂战士", cardClass: "WARRIOR", rarity: "RARE", type: "MINION", cost: 3, attack: 2, health: 4, text: "Whenever a minion takes damage, gain +1 Attack.", race: "NONE", mechanics: ["trigger"], set: "Classic" },
  { id: "WW_008", name: "Shield Block", nameZh: "盾牌格挡", cardClass: "WARRIOR", rarity: "FREE", type: "SPELL", cost: 3, text: "Gain 5 Armor. Draw a card.", spellSchool: "NONE", mechanics: ["armor", "draw"], set: "Classic" },
  { id: "WW_009", name: "Bloodhoof Brave", nameZh: "血蹄勇者", cardClass: "WARRIOR", rarity: "RARE", type: "MINION", cost: 3, attack: 2, health: 6, text: "Taunt. Enrage: +3 Attack.", race: "NONE", mechanics: ["taunt", "enrage"], set: "Whispers of the Old Gods" },
  { id: "WW_010", name: "Brawl", nameZh: "绝命乱斗", cardClass: "WARRIOR", rarity: "EPIC", type: "SPELL", cost: 5, text: "Destroy all minions except one. (chosen randomly)", spellSchool: "NONE", mechanics: ["destroy", "aoe"], set: "Classic" },
  { id: "WW_011", name: "Brawlmaster Wolfgang", nameZh: "乱斗大师沃尔夫冈", cardClass: "WARRIOR", rarity: "LEGENDARY", type: "MINION", cost: 6, attack: 5, health: 5, text: "After a friendly minion dies, give your hero +3 Attack this turn.", race: "NONE", mechanics: ["trigger"], set: "Fractured in Alterac Valley" },

  // === MAGE ===
  { id: "MG_001", name: "Arcane Intellect", nameZh: "奥术智慧", cardClass: "MAGE", rarity: "FREE", type: "SPELL", cost: 3, text: "Draw 2 cards.", spellSchool: "ARCANE", mechanics: ["draw"], set: "Classic" },
  { id: "MG_002", name: "Frostbolt", nameZh: "寒冰箭", cardClass: "MAGE", rarity: "COMMON", type: "SPELL", cost: 2, text: "Deal 3 damage to a character and Freeze it.", spellSchool: "FROST", mechanics: ["freeze", "spell-damage"], set: "Classic" },
  { id: "MG_003", name: "Fireball", nameZh: "火球术", cardClass: "MAGE", rarity: "FREE", type: "SPELL", cost: 4, text: "Deal 6 damage.", spellSchool: "FIRE", mechanics: ["spell-damage"], set: "Classic" },
  { id: "MG_004", name: "Flamestrike", nameZh: "烈焰风暴", cardClass: "MAGE", rarity: "FREE", type: "SPELL", cost: 7, text: "Deal 4 damage to all enemy minions.", spellSchool: "FIRE", mechanics: ["aoe", "spell-damage"], set: "Classic" },
  { id: "MG_005", name: "Sorcerer's Apprentice", nameZh: "巫师学徒", cardClass: "MAGE", rarity: "COMMON", type: "MINION", cost: 2, attack: 3, health: 2, text: "Your spells cost (1) less.", race: "NONE", mechanics: ["aura"], set: "Classic" },
  { id: "MG_006", name: "Mana Wyrm", nameZh: "法力浮龙", cardClass: "MAGE", rarity: "COMMON", type: "MINION", cost: 1, attack: 1, health: 3, text: "Whenever you cast a spell, gain +1 Attack.", race: "NONE", mechanics: ["trigger"], set: "Classic" },
  { id: "MG_007", name: "Ice Barrier", nameZh: "寒冰护体", cardClass: "MAGE", rarity: "FREE", type: "SPELL", cost: 3, text: "Secret: When your hero is attacked, gain 8 Armor.", spellSchool: "FROST", mechanics: ["secret", "armor"], set: "Classic" },
  { id: "MG_008", name: "Counterspell", nameZh: "法术反制", cardClass: "MAGE", rarity: "RARE", type: "SPELL", cost: 3, text: "Secret: When your opponent casts a spell, Counter it.", spellSchool: "ARCANE", mechanics: ["secret"], set: "Classic" },
  { id: "MG_009", name: "Arcane Explosion", nameZh: "魔爆术", cardClass: "MAGE", rarity: "FREE", type: "SPELL", cost: 2, text: "Deal 1 damage to all enemy minions.", spellSchool: "ARCANE", mechanics: ["aoe", "spell-damage"], set: "Classic" },
  { id: "MG_010", name: "Water Elemental", nameZh: "水元素", cardClass: "MAGE", rarity: "FREE", type: "MINION", cost: 4, attack: 3, health: 6, text: "Freeze any character damaged by this minion.", race: "ELEMENTAL", mechanics: ["freeze"], set: "Classic" },
  { id: "MG_011", name: "Reno the Lone Mage", nameZh: "孤独的法师雷诺", cardClass: "MAGE", rarity: "LEGENDARY", type: "MINION", cost: 6, attack: 4, health: 6, text: "Battlecry: If your deck has no duplicates, deal 10 damage randomly split among all enemy minions.", race: "NONE", mechanics: ["battlecry"], set: "Explorers" },

  // === HUNTER ===
  { id: "HT_001", name: "Hunter's Mark", nameZh: "猎人印记", cardClass: "HUNTER", rarity: "FREE", type: "SPELL", cost: 1, text: "Change a minion's Health to 1.", spellSchool: "NATURE", mechanics: ["modify"], set: "Classic" },
  { id: "HT_002", name: "Arcane Shot", nameZh: "奥术射击", cardClass: "HUNTER", rarity: "FREE", type: "SPELL", cost: 1, text: "Deal 2 damage.", spellSchool: "ARCANE", mechanics: ["spell-damage"], set: "Classic" },
  { id: "HT_003", name: "Tracking", nameZh: "追踪术", cardClass: "HUNTER", rarity: "FREE", type: "SPELL", cost: 1, text: "Discover a card from your deck.", spellSchool: "NONE", mechanics: ["discover"], set: "Classic" },
  { id: "HT_004", name: "Kill Command", nameZh: "杀戮命令", cardClass: "HUNTER", rarity: "FREE", type: "SPELL", cost: 3, text: "Deal 3 damage. If you control a Beast, deal 5 damage instead.", spellSchool: "NONE", mechanics: ["spell-damage"], set: "Classic" },
  { id: "HT_005", name: "Animal Companion", nameZh: "动物伙伴", cardClass: "HUNTER", rarity: "FREE", type: "SPELL", cost: 3, text: "Summon a random Beast companion.", spellSchool: "NATURE", mechanics: ["summon"], set: "Classic" },
  { id: "HT_006", name: "Unleash the Hounds", nameZh: "关门放狗", cardClass: "HUNTER", rarity: "COMMON", type: "SPELL", cost: 3, text: "Summon a 1/1 Hound for each enemy minion.", spellSchool: "NONE", mechanics: ["summon"], set: "Classic" },
  { id: "HT_007", name: "Houndmaster", nameZh: "驯兽师", cardClass: "HUNTER", rarity: "FREE", type: "MINION", cost: 4, attack: 4, health: 3, text: "Battlecry: Give a friendly Beast +2/+2 and Taunt.", race: "NONE", mechanics: ["battlecry", "taunt"], set: "Classic" },
  { id: "HT_008", name: "Eaglehorn Bow", nameZh: "鹰角弓", cardClass: "HUNTER", rarity: "RARE", type: "WEAPON", cost: 3, attack: 3, health: 2, durability: 2, text: "Whenever a friendly Secret is revealed, gain +1 Durability.", mechanics: ["secret", "trigger"], set: "Classic" },
  { id: "HT_009", name: "Savannah Highmane", nameZh: "长鬃草原狮", cardClass: "HUNTER", rarity: "RARE", type: "MINION", cost: 6, attack: 6, health: 5, text: "Deathrattle: Summon two 2/2 Hyenas.", race: "BEAST", mechanics: ["deathrattle", "summon"], set: "Classic" },
  { id: "HT_010", name: "King Krush", nameZh: "暴龙王克鲁什", cardClass: "HUNTER", rarity: "LEGENDARY", type: "MINION", cost: 9, attack: 8, health: 8, text: "Charge.", race: "BEAST", mechanics: ["charge"], set: "Classic" },

  // === WARLOCK ===
  { id: "WL_001", name: "Mortal Coil", nameZh: "死亡缠绕", cardClass: "WARLOCK", rarity: "FREE", type: "SPELL", cost: 1, text: "Deal 1 damage to a minion. If it dies, draw a card.", spellSchool: "SHADOW", mechanics: ["draw"], set: "Classic" },
  { id: "WL_002", name: "Flame Imp", nameZh: "烈焰小鬼", cardClass: "WARLOCK", rarity: "COMMON", type: "MINION", cost: 1, attack: 3, health: 2, text: "Battlecry: Deal 3 damage to your hero.", race: "DEMON", mechanics: ["battlecry"], set: "Classic" },
  { id: "WL_003", name: "Voidwalker", nameZh: "虚空行者", cardClass: "WARLOCK", rarity: "FREE", type: "MINION", cost: 1, attack: 1, health: 3, text: "Taunt.", race: "DEMON", mechanics: ["taunt"], set: "Classic" },
  { id: "WL_004", name: "Defile", nameZh: "亵渎", cardClass: "WARLOCK", rarity: "RARE", type: "SPELL", cost: 2, text: "Deal 1 damage to all minions. If any die, cast this again.", spellSchool: "SHADOW", mechanics: ["aoe"], set: "Knights of the Frozen Throne" },
  { id: "WL_005", name: "Dark Pact", nameZh: "黑暗契约", cardClass: "WARLOCK", rarity: "COMMON", type: "SPELL", cost: 2, text: "Destroy a friendly minion. Restore 4 Health to your hero.", spellSchool: "SHADOW", mechanics: ["destroy", "heal"], set: "Kobolds & Catacombs" },
  { id: "WL_006", name: "Siphon Soul", nameZh: "灵魂虹吸", cardClass: "WARLOCK", rarity: "RARE", type: "SPELL", cost: 6, text: "Destroy a minion. Restore 3 Health to your hero.", spellSchool: "SHADOW", mechanics: ["destroy", "heal"], set: "Classic" },
  { id: "WL_007", name: "Doomguard", nameZh: "末日守卫", cardClass: "WARLOCK", rarity: "RARE", type: "MINION", cost: 5, attack: 5, health: 7, text: "Charge. Battlecry: Discard two random cards.", race: "DEMON", mechanics: ["charge", "battlecry", "discard"], set: "Classic" },
  { id: "WL_008", name: "Lord Jaraxxus", nameZh: "加拉克苏斯大王", cardClass: "WARLOCK", rarity: "LEGENDARY", type: "MINION", cost: 9, attack: 3, health: 15, text: "Battlecry: Equip a 3/8 Blood Fury.", race: "DEMON", mechanics: ["battlecry"], set: "Classic" },
  { id: "WL_009", name: "Hellfire", nameZh: "地狱烈焰", cardClass: "WARLOCK", rarity: "FREE", type: "SPELL", cost: 4, text: "Deal 3 damage to all characters.", spellSchool: "FIRE", mechanics: ["aoe"], set: "Classic" },
  { id: "WL_010", name: "Darkshire Councilman", nameZh: "暗巷议员", cardClass: "WARLOCK", rarity: "COMMON", type: "MINION", cost: 3, attack: 1, health: 5, text: "After you summon a minion, gain +1 Attack.", race: "NONE", mechanics: ["trigger"], set: "Whispers of the Old Gods" },

  // === ROGUE ===
  { id: "RG_001", name: "Backstab", nameZh: "背刺", cardClass: "ROGUE", rarity: "FREE", type: "SPELL", cost: 0, text: "Deal 2 damage to an undamaged minion.", spellSchool: "NONE", mechanics: [], set: "Classic" },
  { id: "RG_002", name: "Preparation", nameZh: "伺机待发", cardClass: "ROGUE", rarity: "EPIC", type: "SPELL", cost: 0, text: "The next spell you cast this turn costs (3) less.", spellSchool: "NONE", mechanics: [], set: "Classic" },
  { id: "RG_003", name: "Deadly Poison", nameZh: "致命药膏", cardClass: "ROGUE", rarity: "FREE", type: "SPELL", cost: 1, text: "Give your weapon +2 Attack.", spellSchool: "NONE", mechanics: [], set: "Classic" },
  { id: "RG_004", name: "Eviscerate", nameZh: "刺骨", cardClass: "ROGUE", rarity: "COMMON", type: "SPELL", cost: 2, text: "Deal 2 damage. Combo: Deal 4 damage instead.", spellSchool: "NONE", mechanics: ["combo"], set: "Classic" },
  { id: "RG_005", name: "Sap", nameZh: "闷棍", cardClass: "ROGUE", rarity: "FREE", type: "SPELL", cost: 2, text: "Return an enemy minion to your opponent's hand.", spellSchool: "NONE", mechanics: ["bounce"], set: "Classic" },
  { id: "RG_006", name: "SI:7 Agent", nameZh: "军情七处特工", cardClass: "ROGUE", rarity: "RARE", type: "MINION", cost: 3, attack: 3, health: 3, text: "Combo: Deal 2 damage.", race: "NONE", mechanics: ["combo"], set: "Classic" },
  { id: "RG_007", name: "Edwin VanCleef", nameZh: "艾德温·范克里夫", cardClass: "ROGUE", rarity: "LEGENDARY", type: "MINION", cost: 3, attack: 2, health: 2, text: "Combo: Gain +2/+2 for each card played earlier this turn.", race: "NONE", mechanics: ["combo"], set: "Classic" },
  { id: "RG_008", name: "Fan of Knives", nameZh: "刀扇", cardClass: "ROGUE", rarity: "FREE", type: "SPELL", cost: 3, text: "Deal 1 damage to all enemy minions. Draw a card.", spellSchool: "NONE", mechanics: ["aoe", "draw"], set: "Classic" },
  { id: "RG_009", name: "Assassin's Blade", nameZh: "刺客之刃", cardClass: "ROGUE", rarity: "FREE", type: "WEAPON", cost: 5, attack: 3, health: 4, durability: 4, set: "Classic" },
  { id: "RG_010", name: "Sprint", nameZh: "疾跑", cardClass: "ROGUE", rarity: "FREE", type: "SPELL", cost: 7, text: "Draw 4 cards.", spellSchool: "NONE", mechanics: ["draw"], set: "Classic" },

  // === PALADIN ===
  { id: "PD_001", name: "Blessing of Might", nameZh: "力量祝福", cardClass: "PALADIN", rarity: "FREE", type: "SPELL", cost: 1, text: "Give a minion +3 Attack.", spellSchool: "HOLY", mechanics: ["modify"], set: "Classic" },
  { id: "PD_002", name: "Noble Sacrifice", nameZh: "崇高牺牲", cardClass: "PALADIN", rarity: "COMMON", type: "SPELL", cost: 1, text: "Secret: When an enemy attacks, summon a 2/1 Defender as the new target.", spellSchool: "NONE", mechanics: ["secret", "summon"], set: "Classic" },
  { id: "PD_003", name: "Shield of the Righteous", nameZh: "正义之盾", cardClass: "PALADIN", rarity: "COMMON", type: "SPELL", cost: 1, text: "Gain +1 Attack for each minion you control.", spellSchool: "HOLY", mechanics: ["modify"], set: "Rise of Shadows" },
  { id: "PD_004", name: "Aldor Peacekeeper", nameZh: "奥尔多卫士", cardClass: "PALADIN", rarity: "RARE", type: "MINION", cost: 3, attack: 3, health: 3, text: "Battlecry: Change an enemy minion's Attack to 1.", race: "NONE", mechanics: ["battlecry", "modify"], set: "Classic" },
  { id: "PD_005", name: "Consecration", nameZh: "奉献", cardClass: "PALADIN", rarity: "FREE", type: "SPELL", cost: 4, text: "Deal 2 damage to all enemy characters.", spellSchool: "HOLY", mechanics: ["aoe", "spell-damage"], set: "Classic" },
  { id: "PD_006", name: "Truesilver Champion", nameZh: "真银圣剑", cardClass: "PALADIN", rarity: "FREE", type: "WEAPON", cost: 4, attack: 4, health: 2, durability: 2, text: "Whenever your hero attacks, restore 2 Health to it.", mechanics: ["trigger", "heal"], set: "Classic" },
  { id: "PD_007", name: "Hammer of Wrath", nameZh: "愤怒之锤", cardClass: "PALADIN", rarity: "FREE", type: "SPELL", cost: 4, text: "Deal 3 damage. Draw a card.", spellSchool: "HOLY", mechanics: ["draw", "spell-damage"], set: "Classic" },
  { id: "PD_008", name: "Equality", nameZh: "生平", cardClass: "PALADIN", rarity: "RARE", type: "SPELL", cost: 4, text: "Change the Health of ALL minions to 1.", spellSchool: "NONE", mechanics: ["modify", "aoe"], set: "Classic" },
  { id: "PD_009", name: "Tirion Fordring", nameZh: "提里奥·弗丁", cardClass: "PALADIN", rarity: "LEGENDARY", type: "MINION", cost: 8, attack: 6, health: 6, text: "Divine Shield, Taunt. Deathrattle: Equip a 5/3 Ashbringer.", race: "NONE", mechanics: ["divine-shield", "taunt", "deathrattle"], set: "Classic" },
  { id: "PD_010", name: "Sunkeeper Tarim", nameZh: "守日者塔林姆", cardClass: "PALADIN", rarity: "LEGENDARY", type: "MINION", cost: 6, attack: 3, health: 7, text: "Taunt. Battlecry: Set the Attack and Health of all other minions to 3.", race: "NONE", mechanics: ["taunt", "battlecry", "modify"], set: "Journey to Un'Goro" },

  // === PRIEST ===
  { id: "PR_001", name: "Holy Smite", nameZh: "神圣惩击", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 1, text: "Deal 2 damage to a minion.", spellSchool: "HOLY", mechanics: ["spell-damage"], set: "Classic" },
  { id: "PR_002", name: "Power Word: Shield", nameZh: "真言术：盾", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 1, text: "Give a minion +2 Health. Draw a card.", spellSchool: "HOLY", mechanics: ["modify", "draw"], set: "Classic" },
  { id: "PR_003", name: "Northshire Cleric", nameZh: "北郡牧师", cardClass: "PRIEST", rarity: "FREE", type: "MINION", cost: 1, attack: 1, health: 3, text: "Whenever a minion is healed, draw a card.", race: "NONE", mechanics: ["trigger", "draw"], set: "Classic" },
  { id: "PR_004", name: "Shadow Word: Pain", nameZh: "暗言术：痛", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 2, text: "Destroy a minion with 3 or less Attack.", spellSchool: "SHADOW", mechanics: ["destroy"], set: "Classic" },
  { id: "PR_005", name: "Shadow Word: Death", nameZh: "暗言术：灭", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 3, text: "Destroy a minion with 5 or more Attack.", spellSchool: "SHADOW", mechanics: ["destroy"], set: "Classic" },
  { id: "PR_006", name: "Auchenai Soulpriest", nameZh: "奥金尼灵魂祭司", cardClass: "PRIEST", rarity: "RARE", type: "MINION", cost: 4, attack: 3, health: 5, text: "Your healing effects deal damage instead.", race: "NONE", mechanics: ["aura"], set: "Classic" },
  { id: "PR_007", name: "Holy Nova", nameZh: "神圣新星", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 5, text: "Deal 2 damage to all enemy minions. Restore 2 Health to all friendly characters.", spellSchool: "HOLY", mechanics: ["aoe", "heal", "spell-damage"], set: "Classic" },
  { id: "PR_008", name: "Cabal Shadow Priest", nameZh: "秘教暗影祭司", cardClass: "PRIEST", rarity: "EPIC", type: "MINION", cost: 6, attack: 4, health: 5, text: "Battlecry: Take control of an enemy minion with 2 or less Attack.", race: "NONE", mechanics: ["battlecry", "mind-control"], set: "Classic" },
  { id: "PR_009", name: "Mind Control", nameZh: "精神控制", cardClass: "PRIEST", rarity: "FREE", type: "SPELL", cost: 10, text: "Take control of an enemy minion.", spellSchool: "SHADOW", mechanics: ["mind-control"], set: "Classic" },

  // === SHAMAN ===
  { id: "SH_001", name: "Lightning Bolt", nameZh: "闪电箭", cardClass: "SHAMAN", rarity: "COMMON", type: "SPELL", cost: 1, text: "Deal 3 damage. Overload: (1).", spellSchool: "NATURE", mechanics: ["spell-damage", "overload"], set: "Classic" },
  { id: "SH_002", name: "Totemic Might", nameZh: "图腾之力", cardClass: "SHAMAN", rarity: "FREE", type: "SPELL", cost: 0, text: "Give your Totems +2 Health.", spellSchool: "NATURE", mechanics: ["modify"], set: "Classic" },
  { id: "SH_003", name: "Rockbiter Weapon", nameZh: "石化武器", cardClass: "SHAMAN", rarity: "FREE", type: "SPELL", cost: 1, text: "Give a friendly character +3 Attack this turn.", spellSchool: "NATURE", mechanics: ["modify"], set: "Classic" },
  { id: "SH_004", name: "Feral Spirit", nameZh: "野性之魂", cardClass: "SHAMAN", rarity: "RARE", type: "SPELL", cost: 3, text: "Summon two 2/3 Spirit Wolves with Taunt. Overload: (2).", spellSchool: "NATURE", mechanics: ["summon", "taunt", "overload"], set: "Classic" },
  { id: "SH_005", name: "Lightning Storm", nameZh: "闪电风暴", cardClass: "SHAMAN", rarity: "RARE", type: "SPELL", cost: 3, text: "Deal 2-3 damage to all enemy minions. Overload: (2).", spellSchool: "NATURE", mechanics: ["aoe", "overload"], set: "Classic" },
  { id: "SH_006", name: "Hex", nameZh: "妖术", cardClass: "SHAMAN", rarity: "FREE", type: "SPELL", cost: 4, text: "Transform a minion into a 0/1 Frog with Taunt.", spellSchool: "NATURE", mechanics: ["transform"], set: "Classic" },
  { id: "SH_007", name: "Mana Tide Totem", nameZh: "法力之潮图腾", cardClass: "SHAMAN", rarity: "RARE", type: "MINION", cost: 3, attack: 0, health: 3, text: "At the end of your turn, draw a card.", race: "TOTEM", mechanics: ["trigger", "draw"], set: "Classic" },
  { id: "SH_008", name: "Doomhammer", nameZh: "毁灭之锤", cardClass: "SHAMAN", rarity: "EPIC", type: "WEAPON", cost: 5, attack: 2, health: 8, durability: 8, text: "Windfury, Overload: (2).", mechanics: ["windfury", "overload"], set: "Classic" },
  { id: "SH_009", name: "Al'Akir the Windlord", nameZh: "风领主奥拉基尔", cardClass: "SHAMAN", rarity: "LEGENDARY", type: "MINION", cost: 8, attack: 3, health: 5, text: "Charge, Divine Shield, Taunt, Windfury.", race: "ELEMENTAL", mechanics: ["charge", "divine-shield", "taunt", "windfury"], set: "Classic" },

  // === DRUID ===
  { id: "DR_001", name: "Innervate", nameZh: "激活", cardClass: "DRUID", rarity: "FREE", type: "SPELL", cost: 0, text: "Gain 1 Mana Crystal this turn only.", spellSchool: "NATURE", mechanics: ["ramp"], set: "Classic" },
  { id: "DR_002", name: "Wrath", nameZh: "愤怒", cardClass: "DRUID", rarity: "FREE", type: "SPELL", cost: 2, text: "Choose One - Deal 3 damage to a minion; or Deal 1 damage and draw a card.", spellSchool: "NATURE", mechanics: ["choose-one", "draw", "spell-damage"], set: "Classic" },
  { id: "DR_003", name: "Wild Growth", nameZh: "野性成长", cardClass: "DRUID", rarity: "FREE", type: "SPELL", cost: 3, text: "Gain an empty Mana Crystal.", spellSchool: "NATURE", mechanics: ["ramp"], set: "Classic" },
  { id: "DR_004", name: "Swipe", nameZh: "横扫", cardClass: "DRUID", rarity: "FREE", type: "SPELL", cost: 4, text: "Deal 4 damage to an enemy and 1 damage to all other enemies.", spellSchool: "NATURE", mechanics: ["aoe", "spell-damage"], set: "Classic" },
  { id: "DR_005", name: "Keeper of the Grove", nameZh: "丛林守护者", cardClass: "DRUID", rarity: "RARE", type: "MINION", cost: 4, attack: 2, health: 4, text: "Choose One - Deal 2 damage; or Silence a minion.", race: "NONE", mechanics: ["choose-one", "silence"], set: "Classic" },
  { id: "DR_006", name: "Druid of the Claw", nameZh: "利爪德鲁伊", cardClass: "DRUID", rarity: "FREE", type: "MINION", cost: 5, attack: 4, health: 4, text: "Choose One - Transform into Cat with Charge; or Bear with Taunt.", race: "NONE", mechanics: ["choose-one", "charge", "taunt"], set: "Classic" },
  { id: "DR_007", name: "Ancient of Lore", nameZh: "知识古树", cardClass: "DRUID", rarity: "EPIC", type: "MINION", cost: 7, attack: 5, health: 5, text: "Choose One - Draw 2 cards; or Restore 5 Health.", race: "NONE", mechanics: ["choose-one", "draw", "heal"], set: "Classic" },
  { id: "DR_008", name: "Force of Nature", nameZh: "自然之力", cardClass: "DRUID", rarity: "EPIC", type: "SPELL", cost: 5, text: "Summon three 2/2 Treants.", spellSchool: "NATURE", mechanics: ["summon"], set: "Classic" },
  { id: "DR_009", name: "Cenarius", nameZh: "塞纳留斯", cardClass: "DRUID", rarity: "LEGENDARY", type: "MINION", cost: 9, attack: 5, health: 8, text: "Choose One - Give your other minions +2/+2; or Summon two 2/2 Treants with Taunt.", race: "NONE", mechanics: ["choose-one", "summon", "taunt"], set: "Classic" },

  // === DEMON HUNTER ===
  { id: "DH_001", name: "Demon Claws", nameZh: "恶魔之爪", cardClass: "DEMONHUNTER", rarity: "FREE", type: "SPELL", cost: 1, text: "Give your hero +2 Attack this turn.", spellSchool: "FEL", mechanics: [], set: "Ashes of Outland" },
  { id: "DH_002", name: "Blind", nameZh: "致盲", cardClass: "DEMONHUNTER", rarity: "COMMON", type: "SPELL", cost: 0, text: "A minion can't attack next turn.", spellSchool: "NONE", mechanics: [], set: "Ashes of Outland" },
  { id: "DH_003", name: "Sightless Watcher", nameZh: "无面监视者", cardClass: "DEMONHUNTER", rarity: "COMMON", type: "MINION", cost: 2, attack: 3, health: 2, text: "Battlecry: Look at 3 cards in your deck. Choose one to put on top.", race: "DEMON", mechanics: ["battlecry"], set: "Ashes of Outland" },
  { id: "DH_004", name: "Chaos Strike", nameZh: "混乱打击", cardClass: "DEMONHUNTER", rarity: "FREE", type: "SPELL", cost: 3, text: "Give your hero +2 Attack this turn. Draw a card.", spellSchool: "FEL", mechanics: ["draw"], set: "Ashes of Outland" },
  { id: "DH_005", name: "Aldrachi Warblades", nameZh: "奥达奇战刃", cardClass: "DEMONHUNTER", rarity: "COMMON", type: "WEAPON", cost: 3, attack: 2, health: 2, durability: 2, text: "Lifesteal", mechanics: ["lifesteal"], set: "Ashes of Outland" },
  { id: "DH_006", name: "Metamorphosis", nameZh: "变形", cardClass: "DEMONHUNTER", rarity: "LEGENDARY", type: "SPELL", cost: 5, text: "Replace your Hero Power with 'Deal 4 damage.' Lasts 2 turns.", spellSchool: "FEL", mechanics: [], set: "Ashes of Outland" },
  { id: "DH_007", name: "Priestess of Fury", nameZh: "怒火祭司", cardClass: "DEMONHUNTER", rarity: "RARE", type: "MINION", cost: 7, attack: 6, health: 5, text: "At the end of your turn, deal 6 damage randomly split among all enemies.", race: "DEMON", mechanics: ["trigger"], set: "Ashes of Outland" },
  { id: "DH_008", name: "Illidari Inquisitor", nameZh: "伊利达里审判官", cardClass: "DEMONHUNTER", rarity: "COMMON", type: "MINION", cost: 8, attack: 8, health: 8, text: "Rush. After this attacks and kills a minion, it may attack again.", race: "DEMON", mechanics: ["rush", "trigger"], set: "Ashes of Outland" },

  // === NEUTRAL ===
  { id: "NT_001", name: "Murloc Raider", nameZh: "鱼人袭击者", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 1, attack: 2, health: 1, race: "MURLOC", set: "Classic" },
  { id: "NT_002", name: "Bloodfen Raptor", nameZh: "血沼迅猛龙", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 2, attack: 3, health: 2, race: "BEAST", set: "Classic" },
  { id: "NT_003", name: "Novice Engineer", nameZh: "工程师学徒", cardClass: "NEUTRAL", rarity: "FREE", type: "MINION", cost: 2, attack: 1, health: 1, text: "Battlecry: Draw a card.", race: "NONE", mechanics: ["battlecry", "draw"], set: "Classic" },
  { id: "NT_004", name: "Acidic Swamp Ooze", nameZh: "酸性沼泽软泥怪", cardClass: "NEUTRAL", rarity: "FREE", type: "MINION", cost: 2, attack: 3, health: 2, text: "Battlecry: Destroy your opponent's weapon.", race: "NONE", mechanics: ["battlecry", "destroy"], set: "Classic" },
  { id: "NT_005", name: "Harvest Golem", nameZh: "收割傀儡", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 3, attack: 2, health: 3, text: "Deathrattle: Summon a 2/1 Damaged Golem.", race: "MECH", mechanics: ["deathrattle", "summon"], set: "Classic" },
  { id: "NT_006", name: "Scarlet Crusader", nameZh: "血色十字军", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 3, attack: 3, health: 1, text: "Divine Shield.", race: "NONE", mechanics: ["divine-shield"], set: "Classic" },
  { id: "NT_007", name: "Defender of Argus", nameZh: "阿古斯防御者", cardClass: "NEUTRAL", rarity: "RARE", type: "MINION", cost: 4, attack: 2, health: 3, text: "Battlecry: Give adjacent minions +1/+1 and Taunt.", race: "NONE", mechanics: ["battlecry", "taunt", "modify"], set: "Classic" },
  { id: "NT_008", name: "Azure Drake", nameZh: "碧蓝幼龙", cardClass: "NEUTRAL", rarity: "RARE", type: "MINION", cost: 5, attack: 4, health: 4, text: "Spell Damage +1. Battlecry: Draw a card.", race: "DRAGON", mechanics: ["spell-damage", "battlecry", "draw"], set: "Classic" },
  { id: "NT_009", name: "Sludge Belcher", nameZh: "淤泥喷射者", cardClass: "NEUTRAL", rarity: "RARE", type: "MINION", cost: 5, attack: 3, health: 5, text: "Taunt. Deathrattle: Summon a 1/2 Slime with Taunt.", race: "NONE", mechanics: ["taunt", "deathrattle", "summon"], set: "Naxxramas" },
  { id: "NT_010", name: "Sylvanas Windrunner", nameZh: "希尔瓦娜斯·风行者", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 6, attack: 5, health: 5, text: "Deathrattle: Take control of a random enemy minion.", race: "UNDEAD", mechanics: ["deathrattle", "mind-control"], set: "Classic" },
  { id: "NT_011", name: "The Black Knight", nameZh: "黑骑士", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 6, attack: 4, health: 5, text: "Battlecry: Destroy an enemy minion with Taunt.", race: "NONE", mechanics: ["battlecry", "destroy", "taunt"], set: "Classic" },
  { id: "NT_012", name: "Ragnaros the Firelord", nameZh: "炎魔之王拉格纳罗斯", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 8, attack: 8, health: 8, text: "Can't attack. At the end of your turn, deal 8 damage to a random enemy.", race: "ELEMENTAL", mechanics: ["trigger"], set: "Classic" },
  { id: "NT_013", name: "Bloodmage Thalnos", nameZh: "血法师萨尔诺斯", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 2, attack: 1, health: 1, text: "Spell Damage +1. Deathrattle: Draw a card.", race: "NONE", mechanics: ["spell-damage", "deathrattle", "draw"], set: "Classic" },
  { id: "NT_014", name: "Loatheb", nameZh: "洛欧塞布", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 5, attack: 5, health: 5, text: "Battlecry: Enemy spells cost (5) more next turn.", race: "NONE", mechanics: ["battlecry"], set: "Naxxramas" },
  { id: "NT_015", name: "Zilliax", nameZh: "泽里克", cardClass: "NEUTRAL", rarity: "LEGENDARY", type: "MINION", cost: 5, attack: 3, health: 2, text: "Magnetic, Divine Shield, Taunt, Lifesteal, Rush.", race: "MECH", mechanics: ["magnetic", "divine-shield", "taunt", "lifesteal", "rush"], set: "The Boomsday Project" },
  { id: "NT_016", name: "Dirty Rat", nameZh: "卑劣的脏鼠", cardClass: "NEUTRAL", rarity: "RARE", type: "MINION", cost: 2, attack: 2, health: 6, text: "Taunt. Battlecry: Your opponent summons a random minion from their hand.", race: "NONE", mechanics: ["taunt", "battlecry", "summon"], set: "Mean Streets of Gadgetzan" },
  { id: "NT_017", name: "Glacial Shard", nameZh: "冰川裂片", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 1, attack: 2, health: 1, text: "Battlecry: Freeze a random enemy minion.", race: "ELEMENTAL", mechanics: ["battlecry", "freeze"], set: "Journey to Un'Goro" },
  { id: "NT_018", name: "Kobold Geomancer", nameZh: "狗头人地卜师", cardClass: "NEUTRAL", rarity: "FREE", type: "MINION", cost: 2, attack: 2, health: 2, text: "Spell Damage +1.", race: "NONE", mechanics: ["spell-damage"], set: "Classic" },
  { id: "NT_019", name: "Ironbeak Owl", nameZh: "铁喙猫头鹰", cardClass: "NEUTRAL", rarity: "COMMON", type: "MINION", cost: 3, attack: 2, health: 1, text: "Battlecry: Silence a minion.", race: "BEAST", mechanics: ["battlecry", "silence"], set: "Classic" },
  { id: "NT_020", name: "Big Game Hunter", nameZh: "王牌猎人", cardClass: "NEUTRAL", rarity: "EPIC", type: "MINION", cost: 5, attack: 4, health: 2, text: "Battlecry: Destroy a minion with 7 or more Attack.", race: "NONE", mechanics: ["battlecry", "destroy"], set: "Classic" },
];

export function getCardById(id: string): HearthstoneCard | undefined {
  return CARDS.find((c) => c.id === id);
}

export function getCardsByClass(cardClass: string): HearthstoneCard[] {
  return CARDS.filter((c) => c.cardClass === cardClass);
}

export function getCardsByCost(cost: number): HearthstoneCard[] {
  return CARDS.filter((c) => c.cost === cost);
}

export function getCardsByMechanic(mechanic: string): HearthstoneCard[] {
  return CARDS.filter((c) => c.mechanics?.includes(mechanic));
}
