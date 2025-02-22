import { relations } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export const roles = pgEnum('role', ['admin', 'member']);

export const users = pgTable('users', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	age: integer('age'),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const usersRelations = relations(users, ({ many }) => ({
	workspaces: many(workspaces),
	workspaceMembers: many(workspaceMembers),
	workspaceInvitations: many(workspaceInvitations),
}));

export const sessions = pgTable('sessions', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const workspaces = pgTable('workspaces', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id]
	}),
	members: many(workspaceMembers),
	invitations: many(workspaceInvitations)
}));

export const workspaceMembers = pgTable('workspace_members', {
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaces.id),
	userId: text('user_id').notNull().references(() => users.id),
	role: roles('role').notNull().default('member'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [workspaceMembers.workspaceId],
		references: [workspaces.id]
	}),
	user: one(users, { fields: [workspaceMembers.userId], references: [users.id] })
}));

export const workspaceInvitations = pgTable('workspace_invitations', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaces.id),
	inviterId: text('inviter_id').notNull().references(() => users.id),
	inviteeEmail: text('invitee_email').notNull(),
	role: roles('role').notNull().default('member'),
	token: text('token').$defaultFn(() => nanoid(21)).notNull().unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	acceptedAt: timestamp('accepted_at', { withTimezone: true, mode: 'date' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const workspaceInvitationsRelations = relations(workspaceInvitations, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [workspaceInvitations.workspaceId],
		references: [workspaces.id]
	}),
	inviter: one(users, { fields: [workspaceInvitations.inviterId], references: [users.id] })
}));


export const feeds = pgTable('feeds', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaces.id),
	title: text('title').notNull(),
	content: text('content'),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const feedsRelations = relations(feeds, ({ many, one }) => ({
	comments: many(feedComments),
	workspace: one(workspaces, {
		fields: [feeds.workspaceId],
		references: [workspaces.id]
	}),
	author: one(users, {
		fields: [feeds.authorId],
		references: [users.id]
	})
}));

export const feedComments = pgTable('feed_comments', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	feedId: text('feed_id')
		.notNull()
		.references(() => feeds.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const feedCommentsRelations = relations(feedComments, ({ one, many }) => ({
	feed: one(feeds, {
		fields: [feedComments.feedId],
		references: [feeds.id]
	}),
	author: one(users, {
		fields: [feedComments.authorId],
		references: [users.id]
	}),
	replies: many(feedComments)
}));

export type Session = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceInsert = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type WorkspaceMemberInsert = typeof workspaceMembers.$inferInsert;
export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type WorkspaceInvitationInsert = typeof workspaceInvitations.$inferInsert;
export type Feed = typeof feeds.$inferSelect;
export type FeedInsert = typeof feeds.$inferInsert;
export type FeedComment = typeof feedComments.$inferSelect;
export type FeedCommentInsert = typeof feedComments.$inferInsert;
