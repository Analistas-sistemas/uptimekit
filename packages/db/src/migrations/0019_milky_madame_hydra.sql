CREATE TABLE IF NOT EXISTS "status_page_email_subscribers" (
	"email" text NOT NULL,
	"status_page_id" text NOT NULL,
	"slack_webhook_url" text,
	"discord_webhook_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "status_page_email_subscribers_status_page_id_email_pk" PRIMARY KEY("status_page_id","email"),
	CONSTRAINT "status_page_email_subscribers_status_page_id_status_page_id_fk" FOREIGN KEY ("status_page_id") REFERENCES "public"."status_page"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
ALTER TABLE "status_page_email_subscribers" ADD COLUMN IF NOT EXISTS "slack_webhook_url" text;--> statement-breakpoint
ALTER TABLE "status_page_email_subscribers" ADD COLUMN IF NOT EXISTS "discord_webhook_url" text;--> statement-breakpoint
DO $$
DECLARE
	current_pk_name text;
	current_pk_columns text[];
BEGIN
	SELECT
		constraint_name,
		array_agg(column_name ORDER BY ordinal_position)
	INTO current_pk_name, current_pk_columns
	FROM information_schema.key_column_usage
	WHERE table_schema = 'public'
		AND table_name = 'status_page_email_subscribers'
		AND constraint_name IN (
			SELECT constraint_name
			FROM information_schema.table_constraints
			WHERE table_schema = 'public'
				AND table_name = 'status_page_email_subscribers'
				AND constraint_type = 'PRIMARY KEY'
		)
	GROUP BY constraint_name;

	IF current_pk_columns IS DISTINCT FROM ARRAY['status_page_id', 'email'] THEN
		IF current_pk_name IS NOT NULL THEN
			EXECUTE format(
				'ALTER TABLE "status_page_email_subscribers" DROP CONSTRAINT %I',
				current_pk_name
			);
		END IF;

		ALTER TABLE "status_page_email_subscribers"
			ADD CONSTRAINT "status_page_email_subscribers_status_page_id_email_pk"
			PRIMARY KEY("status_page_id","email");
	END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM information_schema.table_constraints
		WHERE table_schema = 'public'
			AND table_name = 'status_page_email_subscribers'
			AND constraint_name = 'status_page_email_subscribers_status_page_id_status_page_id_fk'
	) THEN
		ALTER TABLE "status_page_email_subscribers"
			ADD CONSTRAINT "status_page_email_subscribers_status_page_id_status_page_id_fk"
			FOREIGN KEY ("status_page_id") REFERENCES "public"."status_page"("id")
			ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_page_email_subscribers_page_id_idx" ON "status_page_email_subscribers" USING btree ("status_page_id");
