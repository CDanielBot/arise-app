import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'
import { ReactionType } from './Reaction'

export default class ReactionValidator {

    public add(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            UserId: joi.number().required(),
            RelatedPostId: joi.number().optional(),
            UserFullName: joi.string().required(),
            ReactionType: joi.string().required().valid(ReactionType.like, ReactionType.pray)
        })
        return validateBody(req, schema, next)
    }

}