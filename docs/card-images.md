# HearthstoneJSON 卡牌图片 API

> 来源: https://hearthstonejson.com/docs/images.html

## 可用资源

### 1. Card Art (卡牌原画)

仅卡牌插画部分，正方形，无卡框/文字/费用。

| 路径 | 格式 | 分辨率 | 说明 |
|------|------|--------|------|
| `v1/orig/{CARD_ID}.png` | PNG | 不固定，通常 512x512 | 原始无损图，不推荐日常使用 |
| `v1/256x/{CARD_ID}.jpg` | JPG | 256x256 | 小尺寸原画，适合缩略图、列表 |
| `v1/256x/{CARD_ID}.webp` | WebP | 256x256 | 同上，WebP 格式体积更小 |
| `v1/512x/{CARD_ID}.jpg` | JPG | 512x512 | 大尺寸原画，适合详情页、大卡片 |
| `v1/512x/{CARD_ID}.webp` | WebP | 512x512 | 同上，WebP 格式 |

### 2. Card Tiles (卡牌条)

游戏中放入套牌时的长条缩略图，256x59px。

| 路径 | 格式 | 分辨率 |
|------|------|--------|
| `v1/tiles/{CARD_ID}.png` | PNG | 256x59 |
| `v1/tiles/{CARD_ID}.jpg` | JPG | 256x59 |
| `v1/tiles/{CARD_ID}.webp` | WebP | 256x59 |

### 3. Card Renders (完整卡牌渲染)

包含卡框、文字、费用、攻击力/生命值的完整卡牌图。
宽度固定，高度为宽度的 1.5 倍（如 256x384、512x768）。
支持所有 HS 语言。

```
v1/render/latest/{LOCALE}/{RESOLUTION}/{CARD_ID}.{EXT}
```

- `LOCALE`: `zhCN` (简体中文), `enUS`, `jaJP`, 等
- `RESOLUTION`: `256x` 或 `512x`
- `EXT`: 目前仅 `png`

示例:
- `https://art.hearthstonejson.com/v1/render/latest/zhCN/512x/EX1_001.png`
- `https://art.hearthstonejson.com/v1/render/latest/zhCN/256x/EX1_001.png`

## 本项目尺寸选择

根据不同 UI 场景选择最优尺寸：

| UI 场景 | 资源类型 | 分辨率 | 理由 |
|---------|----------|--------|------|
| 卡牌浏览网格 (cards page grid) | Card Art | 256x | 网格卡片小，256px 足够，加载快 |
| 卡牌浏览列表 (cards page list) | Card Art | 256x | 列表缩略图更小，256px 绰绰有余 |
| 卡牌详情页主图 (card detail) | Card Render (zhCN) | 512x | 详情页需要完整卡牌（含文字/属性），512px 宽度清晰 |
| 卡牌详情页背景 | Card Art | 512x | 背景模糊装饰，512px 提供更好的模糊效果 |
| 相关卡牌推荐 (related cards) | Card Art | 256x | 小卡片展示，256px 足够 |
| 套牌内卡牌列表 (deck cards) | Card Tile | 256x59 | 套牌列表中的长条缩略图，最贴合游戏内体验 |
| 套牌卡牌详情图 (deck detail) | Card Art | 256x | 套牌详情页中的单卡展示 |
| SEO og:image | Card Art | 512x | 社交分享需要高清图 |

## CDN Base URL

```
https://art.hearthstonejson.com/v1/
```

## 注意事项

- 高流量网站应自行托管图片，不要直连 CDN
- 商业用途需联系 contact@hearthsim.net
- Card Render 的高度可能在未来版本变化（目前 1.5x 宽度）
- `orig/` 图片尺寸不固定，不建议使用
- 优先使用 WebP 格式减小体积（浏览器支持良好）
