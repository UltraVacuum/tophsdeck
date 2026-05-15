/**
 * FetchDecks - Fetch latest Hearthstone deck data from multiple sources
 *
 * Sources (all require headless browser due to JS rendering / Cloudflare):
 *   1. HSReplay        — tier/win rate archetype data
 *   2. HearthstoneTopDecks — deck lists + deck codes
 *   3. HearthPwn       — popular deck lists
 *   4. iyingdi.com     — Chinese community decks
 *   5. hearthcard.io   — deck builder popular decks
 *
 * Outputs: src/data/generated/decks.json
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// ─── Utilities ─────────────────────────────────────────────────────

function loadExisting() {
  const p = 'src/data/generated/decks.json';
  if (existsSync(p)) {
    try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return []; }
  }
  return [];
}

// Hearthstone deck code decoder (Base64 → card list)
function readVarint(buf, offset) {
  let value = 0, shift = 0, b;
  do {
    b = buf[offset++];
    value |= (b & 0x7f) << shift;
    shift += 7;
  } while (b & 0x80);
  return [value, offset];
}

function decodeDeckCode(code) {
  try {
    const raw = Buffer.from(code.trim(), 'base64');
    let off = 0;
    if (raw[off++] !== 0x00) return null;  // header
    off++;                                   // version
    const format = raw[off++];               // 1=standard, 2=wild

    // Heroes
    const [numH, o1] = readVarint(raw, off); off = o1;
    const heroes = [];
    for (let i = 0; i < numH; i++) {
      const [id, o2] = readVarint(raw, off); off = o2;
      heroes.push(id);
    }

    const cards = [];
    // Single-copy
    const [n1, o3] = readVarint(raw, off); off = o3;
    for (let i = 0; i < n1; i++) {
      const [dbf, o4] = readVarint(raw, off); off = o4;
      cards.push({ dbfId: dbf, quantity: 1 });
    }
    // Double-copy
    const [n2, o5] = readVarint(raw, off); off = o5;
    for (let i = 0; i < n2; i++) {
      const [dbf, o6] = readVarint(raw, off); off = o6;
      cards.push({ dbfId: dbf, quantity: 2 });
    }
    // Multi-copy
    const [n3, o7] = readVarint(raw, off); off = o7;
    for (let i = 0; i < n3; i++) {
      const [dbf, o8] = readVarint(raw, off); off = o8;
      const [cnt, o9] = readVarint(raw, off); off = o9;
      cards.push({ dbfId: dbf, quantity: cnt });
    }

    return { format, heroes, cards };
  } catch { return null; }
}

// DBF ID → card ID mapping from cards-full.json
function loadDbfMap() {
  const p = 'src/data/generated/cards-full.json';
  if (!existsSync(p)) return new Map();
  try {
    const cards = JSON.parse(readFileSync(p, 'utf-8'));
    const map = new Map();
    for (const c of cards) {
      if (c.dbfId) map.set(Number(c.dbfId), c.id);
    }
    return map;
  } catch { return new Map(); }
}

// Hero DBF ID → class enum
function heroToClass(dbfId) {
  const m = {
    274: 'WARRIOR', 2827: 'WARRIOR', 1633: 'WARRIOR',
    637: 'SHAMAN', 77556: 'SHAMAN', 81306: 'SHAMAN',
    31: 'HUNTER', 2826: 'HUNTER', 81326: 'HUNTER',
    813: 'ROGUE', 2828: 'ROGUE', 81314: 'ROGUE',
    39117: 'PALADIN', 2829: 'PALADIN', 81318: 'PALADIN',
    531: 'PRIEST', 2830: 'PRIEST', 81330: 'PRIEST',
    2745: 'WARLOCK', 2831: 'WARLOCK', 81322: 'WARLOCK',
    62587: 'DEMONHUNTER', 81310: 'DEMONHUNTER',
    77557: 'DEATHKNIGHT', 81302: 'DEATHKNIGHT',
    2579: 'MAGE', 2832: 'MAGE', 81334: 'MAGE',
    1068: 'DRUID', 2833: 'DRUID', 81338: 'DRUID',
  };
  return m[dbfId] || null;
}

// Resolve decoded deck cards to card IDs
function resolveCards(decoded, dbfMap) {
  if (!decoded) return [];
  return decoded.cards
    .map(c => ({ cardId: dbfMap.get(c.dbfId) || `DBF_${c.dbfId}`, quantity: c.quantity }))
    .filter(c => c.cardId);
}

// Normalize archetype name for matching
function normalizeArchetype(name) {
  return (name || '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Source Adapters ───────────────────────────────────────────────

// Each adapter receives a Playwright browser instance and returns an array of:
// { name, cardClass, format, archetype, deckCode, winRate, gamesPlayed, tier, source, url }

async function fetchHSReplay(browser) {
  console.log('1. HSReplay meta/tier data...');
  const items = [];
  const page = await browser.newPage();
  try {
    await page.goto('https://hsreplay.net/meta/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.archetype-stats, .tier-list, [data-archetype]', { timeout: 10000 }).catch(() => {});

    const archetypes = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr[data-archetype], .archetype-row, .tier-row');
      return Array.from(rows).map(row => {
        const nameEl = row.querySelector('.archetype-name, .name, td:first-child a, td:nth-child(2)');
        const wrEl = row.querySelector('.win-rate, td:nth-child(3), [data-winrate]');
        const gamesEl = row.querySelector('.games, td:nth-child(4), [data-games]');
        const classEl = row.querySelector('.class-name, .player-class, [data-class]');
        return {
          name: nameEl?.textContent?.trim() || '',
          winRate: parseFloat(wrEl?.textContent?.trim()) || 0,
          gamesPlayed: parseInt(gamesEl?.textContent?.replace(/\D/g, '')) || 0,
          className: classEl?.textContent?.trim() || '',
        };
      }).filter(r => r.name);
    });

    const classMap = {
      warrior: 'WARRIOR', shaman: 'SHAMAN', hunter: 'HUNTER',
      rogue: 'ROGUE', paladin: 'PALADIN', priest: 'PRIEST',
      warlock: 'WARLOCK', 'demon hunter': 'DEMONHUNTER', 'death knight': 'DEATHKNIGHT',
      mage: 'MAGE', druid: 'DRUID',
    };

    for (const a of archetypes) {
      items.push({
        name: a.name,
        cardClass: classMap[(a.className || '').toLowerCase()] || '',
        format: 'standard',
        archetype: a.name,
        winRate: a.winRate,
        gamesPlayed: a.gamesPlayed,
        tier: a.winRate > 55 ? 1 : a.winRate > 52 ? 2 : a.winRate > 50 ? 3 : 4,
        source: 'hsreplay',
        url: 'https://hsreplay.net/meta/',
      });
    }
  } catch (e) {
    console.log(`   Error: ${e.message?.slice(0, 80)}`);
  } finally {
    await page.close();
  }
  console.log(`   ${items.length} archetypes`);
  return items;
}

async function fetchHSTD(browser) {
  console.log('2. HearthstoneTopDecks...');
  const items = [];
  const page = await browser.newPage();
  try {
    await page.goto('https://www.hearthstonetopdecks.com/decks/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.deck-list, .deck-box, article', { timeout: 10000 }).catch(() => {});

    const decks = await page.evaluate(() => {
      const cards = document.querySelectorAll('.deck-box, article.deck, .deck-list-item, .entry');
      return Array.from(cards).map(el => {
        const nameEl = el.querySelector('.deck-name, h2, h3, .title, a');
        const codeEl = el.querySelector('.deck-code, [data-deckcode], .copy-deck');
        const classEl = el.querySelector('.deck-class, .class, [data-class]');
        const linkEl = el.querySelector('a[href*="/deck"]');
        return {
          name: nameEl?.textContent?.trim() || '',
          deckCode: codeEl?.dataset?.deckcode || codeEl?.textContent?.trim() || '',
          className: classEl?.textContent?.trim() || '',
          url: linkEl?.href || '',
        };
      }).filter(d => d.name);
    });

    for (const d of decks) {
      if (d.deckCode && d.deckCode.startsWith('AAECA')) {
        items.push({
          name: d.name, cardClass: '', format: 'standard',
          archetype: d.name, deckCode: d.deckCode,
          source: 'hearthstonetopdecks', url: d.url,
        });
      }
    }
  } catch (e) {
    console.log(`   Error: ${e.message?.slice(0, 80)}`);
  } finally {
    await page.close();
  }
  console.log(`   ${items.length} decks`);
  return items;
}

async function fetchHearthPwn(browser) {
  console.log('3. HearthPwn...');
  const items = [];
  const page = await browser.newPage();
  try {
    const url = 'https://www.hearthpwn.com/decks?filter-show-standard=1&sort=-viewcount';
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.deck-list, .deck-row, table.decks', { timeout: 10000 }).catch(() => {});

    const deckLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/decks/"]');
      return Array.from(links).slice(0, 20).map(a => ({
        name: a.textContent?.trim() || '',
        url: a.href || '',
      })).filter(l => l.url.match(/\/decks\/\d+/));
    });

    // Visit top deck pages to extract deck codes
    for (const link of deckLinks.slice(0, 10)) {
      try {
        await page.goto(link.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const code = await page.evaluate(() => {
          const el = document.querySelector('.deck-code, [data-deckcode], #deck-code, .export-deck-button');
          return el?.textContent?.trim() || el?.dataset?.deckcode || '';
        });
        if (code && code.startsWith('AAECA')) {
          items.push({
            name: link.name, cardClass: '', format: 'standard',
            archetype: link.name, deckCode: code,
            source: 'hearthpwn', url: link.url,
          });
        }
      } catch { /* skip inaccessible pages */ }
    }
  } catch (e) {
    console.log(`   Error: ${e.message?.slice(0, 80)}`);
  } finally {
    await page.close();
  }
  console.log(`   ${items.length} decks`);
  return items;
}

async function fetchIyingdi(browser) {
  console.log('4. iyingdi.com...');
  const items = [];
  const page = await browser.newPage();
  try {
    await page.goto('https://www.iyingdi.com/web/tools/hearthstone/userdecks', {
      waitUntil: 'networkidle', timeout: 30000,
    });
    await page.waitForSelector('.deck-item, .deck-card, .deck-list', { timeout: 10000 }).catch(() => {});

    const decks = await page.evaluate(() => {
      const els = document.querySelectorAll('.deck-item, .deck-card, [data-deck]');
      return Array.from(els).map(el => {
        const nameEl = el.querySelector('.name, .title, h3');
        const codeEl = el.querySelector('.deck-code, [data-code]');
        return {
          name: nameEl?.textContent?.trim() || '',
          deckCode: codeEl?.dataset?.code || codeEl?.textContent?.trim() || '',
        };
      });
    });

    for (const d of decks) {
      if (d.deckCode && d.deckCode.startsWith('AAECA')) {
        items.push({
          name: d.name, cardClass: '', format: 'standard',
          archetype: d.name, deckCode: d.deckCode,
          source: 'iyingdi', url: 'https://www.iyingdi.com/web/tools/hearthstone/userdecks',
        });
      }
    }
  } catch (e) {
    console.log(`   Error: ${e.message?.slice(0, 80)}`);
  } finally {
    await page.close();
  }
  console.log(`   ${items.length} decks`);
  return items;
}

async function fetchHearthcard(browser) {
  console.log('5. hearthcard.io...');
  const items = [];
  const page = await browser.newPage();
  try {
    await page.goto('https://hearthcard.io/', { waitUntil: 'networkidle', timeout: 30000 });
    // Look for popular/trending section
    await page.waitForSelector('.popular, .trending, .deck-list, [data-deck]', { timeout: 8000 }).catch(() => {});

    const decks = await page.evaluate(() => {
      const els = document.querySelectorAll('.popular .deck, .trending .deck, [data-deck-code]');
      return Array.from(els).map(el => ({
        name: el.querySelector('.name, .title')?.textContent?.trim() || '',
        deckCode: el.dataset.deckCode || el.querySelector('[data-deck-code]')?.dataset?.deckCode || '',
      }));
    });

    for (const d of decks) {
      if (d.deckCode && d.deckCode.startsWith('AAECA')) {
        items.push({
          name: d.name, cardClass: '', format: 'standard',
          archetype: d.name, deckCode: d.deckCode,
          source: 'hearthcard', url: 'https://hearthcard.io/',
        });
      }
    }
  } catch (e) {
    console.log(`   Error: ${e.message?.slice(0, 80)}`);
  } finally {
    await page.close();
  }
  console.log(`   ${items.length} decks`);
  return items;
}

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('=== FetchDecks ===\n');

  const dbfMap = loadDbfMap();
  console.log(`Card DBF map: ${dbfMap.size} entries\n`);

  let browser = null;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });
    console.log('Playwright: launched Chromium\n');
  } catch {
    console.log('Playwright not available — skipping all headless browser sources.\n');
    console.log('Install: npx playwright install --with-deps chromium\n');
    // Write empty output so the workflow doesn't fail
    writeFileSync('src/data/generated/decks.json', JSON.stringify([], null, 2));
    console.log('Output: 0 decks (no browser)');
    return;
  }

  const allFetched = [];

  // Run all source adapters
  const adapters = [
    fetchHSReplay,
    fetchHSTD,
    fetchHearthPwn,
    fetchIyingdi,
    fetchHearthcard,
  ];

  for (const adapter of adapters) {
    try {
      const results = await adapter(browser);
      allFetched.push(...results);
    } catch (e) {
      console.log(`   Adapter failed: ${e.message?.slice(0, 80)}`);
    }
  }

  await browser.close();

  // Resolve deck codes → card lists
  for (const deck of allFetched) {
    if (deck.deckCode && !deck.cards?.length) {
      const decoded = decodeDeckCode(deck.deckCode);
      if (decoded) {
        const cardClass = heroToClass(decoded.heroes[0]);
        if (cardClass && !deck.cardClass) deck.cardClass = cardClass;
        deck.format = decoded.format === 2 ? 'wild' : 'standard';
        deck.cards = resolveCards(decoded, dbfMap);
      }
    }
    if (!deck.date) deck.date = new Date().toISOString().split('T')[0];
  }

  // Deduplicate by deckCode (keep highest winRate)
  const seen = new Map();
  for (const d of allFetched) {
    const key = d.deckCode || `${d.cardClass}-${normalizeArchetype(d.archetype)}`;
    const existing = seen.get(key);
    if (!existing || (d.winRate || 0) > (existing.winRate || 0)) {
      seen.set(key, d);
    }
  }
  const deduped = [...seen.values()];

  // Merge with existing fetched data
  const existing = loadExisting();
  const existingIds = new Set(existing.map(d => d.id));
  const fresh = deduped.filter(d => !existingIds.has(d.id));
  const merged = [...fresh, ...existing]
    .sort((a, b) => (b.winRate || 0) - (a.winRate || 0))
    .slice(0, 100);

  writeFileSync('src/data/generated/decks.json', JSON.stringify(merged, null, 2));
  console.log(`\nExisting: ${existing.length}, Fetched: ${allFetched.length}, ` +
    `After merge: ${merged.length} (new: ${fresh.length})`);

  if (fresh.length > 0) {
    console.log('\nNew decks:');
    fresh.slice(0, 5).forEach(d =>
      console.log(`  [${d.source}] ${d.cardClass} — ${d.name?.slice(0, 50)} (${d.winRate || '?'}%)`)
    );
  }
}

main().catch(e => { console.error(e); process.exit(1); });
