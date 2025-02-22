import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import * as bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, InsertUser } from "@/db/schema";
import { validatePassword } from "@/utils/validate-password";
import { handleError } from "@/utils/error";

const usersGroup = new Hono();

// Login 
usersGroup.post('/register', async(c) => {
    try {
        const { userName, email, password } = await c.req.json()
        
        if (!userName || !email || !password) {
            return c.json({ 
                error: 'Validation Error',
                details: 'Missing required fields',
                status: 400
            })
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return c.json({ 
                error: 'Validation Error',
                details: 'Invalid email format',
                status: 400
            })
        }

        if (!validatePassword(password)) {
            return c.json({ 
                error: 'Validation Error',
                details: 'Password requirements not met',
                status: 400
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        
        const existingUser = await db
            .query
            .users
            .findFirst({
                where: eq(users.email, email)
            })
    

        if(existingUser) {
            return c.json({ 
                error: 'Registration Error',
                details: 'Email already exists',
                status: 409
            })
        }

        const userData: InsertUser = {
            userName,
            email,
            passwordHash
        }

         await db.insert(users)
            .values(userData)
            .returning()

        return c.json({
            message: 'User registered successfully',
            status:201
        });
    } catch (error) {
        handleError(error)
    }
})

// 
usersGroup.post('/login', async(c) => {
    try {
        const { email, password } = await c.req.json()

        if (!email || !password) {
            return c.json({ 
                error: 'Validation Error',
                details: 'Missing credentials',
                status: 400
            })
        }

        const user = await db
            .query
            .users
            .findFirst({
                where: eq(users.email, email),
                columns: {
                    id: true,
                    userName: true,
                    email: true,
                    passwordHash: true,
                }
            })
        
        if (!user) {
            return c.json({ 
                error: 'Authentication Error',
                details: 'Invalid email or password',
                status: 401
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPassword) {
            return c.json({ 
                error: 'Authentication Error',
                details: 'Invalid email or password',
                status: 401
            }) 
        }

        const token = await sign({ id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.JWT_SECRET!)

        return c.json({
            message: 'Login successful',
            token,
            status: 200
        })
    } catch (error) {
        handleError(error)
    }
})

export default usersGroup