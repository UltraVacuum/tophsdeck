/**
 * FetchMeta - Fetch archetype stats from HSReplay and write meta-overlay.json
 *
 * Strategy: Scrape HSReplay /meta/ page for archetype winrate/tier data,
 * then match to our deck IDs via a hardcoded archetype mapping table.
 *
 * Outputs: src/data/generated/meta-overlay.json
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// ─── Archetype Mapping ──────────────────────────────────────────
// Maps HSReplay archetype names to our deck IDs.
// Key = normalized HSReplay archetype name (lowercase, trimmed)
// Value = our deck ID from decks.json
const ARCHETYPE_MAP = {
  // Demon Hunter
  'aggro demon hunter': 'deck-dh-aggro',
  'soul demon hunter': 'deck-dh-soul',
  'token demon hunter': 'deck-dh-token',

  // Death Knight
  'frost death knight': 'deck-dk-frost-aggro',
  'frost aggro death knight': 'deck-dk-frost-aggro',
  'blood death knight': 'deck-dk-blood-control',
  'unholy death knight': 'deck-dk-unholy-midrange',
  'frost control death knight': 'deck-dk-frost-control',

  // Druid
  'ramp druid': 'deck-druid-ramp',
  'token druid': 'deck-druid-token-wild',
  'combo druid': 'deck-druid-combo',
  'token druid (standard)': 'deck-druid-token-standard',

  // Hunter
  'face hunter': 'deck-hunter-face',
  'midrange hunter': 'deck-hunter-midrange',

  // Mage
  'tempo mage': 'deck-mage-tempo',
  'freeze mage': 'deck-mage-freeze',
  'big spell mage': 'deck-mage-big-spell',
  'grinder mage': 'deck-mage-grinder',
  'quest mage': 'deck-mage-quest',

  // Paladin
  'even paladin': 'deck-paladin-even',
  'aggro paladin': 'deck-paladin-aggro',
  'hand paladin': 'deck-paladin-hand',
  'divine shield paladin': 'deck-paladin-divine',
  'murloc paladin': 'deck-paladin-murloc',

  // Priest
  'control priest': 'deck-priest-control',
  'shadow priest': 'deck-priest-shadow',
  'resurrect priest': 'deck-priest-resurrect',
  'shadow aggro priest': 'deck-priest-shadow-aggro',
  'raza priest': 'deck-priest-raza',

  // Rogue
  'miracle rogue': 'deck-rogue-miracle',
  'pirate rogue': 'deck-rogue-pirate',
  'quest rogue': 'deck-rogue-quest',
  'deathrattle rogue': 'deck-rogue-deathrattle',

  // Shaman
  'midrange shaman': 'deck-shaman-midrange',
  'evolve shaman': 'deck-shaman-evolve',
  'quest shaman': 'deck-shaman-quest',
  'battlecry shaman': 'deck-shaman-battlecry',
  'shudderwock shaman': 'deck-shaman-shudderwock',

  // Warlock
  'zoo warlock': 'deck-warlock-zoo',
  'handlock': 'deck-warlock-handlock',
  'cube warlock': 'deck-warlock-cube',
  'zoo aggro warlock': 'deck-warlock-zoo-aggro',
  'reno warlock': 'deck-warlock-reno',

  // Warrior
  'control warrior': 'deck-warrior-control',
  'pirate warrior': 'deck-warrior-pirate',
  'pirate warrior (standard)': 'deck-warrior-pirate-standard',
  'quest warrior': 'deck-warrior-quest',
};

// ─── Utilities ──────────────────────────────────────────────────

function normalize(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

const CLASS_MAP = {
  warrior: 'WARRIOR', shaman: 'SHAMAN', hunter: 'HUNTER',
  rogue: 'ROGUE', paladin: 'PALADIN', priest: 'PRIEST',
  warlock: 'WARLOCK', 'demon hunter': 'DEMONHUNTER', 'death knight': 'DEATHKNIGHT',
  mage: 'MAGE', druid: 'DRUID',
};

function loadExisting() {
  const p = 'src/data/generated/meta-overlay.json';
  if (existsSync(p)) {
    try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return null; }
  }
  return null;
}

// ─── HSReplay Scraper ───────────────────────────────────────────

async function fetchHSReplayMeta(browser) {
  console.log('Fetching HSReplay /meta/ ...');
  const archetypes = [];
  const page = await browser.newPage();

  try {
    await page.goto('https://hsreplay.net/meta/', {
      waitUntil: 'networkidle',
      timeout: 45000,
    });

    // Wait for data to render
    await page.waitForSelector('table, .tier-list, .archetype-row, [data-archetype]', {
      timeout: 15000,
    }).catch(() => {});

    // Try extracting from embedded JSON first (more reliable)
    const embedded = await page.evaluate(() => {
      // Check for Next.js data
      const nextData = document.getElementById('__NEXT_DATA__');
      if (nextData) {
        try { return JSON.parse(nextData.textContent); } catch { /* */ }
      }
      return null;
    });

    if (embedded?.props?.pageProps) {
      console.log('  Found embedded page data');
      // Navigate the structure to find archetype data
      const pp = embedded.props.pageProps;
      const meta = pp.meta || pp.archetypes || pp.tierList || pp.data;
      if (Array.isArray(meta)) {
        for (const a of meta) {
          archetypes.push({
            name: a.name || a.archetype_name || '',
            cardClass: a.player_class_name || a.className || '',
            winRate: parseFloat(a.win_rate || a.winRate || 0),
            gamesPlayed: parseInt((a.total_games || a.gamesPlayed || 0)).toString().replace(/\D/g, '') || 0,
            tier: a.tier || 0,
          });
        }
      }
    }

    // Fallback: scrape DOM table rows
    if (archetypes.length === 0) {
      console.log('  Scraping DOM table...');
      const rows = await page.evaluate(() => {
        const selectors = [
          'table tbody tr',
          '.tier-list .archetype-row',
          '[data-archetype]',
          '.meta-table tr',
          'tr[class*="archetype"]',
        ];

        for (const sel of selectors) {
          const els = document.querySelectorAll(sel);
          if (els.length > 3) {
            return Array.from(els).map(row => {
              const cells = row.querySelectorAll('td, th');
              const text = Array.from(cells).map(c => c.textContent?.trim() || '');
              return {
                name: text[0] || text[1] || '',
                className: text[1] || '',
                winRate: text.find(t => /^\d+\.\d+%?$/.test(t)) || '0',
                games: text.find(t => /^\d{4,}/.test(t.replace(/,/g, ''))) || '0',
              };
            }).filter(r => r.name && r.name.length > 2);
          }
        }
        return [];
      });

      for (const r of rows) {
        archetypes.push({
          name: r.name,
          cardClass: r.className,
          winRate: parseFloat(r.winRate.replace('%', '')) || 0,
          gamesPlayed: parseInt(r.games.replace(/,/g, '')) || 0,
          tier: 0,
        });
      }
    }
  } catch (e) {
    console.log(`  Error: ${e.message?.slice(0, 100)}`);
  } finally {
    await page.close();
  }

  console.log(`  ${archetypes.length} archetypes found`);
  return archetypes;
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('=== FetchMeta ===\n');

  let browser = null;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });
    console.log('Playwright: launched Chromium\n');
  } catch {
    console.log('Playwright not available — cannot fetch meta data.');
    console.log('Install: npx playwright install --with-deps chromium\n');
    process.exit(0);
  }

  const rawArchetypes = await fetchHSReplayMeta(browser);
  await browser.close();

  if (rawArchetypes.length === 0) {
    console.log('No archetypes fetched — keeping existing meta-overlay.json');
    process.exit(0);
  }

  // Match archetypes to deck IDs
  const archetypes = {};
  let matched = 0;
  let unmatched = 0;

  for (const a of rawArchetypes) {
    const norm = normalize(a.name);
    const deckId = ARCHETYPE_MAP[norm];

    if (deckId) {
      // Compute tier from winRate if not provided
      const tier = a.tier || (a.winRate > 55 ? 1 : a.winRate > 52 ? 2 : a.winRate > 50 ? 3 : 4);
      archetypes[deckId] = {
        winRate: a.winRate || undefined,
        gamesPlayed: parseInt(String(a.gamesPlayed).replace(/\D/g, '')) || undefined,
        tier: tier || undefined,
        lastUpdated: new Date().toISOString(),
        source: 'hsreplay',
      };
      matched++;
    } else {
      unmatched++;
      // Log unmatched for mapping updates
      console.log(`  Unmatched: "${a.name}" (${norm}) [${a.cardClass}]`);
    }
  }

  const result = {
    lastFetch: new Date().toISOString(),
    source: 'hsreplay',
    fetchSuccess: matched > 0,
    archetypes,
  };

  // Validate: don't overwrite with too little data
  if (matched < 5) {
    console.log(`\n⚠️  Only ${matched} matches — likely a scrape issue. Keeping existing data.`);
    process.exit(0);
  }

  writeFileSync('src/data/generated/meta-overlay.json', JSON.stringify(result, null, 2));
  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`);
  console.log(`Written: meta-overlay.json (${Object.keys(archetypes).length} deck updates)`);
}

main().catch(e => { console.error(e); process.exit(1); });
