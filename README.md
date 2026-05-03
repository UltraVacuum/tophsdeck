# hs-deck-data

Hearthstone card data pipeline and PostgreSQL storage layer. Ingests card metadata from [HearthstoneJSON](https://hearthstonejson.com/), stores it in PostgreSQL via Drizzle ORM, and downloads card art from `art.hearthstonejson.com`.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Language:** TypeScript
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) with `postgres-js` driver
- **Database:** PostgreSQL
- **Card art source:** [HearthstoneJSON Art API](https://hearthstonejson.com/docs/art/)

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL instance
- A `.env` file with:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Setup

```bash
pnpm install
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run migration and insert all cards from `src/data-raw/cards.json` into the database |
| `pnpm gen` | Generate a Drizzle SQL migration from schema changes (`drizzle-kit generate:pg`) |
| `pnpm push` | Push schema directly to the database without generating a migration file (`drizzle-kit push:pg`) |

### Utility Scripts (under `src/scripts/`)

| File | Purpose |
|------|---------|
| `make-migrations.ts` | Run pending Drizzle migrations against the database |
| `insert-cards.ts` | Insert cards from JSON without running migrations first |
| `bn-download.ts` | Batch-download card art images (orig, tiles, 256x, 512x) in jpg/webp from `art.hearthstonejson.com` |

## Data Schema

Three tables defined in `src/schema.ts`:

### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `email` | `text` | |
| `user_meta` | `jsonb` | Arbitrary user metadata |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto |

### `cards`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `varchar` | PK, Hearthstone card ID (e.g. `CS2_235`) |
| `name` | `varchar` | |
| `dbfId` | `varchar` | Numeric DBF ID as string |
| `cardClass` | `varchar` | Class (e.g. `MAGE`, `DEMONHUNTER`) |
| `cardMeta` | `jsonb` | Full card JSON from HearthstoneJSON |
| `cost` | `integer` | Mana cost |
| `attack` | `integer` | |
| `health` | `integer` | |
| `type` | `varchar` | `MINION`, `SPELL`, `WEAPON`, `HERO`, etc. |
| `rarity` | `varchar` | |
| `set` | `varchar` | Card set |
| `collectible` | `boolean` | |
| `mechanics` | `jsonb` | Array of mechanic tags |
| `_...more columns_` | | 30+ additional fields (Battlegrounds, Mercenaries, etc.) |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto |

The `cardMeta` JSONB column stores the complete card object from HearthstoneJSON. Frequently queried fields are duplicated as top-level columns for index-friendly filtering and sorting.

### `decks`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK -> `users.id` |
| `deck_meta` | `jsonb` | Arbitrary deck data (cards list, format, etc.) |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto |

## Data Flow

```
HearthstoneJSON API
       |
       v
src/data-raw/cards.json   (raw card data, ~10k+ cards)
       |
       v  pnpm dev
PostgreSQL (cards table)   (migration + upsert)
       |
       v  src/scripts/bn-download.ts
images/{orig,tiles,256x,512x}/{id}.{jpg,webp}
```

## Project Structure

```
hs-deck-data/
  src/
    schema.ts            # Drizzle table definitions + CardMeta type + cardToInsert()
    index.ts             # Main entry: migrate + insert cards
    scripts/
      make-migrations.ts # Run migrations only
      insert-cards.ts    # Insert cards only (no migration)
      bn-download.ts     # Download card art images
    data-raw/
      cards.json         # Full card dataset
      cards-enUS.json    # English locale
      cards-znCN.json    # Simplified Chinese locale
      cards.collectible.json
      ...
  drizzle/               # Generated SQL migrations
  images/                # Downloaded card art (not in repo)
  drizzle.config.ts      # Drizzle Kit config
  tsconfig.json
```

## License

ISC
