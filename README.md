# TopHSDeck - 炉石传说卡组推荐平台

基于 Next.js 构建的炉石传说（Hearthstone）卡组推荐与卡牌浏览平台。自动抓取梯队数据、解码卡组代码，提供完整的卡组构建与环境分析体验。

## 页面功能

### `/` 首页
- **数据概览** — 展示最高胜率、平均胜率、卡组总数、卡牌总数等核心统计
- **精选卡组** — 突出展示推荐卡组，含胜率、梯队、造价信息
- **职业速览** — 11 个职业图标网格，显示各职业可用卡组数量
- **经典配合** — 展示热门卡牌配合组合
- **最新资讯** — 按分类标签展示新闻动态（补丁、赛事、攻略等）

### `/cards` 卡牌浏览
- **全卡牌数据库** — 涵盖所有可收集卡牌
- **多维度筛选** — 按职业（11 个职业图标按钮）、费用（0-7+ 宝石按钮）、稀有度（免费/普通/稀有/史诗/传说标签）、类型（随从/法术/武器/英雄/地标）筛选
- **双视图模式** — 图片网格 / 列表视图自由切换
- **实时搜索** — 支持中英文关键词搜索
- **悬停预览** — 卡牌悬停时显示攻防属性覆盖层
- **响应式网格** — 3-7 列自适应布局

### `/cards/[id]` 卡牌详情
- **大图展示** — 高清卡牌图片 + 职业稀有度渐变背景
- **完整属性** — 费用、攻击、生命/耐久、种族、法术派系、所属系列、画师
- **传说卡光效** — 传说品质卡牌专属闪光动画
- **卡牌故事** — 背景故事、风味文本、WoW 渊源关联（含 Wowhead 外链）
- **相关推荐** — 同机制/同类型卡牌推荐
- **面包屑导航** — 层级路径导航

### `/decks` 卡组列表
- **搜索** — 按卡组名称/原型关键词搜索
- **筛选** — 按职业、模式（标准/狂野）过滤
- **排序** — 支持胜率、场次、梯队、尘造价排序
- **筛选标签** — 激活的筛选条件显示为可点击移除的标签
- **卡组卡片** — 展示职业图标、胜率、场次、梯队徽章、模式标识

### `/decks/[id]` 卡组详情
- **卡组概览** — 职业主题色横幅 + 统计数据（胜率、排名、尘造价、难度）
- **完整卡牌列表** — 游戏内 Tile 长条图片展示，按费用分组
- **法力曲线** — 可视化法力值分布图表
- **一键复制** — 卡组代码复制到剪贴板
- **收藏功能** — 本地存储收藏的卡组
- **攻略指南** — 核心策略、关键决策点、起手留牌建议
- **对阵分析** — 各职业对阵数据与应对策略
- **替换建议** — 可选替换卡牌推荐
- **相关卡组** — 同职业/同原型卡组推荐

### `/decks/import` 卡组导入
- **粘贴代码** — 粘贴 Hearthstone 卡组代码（支持 deckstring 格式）
- **自动解析** — 解码后自动识别职业、卡牌列表、法力曲线
- **法力曲线图** — 可视化费用分布
- **尘造价计算** — 自动计算合成所需奥术之尘
- **分类展示** — 职业卡 / 中立卡分组显示，含数量徽章
- **不完整提示** — 非 30 张卡组显示警告

### `/classes/[id]` 职业详情
- **职业信息** — 职业图标、描述、玩法风格指导
- **统计数据** — 职业卡牌数、可用卡组数、最高胜率
- **推荐卡组** — 该职业的热门卡组列表，含职业主题色
- **职业卡牌** — 按费用展示该职业全部卡牌

### `/meta` 环境分析
- **整体统计** — 卡组总数、平均胜率、总对局数概览
- **梯队排行** — S/A/B/C 级别分组，含胜率进度条与职业配色
- **职业分布** — 各职业在天梯中的占比可视化
- **数据格式化** — 大数字自动缩写（如 1.2k）

### `/mechanics` 机制说明
- **机制词典** — 完整的炉石关键词与机制列表
- **详细说明** — 每个机制的工作原理与使用技巧
- **关联卡牌** — 展示使用该机制的相关卡牌及数量

### `/synergies` 卡牌配合
- **经典组合** — 149 个经典卡牌配合组合与详解
- **搜索过滤** — 按关键词搜索配合组合
- **难度评级** — 1-5 星执行难度评估
- **标签分类** — 按战术类型标签分组
- **关联卡牌** — 配合涉及的卡牌链接

### `/news` 资讯
- **分类展示** — 精选资讯 / 社区资讯分区
- **分类标签** — 补丁公告、赛事、扩展包、攻略等彩色分类徽章
- **来源标注** — 显示资讯来源与发布时间
- **外链跳转** — 原文链接与新窗口标识

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui
- **UI 组件**: Radix UI + Lucide Icons
- **数据抓取**: Playwright（HearthstoneTopDecks 爬虫）
- **CI/CD**: GitHub Actions（自动更新卡组/卡牌/资讯数据）
- **数据源**: HearthstoneJSON API + HearthstoneTopDecks + HSReplay
- **部署**: 支持静态生成 (SSG) + Vercel Analytics

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── page.tsx            # 首页
│   ├── cards/              # /cards 卡牌浏览 + /cards/[id] 卡牌详情
│   ├── decks/              # /decks 卡组列表 + /decks/[id] 卡组详情 + /decks/import 导入
│   ├── classes/            # /classes/[id] 职业详情页
│   ├── meta/               # /meta 环境分析
│   ├── mechanics/          # /mechanics 机制说明
│   ├── synergies/          # /synergies 卡牌配合
│   └── news/               # /news 资讯
├── components/
│   ├── cards/              # CardImage, CardItem, CardStory
│   ├── decks/              # DeckCard, DeckCodeCopy, FavoriteButton
│   ├── synergies/          # SynergiesContent
│   ├── layout/             # Header, Footer
│   ├── seo/                # JSON-LD 结构化数据组件
│   └── ui/                 # shadcn/ui 基础组件 (Badge, Button, Card, Tabs...)
├── data/
│   ├── generated/          # 自动生成的 JSON 数据
│   │   ├── cards-full.json # 全卡牌数据
│   │   ├── decks.json      # 卡组列表
│   │   ├── decks-merged.json # 合并后的卡组数据
│   │   ├── decks/          # 按日期的卡组快照
│   │   └── news.json       # 资讯数据
│   ├── real-cards.ts       # 卡牌数据接口 + CDN 图片 URL
│   ├── classes.ts          # 职业信息
│   ├── decks.ts            # 卡组数据
│   └── ...
├── lib/
│   ├── deck-code.ts        # 卡组代码编码/解码
│   ├── deckstring.ts       # Deckstring 协议实现
│   ├── seo.ts              # SEO 工具函数
│   └── utils.ts            # 通用工具函数
└── types/                  # TypeScript 类型定义

scripts/                    # 数据抓取脚本
├── fetch-cards.mjs         # 从 HearthstoneJSON 拉取卡牌数据
├── fetch-decks.mjs         # 多源卡组数据抓取
├── fetch-topdecks.mjs      # HearthstoneTopDecks Playwright 爬虫
├── fetch-topdecks-api.mjs  # TopDecks API 数据抓取
└── fetch-news.mjs          # 资讯聚合

.github/workflows/          # GitHub Actions 自动更新
├── update-data.yml         # 全量数据更新
├── update-decks.yml        # 卡组数据更新
└── update-news.yml         # 资讯数据更新
```

## 数据更新

项目通过 GitHub Actions 实现数据自动更新：

1. **抓取** — Playwright 爬虫从 HearthstoneTopDecks 获取梯队排名和卡组代码
2. **解码** — Deckstring 协议解码卡组代码，生成完整卡牌列表
3. **合并** — 多源数据（TopDecks + HSReplay）合并为统一 JSON
4. **提交** — CI 自动提交更新到仓库，触发重新构建

数据源：
- **HearthstoneJSON** — 卡牌基础数据与图片
- **HearthstoneTopDecks** — 梯队排名与卡组代码
- **HSReplay** — 胜率与对局统计

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 http://localhost:3000 查看效果。

### 构建

```bash
npm run build
```

### 手动更新数据

```bash
node scripts/fetch-decks.mjs     # 抓取卡组数据
node scripts/fetch-cards.mjs     # 抓取卡牌数据
node scripts/fetch-news.mjs      # 抓取资讯
```

## 卡牌图片 CDN

卡牌数据来自 [HearthstoneJSON](https://hearthstonejson.com/)：

- 卡牌图片: `https://art.hearthstonejson.com/v1/512x/{cardId}.jpg`
- 卡牌缩略图: `https://art.hearthstonejson.com/v1/256x/{cardId}.jpg`
- 卡牌 Tile 长条: `https://art.hearthstonejson.com/v1/tiles/{cardId}.jpg`

## License

MIT
