import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from '@/schema';

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
    await conn.end();
};

main();
