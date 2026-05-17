import { writeFileSync, mkdirSync } from 'node:fs';
import https from 'node:https';
import { createWriteStream } from 'node:fs';

const API = 'https://api.hearthstonejson.com/v1/latest';
const IMG = 'https://art.hearthstonejson.com/v1/images';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const doReq = (u) => {
      https.get(u, { timeout: 60000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doReq(res.headers.location);
          return;
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    };
    doReq(url);
  });
}

async function fetchJSON(url) {
  const buf = await httpsGet(url);
  return JSON.parse(buf.toString());
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const doReq = (u) => {
      https.get(u, { timeout: 30000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doReq(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) { resolve(false); return; }
        const ws = createWriteStream(dest);
        res.pipe(ws);
        ws.on('finish', () => { ws.close(); resolve(true); });
        ws.on('error', () => resolve(false));
      }).on('error', () => resolve(false));
    };
    doReq(url);
  });
}

async function main() {
  console.log('Fetching HearthstoneJSON data...');
  const [zhCards, enCards] = await Promise.all([
    fetchJSON(`${API}/zhCN/cards.json`),
    fetchJSON(`${API}/enUS/cards.json`),
  ]);
  console.log(`zhCN: ${zhCards.length}, enUS: ${enCards.length}`);
  
  const enMap = new Map(enCards.map(c => [c.id, c]));
  
  // Filter collectible playable cards (includes HERO cards like Deathstalker Rexxar)
  const VALID_CLASSES = new Set([
    'DEMONHUNTER', 'DEATHKNIGHT', 'DRUID', 'HUNTER', 'MAGE',
    'PALADIN', 'PRIEST', 'ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR', 'NEUTRAL',
  ]);
  const collectible = zhCards.filter(c =>
    c.collectible === true &&
    ['MINION','SPELL','WEAPON','LOCATION','HERO'].includes(c.type) &&
    VALID_CLASSES.has(c.cardClass)
  );
  console.log(`Collectible: ${collectible.length}`);
  
  // Download directory
  const imgDir = 'public/images/cards';
  mkdirSync(imgDir, { recursive: true });
  mkdirSync('src/data/generated', { recursive: true });
  
  let downloaded = 0;
  let failed = 0;
  
  // Build card data and download images in batches
  const BATCH = 50;
  const enriched = [];
  
  for (let i = 0; i < collectible.length; i++) {
    const card = collectible[i];
    const en = enMap.get(card.id);
    
    enriched.push({
      id: card.id,
      dbfId: card.dbfId,
      name: en?.name || card.name,
      nameZh: card.name,
      cardClass: card.cardClass || 'NEUTRAL',
      rarity: card.rarity || 'FREE',
      type: card.type,
      cost: card.cost ?? 0,
      attack: card.attack,
      health: card.health,
      durability: card.durability,
      armor: card.armor,
      text: (en?.text || '').replace(/<[^>]+>/g, ''),
      textZh: (card.text || '').replace(/<[^>]+>/g, ''),
      flavor: (en?.flavor || '').replace(/<[^>]+>/g, ''),
      flavorZh: (card.flavor || '').replace(/<[^>]+>/g, ''),
      artist: card.artist,
      race: card.race || card.mercenaryRace || null,
      spellSchool: card.spellSchool || null,
      mechanics: card.mechanics || [],
      set: card.set,
    });
  }
  
  // Save card data
  writeFileSync('src/data/generated/cards-full.json', JSON.stringify(enriched));
  console.log(`Saved ${enriched.length} cards to cards-full.json`);
  
  // Download images in batches (only for cards we actually reference)
  // For dev: download a representative subset
  const imageIds = enriched.map(c => c.id);
  console.log(`Starting image download for ${imageIds.length} cards...`);
  
  for (let batch = 0; batch < imageIds.length; batch += BATCH) {
    const slice = imageIds.slice(batch, batch + BATCH);
    const results = await Promise.allSettled(
      slice.map(async (id) => {
        const dest = `${imgDir}/${id}.png`;
        const url = `${IMG}/${id}.png`;
        return downloadFile(url, dest);
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) downloaded++;
      else failed++;
    }
    process.stdout.write(`\rDownloaded: ${downloaded}, Failed: ${failed}, Progress: ${batch + slice.length}/${imageIds.length}`);
  }
  
  console.log(`\nDone! Downloaded: ${downloaded}, Failed: ${failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
