import { Request, Response, NextFunction } from 'express'
import Errors from '../Errors'
import UserCrud from './UserCrud'
import User, { Language, UserType, CreateUserReq, UpdateUserReq, RegisterUserReq, ChangePasswordReq } from './User'
import * as boom from 'boom'
import * as admin from 'firebase-admin'
import logger from '../../log/Logger'
import { toPhpFormatPassword, verifyPassword } from './PasswordUtil'
import userEvents from './UserEvents'

export default class UserService {

    private crud: UserCrud = new UserCrud()

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.UserId
        logger.log('info', `Retrieving user ${userId}`)
        const user: User = await this.crud.findUserById(userId)
        if (user) {
            user.Password = ''
            logger.log('info', `User ${userId} retireved successfully.`)
            return res.json({ data: { User: user } })
        } else {
            logger.log('warn', `User ${userId} could not be found.`)
            return next(boom.badRequest(Errors.userNotFound))
        }
    }

    public createUser = async (req: Request, res: Response) => {
        const userReq: CreateUserReq = req.body
        const user: User = req.body as User
        logger.log('info', `Creating new user with email ${user.Email}`)
        const dbUser: User = await this.crud.findUserByEmail(user.Email)
        if (dbUser) {
            logger.log('warn', `Could not created new user with email ${user.Email}, as the email is already taken`)
            return res.status(409).json({ error: { message: 'Account already exists' } })
        }

        user.Language = userReq.Language || Language.RO
        user.Type = userReq.Type || UserType.User
        user.User = userReq.FirstName + ' ' + userReq.LastName
        user.Password = toPhpFormatPassword(userReq.Password)

        const userId = await this.crud.createUser(user)

        logger.log('info', `User ${user.Email} created with success in database. Firebase user with same email will be created now.`)
        const createFirebaseUserReq: admin.auth.CreateRequest = {
            displayName: user.User,
            email: user.Email,
            emailVerified: true,
            disabled: false,
            password: userReq.Password
        }

        const firebaseUser: admin.auth.UserRecord = await admin.auth().createUser(createFirebaseUserReq)
        const updateUser = {
            FirebaseUid: firebaseUser.uid
        }
        logger.log('info', `Firebase user ${firebaseUser.uid} created with success for user ${user.Email}. Database user will be updated with firebase uid now.`)
        await this.crud.updateUser(updateUser, userId)
        logger.log('info', `User ${user.Email} updated with success with firebase uid ${firebaseUser.uid}.`)
        const newUser = await this.crud.findUserById(userId)
        newUser.Password = undefined
        logger.log('info', `User ${newUser.Email} created with success into the system`)

        return res.json({ data: { User: newUser } })
    }

    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.UserId
        const passwords = req.body as ChangePasswordReq
        logger.log('info', `Changing password for user ${userId}`)
        const user = await this.crud.findUserById(userId)
        if (!user) {
            logger.log('warn', `Could not change password for user ${userId} as it not exists in the database`)
            return next(boom.badRequest(Errors.authMissingUser))
        }
        const isMatch = verifyPassword(passwords.OldPassword, user.Password)
        if (!isMatch) {
            logger.log('warn', `Could not change password for user ${userId} as the provided password does not match the one in the database`)
            return next(boom.badRequest(Errors.authWrongPassword))
        }

        await admin.auth().updateUser(user.FirebaseUid, { password: passwords.NewPassword })

        const newPassword = toPhpFormatPassword(passwords.NewPassword)
        const updatedRows = await this.crud.updatePassword(newPassword, userId)
        if (updatedRows < 1) {
            logger.log('warn', `Password not updated for user ${userId}`)
            return res.status(500)
        } else {
            logger.log('info', `Password changed successfully for user ${userId}`)
            return res.status(200).json({ data: { Updated: true } })
        }
    }

    public updateUser = async (req: Request, res: Response) => {
        const userId = req.params.UserId
        const newUser: UpdateUserReq = req.body
        logger.log('info', `Updating user ${userId}.`, newUser)
        const updatedNo = await this.crud.updateUser(newUser, userId)
        if (updatedNo !== 1) {
            logger.log('warn', `${updatedNo} rows were updated into the database when updating user ${userId}`, newUser)
        } else {
            logger.log('info', `User ${userId} updated with success.`)
        }
        if (newUser.FirstName || newUser.LastName) {
            // propagate new username event so all cached database columns may be refreshed
            const dbUser = await this.crud.findUserById(userId)
            let newUsername = newUser.FirstName ? newUser.FirstName : dbUser.FirstName
            newUsername += ' '
            newUsername += newUser.LastName ? newUser.LastName : dbUser.LastName
            userEvents.emitUpdateUserEvent({ username: newUsername, userId: userId })
        }
        return res.json({ data: { Updated: updatedNo > 0 } })
    }

    /*
     *  register a new user in db, that has a facebook or gmail account (details are stored in firebase for simplicity)
     */
    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        const registerReq: RegisterUserReq = req.body
        logger.log('info', `Registering external user into our system.`, registerReq)
        let firebaseUserRecord: admin.auth.UserRecord
        try {
            firebaseUserRecord = await admin.auth().getUserByEmail(registerReq.Email)
        } catch (error) {
            logger.log('error', `Could not register external user into our system due to: ${error.message}.`, error)
            return next(boom.badRequest(error.message))
        }

        const dbUser = await this.crud.findUserByEmail(registerReq.Email)
        if (dbUser) {
            const user: UpdateUserReq = {
                FirebaseUid: firebaseUserRecord.uid,
                FirstName: registerReq.FirstName || dbUser.FirstName,
                LastName: registerReq.LastName || dbUser.LastName,
                Mobile: dbUser.Mobile || firebaseUserRecord.phoneNumber
            }
            const updatedRows = await this.crud.updateUser(user, dbUser.UserId)
            if (updatedRows !== 1) {
                logger.log('warn', `${updatedRows} were updated when registering external user ${registerReq.Email} into the system`)
            } else {
                logger.log('info', `External user ${registerReq.Email} registered with success into the system`)
            }
            const newUser = await this.crud.findUserById(dbUser.UserId)
            newUser.Password = undefined
            return res.status(200).json({ data: { User: newUser } })
        } else {
            const user: User = {
                Email: firebaseUserRecord.email,
                Password: firebaseUserRecord.uid,
                FirstName: registerReq.FirstName,
                LastName: registerReq.LastName,
                User: registerReq.FirstName + ' ' + registerReq.LastName,
                Mobile: firebaseUserRecord.phoneNumber,
                FirebaseUid: firebaseUserRecord.uid,
                Language: Language.RO,
                Type: UserType.User
            }
            const newUserId = await this.crud.createUser(user)
            logger.log('info', `External user ${registerReq.Email} registered with success into the system`)
            const newUser = await this.crud.findUserById(newUserId)
            newUser.Password = undefined
            return res.status(201).json({ data: { User: newUser } })
        }
    }

}