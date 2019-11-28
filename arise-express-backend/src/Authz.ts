import { Request, Response, NextFunction } from 'express'
import { toRestCallString } from './services/Helper'
import logger from './log/Logger'
import User from './services/user/User'
import * as boom from 'boom'

export async function authorizeReq(req: Request, res: Response, next: NextFunction,
    verifyResourceOwner: (userId: number, req: Request) => Promise<boolean>) {
    if (!res.locals.user) {
        logger.log('warn', `Could not find user in locals storage when calling ${toRestCallString(req)}! You must call Authorization only for authenticated requests!`)
        return next(boom.forbidden('Cannot run request as the user is not the owner of the resource.'))
    }
    const user = res.locals.user as User
    const validOwner = await verifyResourceOwner(user.UserId, req)
    if (!validOwner) {
        logger.log('warn', `Authorization failure! Cannot call ${toRestCallString(req)}. Reason: Resource does not belong to user [${user.UserId}`)
        return next(boom.forbidden('Cannot run request as the user is not the owner of the resource.'))
    }
    return next()
}

export function authorizeByUserId(req: Request, res: Response, next: NextFunction) {
    authorizeReq(req, res, next, async (userId: number, req: Request) => {
        const userIdParam = Number.parseInt(req.params.UserId)
        return userIdParam === userId
    })
}