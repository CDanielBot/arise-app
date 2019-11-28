import { Request, Response, NextFunction } from 'express'
import { toRestCallString } from './services/Helper'
import UserCrud from './services/user/UserCrud'
import logger from './log/Logger'
import * as admin from 'firebase-admin'
import * as boom from 'boom'

class Auth {

    private userCrud: UserCrud = new UserCrud()

    public required = async (req: Request, res: Response, next: NextFunction) => {
        const token = this.getTokenFromHeaders(req)
        if (!token) {
            logger.log('info', `Authentication: could not find authorization header for call ${toRestCallString(req)}`)
            return next(boom.unauthorized('Missing token for authentication'))
        } else {
            const decodedToken = await admin.auth().verifyIdToken(token)
            if (!decodedToken) {
                logger.log('info', `Authentication: wrong authorization header passed for call ${toRestCallString(req)}`)
                return next(boom.unauthorized('Wrong token for authentication'))
            } else {
                logger.log('info', `FirebaseUID ${decodedToken.uid}`)
                const user = await this.userCrud.findUserByFirebaseUid(decodedToken.uid)
                res.locals.user = user
                return next()
            }
        }
    }

    public optional(req: Request, res: Response, next: NextFunction) {
        return next()
    }

    public generateToken = async (userUid: string): Promise<string> => {
        const token = await admin.auth().createCustomToken(userUid)
        return token
    }

    private getTokenFromHeaders = (req: Request) => {
        const authorization = req.headers.authorization
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1]
        }
        return undefined
    }

}

export default new Auth()
