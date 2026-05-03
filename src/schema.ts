import {
    varchar,
    integer,
    boolean,
    pgTable,
    serial,
    text,
    uuid,
    jsonb,
    timestamp
} from 'drizzle-orm/pg-core';

// ─── Timestamps ────────────────────────────────────────────────────────────────

const basicColumn = {
    created_at: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updated_at: timestamp('updated_at', {
        withTimezone: true
    }).defaultNow(),
}

// ─── Card type definition ──────────────────────────────────────────────────────
// This interface describes the full Hearthstone card JSON stored in cardMeta.
// Source: Blizzard Hearthstone API / HearthstoneJSON

export interface CardMeta {
    id: string;
    dbfId: number;
    name: string;
    cardClass: string;
    set: string;
    type: string;
    cost?: number;
    attack?: number;
    health?: number;
    armor?: number;
    rarity?: string;
    artist?: string;
    faction?: string;
    collectible?: boolean;
    flavor?: string;
    text?: string;
    spellSchool?: string;
    mechanics?: string[];
    race?: string;
    races?: string[];
    referencedTags?: string[];
    elite?: boolean;
    targetingArrowText?: string;
    durability?: number;
    overload?: number;
    spellDamage?: number;
    heroPowerDbfId?: number;
    battlegroundsPremiumDbfId?: number;
    techLevel?: number;
    hasDiamondSkin?: boolean;
    howToEarnGolden?: string;
    howToEarn?: string;
    collectionText?: string;
    hideCost?: boolean;
    hideStats?: boolean;
    mercenariesRole?: number;
    isBattlegroundsPoolMinion?: boolean;
    battlegroundsNormalDbfId?: number;
    battlegroundsBuddyDbfId?: number;
    battlegroundsHero?: boolean;
    isBattlegroundsBuddy?: boolean;
    battlegroundsSkinParentId?: number;
    battlegroundsDarkmoonPrizeTurn?: number;
    countAsCopyOfDbfId?: number;
    classes?: string[];
    puzzleType?: number;
    multiClassGroup?: string;
    isMiniSet?: boolean;
    mercenariesAbilityCooldown?: number;
    questReward?: string;
}

// ─── Card column definitions ───────────────────────────────────────────────────
// Individual columns duplicate data from cardMeta for query performance.
// PostgreSQL can natively filter/sort on these columns using indexes,
// whereas querying inside JSONB requires ->> casts and can't use btree indexes.
// Keep in sync with CardMeta interface above.

const cardColumns = {
    id: varchar('id').primaryKey(),
    name: varchar('name'),
    dbfId: varchar('dbfId'),
    cardClass: varchar('cardClass'),
    cardMeta: jsonb('cardMeta').$type<CardMeta>(),
    attack: integer('attack'),
    health: integer('health'),
    armor: integer('armor'),
    heroPowerDbfId: varchar('heroPowerDbfId'),
    set: varchar('set'),
    type: varchar('type'),
    artist: varchar('artist'),
    rarity: varchar('rarity'),
    cost: integer('cost'),
    faction: varchar('faction'),
    collectible: boolean('collectible'),
    flavor: text('flavor'),
    spellSchool: varchar('spellSchool'),
    text: text('text'),
    mechanics: jsonb('mechanics'),
    race: varchar('race'),
    races: jsonb('races'),
    referencedTags: jsonb('referencedTags'),
    elite: boolean('elite'),
    targetingArrowText: text('targetingArrowText'),
    durability: integer('durability'),
    overload: integer('overload'),
    spellDamage: integer('spellDamage'),
    battlegroundsPremiumDbfId: varchar('battlegroundsPremiumDbfId'),
    techLevel: integer('techLevel'),
    hasDiamondSkin: boolean('hasDiamondSkin'),
    howToEarnGolden: text('howToEarnGolden'),
    howToEarn: text('howToEarn'),
    collectionText: text('collectionText'),
    hideCost: boolean('hideCost'),
    hideStats: boolean('hideStats'),
    mercenariesRole: integer('mercenariesRole'),
    isBattlegroundsPoolMinion: boolean('isBattlegroundsPoolMinion'),
    battlegroundsNormalDbfId: varchar('battlegroundsNormalDbfId'),
    battlegroundsBuddyDbfId: varchar('battlegroundsBuddyDbfId'),
    battlegroundsHero: boolean('battlegroundsHero'),
    isBattlegroundsBuddy: boolean('isBattlegroundsBuddy'),
    battlegroundsSkinParentId: varchar('battlegroundsSkinParentId'),
    battlegroundsDarkmoonPrizeTurn: varchar('battlegroundsDarkmoonPrizeTurn'),
    countAsCopyOfDbfId: varchar('countAsCopyOfDbfId'),
    classes: jsonb('classes'),
    puzzleType: varchar('puzzleType'),
    multiClassGroup: varchar('multiClassGroup'),
    isMiniSet: boolean('isMiniSet'),
    mercenariesAbilityCooldown: integer('mercenariesAbilityCooldown'),
    questReward: varchar('questReward'),
}

// ─── Tables ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: text('email'),
    user_meta: jsonb('user_meta'),
    ...basicColumn
});

export const cards = pgTable('cards', {
    ...cardColumns,
    ...basicColumn
});

export const decks = pgTable('decks', {
    id: uuid('id').primaryKey(),
    deck_meta: jsonb('deck_meta'),
    user_id: uuid('user_id').references(() => users.id),
    ...basicColumn
});

// Maps a CardMeta (from JSON) to the insert shape expected by the `cards` table.
// Number fields that are stored as varchar are converted to strings.
export function cardToInsert(card: CardMeta) {
    return {
        id: card.id,
        dbfId: String(card.dbfId),
        name: card.name,
        cardClass: card.cardClass,
        set: card.set,
        type: card.type,
        cost: card.cost,
        attack: card.attack,
        health: card.health,
        armor: card.armor,
        heroPowerDbfId: card.heroPowerDbfId != null ? String(card.heroPowerDbfId) : null,
        rarity: card.rarity,
        artist: card.artist,
        faction: card.faction,
        collectible: card.collectible,
        flavor: card.flavor,
        text: card.text,
        spellSchool: card.spellSchool,
        mechanics: card.mechanics,
        race: card.race,
        races: card.races,
        referencedTags: card.referencedTags,
        elite: card.elite,
        targetingArrowText: card.targetingArrowText,
        durability: card.durability,
        overload: card.overload,
        spellDamage: card.spellDamage,
        battlegroundsPremiumDbfId: card.battlegroundsPremiumDbfId != null ? String(card.battlegroundsPremiumDbfId) : null,
        techLevel: card.techLevel,
        hasDiamondSkin: card.hasDiamondSkin,
        howToEarnGolden: card.howToEarnGolden,
        howToEarn: card.howToEarn,
        collectionText: card.collectionText,
        hideCost: card.hideCost,
        hideStats: card.hideStats,
        mercenariesRole: card.mercenariesRole,
        isBattlegroundsPoolMinion: card.isBattlegroundsPoolMinion,
        battlegroundsNormalDbfId: card.battlegroundsNormalDbfId != null ? String(card.battlegroundsNormalDbfId) : null,
        battlegroundsBuddyDbfId: card.battlegroundsBuddyDbfId != null ? String(card.battlegroundsBuddyDbfId) : null,
        battlegroundsHero: card.battlegroundsHero,
        isBattlegroundsBuddy: card.isBattlegroundsBuddy,
        battlegroundsSkinParentId: card.battlegroundsSkinParentId != null ? String(card.battlegroundsSkinParentId) : null,
        battlegroundsDarkmoonPrizeTurn: card.battlegroundsDarkmoonPrizeTurn != null ? String(card.battlegroundsDarkmoonPrizeTurn) : null,
        countAsCopyOfDbfId: card.countAsCopyOfDbfId != null ? String(card.countAsCopyOfDbfId) : null,
        classes: card.classes,
        puzzleType: card.puzzleType != null ? String(card.puzzleType) : null,
        multiClassGroup: card.multiClassGroup,
        isMiniSet: card.isMiniSet,
        mercenariesAbilityCooldown: card.mercenariesAbilityCooldown,
        questReward: card.questReward,
        cardMeta: card,
    };
}
