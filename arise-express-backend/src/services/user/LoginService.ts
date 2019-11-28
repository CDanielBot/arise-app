import { Request, Response, NextFunction } from 'express'
import Errors from '../Errors'
import UserCrud from './UserCrud'
import { UserCredentials } from './User'
import Auth from '../../Auth'
import * as boom from 'boom'
import logger from '../../log/Logger'
import { verifyPassword } from './PasswordUtil'

export default class LoginService {

    private crud: UserCrud

    constructor() {
        this.crud = new UserCrud()
    }

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        const credential: UserCredentials = req.body
        logger.log('info', `Logging in user with email ${credential.Email}`)
        const user = await this.crud.findUserByEmail(credential.Email)
        if (!user) {
            logger.log('warn', `Could not log in user ${credential.Email} as it could not be found in the database`)
            return next(boom.badRequest(Errors.authMissingUser))
        }
        const isMatch = verifyPassword(credential.Password, user.Password)
        if (!isMatch) {
            logger.log('warn', `Could not log in user ${credential.Email} as the provided password does not match with the one in the database`)
            return next(boom.badRequest(Errors.authWrongPassword))
        }
        if (!user.FirebaseUid) {
            logger.log('error', `Failed to find firebase uid for user ${user.UserId}`)
            return next(boom.badImplementation(Errors.userMissingFirebaseUid))
        }
        const token = await Auth.generateToken(user.FirebaseUid)
        logger.log('info', `User ${credential.Email} logged in successfully. New authorization token generated: ${token}`)
        return res.status(200).set('Authorization', `Bearer ${token}`).json({
            data: {
                User: user,
                AccessToken: {
                    Value: token,
                    Type: 'Bearer'
                }
            }
        })
    }

}