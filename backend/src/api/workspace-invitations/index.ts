import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { workspaceInvitations, workspaceMembers } from "@/db/schema";
import { authMiddleware } from "@/middleware";
import { handleError } from "@/utils/error";

const workspaceInvitationsGroup = new Hono();

// Accept invite
workspaceInvitationsGroup.post('/accept', authMiddleware, async (c) => {

    try {

        const { token, userId } = await c.req.json()
        if (!token || !userId) {
            return c.json({
                error: 'Validation Error',
                details: 'Missing required fields',
                status: 400
            })
        }

        const [invite] = await db.select()
            .from(workspaceInvitations)
            .where(
                and(
                    eq(workspaceInvitations.token, token),
                )
            )

        if (!invite) {
            return c.json({ 
                error: 'Not Found',
                details: 'Invite not found or not authorized',
                status: 404
            })
        }

        // Add user to workspace members

        await db
            .update(workspaceInvitations)
            .set({
                status: 'accepted'
            })
            .where(eq(workspaceInvitations.token, token))
        

        await db
            .insert(workspaceMembers)
            .values({
            userId: userId,
            workspaceId: invite.workspaceId,
        })


        return c.json({
            message: 'Invite accepted successfully'
        }, 200)
    } catch (error) {
        handleError(error)
    }
})

// Reject invite
workspaceInvitationsGroup.post('/reject', authMiddleware, async (c) => {
    try {
        
        const { token, userId } = await c.req.json()
        if (!token || !userId) {
            return c.json({
                error: 'Validation Error',
                details: 'Missing required fields',
                status: 400
            })
        }

        const invite = await db.select()
            .from(workspaceInvitations)
            .where(
                and(
                    eq(workspaceInvitations.id, token),
                )
            )

        if (!invite.length) {
            return c.json({ 
                error: 'Not Found',
                details: 'Invite not found or not authorized'
            }, 404)
        }

        await db
            .update(workspaceInvitations)
            .set({
                status: 'rejected' 
            })
            .where(eq(workspaceInvitations.token, token))

        return c.json({
            message: 'Invite rejected successfully'
        }, 200)
    } catch (error) {
        handleError(error)
    }
})