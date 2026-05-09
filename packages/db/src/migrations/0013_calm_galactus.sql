ALTER TABLE "monitor" ADD COLUMN IF NOT EXISTS "publish_incident_to_status_page" boolean DEFAULT false NOT NULL;
