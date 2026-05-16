/**
 * FetchTopDecks — Scrape hearthstonetopdecks.com for meta tier list & deck codes
 *
 * Uses Playwright (same as fetch-decks.mjs) to bypass WAF/bot detection.
 *   1. Fetch homepage → parse tier list (archetype names, class icons, tier levels)
 *   2. Fetch featured deck links → extract deck URLs with rank/player info
 *   3. For each featured deck, fetch page → extract deck code from data-deck-code
 *   4. Output topdecks-overlay.json for merge in decks.ts
 *
 * Outputs: src/data/generated/topdecks-overlay.json
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const BASE = 'https://www.hearthstonetopdecks.com';
const OUT = 'src/data/generated/topdecks-overlay.json';

const ICON_CLASS_MAP = {
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

const TIER_MAP = { 'Best Decks': 1, 'Great Decks': 2, 'Off-Meta Decks': 3 };

const ARCHETYPE_ID_MAP = {
  'broxigar demon hunter': 'deck-dh-broxigar',
  'deathrattle broxigar demon hunter': 'deck-dh-broxigar',
  'cycle broxigar demon hunter': 'deck-dh-broxigar-cycle',
  'cliff dive demon hunter': 'deck-dh-cliff-dive',
  'aggro demon hunter': 'deck-dh-aggro',
  'no minion demon hunter': 'deck-dh-no-minion',
  'octosari demon hunter': 'deck-dh-octosari',
  'peddler demon hunter': 'deck-dh-peddler',
  'pirate aggro demon hunter': 'deck-dh-pirate-aggro',

  'corpse death knight': 'deck-dk-corpse',
  'unholy corpse death knight': 'deck-dk-corpse',
  'unholy/blood corpse death knight': 'deck-dk-corpse',
  'leech death knight': 'deck-dk-leech',
  'aggro corpse death knight': 'deck-dk-aggro-corpse',
  'stegodon death knight': 'deck-dk-stegodon',
  'deathrattle death knight': 'deck-dk-deathrattle',
  'aggro death knight': 'deck-dk-frost-aggro',
  'blood death knight': 'deck-dk-blood-control',
  'blood control death knight': 'deck-dk-blood-control',
  'frost death knight': 'deck-dk-frost-aggro',
  'frost aggro death knight': 'deck-dk-frost-aggro',
  'unholy death knight': 'deck-dk-unholy-midrange',

  'owlonius location druid': 'deck-druid-owlonius',
  'owlonius druid': 'deck-druid-owlonius',
  'aviana druid': 'deck-druid-aviana',
  'ramp druid': 'deck-druid-ramp',
  'token druid': 'deck-druid-token-wild',
  'treant druid': 'deck-druid-treant',

  'discover hunter': 'deck-hunter-discover',
  'face hunter': 'deck-hunter-face',
  'midrange hunter': 'deck-hunter-midrange',
  'sandwich hunter': 'deck-hunter-sandwich',
  'sandwich big hunter': 'deck-hunter-sandwich',

  'protoss mage': 'deck-mage-protoss',
  'elemental mage': 'deck-mage-elemental',
  'quest mage': 'deck-mage-quest',
  'quest spell mage': 'deck-mage-quest',
  'arkwing quest mage': 'deck-mage-arkwing-quest',
  'arkwing mage': 'deck-mage-arkwing',
  'toki mage': 'deck-mage-toki',
  'arcane mage': 'deck-mage-arcane',
  'imbue mage': 'deck-mage-imbue',

  'aura paladin': 'deck-paladin-aura',
  'aggro paladin': 'deck-paladin-aggro',
  'handbuff paladin': 'deck-paladin-handbuff',
  'libram paladin': 'deck-paladin-libram',
  'imbue dragon paladin': 'deck-paladin-imbue-dragon',

  'protoss priest': 'deck-priest-protoss',
  'zarimi priest': 'deck-priest-zarimi',
  'aviana control priest': 'deck-priest-control',
  'control priest': 'deck-priest-control',
  'medivh control priest': 'deck-priest-control',
  'burn priest': 'deck-priest-burn',
  'xl burn shadow priest': 'deck-priest-burn',

  'imbue rogue': 'deck-rogue-imbue',
  'ashamane rogue': 'deck-rogue-ashamane',
  'protoss rogue': 'deck-rogue-protoss',
  'cycle rogue': 'deck-rogue-cycle',
  'quasar rogue': 'deck-rogue-quasar',
  'miracle rogue': 'deck-rogue-miracle',

  'midrange shaman': 'deck-shaman-midrange',
  'aggro totem shaman': 'deck-shaman-aggro-totem',
  'spell damage overload shaman': 'deck-shaman-spell-damage',

  'egg warlock': 'deck-warlock-egg',
  'rafaam warlock': 'deck-warlock-rafaam',
  'zoo demon warlock': 'deck-warlock-zoo',
  'demon warlock': 'deck-warlock-demon',
  'questline warlock': 'deck-warlock-questline',

  'dragon warrior': 'deck-warrior-dragon',
  'quest control warrior': 'deck-warrior-quest-control',
  'quest warrior': 'deck-warrior-quest',
  'control warrior': 'deck-warrior-control',
};

function normalize(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9\s/]/g, '').replace(/\s+/g, ' ').trim();
}

function classFromIcon(alt) {
  const key = (alt || '').replace(/\s*icon/i, '').replace(/-/g, ' ').trim().toLowerCase();
  for (const [k, v] of Object.entries(ICON_CLASS_MAP)) {
    if (key.includes(k.replace(/-/g, ' ')) || key.includes(k)) return v;
  }
  return null;
}

// ─── Parse tier list from homepage HTML ─────────────────────────

function parseTierList(html) {
  const archetypes = [];
  const sections = html.split(/<h4>/);

  for (const section of sections) {
    let tierName = null;
    let tierLevel = 0;
    const trimmed = section.trimStart();
    for (const [name, level] of Object.entries(TIER_MAP)) {
      if (trimmed.startsWith(name)) {
        tierName = name;
        tierLevel = level;
        break;
      }
    }
    if (!tierName) continue;

    const itemRe = /alt="([^"]*?\sIcon)"[^>]*>\s*([^<]+)<\/a>/g;
    let m;
    while ((m = itemRe.exec(section)) !== null) {
      const cardClass = classFromIcon(m[1]);
      const name = m[2].trim().replace(/&#8211;/g, '-').replace(/&amp;/g, '&');
      if (cardClass && name) {
        archetypes.push({ name, cardClass, tier: tierLevel, tierName });
      }
    }
  }
  return archetypes;
}

// ─── Parse featured decks from homepage HTML ────────────────────

function parseFeaturedDecks(html) {
  const decks = [];
  const re = /class="standard-featured">[\s\S]*?<a\s+href="([^"]*)"[^>]*>[\s\S]*?alt="([^"]*?\sIcon)"[^>]*>\s*([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1];
    const iconAlt = m[2];
    const title = m[3].trim()
      .replace(/&#8211;/g, '-')
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');

    const cardClass = classFromIcon(iconAlt);
    const rankMatch = title.match(/#?(\d+)\s*(Legend|Early)/i);
    const rank = rankMatch ? parseInt(rankMatch[1]) : null;
    const playerMatch = title.match(/\(([^)]+)\)/);
    const player = playerMatch ? playerMatch[1] : null;
    const isWild = title.includes('Wild S');
    const format = isWild ? 'wild' : 'standard';
    const nameParts = title.split(/\s*[-–]\s*/);
    const deckName = nameParts[0].trim();

    decks.push({ url, title, deckName, cardClass, rank, player, format });
  }
  return decks;
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('=== FetchTopDecks ===\n');

  let browser = null;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });
    console.log('Playwright: launched Chromium\n');
  } catch {
    console.log('Playwright not available — cannot fetch from hearthstonetopdecks.');
    console.log('Install: npx playwright install --with-deps chromium\n');
    process.exit(0);
  }

  // Step 1 & 2: Fetch homepage and parse tier list + featured decks
  console.log('Fetching homepage...');
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const homepageHtml = await page.content();

  const tierList = parseTierList(homepageHtml);
  const featuredDecks = parseFeaturedDecks(homepageHtml);
  console.log(`  ${tierList.length} tier list archetypes`);
  console.log(`  ${featuredDecks.length} featured decks`);

  // Step 3: Fetch deck codes for featured standard decks
  const standardDecks = featuredDecks.filter(d => d.format === 'standard').slice(0, 8);
  console.log(`\nFetching deck codes for ${standardDecks.length} standard decks...`);

  const deckDetails = [];
  for (const deck of standardDecks) {
    try {
      await page.goto(deck.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const html = await page.content();

      const codeMatch = html.match(/data-deck-code="([^"]+)"/);
      const dustMatch = html.match(/Dust Cost:?\s*([\d,]+)/i);
      const deckCode = codeMatch ? codeMatch[1] : null;
      const dustCost = dustMatch ? parseInt(dustMatch[1].replace(/,/g, '')) : null;

      if (deckCode) {
        deckDetails.push({ ...deck, deckCode, dustCost });
        console.log(`  ${deck.deckName}: ${deckCode.slice(0, 20)}... (dust: ${dustCost})`);
      }
    } catch {
      console.log(`  Failed: ${deck.deckName}`);
    }
    await page.waitForTimeout(300);
  }

  await page.close();
  await browser.close();

  // Build overlay
  const archetypes = {};
  let matched = 0;

  for (const t of tierList) {
    const norm = normalize(t.name);
    const id = ARCHETYPE_ID_MAP[norm];
    if (id) {
      archetypes[id] = {
        ...(archetypes[id] || {}),
        tier: t.tier,
        tierName: t.tierName,
        cardClass: t.cardClass,
        archetypeName: t.name,
      };
      matched++;
    } else {
      console.log(`  Unmatched tier: "${t.name}" (${norm}) [${t.cardClass}]`);
    }
  }

  for (const d of deckDetails) {
    const norm = normalize(d.deckName);
    const id = ARCHETYPE_ID_MAP[norm];
    if (id && archetypes[id]) {
      archetypes[id].deckCode = d.deckCode;
      archetypes[id].dustCost = d.dustCost;
      archetypes[id].sourceUrl = d.url;
      archetypes[id].rank = d.rank;
      archetypes[id].player = d.player;
    } else if (id) {
      archetypes[id] = {
        ...archetypes[id],
        deckCode: d.deckCode,
        dustCost: d.dustCost,
        sourceUrl: d.url,
        rank: d.rank,
        player: d.player,
      };
    }
  }

  if (matched < 3) {
    console.log(`\n⚠️  Only ${matched} tier matches — likely a scrape issue. Keeping existing data.`);
    process.exit(0);
  }

  const result = {
    lastFetch: new Date().toISOString(),
    source: 'hearthstonetopdecks',
    fetchSuccess: matched > 0,
    tierListCount: tierList.length,
    featuredDeckCount: featuredDecks.length,
    deckCodeCount: deckDetails.length,
    archetypes,
  };

  writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`\nWritten: ${OUT} (${Object.keys(archetypes).length} archetypes, ${deckDetails.length} deck codes)`);
}

main().catch(e => { console.error(e); process.exit(1); });
