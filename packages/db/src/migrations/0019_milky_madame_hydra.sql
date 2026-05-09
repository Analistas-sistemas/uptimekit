ALTER TABLE "status_page_email_subscribers" ADD COLUMN IF NOT EXISTS "slack_webhook_url" text;--> statement-breakpoint
ALTER TABLE "status_page_email_subscribers" ADD COLUMN IF NOT EXISTS "discord_webhook_url" text;
