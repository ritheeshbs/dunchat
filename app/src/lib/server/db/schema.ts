import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

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

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
