import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import { validateQueryParams, validateBody } from '../Helper'
import { SeenType, NotificationType } from './Notification'

export default class NotificationValidator {

    public update(req: Request, res: Response, next: NextFunction) {
        const schema = joi.object().keys({
            NotificationIds: joi.array().required().not().empty()
                .items(joi.object().keys({
                    Id: joi.number().required(),
                    Type: joi.string().required().valid(NotificationType.Broadcast, NotificationType.PeerToPeer)
                }))
        })
        return validateBody(req, schema, next)
    }

}