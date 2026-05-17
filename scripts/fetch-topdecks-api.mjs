/**
 * FetchTopDecksAPI — 从 hearthstonetopdecks.com 抓取卡组数据
 *
 * 数据获取策略：
 *   - WordPress REST API 无地域限制，但有代理兼容性问题
 *   - 使用 curl（通过 child_process）进行 HTTP 请求
 *   - curl 在本地 Clash 代理环境下可以正确直连或走代理
 *
 * 流程：
 *   1. WP API 获取最近的 Deck Roundup 周报文章
 *   2. 解析 HTML → 卡组元数据 + 卡牌列表
 *   3. 抓取每个卡组详情页 → 提取 deck code（AAE... base64）
 *   4. 解码 deck code → dbfId 列表，匹配卡牌名称
 *   5. 输出 topdecks-overlay.json（兼容现有 fetch-topdecks.mjs 格式）
 *
 * 输出模式（增量）：
 *   每次运行输出到 src/data/generated/decks/YYYY-MM-DD.json（日期快照）
 *   然后自动运行合并脚本，将所有快照合并为 decks-merged.json
 *   decks.ts 从 decks-merged.json 加载数据
 *
 * 用法：
 *   node scripts/fetch-topdecks-api.mjs              # 抓取 + 输出日期快照 + 合并
 *   node scripts/fetch-topdecks-api.mjs --pages 5     # 抓最近 5 篇周报
 *   node scripts/fetch-topdecks-api.mjs --no-codes    # 跳过详情页抓取
 *   node scripts/fetch-topdecks-api.mjs --merge-only  # 只合并，不抓取
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// ─── 配置 ──────────────────────────────────────────────────────

const BASE = 'https://www.hearthstonetopdecks.com';
const API_BASE = `${BASE}/wp-json/wp/v2`;
const DECK_ROUNDUP_CAT = 745;
const DEFAULT_PAGES = 3;
const REQUEST_DELAY = 400;
const TIMEOUT = 60;

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const GENERATED_DIR = resolve(PROJECT_ROOT, 'src/data/generated');
const DECKS_DIR = resolve(GENERATED_DIR, 'decks');
const MERGED_PATH = resolve(GENERATED_DIR, 'decks-merged.json');

// 解析命令行参数
const args = process.argv.slice(2);
const pagesIdx = args.indexOf('--pages');
const pagesCount = (pagesIdx >= 0 && args[pagesIdx + 1]) ? parseInt(args[pagesIdx + 1]) : DEFAULT_PAGES;
const skipCodes = args.includes('--no-codes');
const mergeOnly = args.includes('--merge-only');

// ─── 职业映射 ─────────────────────────────────────────────────

const HEADER_CLASS_MAP = {
  'death-knight': 'DEATHKNIGHT',
  'demon-hunter': 'DEMONHUNTER',
  druid: 'DRUID',
  hunter: 'HUNTER',
  mage: 'MAGE',
  paladin: 'PALADIN',
  priest: 'PRIEST',
  rogue: 'ROGUE',
  shaman: 'SHAMAN',
  warlock: 'WARLOCK',
  warrior: 'WARRIOR',
};

// ─── Archetype ID 映射（与 fetch-topdecks.mjs 保持一致）───────

const ARCHETYPE_ID_MAP = {
  // ── Demon Hunter ────────────────────────────────────────────
  'peddler demon hunter': 'deck-dh-peddler',
  'broxigar demon hunter': 'deck-dh-broxigar',
  'broxigar demon hunter legend': 'deck-dh-broxigar',
  'broxigar deathrattle demon hunter': 'deck-dh-broxigar-deathrattle',
  'deathrattle broxigar demon hunter': 'deck-dh-broxigar-deathrattle',
  'deathrattle broxigar demon hunter 1': 'deck-dh-broxigar-deathrattle',
  'broxigar questline demon hunter': 'deck-dh-broxigar-questline',
  'cycle broxigar demon hunter': 'deck-dh-broxigar-cycle',
  'aggro demon hunter': 'deck-dh-aggro',
  'crewmate aggro demon hunter': 'deck-dh-aggro-crewmate',
  'cliff dive demon hunter': 'deck-dh-cliff-dive',
  'no minion demon hunter': 'deck-dh-no-minion',
  'pirate demon hunter': 'deck-dh-pirate-aggro',
  'pirate aggro demon hunter': 'deck-dh-pirate-aggro',
  'octosari demon hunter': 'deck-dh-octosari',
  'mutalisk otk demon hunter': 'deck-dh-mutalisk-otk',

  // ── Death Knight ────────────────────────────────────────────
  'corpse death knight': 'deck-dk-corpse',
  'unholy corpse death knight': 'deck-dk-corpse',
  'unholy corpse death knight legend': 'deck-dk-corpse',
  'leech death knight': 'deck-dk-leech',
  'bloodunholy leech death knight': 'deck-dk-leech',
  'aggro death knight': 'deck-dk-frost-aggro',
  'stegodon death knight': 'deck-dk-stegodon',
  'deathrattle death knight': 'deck-dk-deathrattle',
  'bloodunholy deathrattle death knight legend': 'deck-dk-deathrattle',
  'blood death knight': 'deck-dk-blood-control',
  'blood control death knight': 'deck-dk-blood-control',
  'frost death knight': 'deck-dk-frost-aggro',
  'frost aggro death knight': 'deck-dk-frost-aggro',
  'unholy death knight': 'deck-dk-unholy-midrange',
  'unholyblood corpse death knight': 'deck-dk-corpse',
  'rainbow handbuff death knight': 'deck-dk-rainbow-handbuff',

  // ── Druid ───────────────────────────────────────────────────
  'owlonius druid': 'deck-druid-owlonius',
  'owlonius location druid': 'deck-druid-owlonius',
  'aviana druid': 'deck-druid-aviana',
  'ramp druid': 'deck-druid-ramp',
  'token druid': 'deck-druid-token-wild',
  'starship token druid': 'deck-druid-token-starship',
  'treant druid': 'deck-druid-treant',
  'pirate embiggen druid': 'deck-druid-pirate-embiggen',
  'xl malygos ysiel druid': 'deck-druid-xl-malygos-ysiel',
  'xl reno dragon druid': 'deck-druid-xl-reno-dragon',

  // ── Hunter ──────────────────────────────────────────────────
  'discover hunter': 'deck-hunter-discover',
  'briarspawn discover hunter': 'deck-hunter-discover-briarspawn',
  'sandwich discover hunter': 'deck-hunter-discover-sandwich',
  'tick tock discover hunter': 'deck-hunter-discover-tick-tock',
  'face hunter': 'deck-hunter-face',
  'midrange hunter': 'deck-hunter-midrange',
  'sandwich hunter': 'deck-hunter-sandwich',
  'sandwich big hunter': 'deck-hunter-sandwich-big',
  'xl reno hunter': 'deck-hunter-xl-reno',
  'xl leoroxx reno hunter': 'deck-hunter-xl-leoroxx-reno',

  // ── Mage ────────────────────────────────────────────────────
  'protoss mage': 'deck-mage-protoss',
  'elemental mage': 'deck-mage-elemental',
  'quest mage': 'deck-mage-quest',
  'spell quest mage': 'deck-mage-spell-quest',
  'xl quest mage': 'deck-mage-xl-quest',
  'arkwing mage': 'deck-mage-arkwing',
  'arkwing mage legend': 'deck-mage-arkwing',
  'arkwing quest mage': 'deck-mage-arkwing-quest',
  'toki mage': 'deck-mage-toki',
  'arcane mage': 'deck-mage-arcane',
  'imbue mage': 'deck-mage-imbue',
  'xl reno big spell mage': 'deck-mage-xl-reno-big-spell',

  // ── Paladin ─────────────────────────────────────────────────
  'aura paladin': 'deck-paladin-aura',
  'infinity aura paladin': 'deck-paladin-aura-infinity',
  'aggro paladin': 'deck-paladin-aggro',
  'handbuff paladin': 'deck-paladin-handbuff',
  'libram paladin': 'deck-paladin-libram',
  'libram paladin legend': 'deck-paladin-libram',
  'libram aura paladin': 'deck-paladin-libram-aura',
  'imbue dragon paladin': 'deck-paladin-imbue-dragon',
  'umbra paladin': 'deck-paladin-umbra',
  'mech paladin': 'deck-paladin-mech',
  'egg aggro paladin': 'deck-paladin-egg-aggro',

  // ── Priest ──────────────────────────────────────────────────
  'protoss priest': 'deck-priest-protoss',
  'zarimi priest': 'deck-priest-zarimi',
  'control priest': 'deck-priest-control',
  'medivh control priest top 300 legend': 'deck-priest-control',
  'burn priest': 'deck-priest-burn',
  'bandage otk priest': 'deck-priest-bandage-otk',
  'xl questline reno priest': 'deck-priest-xl-questline-reno',
  'xl reno shadow priest': 'deck-priest-xl-reno-shadow',
  'xl burn shadow priest': 'deck-priest-xl-burn-shadow',

  // ── Rogue ───────────────────────────────────────────────────
  'imbue rogue': 'deck-rogue-imbue',
  'imbue rogue top 50 legend': 'deck-rogue-imbue',
  'ashamane rogue': 'deck-rogue-ashamane',
  'protoss rogue': 'deck-rogue-protoss',
  'cycle rogue': 'deck-rogue-cycle',
  'quasar rogue': 'deck-rogue-quasar',
  'miracle rogue': 'deck-rogue-miracle',
  'tess rogue': 'deck-rogue-tess',
  'combo rogue': 'deck-rogue-combo',

  // ── Shaman ──────────────────────────────────────────────────
  'midrange shaman': 'deck-shaman-midrange',
  'aggro totem shaman': 'deck-shaman-aggro-totem',
  'spell damage overload shaman': 'deck-shaman-spell-damage',
  'xl reno shudderwock shaman': 'deck-shaman-xl-reno-shudderwock',

  // ── Warlock ─────────────────────────────────────────────────
  'egg warlock': 'deck-warlock-egg',
  'rafaam warlock': 'deck-warlock-rafaam',
  'zoo warlock': 'deck-warlock-zoo',
  'zoo demon warlock': 'deck-warlock-zoo',
  'demon warlock': 'deck-warlock-demon',
  'wallow demon warlock': 'deck-warlock-wallow-demon',
  'burn warlock': 'deck-warlock-burn',
  'pirate burn warlock': 'deck-warlock-burn-pirate',
  'sludge burn warlock': 'deck-warlock-burn-sludge',
  'xl quest reno warlock': 'deck-warlock-xl-quest-reno',
  'xl questline warlock': 'deck-warlock-xl-questline',

  // ── Warrior ─────────────────────────────────────────────────
  'dragon warrior': 'deck-warrior-dragon',
  'quest control warrior': 'deck-warrior-quest-control',
  'quest warrior': 'deck-warrior-quest',
  'control warrior': 'deck-warrior-control',
  'xl control warrior': 'deck-warrior-xl-control',
  'xl reno warrior': 'deck-warrior-xl-reno',
  'odyn otk warrior': 'deck-warrior-odyn-otk',
};

// ─── 工具函数 ─────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function decodeHTML(str) {
  return (str || '')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function normalize(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/** 安全的 curl 调用 */
function curl(url, accept = 'application/json') {
  try {
    return execFileSync('curl', [
      '-sL',                       // 静默 + 跟随重定向
      '--max-time', String(TIMEOUT),
      '-H', `User-Agent: Mozilla/5.0 (compatible; TopHSDeck/1.0)`,
      '-H', `Accept: ${accept}`,
      url,
    ], { encoding: 'utf-8', timeout: (TIMEOUT + 5) * 1000, maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    return '';
  }
}

/** 从 class-header CSS class 提取职业 */
function extractClass(cssClass) {
  if (!cssClass) return null;
  for (const [key, value] of Object.entries(HEADER_CLASS_MAP)) {
    if (cssClass.includes(`${key}-header`)) return value;
  }
  return null;
}

/** 从标题中提取排名 */
function extractRank(title) {
  const m = title.match(/#?(\d+)\s*(Legend|Early)/i);
  return m ? parseInt(m[1]) : null;
}

/** 从标题中提取玩家名 */
function extractPlayer(title) {
  const m = title.match(/\(([^)]+)\)/);
  return m ? m[1] : null;
}

/** 判断是否为狂野卡组 */
function isWildDeck(title, meta) {
  return /wild/i.test(title) || /wild/i.test(meta || '');
}

/** 去除标题中的排名、玩家名等后缀，得到卡组名 */
function extractDeckName(title) {
  let name = title
    // 去除 "Stonekeep's " 等作者前缀
    .replace(/^Stonekeep'?s?\s*/i, '')
    // 去除排名后缀: "#1 Legend (Player)" 或 "Early #1 Legend (Player)"
    .replace(/\s*[–-]\s*(?:Early\s+)?#?\d+\s*(?:Legend|Early).*$/i, '')
    // 去除 "Across the Timeways" 等赛季名
    .replace(/\s*[–-]\s*Across.*$/i, '')
    // 去除括号内的扩展名
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/['']/g, "'")
    .trim();
  return decodeHTML(name);
}

// ─── Deck Code 解码器 ─────────────────────────────────────────

function decodeDeckstring(code) {
  const buf = Buffer.from(code, 'base64');
  let p = 0;
  function readVarint() {
    let result = 0n, shift = 0n, byte;
    do { byte = BigInt(buf[p++]); result |= (byte & 0x7fn) << shift; shift += 7n; } while (byte & 0x80n);
    return Number(result);
  }

  readVarint(); // header (0)
  readVarint(); // version (1)
  const format = readVarint();
  const numHeroes = readVarint();
  for (let i = 0; i < numHeroes; i++) readVarint();

  const cards = [];

  const n1 = readVarint();
  for (let i = 0; i < n1; i++) cards.push({ dbfId: readVarint(), quantity: 1 });

  const n2 = readVarint();
  for (let i = 0; i < n2; i++) cards.push({ dbfId: readVarint(), quantity: 2 });

  const n3 = readVarint();
  for (let i = 0; i < n3; i++) cards.push({ dbfId: readVarint(), quantity: readVarint() });

  return { format, cards };
}

// ─── Step 1: 获取 Deck Roundup 文章列表 ────────────────────────

async function fetchRoundupPosts(pages) {
  console.log(`\n📖 Step 1: Fetching ${pages} latest Deck Roundup posts...`);
  const raw = curl(`${API_BASE}/posts?categories=${DECK_ROUNDUP_CAT}&per_page=${pages}&_fields=id,date,title,link,content`);
  if (!raw) throw new Error('Failed to fetch posts from WP API');

  const posts = JSON.parse(raw);
  console.log(`  Got ${posts.length} posts`);
  for (const p of posts) {
    console.log(`  • ${new Date(p.date).toLocaleDateString()} — ${decodeHTML(p.title.rendered)}`);
  }
  return posts;
}

// ─── Step 2: 解析 HTML → 卡组列表 ──────────────────────────────

function parseDeckBoxes(html) {
  const decks = [];
  const boxes = html.split(/<div class="deck-box">/).slice(1);

  for (const box of boxes) {
    try {
      // 提取标题和链接
      const headerMatch = box.match(
        /<a\s+href="([^"]*\/decks\/[^"]+)"[^>]*class="class-header\s+([a-z- ]+)"[^>]*>\s*(?:<[^>]*>)?\s*([^<]+?)\s*(?:<\/[^>]*>)?\s*<\/a>/i
      ) || box.match(
        /<a\s+href="([^"]*\/decks\/[^"]+)"[^>]*class="class-header\s+([a-z- ]+)"[^>]*><h[23]>([^<]+)<\/h[23]>/i
      );
      if (!headerMatch) continue;

      const url = headerMatch[1];
      const cssClass = headerMatch[2];
      const rawTitle = decodeHTML(headerMatch[3]);

      const cardClass = extractClass(cssClass);
      if (!cardClass) continue;

      // 提取 Meta 信息
      const formatMatch = box.match(/<strong>Format:<\/strong>\s*(?:<[^>]*>)?([^<]+)/i);
      const seasonMatch = box.match(/<strong>Season:<\/strong>\s*(?:<[^>]*>)?([^<]+)/i);
      const playerMatch = box.match(/<strong>Player:<\/strong>\s*(?:<[^>]*>)*([^<]+)/i);
      const dustMatch = box.match(/deck-box-dust[^>]*>\s*(?:<[^>]*>)*\s*<strong>([\d,]+)/i);

      // 提取卡牌列表
      const cardRegex = /<span class="card-cost">(\d+)<\/span><a[^>]*><span class="card-name">([^<]+)<\/span><\/a><span class="card-count">(\d+)<\/span>/g;
      const cards = [];
      let cardMatch;
      while ((cardMatch = cardRegex.exec(box)) !== null) {
        cards.push({
          cost: parseInt(cardMatch[1]),
          name: decodeHTML(cardMatch[2]),
          quantity: parseInt(cardMatch[3]),
        });
      }

      const slug = url.split('/decks/')[1]?.replace(/\/$/, '') || '';

      decks.push({
        url,
        slug,
        title: rawTitle,
        deckName: extractDeckName(rawTitle),
        cardClass,
        rank: extractRank(rawTitle),
        player: playerMatch ? decodeHTML(playerMatch[1].trim()) : extractPlayer(rawTitle),
        format: formatMatch ? decodeHTML(formatMatch[1].trim()) : (isWildDeck(rawTitle) ? 'wild' : 'standard'),
        season: seasonMatch ? decodeHTML(seasonMatch[1].trim()) : null,
        dustCost: dustMatch ? parseInt(dustMatch[1].replace(/,/g, '')) : null,
        cards,
        cardCount: cards.reduce((s, c) => s + c.quantity, 0),
      });
    } catch {
      // 跳过解析失败的 deck-box
    }
  }

  return decks;
}

// ─── Step 3: 抓取详情页 → Deck Code ───────────────────────────

function fetchDeckCode(slug) {
  const url = `${BASE}/decks/${slug}/`;
  const html = curl(url, 'text/html');
  if (!html) return null;

  const match = html.match(/data-deck-code="([A-Za-z0-9+/=]+)"/);
  return match ? match[1] : null;
}

// ─── Step 4: 解码 Deck Code → 卡牌列表 ─────────────────────────

function decodeDeckCards(deckCode, dbfMap) {
  try {
    const decoded = decodeDeckstring(deckCode);
    return decoded.cards.map(c => ({
      dbfId: c.dbfId,
      name: dbfMap[c.dbfId]?.name || `Unknown(${c.dbfId})`,
      cardId: dbfMap[c.dbfId]?.id || '',
      quantity: c.quantity,
    }));
  } catch {
    return [];
  }
}

// ─── Step 5: 构建当次抓取快照 ─────────────────────────────────

function buildSnapshot(allDecks, fetchDate) {
  const archetypes = {};
  let matched = 0;
  let deckCodeCount = 0;

  // 按卡组名归一化，保留排名最高的版本
  const bestDecks = {};
  for (const deck of allDecks) {
    const norm = normalize(deck.deckName);
    const existing = bestDecks[norm];
    if (!existing || (deck.rank && (!existing.rank || deck.rank < existing.rank))) {
      bestDecks[norm] = deck;
    }
  }

  for (const [normName, deck] of Object.entries(bestDecks)) {
    const id = ARCHETYPE_ID_MAP[normName];
    if (!id) continue;

    const archData = {
      archetypeName: deck.deckName,
      cardClass: deck.cardClass,
      tier: deck.rank ? (deck.rank <= 3 ? 1 : deck.rank <= 10 ? 2 : 3) : 3,
      tierName: deck.rank ? (deck.rank <= 3 ? 'Best Decks' : deck.rank <= 10 ? 'Great Decks' : 'Off-Meta Decks') : 'Featured',
      sourceUrl: deck.url,
      player: deck.player,
      rank: deck.rank,
      dustCost: deck.dustCost,
      cards: deck.decodedCards || deck.cards.map(c => ({ name: c.name, quantity: c.quantity, cost: c.cost })),
      cardCount: deck.cardCount,
    };

    if (deck.deckCode) {
      archData.deckCode = deck.deckCode;
      deckCodeCount++;
    }

    archetypes[id] = archData;
    matched++;
  }

  return {
    fetchDate,
    fetchTimestamp: new Date().toISOString(),
    source: 'hearthstonetopdecks-api',
    totalDecksParsed: allDecks.length,
    uniqueArchetypes: matched,
    deckCodeCount,
    archetypes,
  };
}

// ─── 合并：读取所有日期快照 → 输出 decks-merged.json ───────────

function mergeSnapshots() {
  mkdirSync(DECKS_DIR, { recursive: true });

  // 扫描所有日期文件
  let files;
  try {
    files = [...new Set([  // 去重
      ...readdirSync(DECKS_DIR).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)),
    ])];
  } catch {
    files = [];
  }

  if (!files.length) {
    console.log('  ⚠️  No snapshot files found in decks/');
    return;
  }

  // 按日期排序（新→旧）
  files.sort().reverse();
  console.log(`  Found ${files.length} snapshot(s): ${files.join(', ')}`);

  // 合并策略：每个 archetype 保留最新有 deckCode 的版本，
  // 如果最新版没有 deckCode 但旧版有，则保留旧版的 deckCode
  const merged = {};
  const meta = { dates: [], totalArchetypes: 0, totalDeckCodes: 0 };

  for (const file of files) {
    const date = file.replace('.json', '');
    meta.dates.push(date);

    let snapshot;
    try {
      snapshot = JSON.parse(readFileSync(resolve(DECKS_DIR, file), 'utf-8'));
    } catch {
      continue;
    }

    for (const [id, data] of Object.entries(snapshot.archetypes || {})) {
      if (!merged[id]) {
        // 首次出现：直接用
        merged[id] = { ...data, firstSeen: date, lastSeen: date };
      } else {
        // 已存在：合并
        const existing = merged[id];
        existing.lastSeen = date;

        // 如果新版有 deckCode，更新整个数据
        if (data.deckCode && data.cards?.length) {
          Object.assign(existing, data);
        }
        // 如果新版没 deckCode 但旧版也没有，更新元数据
        else if (!existing.deckCode && data.deckCode) {
          existing.deckCode = data.deckCode;
          existing.cards = data.cards;
          existing.cardCount = data.cardCount;
        }

        // 始终更新排名信息（取更好的）
        if (data.rank && (!existing.rank || data.rank < existing.rank)) {
          existing.rank = data.rank;
          existing.player = data.player;
          existing.sourceUrl = data.sourceUrl;
          existing.tier = data.tier;
          existing.tierName = data.tierName;
        }
      }
    }
  }

  // 标记最近一次看到的日期
  const latestDate = meta.dates[0];

  const result = {
    lastMerge: new Date().toISOString(),
    latestSnapshot: latestDate,
    snapshotCount: files.length,
    totalArchetypes: Object.keys(merged).length,
    totalDeckCodes: Object.values(merged).filter(d => d.deckCode).length,
    archetypes: merged,
  };

  writeFileSync(MERGED_PATH, JSON.stringify(result, null, 2));
  console.log(`  ✅ Merged ${Object.keys(merged).length} archetypes → decks-merged.json`);
  console.log(`     ${Object.values(merged).filter(d => d.deckCode).length} with deck codes`);
}

// ─── 主流程 ────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   FetchTopDecks API — curl-based Scraper ║');
  console.log('╚══════════════════════════════════════════╝');

  const today = new Date().toISOString().split('T')[0];
  const snapshotPath = resolve(DECKS_DIR, `${today}.json`);

  // --merge-only 模式：只合并已有快照
  if (mergeOnly) {
    console.log('\n📦 Merge-only mode (skipping fetch)');
    mergeSnapshots();
    return;
  }

  console.log(`\nConfig: pages=${pagesCount}, skipCodes=${skipCodes}`);
  console.log(`Snapshot: ${snapshotPath}`);

  // 加载卡牌数据
  const cardsPath = resolve(PROJECT_ROOT, 'src/data/generated/cards-full.json');
  let dbfMap = {};
  if (existsSync(cardsPath)) {
    const cardsJson = JSON.parse(readFileSync(cardsPath, 'utf-8'));
    for (const c of cardsJson) {
      if (c.dbfId) dbfMap[String(c.dbfId)] = c;
    }
    console.log(`\n🃏 Loaded ${Object.keys(dbfMap).length} cards from cards-full.json`);
  } else {
    console.log('\n⚠️  cards-full.json not found — deck code decoding will be limited');
  }

  // Step 1: 获取文章列表
  const posts = await fetchRoundupPosts(pagesCount);
  if (!posts.length) {
    console.log('❌ No posts found. Exiting.');
    process.exit(1);
  }

  // Step 2: 解析每篇文章中的卡组
  console.log('\n📦 Step 2: Parsing deck boxes from HTML...');
  const allDecks = [];
  for (const post of posts) {
    const decks = parseDeckBoxes(post.content.rendered);
    console.log(`  ${decks.length} decks from "${decodeHTML(post.title.rendered).slice(0, 60)}"`);
    allDecks.push(...decks);
  }
  console.log(`  Total: ${allDecks.length} decks parsed`);

  if (!allDecks.length) {
    console.log('❌ No decks found. HTML structure may have changed.');
    process.exit(1);
  }

  // Step 3: 抓取 Deck Codes
  if (!skipCodes) {
    console.log('\n🔑 Step 3: Fetching deck codes from detail pages...');
    let fetched = 0;
    let found = 0;

    const standardDecks = allDecks
      .filter(d => !isWildDeck(d.title, d.format) && d.slug && !d.deckCode)
      .slice(0, 50);

    for (const deck of standardDecks) {
      const code = fetchDeckCode(deck.slug);
      fetched++;
      if (code) {
        deck.deckCode = code;
        found++;
        if (Object.keys(dbfMap).length > 0) {
          deck.decodedCards = decodeDeckCards(code, dbfMap);
        }
        console.log(`  ✓ ${deck.deckName}: ${code.slice(0, 30)}...`);
      }
      if (fetched % 10 === 0) console.log(`  Progress: ${fetched}/${standardDecks.length} (${found} codes found)`);
      await sleep(REQUEST_DELAY);
    }
    console.log(`  ${found}/${fetched} deck codes fetched`);
  }

  // Step 5: 构建快照 + 保存日期文件
  console.log('\n🔧 Step 5: Building snapshot...');
  const snapshot = buildSnapshot(allDecks, today);

  mkdirSync(DECKS_DIR, { recursive: true });
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
  console.log(`\n✅ Snapshot saved: ${snapshotPath}`);
  console.log(`   ${snapshot.uniqueArchetypes} archetypes, ${snapshot.deckCodeCount} with deck codes`);

  // 打印职业统计
  const classStats = {};
  for (const arch of Object.values(snapshot.archetypes)) {
    classStats[arch.cardClass] = (classStats[arch.cardClass] || 0) + 1;
  }
  console.log('\n   Class distribution:');
  for (const [cls, count] of Object.entries(classStats).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cls.padEnd(16)} ${count} decks`);
  }

  // 打印未匹配的卡组
  const unmatched = new Set();
  for (const deck of allDecks) {
    const norm = normalize(deck.deckName);
    if (!ARCHETYPE_ID_MAP[norm] && !unmatched.has(norm)) {
      unmatched.add(norm);
    }
  }
  if (unmatched.size > 0) {
    console.log(`\n   ⚠️  ${unmatched.size} unmatched archetypes (not in ARCHETYPE_ID_MAP):`);
    for (const name of [...unmatched].slice(0, 15)) {
      console.log(`     "${name}"`);
    }
  }

  // Step 6: 合并所有快照
  console.log('\n📦 Step 6: Merging snapshots...');
  mergeSnapshots();

  // 兼容：也写入 topdecks-overlay.json（供旧流程使用）
  const legacyOverlay = {
    lastFetch: snapshot.fetchTimestamp,
    source: snapshot.source,
    fetchSuccess: snapshot.uniqueArchetypes > 0,
    totalDecksParsed: snapshot.totalDecksParsed,
    uniqueArchetypes: snapshot.uniqueArchetypes,
    deckCodeCount: snapshot.deckCodeCount,
    archetypes: snapshot.archetypes,
  };
  writeFileSync(resolve(GENERATED_DIR, 'topdecks-overlay.json'), JSON.stringify(legacyOverlay, null, 2));
}

main().catch(e => {
  console.error('❌ Fatal error:', e.message);
  process.exit(1);
});
