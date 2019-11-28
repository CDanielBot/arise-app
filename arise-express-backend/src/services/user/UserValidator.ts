import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'
import { Language, UserType } from './User'

export default class UserValidator {

    public add(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().keys({
            Email: joi.string().email().required(),
            Password: joi.string().required(),
            FirstName: joi.string().required(),
            LastName: joi.string().required(),
            Language: joi.string().optional().valid(Language.RO, Language.EN),
            Type: joi.number().optional().valid(UserType.Admin, UserType.Evangelist, UserType.PrayerTeam, UserType.User),
        })
        return validateBody(req, schema, next)
    }

    public changePassword(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            OldPassword: joi.string().optional(),
            NewPassword: joi.string().optional()
        })
        return validateBody(req, schema, next)
    }

    public update(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            FirstName: joi.string().optional(),
            LastName: joi.string().optional(),
            Mobile: joi.string().optional(),
            Description: joi.string().optional(),
            Language: joi.string().optional().valid(Language.RO, Language.EN),
        })
        return validateBody(req, schema, next)
    }

    public register(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().keys({
            Email: joi.string().email().required(),
            FirstName: joi.string().optional(),
            LastName: joi.string().optional()
        })
        return validateBody(req, schema, next)
    }

}