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

export const workspaceMembers = pgTable('workspace_members', {
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaces.id),
	userId: text('user_id').notNull().references(() => users.id),
	role: roles('role').notNull().default('member'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

export const workspaceInvitations = pgTable('workspace_invitations', {
	id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaces.id),
	inviterId: text('inviter_id').notNull().references(() => users.id),
	inviteeEmail: text('invitee_email').notNull(),
	role: roles('role').notNull().default('member'),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	acceptedAt: timestamp('accepted_at', { withTimezone: true, mode: 'date' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date())
});

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
