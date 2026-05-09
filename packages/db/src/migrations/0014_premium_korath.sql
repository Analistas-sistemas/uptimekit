ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "active_monitor_limit" integer;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "regions_per_monitor_limit" integer;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN IF NOT EXISTS "pause_reason" text;
