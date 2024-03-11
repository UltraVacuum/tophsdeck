CREATE TABLE IF NOT EXISTS "color_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"hex" text,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "color_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"rgba" jsonb,
	"hex" text,
	"hsv" text,
	"hsl" text,
	"a" real,
	"info" bigint,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "colors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"hex" text,
	"rgb" jsonb,
	"hsv" jsonb,
	"hsl" jsonb,
	"alpha" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page_colors" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_title" text,
	"page_url" text,
	"page_hid" text,
	"page_colors" jsonb,
	"page_counts" bigint,
	"pres_colors" jsonb,
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
