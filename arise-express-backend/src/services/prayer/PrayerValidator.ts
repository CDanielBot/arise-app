import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'

 class PrayerValidator {

    public add(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            Title: joi.string().optional(),
            Description: joi.string().optional(),
            Post: joi.string().required(),
        })
        return validateBody(req, schema, next)
    }

    public update(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            Title: joi.string().optional(),
            Description: joi.string().optional(),
            Post: joi.string().optional(),
        })
        return validateBody(req, schema, next)
    }

}

export default new PrayerValidator()