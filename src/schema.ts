import { sql } from "drizzle-orm";
import {
    integer,
    bigint,
    real,
    pgTable,
    serial,
    text,
    uuid,
    jsonb,
    timestamp
} from 'drizzle-orm/pg-core';

const basicColumn = {
    created_at: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updated_at: timestamp('updated_at', {
        withTimezone: true
    }).defaultNow(),
}

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: text('email'),
    user_meta: jsonb('user_meta'),
    ...basicColumn
});

export const colors = pgTable('colors', {
    id: uuid('id').primaryKey(),
    hex: text('hex'),
    rgb: jsonb('rgb'),
    hsv: jsonb('hsv'),
    hsl: jsonb('hsl'),
    alpha: text('alpha'),
    ...basicColumn
});

export const page_colors = pgTable('page_colors', {
    id: serial('id').primaryKey(),
    // .default(sql`nextval('table_id_seq'::regclass)`),
    page_title: text('page_title'),
    page_url: text('page_url'),
    page_hid: text('page_hid'),
    page_colors: jsonb('page_colors'),
    page_counts: bigint('page_counts', { mode: 'number' }),
    pres_colors: jsonb('pres_colors'),
    user_id: uuid('user_id').references(() => users.id),
    ...basicColumn
});

export const color_info = pgTable('color_info', {
    id: serial('id').primaryKey(),
    // .default(sql`nextval('table_id_seq'::regclass)`),
    hex: text('hex'),
    name: text('name'),
    ...basicColumn
})

// TODO: remove
export const color_sets = pgTable('color_sets', {
    id: serial('id').primaryKey(),
    // .default(sql`nextval('table_id_seq'::regclass)`),
    rgba: jsonb('rgba'),
    hex: text('hex'),
    hsv: text('hsv'),
    hsl: text('hsl'),
    alpha: real('a'),
    info: bigint('info', { mode: 'number' }),
    ...basicColumn
})
