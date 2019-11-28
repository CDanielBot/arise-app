import { Request, Response, NextFunction } from 'express'
import Notification, { NotificationId } from './Notification'
import { authorizeReq } from '../../Authz'
import NotificationCrud from './NotificationCrud'

const crud: NotificationCrud = new NotificationCrud()

export function authorizeUpdate(req: Request, res: Response, next: NextFunction) {
    authorizeReq(req, res, next, async (userId: number, req: Request) => {
        const notificationToMarkAsSeen: Array<NotificationId> = req.body.NotificationIds

        const notifications: Array<Notification> = await crud.getNotificationsForUser(userId)
        const filteredNotifications = notificationToMarkAsSeen.filter((notificationToMark) => {
            return notifications.find((notification) => notification.NotificationId === notificationToMark.Id)
        })

        return filteredNotifications.length == notificationToMarkAsSeen.length
    })
}

