import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateBody } from '../Helper'

class CommentValidator {

    public add(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            UserId: joi.number().required(),
            Name: joi.string().required(),
            RelatedCommentId: joi.number().optional(),
            RelatedPostId: joi.number().optional(),
            Comment: joi.string().required(),
        })
        return validateBody(req, schema, next)
    }

    public update(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().required().keys({
            Comment: joi.string().required()
        })
        return validateBody(req, schema, next)
    }

}

export default new CommentValidator()
