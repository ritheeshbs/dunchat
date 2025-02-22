import { Hono } from "hono";
import { db } from "@/db";
import { workspaces, workspaceMembers, InsertWorkspace, SelectWorkspace, InsertWorkspaceInvitation, workspaceInvitations } from "@/db/schema"
import { authMiddleware } from "@/middleware/index"
import { eq } from "drizzle-orm";
import { sendEmail } from "@/utils/email";
import { handleError } from "@/utils/error";

const workspacesGroup = new Hono();

workspacesGroup.post('/', authMiddleware, async(c) => {
    try{
        const { workspaceName, slug, emails = [] } = await c.req.json()
    if(!workspaceName || !slug ) {
        return c.json({
            error: 'Validation Error',
            details: 'Missing required fields',
            status: 400
        })
    }
    const jwtPayload = c.get('jwtPayload')
    

    const existingWorkspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug.toLowerCase())
    })

    if(existingWorkspace) {
        return c.json({
            error: 'Workspace Error',
            details: 'Slug already exists',
            status: 409
        })
    }


    await db.transaction(async (trx) => {
        const workspaceData: InsertWorkspace = {
            workspaceName: workspaceName, 
            ownerId: jwtPayload.id,
            slug: slug.toLowerCase()
        };
        
        const [newWorkspace]:SelectWorkspace[] = await db.insert(workspaces)
            .values(workspaceData)
            .returning() 
    
        await db.insert(workspaceMembers).values({
            userId: jwtPayload.id,
            role: 'admin',
            workspaceId: newWorkspace.id
        })



        for(const email of emails) {

            const workspaceInvitationsData: InsertWorkspaceInvitation = {
                workspaceId: newWorkspace.id,
                invitingUserId: jwtPayload.id,
                invitedUserEmail:email
            }
            const [workspaceInvitation]= await trx
                .insert(workspaceInvitations)
                .values(workspaceInvitationsData)
                .returning()

            if(workspaceInvitation.token)
            {
                await sendEmail(
                    email,
                    'You have been invited to a workspace',
                    `You have been invited to join the workspace ${workspaceName}.`,
                    workspaceInvitation.token 
                ); 
            }
                
        }
        });
            
        return c.json({
            message: 'Workspace created successfully',
            status: 201,
        })
    }
    catch(error) {
        handleError(error)
    }
})