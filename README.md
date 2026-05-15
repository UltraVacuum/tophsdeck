# TopHSDeck - 炉石传说卡组推荐平台

一个基于 Next.js 构建的炉石传说（Hearthstone）卡组推荐与卡牌浏览平台，提供卡组搭配、环境分析、卡牌浏览等功能。

## 功能特性

### 🃏 卡牌浏览
- **全卡牌数据库** — 涵盖所有可收集卡牌，支持中英文搜索
- **多维度筛选** — 按职业、费用、品质、类型快速筛选
- **沉浸式卡牌详情** — 大图展示 + 稀有度光效 + 传说卡闪光动画
- **双视图模式** — 图片网格 / 列表视图自由切换

### ⚔️ 卡组推荐
- 精选热门卡组，含胜率、对战场次等数据
- 法力曲线可视化
- 一键复制卡组代码
- 梯队（Tier）评级展示

### 📊 环境分析
- 当前环境概览与趋势
- 职业对阵数据
- 热门卡组排行

### 🔗 配合与机制
- 卡牌配合关系展示
- 核心机制说明与关联卡牌

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui
- **UI 组件**: Radix UI + Lucide Icons
- **数据**: HearthstoneJSON API（卡牌图片与数据）
- **部署**: 支持静态生成 (SSG)

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── cards/              # 卡牌浏览 + 详情页
│   ├── decks/              # 卡组列表 + 详情页
│   ├── classes/            # 职业详情页
│   ├── meta/               # 环境分析
│   ├── mechanics/          # 机制说明
│   ├── synergies/          # 卡牌配合
│   └── news/               # 资讯
├── components/
│   ├── cards/              # CardImage（带加载/错误状态）
│   ├── decks/              # DeckCard, DeckCodeCopy
│   ├── layout/             # Header, Footer
│   └── ui/                 # shadcn/ui 基础组件
├── data/
│   ├── generated/          # cards-full.json（全卡牌数据）
│   ├── real-cards.ts       # 卡牌数据接口 + CDN 图片 URL
│   ├── classes.ts          # 职业信息
│   ├── decks.ts            # 卡组数据
│   └── ...
├── types/                  # TypeScript 类型定义
└── lib/                    # 工具函数
```

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

### 生产模式

```bash
npm start
```

## 卡牌数据

卡牌数据来自 [HearthstoneJSON](https://hearthstonejson.com/)，图片通过 CDN 加载：

- 256px: `https://art.hearthstonejson.com/v1/256x/{cardId}.jpg`
- 512px: `https://art.hearthstonejson.com/v1/512x/{cardId}.jpg`

## License

MIT
