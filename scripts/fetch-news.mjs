/**
 * FetchNews - Fetch latest Hearthstone news from multiple sources
 *
 * Sources:
 *   1. Reddit /r/hearthstone RSS (active community)
 *   2. HearthstoneTopDecks RSS (may be inactive, fallback)
 *   3. PlayHearthstone official news
 *
 * Outputs: src/data/generated/news.json
 *
 * NOTE: execSync is used with hardcoded URLs only (no user input).
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Safe curl wrapper using execFileSync (no shell injection risk)
function curl(url) {
  try {
    return execFileSync('curl', ['-sL', '-A', 'Mozilla/5.0 (compatible; TopHSDeck Bot)', url], {
      encoding: 'utf-8',
      timeout: 30000,
      maxBuffer: 5 * 1024 * 1024,
    });
  } catch {
    return '';
  }
}

function decodeHTML(str) {
  return (str || '')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...').replace(/&#x2d;/g, '-')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#038;/g, '&');
}

function parseRSS(xml, source) {
  if (!xml) return [];
  const items = [];
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const title = (b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || b.match(/<title>([^<]*)<\/title>/))?.[1]?.trim();
    const link = (b.match(/<link>\s*([^<\s][^<]*?)\s*<\/link>/))?.[1]?.trim();
    const desc = (b.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || b.match(/<description>([^<]*)<\/description>/))?.[1]?.trim();
    const pubDate = (b.match(/<pubDate>([^<]+)<\/pubDate>/))?.[1]?.trim();
    const cats = [...b.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map(c => c[1]);

    if (!title || !link) continue;
    const date = pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    let category = 'guide';
    const t = (title + ' ' + cats.join(' ')).toLowerCase();
    if (/patch|balance|nerf|buff|update|hotfix|调整|削弱|增强|补丁/.test(t)) category = 'patch';
    else if (/event|promo|reward|活动|奖励|促销/.test(t)) category = 'event';
    else if (/esport|tournament|championship|master|电竞|大师赛|锦标赛/.test(t)) category = 'esports';
    else if (/expansion|reveal|launch|cataclysm|扩展|新卡|发布/.test(t)) category = 'expansion';

    const cleanDesc = decodeHTML((desc || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300));

    items.push({
      id: `${source}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
      title: decodeHTML(title),
      summary: cleanDesc,
      category,
      date,
      link,
      source,
    });
  }
  return items;
}

function loadExisting() {
  const p = 'src/data/generated/news.json';
  if (existsSync(p)) {
    try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return []; }
  }
  return [];
}

function merge(existing, fetched) {
  const ids = new Set(existing.map(n => n.id));
  const links = new Set(existing.map(n => n.link));
  const fresh = fetched.filter(n => !ids.has(n.id) && !links.has(n.link));
  return [...fresh, ...existing]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
}

async function main() {
  console.log('=== FetchNews ===\n');
  let all = [];

  // Source 1: Reddit /r/hearthstone (most active community)
  console.log('1. Reddit /r/hearthstone...');
  const redditXml = curl('https://www.reddit.com/r/hearthstone/.rss');
  const redditItems = parseRSS(redditXml, 'reddit');
  console.log(`   ${redditItems.length} articles`);
  all.push(...redditItems);

  // Source 2: HearthstoneTopDecks (may be inactive, legacy fallback)
  console.log('2. HearthstoneTopDecks RSS...');
  const hstdXml = curl('https://www.hearthstonetopdecks.com/feed/');
  const hstdItems = parseRSS(hstdXml, 'hearthstonetopdecks');
  console.log(`   ${hstdItems.length} articles`);
  all.push(...hstdItems);

  // Source 3: PlayHearthstone official blog
  console.log('3. PlayHearthstone RSS...');
  const officialXml = curl('https://hearthstone.blizzard.com/en-us/blog/feed');
  const officialItems = parseRSS(officialXml, 'hearthstone');
  console.log(`   ${officialItems.length} articles`);
  all.push(...officialItems);

  // Merge with existing
  const existing = loadExisting();
  const merged = merge(existing, all);
  const newCount = merged.length - existing.length;

  writeFileSync('src/data/generated/news.json', JSON.stringify(merged, null, 2));
  console.log(`\nExisting: ${existing.length}, Fetched: ${all.length}, After merge: ${merged.length} (new: ${Math.max(0, newCount)})`);

  if (newCount > 0) {
    console.log('\nNew articles:');
    merged.slice(0, Math.min(Math.max(newCount, 0), 5)).forEach(n =>
      console.log(`  [${n.date}] [${n.source}] ${n.title.slice(0, 60)}`)
    );
  } else {
    console.log('\nNo new articles found.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
