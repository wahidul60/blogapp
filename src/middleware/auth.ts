import { NextFunction, Request, Response } from 'express'
import { auth } from '../../src/lib/auth'
import { includes } from 'better-auth/*'

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: string,
                emailVerification: boolean
            }
        }
    }
}


const authMiddleware = (...role: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            })
            console.log(req.user)

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorised"
                });
            }

            if (!session.user.emailVerified) {
                return res.status(401).json({
                    success: false,
                    message: "Your email not verified. Please verify your email"
                })
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role as string,
                emailVerification: session.user.emailVerified
            }

            if (role.length && !role.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to this session"
                })
            }
            next()
            console.log(session)
        } catch (err) {
            next(err)
        }
    };
}


export default authMiddleware