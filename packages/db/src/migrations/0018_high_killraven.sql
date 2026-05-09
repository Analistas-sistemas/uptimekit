CREATE TABLE IF NOT EXISTS "monitor_notification" (
	"monitor_id" text NOT NULL,
	"integration_config_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monitor_notification_monitor_id_integration_config_id_pk" PRIMARY KEY("monitor_id","integration_config_id")
);
--> statement-breakpoint
ALTER TABLE "apikey" DROP CONSTRAINT IF EXISTS "apikey_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "apikey_userId_idx";--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN IF NOT EXISTS "config_id" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN IF NOT EXISTS "organization_id" text;--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'apikey'
			AND column_name = 'user_id'
	) THEN
		UPDATE "apikey"
		SET "organization_id" = (
			SELECT "member"."organization_id"
			FROM "member"
			WHERE "member"."user_id" = "apikey"."user_id"
			ORDER BY "member"."created_at" ASC
			LIMIT 1
		)
		WHERE "apikey"."organization_id" IS NULL;
	END IF;
END $$;--> statement-breakpoint
ALTER TABLE "apikey" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integration_config" ADD COLUMN IF NOT EXISTS "name" text;--> statement-breakpoint
UPDATE "integration_config"
SET "name" = CASE
	WHEN "type" = 'webhook' THEN 'Webhook'
	WHEN "type" = 'discord' THEN 'Discord'
	WHEN "type" = 'telegram' THEN 'Telegram'
	WHEN "type" = 'alertmanager' THEN 'Prometheus AlertManager'
	ELSE "type"
END
WHERE "name" IS NULL;--> statement-breakpoint
ALTER TABLE "integration_config" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integration_config" ADD COLUMN IF NOT EXISTS "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "monitor_notification" DROP CONSTRAINT IF EXISTS "monitor_notification_monitor_id_monitor_id_fk";--> statement-breakpoint
ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_notification" DROP CONSTRAINT IF EXISTS "monitor_notification_integration_config_id_integration_config_id_fk";--> statement-breakpoint
ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_integration_config_id_integration_config_id_fk" FOREIGN KEY ("integration_config_id") REFERENCES "public"."integration_config"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apikey" DROP CONSTRAINT IF EXISTS "apikey_organization_id_organization_id_fk";--> statement-breakpoint
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "monitor_notification_monitor_idx" ON "monitor_notification" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "monitor_notification_config_idx" ON "monitor_notification" USING btree ("integration_config_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_configId_idx" ON "apikey" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_organizationId_idx" ON "apikey" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "apikey" DROP COLUMN IF EXISTS "user_id";
