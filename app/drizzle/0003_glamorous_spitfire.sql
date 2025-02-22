CREATE TABLE "feed_labels" (
	"id" text PRIMARY KEY NOT NULL,
	"feed_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"author_id" text NOT NULL,
	"label" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feed_comments" DROP CONSTRAINT "feed_comments_feed_id_feeds_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_comments" ADD COLUMN "workspace_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "feed_labels" ADD CONSTRAINT "feed_labels_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_labels" ADD CONSTRAINT "feed_labels_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_labels" ADD CONSTRAINT "feed_labels_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;