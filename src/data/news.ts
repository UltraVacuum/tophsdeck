import { NewsItem } from "@/types";

// Static fallback news items (used when generated/news.json is not available)
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "《炉石传说》新扩展包「翡翠梦境」正式公布",
    summary: "暴雪公布了炉石传说最新扩展包「翡翠梦境」，包含145张全新卡牌，引入全新关键词「唤醒」和「沉睡」。新扩展包将于下月正式上线。",
    category: "patch",
    date: "2025-03-15",
  },
  {
    id: "news-2",
    title: "平衡性更新：法师和恶魔猎手多张卡牌削弱",
    summary: "本次补丁对法师的火球术费用提升至5费，恶魔猎手的混沌打击费用提升至4费。同时加强了猎人和牧师的多张核心卡牌。",
    category: "patch",
    date: "2025-03-10",
  },
  {
    id: "news-3",
    title: "2025 炉石传说大师赛全球总决赛即将开战",
    summary: "来自全球的16位顶尖选手将齐聚一堂，争夺10万美元的总奖金。比赛采用征服赛制，持续三天。中国选手glory将卫冕出战。",
    category: "esports",
    date: "2025-03-08",
  },
  {
    id: "news-4",
    title: "新手入门指南：如何选择第一个职业和卡组",
    summary: "本文为刚入坑炉石的新玩家提供全面的职业选择建议，推荐了5套低成本高效率的入门卡组，帮助你快速上分。",
    category: "guide",
    date: "2025-03-05",
  },
  {
    id: "news-5",
    title: "暗月马戏团限时活动回归",
    summary: "暗月马戏团活动限时回归，完成每日任务可获得专属卡背和金色卡牌。活动期间还有特殊的乱斗模式和对战奖励加成。",
    category: "event",
    date: "2025-03-01",
  },
  {
    id: "news-6",
    title: "天梯环境分析：当前版本最强的5套卡组",
    summary: "根据HSReplay的数据统计，本文详细分析了当前标准模式中胜率最高的5套卡组，包括节奏法、中速萨和快攻恶魔猎手等。",
    category: "guide",
    date: "2025-02-28",
  },
  {
    id: "news-7",
    title: "竞技场新机制：双职业竞技场限时开放",
    summary: "本周竞技场开放双职业模式，玩家可以选择两个职业的英雄技能和卡池。新机制带来前所未有的策略深度和趣味性。",
    category: "event",
    date: "2025-02-25",
  },
  {
    id: "news-8",
    title: "社区投票：你最喜欢的经典卡牌Top 10",
    summary: "经过两周的社区投票，结果出炉！炎魔之王拉格纳罗斯、希尔瓦娜斯·风行者和提里奥·弗丁位列前三。来看看完整的排行榜吧。",
    category: "event",
    date: "2025-02-20",
  },
];

export const NEWS: NewsItem[] = FALLBACK_NEWS;
