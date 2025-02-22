ALTER TABLE "feed_labels" DROP CONSTRAINT "feed_labels_feed_id_feeds_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_labels" DROP COLUMN "feed_id";