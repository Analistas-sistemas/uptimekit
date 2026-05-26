ALTER TABLE "monitor" ALTER COLUMN "timeout" SET DEFAULT 48;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "retries" integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "retry_interval" integer DEFAULT 20 NOT NULL;