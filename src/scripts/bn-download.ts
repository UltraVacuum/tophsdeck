// Battle.net API endpoint for Hearthstone cards
// https://api.blizzard.com/hearthstone/cards?class=all&pageSize=450&set=standard&sort=manaCost%3Aasc%2Cname%3Aasc%2Cclasses%3Aasc%2CgroupByClass%3Aasc&locale=zh_CN

import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import cards from '@/data-raw/cards.json' assert { type: 'json' }

import { writeFile } from 'fs/promises';

async function downloadImage(url: string, destination: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        await writeFile(destination, Buffer.from(arrayBuffer));
        console.log(`Image downloaded and saved as ${destination}`);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error downloading image: ${message}`);
        console.error(`Error downloading url: ${url}`);
    }
}

// https://art.hearthstonejson.com/v1/orig/ (Example)
// https://art.hearthstonejson.com/v1/256x/ (Example)
// https://art.hearthstonejson.com/v1/512x/ (Example)
// https://art.hearthstonejson.com/v1/tiles/CS2_235.png
// https://art.hearthstonejson.com/v1/tiles/CS2_235.jpg
// https://art.hearthstonejson.com/v1/tiles/CS2_235.webp

const ImageExt = ['jpg', 'webp']
const ImagePix = [
    'orig',
    'tiles',
    '256x',
    '512x'
]

const cardImageUrl = (
    id: string | number,
    pix: string,
    ext: string
): string | null => {
    if (!id) return null
    if (ImageExt.indexOf(ext) === -1) return null
    if (ImagePix.indexOf(pix) === -1) return null
    return `https://art.hearthstonejson.com/v1/${pix}/${id}.${ext}`
}

const saveDir = (pix: string, ext: string) => {
    const dir = path.join(`./images/${pix}/${ext}`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir
}

const downloadCardImage = async ({ id }: { id: string }) => {
    for (const ext of ImageExt) {
        for (const pix of ImagePix) {
            const imgUrl = cardImageUrl(id, pix, ext)
            if (!imgUrl) {
                console.log(`card ${id} url is null`)
                continue
            }
            const savePath = saveDir(pix, ext)
            const fileName = `${id}.${ext}`
            const fullPath = path.join(savePath, fileName)
            if (fs.existsSync(fullPath)) {
                console.log(`file exists, skip download: ${fullPath}`)
                continue
            }
            await downloadImage(imgUrl, fullPath)
            console.log(`download ${id} completed.`)
        }
    }
}

const main = async () => {
    for (let i = cards.length - 1; i >= 0; i--) {
        await downloadCardImage(cards[i])
    }
}

main();
