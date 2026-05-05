CREATE TABLE "monitor_notification" (
	"monitor_id" text NOT NULL,
	"integration_config_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monitor_notification_monitor_id_integration_config_id_pk" PRIMARY KEY("monitor_id","integration_config_id")
);
--> statement-breakpoint
ALTER TABLE "apikey" DROP CONSTRAINT "apikey_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "apikey_userId_idx";--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "config_id" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "integration_config" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "integration_config" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_integration_config_id_integration_config_id_fk" FOREIGN KEY ("integration_config_id") REFERENCES "public"."integration_config"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "monitor_notification_monitor_idx" ON "monitor_notification" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "monitor_notification_config_idx" ON "monitor_notification" USING btree ("integration_config_id");--> statement-breakpoint
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "apikey_configId_idx" ON "apikey" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "apikey_organizationId_idx" ON "apikey" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "apikey" DROP COLUMN "user_id";