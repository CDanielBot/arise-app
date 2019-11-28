import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateQueryParams } from '../Helper'

export default class PostValidator {

    public load(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            userId: joi.number().optional(),
            batchSize: joi.number().optional(),
            lastLoadedPostId: joi.number().optional()
        })
        return validateQueryParams(req, schema, next)
    }

}