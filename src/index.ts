import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from './schema';

const { DATABASE_URL } = process.env

const main = async () => {
    console.log(DATABASE_URL)
    // const migrationConnection = postgres(process.env.DATABASE_URL!, { max: 1 });
    const queryConnection = postgres(process.env.DATABASE_URL!, {
        ssl: { rejectUnauthorized: false },
        no_prepare: true
    });

    const db = drizzle(queryConnection, { schema });
    // await migrate(drizzle(migrationConnection), { migrationsFolder: 'drizzle' });
    // await migrationConnection.end();
    const users = await db.query.users.findFirst()
    // await db.insert(user).values([{ name: 'alef' }, { name: 'bolk' }]);
    console.log(users);
};

main();
