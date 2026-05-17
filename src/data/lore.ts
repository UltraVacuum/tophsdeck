// Card lore / flavor stories for key cards
// Wowhead links: https://www.wowhead.com/card=<dbfId> for HS cards
//                https://www.wowhead.com/npc=<npcId>  for WoW NPCs

export interface CardLoreEntry {
  /** 背景故事 — 卡牌在魔兽世界中的来历 */
  lore: string;
  /** 趣味小知识 */
  funFact?: string;
  /** Wowhead 卡牌页面链接 */
  wowheadCardUrl?: string;
  /** Wowhead 魔兽世界 NPC/物品链接 */
  wowheadWowUrl?: string;
  /** 在魔兽世界中的出处区域或副本 */
  wowOrigin?: string;
  /** 故事标签 — 用于跨卡牌故事串联 */
  storyTags?: string[];
  /** 关联卡牌 ID — 同一故事线的卡牌 */
  relatedCardIds?: string[];
}

export const CARD_LORE: Record<string, CardLoreEntry> = {
  // ═══════════════════════════════════════
  // 经典传说 — Classic Legends
  // ═══════════════════════════════════════
  EX1_298: {
    lore: "拉格纳罗斯，炎魔之王，是《魔兽世界》中熔火之心的最终Boss。在艾泽拉斯的远古时代，他是上古之神的手下，被泰坦封印在火焰之地。在炉石传说中，他以8费8/8的姿态成为了游戏史上最具标志性的中立传说卡牌。'死吧，虫子！'是每位玩家都熟悉的台词。",
    funFact: "拉格纳罗斯曾是竞技场中最强的8费随从，出场即造成8点伤害的效果使他被称为'炎魔舅舅'。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=374/ragnaros-the-firelord",
    wowheadWowUrl: "https://www.wowhead.com/npc=11502/ragnaros",
    wowOrigin: "熔火之心 (Molten Core)",
    storyTags: ["元素领主", "上古之神", "熔火之心"],
    relatedCardIds: ["BRM_030", "NEW1_010"],
  },
  EX1_016: {
    lore: "希尔瓦娜斯·风行者曾是高等精灵的游侠将军，在巫妖王阿尔萨斯的入侵中被杀并复活为女妖。后来她挣脱了巫妖王的控制，建立了被遗忘者，成为了幽暗城的女王。她的卡牌效果——死亡时控制一个敌方随从——完美体现了她操控亡灵的能力。",
    funFact: "希尔瓦娜斯是历史上被削弱最多的卡牌之一，从6费调整为7费，最终被移入荣誉室。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1721/sylvanas-windrunner",
    wowheadWowUrl: "https://www.wowhead.com/npc=10181/sylvanas-windrunner",
    wowOrigin: "冰冠堡垒 / 幽暗城",
    storyTags: ["被遗忘者", "风行者家族", "巫妖王之怒"],
    relatedCardIds: ["ICC_314", "CORE_EX1_383"],
  },
  CORE_EX1_383: {
    lore: "提里奥·弗丁是白银之手的圣骑士，联盟最伟大的英雄之一。他在冰冠堡垒的决战中亲手终结了巫妖王阿尔萨斯。在炉石传说中，他集圣盾、嘲讽和亡语于一身，死后还留下一把灰烬使者。被公认为游戏中最强的圣骑士专属传说。",
    funFact: "提里奥的亡语武器'灰烬使者'攻击力为5，恰好能杀死大部分常规随从。这把剑在魔兽世界中也是圣骑士的标志性武器。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=69613/tirion-fordring",
    wowheadWowUrl: "https://www.wowhead.com/npc=24758/tirion-fordring",
    wowOrigin: "冰冠堡垒 / 东瘟疫之地",
    storyTags: ["白银之手", "灰烬使者", "巫妖王之怒"],
    relatedCardIds: ["ICC_314", "EX1_016"],
  },
  EX1_613: {
    lore: "艾德温·范克里夫是暴风城的石匠工会会长。在第一次兽人战争后重建暴风城的过程中，贵族们拒绝支付工人的报酬。愤怒的范克里夫组建了迪菲亚兄弟会，成为了西部荒野最臭名昭著的罪犯。他的连击效果——根据本回合已使用卡牌数获得增益——完美体现了他精密谋划的性格。",
    funFact: "范克里夫曾是炉石历史上最重要的单卡之一，在奇迹贼卡组中可以用0费法术养出10/10甚至更大的超级随从。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=306/edwin-vancleef",
    wowheadWowUrl: "https://www.wowhead.com/npc=639/edwin-vancleef",
    wowOrigin: "死亡矿井 (Deadmines)",
    storyTags: ["迪菲亚兄弟会", "暴风城", "死亡矿井"],
    relatedCardIds: [],
  },
  FP1_030: {
    lore: "洛欧塞布是纳克萨玛斯中的瘟疫翼Boss。这个由真菌和腐败组成的生物能够释放瘟疫孢子，使法术施放变得极其昂贵。在炉石传说中，他的战吼效果——使对手下回合法术费用+5——堪称对抗法师和奇迹贼的最佳利器。",
    funFact: "洛欧塞布是纳克萨玛斯冒险模式中最受欢迎的单卡之一，被誉为'法术终结者'。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1914/loatheb",
    wowheadWowUrl: "https://www.wowhead.com/npc=16011/loatheb",
    wowOrigin: "纳克萨玛斯 — 瘟疫翼",
    storyTags: ["纳克萨玛斯", "天灾军团", "瘟疫"],
    relatedCardIds: [],
  },
  EX1_534: {
    lore: "长鬃草原狮是贫瘠之地草原上的顶级掠食者。在魔兽世界中，猎人玩家可以在贫瘠之地驯服这种威武的野兽。在炉石传说中，它以6费6/5的身材加亡语召唤两只2/2土狼闻名，总属性高达10/9，被称为'最超模的稀有卡'。",
    funFact: "草原狮的亡语土狼在炉石术语中催生了'狮群'这个概念——任何能不断产生衍生随从的卡牌。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1261/savannah-highmane",
    wowheadWowUrl: "https://www.wowhead.com/npc=14006/savannah-highmane",
    wowOrigin: "贫瘠之地",
    storyTags: ["野兽", "贫瘠之地", "猎人"],
    relatedCardIds: ["EX1_543"],
  },
  EX1_543: {
    lore: "暴龙王克鲁什是安戈洛环形山的隐藏Boss，是那里最强大的霸王龙。在魔兽世界中，它是精英怪中的传说，无数玩家曾在它的爪下倒下。在炉石传说中，9费8/8的冲锋身材让它成为了经典的高费终结手段。",
    funFact: "暴龙王是炉石传说中最早的恐龙主题传说卡牌之一，'暴龙王'也成为了'大哥冲锋'的代名词。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1144/king-krush",
    wowheadWowUrl: "https://www.wowhead.com/npc=38442/king-krush",
    wowOrigin: "安戈洛环形山",
    storyTags: ["恐龙", "安戈洛", "野兽"],
    relatedCardIds: ["EX1_534"],
  },
  NEW1_010: {
    lore: "风领主奥拉基尔是四元素领主之一，掌管风之元素。在魔兽世界中，他驻守于风神王座。炉石传说中他集冲锋、圣盾、嘲讽、风怒四大机制于一身，被称为'最强元素领主'——虽然其他三位元素领主对此持有异议。",
    funFact: "奥拉基尔是炉石传说中拥有最多关键词的随从（4个），也因此成为了设计团队口中'机制最密集的卡牌'。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=32/alakir-the-windlord",
    wowheadWowUrl: "https://www.wowhead.com/npc=46753/alakir-the-windlord",
    wowOrigin: "风神王座 (Throne of the Four Winds)",
    storyTags: ["元素领主", "风神王座"],
    relatedCardIds: ["EX1_298"],
  },
  CORE_EX1_323: {
    lore: "加拉克苏斯大王是深渊领主，艾瑞达一族中最强大的存在之一。在魔兽世界中被术士召唤来对抗天灾军团。在炉石传说中，打出他就等于直接变身——将你的英雄替换为大王本人，并装备一把3/8的血怒之剑。这是炉石最早的英雄替换卡牌。",
    funFact: "大王战吼替换英雄的机制后来演变为整个'英雄牌'系统，可以说是英雄牌概念的鼻祖。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=69637/lord-jaraxxus",
    wowheadWowUrl: "https://www.wowhead.com/npc=33689/lord-jaraxxus",
    wowOrigin: "十字军试炼 (Trial of the Crusader)",
    storyTags: ["术士", "艾瑞达", "燃烧军团"],
    relatedCardIds: [],
  },
  LOE_011: {
    lore: "雷诺·杰克逊是探险者协会的创始成员之一。作为一个热爱考古的冒险家，他走遍了艾泽拉斯的每一个角落寻找远古宝藏。他的'没有重复牌则全场回满'的效果完美体现了他独来独往的性格——宇宙流卡组的灵魂人物。",
    funFact: "雷诺·杰克逊是'宇宙流'（Highlander）卡组的核心卡牌，这个术语来源于电影《挑战者》中的名言'只能有一个'。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=2883/reno-jackson",
    wowOrigin: "探险者协会",
    storyTags: ["探险者协会", "宇宙流"],
    relatedCardIds: ["LOE_077", "LOE_079"],
  },
  UNG_015: {
    lore: "守日者塔林姆是圣骑士阵营中最受人尊敬的领导者之一。在魔兽世界中，他守卫着太阳之井，保护着血精灵的圣光之源。在炉石传说中，他的战吼将所有其他随从变为3/3，既能削弱对手的大怪，也能强化自己的小怪。",
    funFact: "塔林姆的效果被玩家戏称为'平等2.0'，因为他和生平一样都能消除随从的属性差异。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=41145/sunkeeper-tarim",
    wowheadWowUrl: "https://www.wowhead.com/npc=45213/sunkeeper-tarim",
    wowOrigin: "太阳之井 / 奎尔丹纳斯岛",
    storyTags: ["圣骑士", "血精灵", "太阳之井"],
    relatedCardIds: ["CORE_EX1_383"],
  },
  BOT_548: {
    lore: "泽里克是一个来历不明的机械战士，据说来自某个失落的机械文明。他集磁力、圣盾、嘲讽、吸血、突袭于一身，是炉石传说中机制最全面的随从之一。无论放在什么卡组中都能发挥作用。",
    funFact: "泽里克是炉石历史上使用率最高的中立传说之一，被称为'万能胶'——能粘在任何卡组里。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=49184/zilliax",
    storyTags: ["机械", "砰砰计划"],
    relatedCardIds: [],
  },
  CS2_235: {
    lore: "北郡牧师是艾泽拉斯教会的基层成员。她们在教堂和修道院中研习圣光之道，虽然年纪轻轻却拥有强大的治疗和祈祷能力。在炉石传说中，每有一个随从被治疗就抽一张牌的效果，使她成为了最强的过牌引擎之一。",
    funFact: "北郡牧师配合奥金尼灵魂祭司可以无限抽牌直到疲劳——不过这通常意味着你已经赢了。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1650/northshire-cleric",
    wowheadWowUrl: "https://www.wowhead.com/npc=15279/northshire-cleric",
    wowOrigin: "北郡修道院 / 艾尔文森林",
    storyTags: ["牧师", "圣光", "北郡"],
    relatedCardIds: [],
  },
  EX1_573: {
    lore: "塞纳留斯是艾泽拉斯的半神，森林之王。他是暗夜精灵德鲁伊的导师，也是自然力量的化身。他的抉择效果——要么强化全体随从，要么召唤两个嘲讽树人——完美体现了他既是守护者又是自然力量的双重身份。",
    funFact: "塞纳留斯的卡牌插画中可以看到月光之下的海加尔山，这是他永恒的栖息之地。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=36/cenarius",
    wowheadWowUrl: "https://www.wowhead.com/npc=12042/cenarius",
    wowOrigin: "海加尔山 / 月光林地",
    storyTags: ["半神", "暗夜精灵", "海加尔山"],
    relatedCardIds: [],
  },
  // ═══════════════════════════════════════
  // 巫妖王 — The Lich King Saga
  // ═══════════════════════════════════════
  ICC_314: {
    lore: "巫妖王阿尔萨斯·米奈希尔曾是洛丹伦的王储、白银之手的圣骑士。为了拯救他的人民，他拾起了被诅咒的魔剑霜之哀伤，却因此被耐奥祖的意志所吞噬。他杀死了自己的父亲，摧毁了洛丹伦王国，最终坐镇冰冠堡垒成为了艾泽拉斯最恐怖的存在。",
    funFact: "阿尔萨斯是魔兽世界中最具悲剧色彩的反派——他做的每一个选择都是为了'拯救'，却一步步走向深渊。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=42818/the-lich-king",
    wowheadWowUrl: "https://www.wowhead.com/npc=36597/the-lich-king",
    wowOrigin: "冰冠堡垒 (Icecrown Citadel)",
    storyTags: ["巫妖王", "天灾军团", "霜之哀伤", "冰冠堡垒"],
    relatedCardIds: ["EX1_016", "CORE_EX1_383"],
  },
  // ═══════════════════════════════════════
  // 探险者协会 — League of Explorers
  // ═══════════════════════════════════════
  LOE_077: {
    lore: "布莱恩·铜须是铜须三兄弟中最年轻的探险家。他致力于揭开泰坦遗迹的秘密，在奥达曼、奥杜雅和奥丹姆留下了足迹。在炉石传说中，他的战吼效果——使战吼触发两次——体现了他对远古宝藏的不懈追寻。",
    funFact: "布莱恩在魔兽世界中'失踪'了整整两个资料片，玩家们组成了'寻找布莱恩'社区活动，直到大灾变才重逢。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=2949/brann-bronzebeard",
    wowheadWowUrl: "https://www.wowhead.com/npc=24391/brann-bronzebeard",
    wowOrigin: "奥杜雅 / 奥丹姆",
    storyTags: ["探险者协会", "铜须家族", "泰坦"],
    relatedCardIds: ["LOE_011", "LOE_079"],
  },
  LOE_079: {
    lore: "伊莉斯·逐星是探险者协会中智勇双全的暗夜精灵学者。她将考古学的严谨与冒险家的勇气融为一体，带领团队穿越了无数远古遗迹。她的卡牌效果——将一张'地图'洗入牌库——完美再现了探险者追寻宝藏的旅程。",
    funFact: "伊莉斯是炉石传说中获得重印次数最多的角色之一，每个新版本都以不同形态登场。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=2951/elise-starseeker",
    storyTags: ["探险者协会", "暗夜精灵", "考古"],
    relatedCardIds: ["LOE_011", "LOE_077"],
  },
  // ═══════════════════════════════════════
  // 龙族传说 — Dragon Legends
  // ═══════════════════════════════════════
  BRM_030: {
    lore: "奈法利安是黑龙公主奥妮克希亚的兄弟，死亡之翼奈萨里奥的长子。他占领了黑石山巅峰的黑翼巢穴，利用各龙族的能力进行恐怖的龙血实验。在炉石传说中，他的战吼发现对方职业的法术，完美复刻了他在魔兽世界中'窃取龙族力量'的行径。",
    funFact: "奈法利安是炉石冒险模式'黑石山'的最终Boss，他的英雄技能每回合都会随机获得一个龙族力量。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=2261/nefarian",
    wowheadWowUrl: "https://www.wowhead.com/npc=11583/nefarian",
    wowOrigin: "黑翼巢穴 (Blackwing Lair)",
    storyTags: ["黑龙", "黑石山", "死亡之翼"],
    relatedCardIds: ["EX1_298", "EX1_562"],
  },
  // ═══════════════════════════════════════
  // 暗影崛起 — Rise of Shadows
  // ═══════════════════════════════════════
  DAL_422: {
    lore: "拉法姆是古埃及风格的邪恶考古学家，自称'至高术士'。他召集了炉石史上最臭名昭著的反派团队——怪盗军团，企图夺取达拉然。在炉石传说中，他的战吼将牌库中的随从替换为传说随从，体现了他窃取和篡改的邪恶本质。",
    funFact: "拉法姆是炉石中少有的'跨版本反派'，从探险者协会到暗影崛起一直是主要反派。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=52119/arch-villain-rafaam",
    storyTags: ["怪盗军团", "达拉然", "反派"],
    relatedCardIds: ["LOE_077", "LOE_079"],
  },
  // ═══════════════════════════════════════
  // 五色巨龙 — The Dragon Aspects
  // ═══════════════════════════════════════
  EX1_561: {
    lore: "阿莱克丝塔萨是红龙女王，生命的缚誓者。泰坦赋予了她守护艾泽拉斯生命的使命。在魔兽世界中，她被龙喉兽人奴役多年，直到被冒险者解救。在炉石传说中，她的战吼将英雄生命值设为15点——无论是救死扶伤还是一击致命，都彰显了她掌控生死的力量。",
    funFact: "阿莱克丝塔萨是炉石传说中最早的'斩杀组件'之一，在冰法卡组中配合炎爆术可以打出致命连击。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=581/alexstrasza",
    wowheadWowUrl: "https://www.wowhead.com/npc=31333/alexstrasza",
    wowOrigin: "格瑞姆巴托 / 龙眠神殿",
    storyTags: ["五色巨龙", "泰坦", "龙眠神殿"],
    relatedCardIds: ["EX1_572", "NEW1_030", "EX1_563", "EX1_560"],
  },
  EX1_572: {
    lore: "伊瑟拉是绿龙女王，梦境的守护者。她永远沉睡在翡翠梦境中，通过梦境之眼注视着艾泽拉斯。她的'梦境'机制——回合结束给玩家一张梦境牌——完美再现了她从梦境中赠予凡人启示的能力。",
    funFact: "伊瑟拉的梦境牌共有5种，其中'觉醒'是炉石中最强的免费伤害法术之一。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=1186/ysera",
    wowheadWowUrl: "https://www.wowhead.com/npc=27447/ysera",
    wowOrigin: "翡翠梦境 / 月光林地",
    storyTags: ["五色巨龙", "翡翠梦境", "龙眠神殿"],
    relatedCardIds: ["EX1_561", "NEW1_030"],
  },
  NEW1_030: {
    lore: "死亡之翼奈萨里奥曾是大地守护者，五色巨龙中最强大的一位。上古之神的低语将他逼疯，他撕裂了自己的身体，以毁灭性的力量重生于世。在炉石传说中，他的战吼摧毁所有其他随从——正如他在大灾变中撕裂了整个艾泽拉斯。",
    funFact: "死亡之翼是炉石传说中第一张'全清'传说随从。'他毁掉了一切！'——不只是对手的场面，还有你自己的。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=834/deathwing",
    wowheadWowUrl: "https://www.wowhead.com/npc=48287/deathwing",
    wowOrigin: "大漩涡 / 暮光堡垒",
    storyTags: ["五色巨龙", "上古之神", "大灾变"],
    relatedCardIds: ["EX1_561", "EX1_572", "BRM_030"],
  },
  EX1_563: {
    lore: "玛里苟斯是蓝龙之王，魔法之王。他守护着艾泽拉斯的奥术魔法井——永恒之井。在巫妖王之怒中，他被凡人英雄击败于魔枢。在炉石传说中，他的战吼使法术伤害+5，完美体现了他是魔法力量化身的本质。",
    funFact: "玛里苟斯是'蓝龙贼'卡组的核心——配合影袭和刺骨等低费法术可以打出惊人的爆发伤害。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=436/malygos",
    wowheadWowUrl: "https://www.wowhead.com/npc=31722/malygos",
    wowOrigin: "魔枢 (The Nexus)",
    storyTags: ["五色巨龙", "奥术魔法", "蓝龙"],
    relatedCardIds: ["EX1_561", "EX1_572"],
  },
  EX1_560: {
    lore: "诺兹多姆是青铜龙王，永恒之王。他守护着时间线，确保历史不被篡改。在炉石传说中，他的效果——将回合时间限制为15秒——直接将他在魔兽世界中的'时间掌控'能力转化为游戏机制。",
    funFact: "诺兹多姆是炉石中唯一一张直接改变游戏界面行为的卡牌，他缩短的 Rope（回合结束倒计时）让无数操作流玩家闻风丧胆。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=411/nozdormu",
    wowheadWowUrl: "https://www.wowhead.com/npc=43468/nozdormu",
    wowOrigin: "时光之穴 / 永恒神殿",
    storyTags: ["五色巨龙", "时光之穴"],
    relatedCardIds: ["EX1_561", "EX1_572"],
  },
  EX1_562: {
    lore: "奥妮克希亚是黑龙公主，死亡之翼的女儿。她以人类女性的身份潜入暴风城，操纵联盟政治多年。在炉石传说中，她的战吼召唤6个2/1的龙人随从——完美复刻了魔兽世界中她召唤龙人护卫的Boss战机制。",
    funFact: "'多抽了几个龙人'成为了炉石社区的经典梗，用来形容被铺满场面时的绝望感。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=363/onyxia",
    wowheadWowUrl: "https://www.wowhead.com/npc=10184/onyxia",
    wowOrigin: "奥妮克希亚的巢穴 (Onyxia's Lair)",
    storyTags: ["黑龙", "死亡之翼", "暴风城"],
    relatedCardIds: ["NEW1_030", "BRM_030"],
  },
  // ═══════════════════════════════════════
  // 部落英雄 — Horde Heroes
  // ═══════════════════════════════════════
  CORE_EX1_414: {
    lore: "格罗玛什·地狱咆哮是战歌氏族的酋长，部落最伟大的战士之一。他是第一个饮下玛诺洛斯之血的兽人，也是最终亲手斩杀这个恶魔的人——以自己的生命为代价。在炉石传说中，他的激怒效果（怒火中烧时攻击力+6）完美诠释了'怒火即力量'。",
    funFact: "格罗玛什配合怒火中烧可以一回合打出12点伤害，是早期战士'斩杀'卡组的核心组件。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=69643/grommash-hellscream",
    wowheadWowUrl: "https://www.wowhead.com/npc=5519/grommash-hellscream",
    wowOrigin: "灰谷 / 阿什兰",
    storyTags: ["部落", "兽人", "战歌氏族"],
    relatedCardIds: [],
  },
  CORE_EX1_110: {
    lore: "凯恩·血蹄是牛头人酋长，雷霆崖的领袖。他是部落中最受尊敬的长者之一，以智慧和公正著称。在炉石传说中，他的亡语召唤一个同属性的4/5随从——正如他的遗志由其子贝恩·血蹄继承。",
    funFact: "凯恩是炉石中'亡语价值'的典范——6费4/5亡语再出4/5，相当于10/10的总量。",
    wowheadCardUrl: "https://www.wowhead.com/hearthstone/card=69667/cairne-bloodhoof",
    wowheadWowUrl: "https://www.wowhead.com/npc=30540/cairne-bloodhoof",
    wowOrigin: "雷霆崖 / 莫高雷",
    storyTags: ["部落", "牛头人", "雷霆崖"],
    relatedCardIds: [],
  },
};

/**
 * Generate Wowhead Hearthstone card URL from dbfId
 */
export function getWowheadCardUrl(dbfId: number): string {
  return `https://www.wowhead.com/hearthstone/card=${dbfId}`;
}

/**
 * Get card lore entry, returns undefined if no lore exists
 */
export function getCardLore(cardId: string): CardLoreEntry | undefined {
  return CARD_LORE[cardId];
}

/**
 * Get all story tags across all lore entries (for tag cloud)
 */
export function getAllStoryTags(): string[] {
  const tags = new Set<string>();
  for (const entry of Object.values(CARD_LORE)) {
    entry.storyTags?.forEach(t => tags.add(t));
  }
  return Array.from(tags).sort();
}

/**
 * Find cards sharing the same story tag
 */
export function getCardsByStoryTag(tag: string): string[] {
  return Object.entries(CARD_LORE)
    .filter(([, entry]) => entry.storyTags?.includes(tag))
    .map(([cardId]) => cardId);
}
