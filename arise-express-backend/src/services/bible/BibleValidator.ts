import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateQueryParams } from '../Helper'
import { BibleVersion } from './Bible'

export default class BibleValidator {

    public get(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            version: joi.string().required().valid((<any>Object).values(BibleVersion))
        })
        return validateQueryParams(req, schema, next)
    }
}