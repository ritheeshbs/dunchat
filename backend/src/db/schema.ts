import { pgEnum, pgTable,text, timestamp,  } from 'drizzle-orm/pg-core'
import { nanoid } from '@/utils/nanoid'


export const RoleEnum = pgEnum("role", ["admin", "member"]);
export const InviteStatusEnum = pgEnum("invite_status", ["pending", "accepted", "rejected"]);

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

export const workspaces=pgTable('workspaces',{
    id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
    workspaceName: text('workspace_name').notNull(),
    slug: text('slug').unique().notNull(),
    ownerId:text('owner_id').references(()=>users.id,{onDelete:'cascade'}).notNull(),
    createdAt:timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectWorkspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

export const workspaceMembers=pgTable('workspace_members',{
    id: text('id').$defaultFn(() => nanoid(6)).primaryKey(),
    workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(()=>users.id),
    role: RoleEnum("role").notNull().default("member"),
    joinedAt: timestamp('joined_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectWorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

export const workspaceInvitations = pgTable('workspace_invitations', {
    id: text('id').$defaultFn(() => nanoid(10)).primaryKey(),
    workspaceId: text('workspace_id').references(() => workspaces.id),
    invitingUserId: text('invited_user_id').references(() => users.id),
    invitedUserEmail: text('invited_user_email'),
    token: text('token').$default(() => nanoid(20)),
    role: RoleEnum('role').notNull().default('member'),
    status: InviteStatusEnum('status').notNull().default('pending'),
    createdAt:timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  });

export type SelectWorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type InsertWorkspaceInvitation = typeof workspaceInvitations.$inferInsert;