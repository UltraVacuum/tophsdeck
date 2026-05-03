CREATE TABLE IF NOT EXISTS "cards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"dbfId" varchar,
	"cardClass" varchar,
	"cardMeta" jsonb,
	"attack" integer,
	"health" integer,
	"armor" integer,
	"heroPowerDbfId" varchar,
	"set" varchar,
	"type" varchar,
	"artist" varchar,
	"rarity" varchar,
	"cost" integer,
	"faction" varchar,
	"collectible" boolean,
	"flavor" text,
	"spellSchool" varchar,
	"text" text,
	"mechanics" jsonb,
	"race" varchar,
	"races" jsonb,
	"referencedTags" jsonb,
	"elite" boolean,
	"targetingArrowText" text,
	"durability" integer,
	"overload" integer,
	"spellDamage" integer,
	"battlegroundsPremiumDbfId" varchar,
	"techLevel" integer,
	"hasDiamondSkin" boolean,
	"howToEarnGolden" text,
	"howToEarn" text,
	"collectionText" text,
	"hideCost" boolean,
	"hideStats" boolean,
	"mercenariesRole" integer,
	"isBattlegroundsPoolMinion" boolean,
	"battlegroundsNormalDbfId" varchar,
	"battlegroundsBuddyDbfId" varchar,
	"battlegroundsHero" boolean,
	"isBattlegroundsBuddy" boolean,
	"battlegroundsSkinParentId" varchar,
	"battlegroundsDarkmoonPrizeTurn" varchar,
	"countAsCopyOfDbfId" varchar,
	"classes" jsonb,
	"puzzleType" varchar,
	"multiClassGroup" varchar,
	"isMiniSet" boolean,
	"mercenariesAbilityCooldown" integer,
	"questReward" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "decks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"deck_meta" jsonb,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"user_meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
