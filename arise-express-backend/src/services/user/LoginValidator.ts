import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'

export default class LoginValidator {

    public login(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            Email: joi.string().email().required(),
            Password: joi.string().required()
        })
        return validateBody(req, schema, next)
    }

}