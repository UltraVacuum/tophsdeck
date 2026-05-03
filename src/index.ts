import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from './schema';
import { cardToInsert } from './schema';
import cardsMeta from '@/data-raw/cards.json' assert { type: 'json' }

const main = async () => {
    const { DATABASE_URL } = process.env;
    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }
    console.log(DATABASE_URL)
    const conn = postgres(DATABASE_URL, {
        ssl: { rejectUnauthorized: false },
        no_prepare: true,
    });

    const db = drizzle(conn, { schema });
    await migrate(db, { migrationsFolder: 'drizzle' });

    for (const card of cardsMeta) {
        await db.insert(schema.cards)
            .values(cardToInsert(card as schema.CardMeta))
            .onConflictDoNothing()
        console.log('insert data succ:', card.id)
    }
    await conn.end();
};

main();
