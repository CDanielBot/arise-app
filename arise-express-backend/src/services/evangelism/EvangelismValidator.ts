import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'

export default class EvangelismValidator {

    public add(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            ApplicantName: joi.string().required(),
            ApplicantEmail: joi.string().email().required(),
            ApplicantPhone: joi.string().required(),
            Name: joi.string().optional(),
            Phone: joi.string().optional(),
            Email: joi.string().email().optional(),
        })
        return validateBody(req, schema, next)
    }

}