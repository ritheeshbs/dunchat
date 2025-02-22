import { pgTable,text, timestamp,  } from 'drizzle-orm/pg-core'
import { nanoid } from '@/utils/nanoid'

export const users = pgTable('users',{
    id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
    userName:text('user_name').unique().notNull(),
    email:text('email').unique().notNull(),
    passwordHash:text('password_hash').notNull(),
    createdAt:timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;