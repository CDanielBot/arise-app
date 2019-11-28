import DbPool from '../../db/DatabasePool'
import Notification, { PeerToPeerCrudNotification, SeenType, BroadcastCrudNotification, NotificationId, NotificationType } from './Notification'
import { count, Counter } from '../../db/DbHelper'

export default class NotificationCrud {

    public async countUnseenNotificationsForUser(userId: number): Promise<number> {
        const peerToPeerCount = await this.countPeerToPeerNotifications(userId)
        const broadcastCount = await this.coundBroadcastNotifications(userId)
        return peerToPeerCount + broadcastCount
    }

    private async countPeerToPeerNotifications(userId: number): Promise<number> {
        const requests: Array<Counter> = await DbPool.query('SELECT count(NotificationId) AS Counter\
                                                    FROM Notifications \
                                                    WHERE TargetUserId = ? \
                                                    AND Seen = ? ', [userId, SeenType.Unseen])

        return count(requests)
    }

    private async coundBroadcastNotifications(userId: number): Promise<number> {
        const requests: Array<Counter> = await DbPool.query('SELECT count(N.NotificationId) AS Counter\
                                                    FROM NotificationsBroadcast N \
                                                    LEFT JOIN Users U ON U.UserId = ? \
                                                    WHERE N.CreationDate > U.CreationDate AND \
                                                          NotificationId NOT IN ( \
                                                            SELECT NotificationId \
                                                            FROM NotificationsBroadcastSeen \
                                                            WHERE UserId = ? \
                                                    )', [userId, userId])

        return count(requests)
    }

    public async updateNotificationsAsSeen(notificationIds: Array<NotificationId>, userId: number): Promise<number> {
        const peerToPeerNotifications = notificationIds.filter((notification) => {
            return notification.Type == NotificationType.PeerToPeer
        })

        const broadcastNotifications = notificationIds.filter((notification) => {
            return notification.Type == NotificationType.Broadcast
        })

        const peerToPeerUpdated = await this.updatePeerToPeerNotificationAsSeen(peerToPeerNotifications)
        const broadcastUpdated = await this.updateBroadcastNotificationAsSeen(broadcastNotifications, userId)
        return peerToPeerUpdated + broadcastUpdated
    }

    private async updatePeerToPeerNotificationAsSeen(notificationIds: Array<NotificationId>): Promise<number> {
        const ids = notificationIds.map(notificationId => notificationId.Id)
        return DbPool.update('Notifications', { Seen: SeenType.Seen }, { column: 'NotificationId', value: ids })
    }

    private async updateBroadcastNotificationAsSeen(notificationIds: Array<NotificationId>, userId: number): Promise<number> {
        const records = notificationIds.map((notification) => {
            return { NotificationId: notification.Id, UserId: userId }
        })
        return DbPool.insertBulk('NotificationsBroadcastSeen', records)
    }

    public async getNotificationsForUser(userId: number) {
        const peerToPeerNotifications: Array<Notification> = await this.getPeerToPeerNotificationsForUser(userId)
        const broadcastNotifications: Array<Notification> = await this.getBroadcastNotificationsForUser(userId)
        return peerToPeerNotifications
            .concat(broadcastNotifications)
            .sort((a, b) => b.CreationDate.getTime() - a.CreationDate.getTime())
    }

    private async getPeerToPeerNotificationsForUser(userId: number): Promise<Array<Notification>> {
        const requests: Array<Notification> = await DbPool.query(`SELECT N.NotificationId, N.TargetUserId, N.RelatedPostId, N.Action,
                                            N.Seen, N.CreationDate, N.UserId as ActionMakerUserId, concat(U.FirstName, ' ', U.LastName) as ActionMakerUsername,
                                            '${NotificationType.PeerToPeer}' as Type
                                            FROM Notifications N
                                            LEFT JOIN Users U ON N.UserId = U.UserId
                                            WHERE N.TargetUserId = ?
                                            ORDER BY N.CreationDate DESC`, [userId])
        return requests
    }

    private async getBroadcastNotificationsForUser(userId: number): Promise<Array<Notification>> {
        const requests: Array<Notification> = await DbPool.query(`SELECT N.NotificationId, N.RelatedPostId, N.Action, N.CreationDate, \n
                                            CASE WHEN S.NotificationId IS NULL THEN ${SeenType.Unseen} ELSE ${SeenType.Seen} END AS Seen, \n
                                            U.UserId as ActionMakerUserId, U.Fullname as ActionMakerUsername, \n
                                            '${NotificationType.Broadcast}' as Type \n
                                            FROM NotificationsBroadcast N \n
                                            LEFT JOIN Users UO ON UO.UserId = ? \n
                                            LEFT JOIN (SELECT UserId, CONCAT(FirstName, ' ', LastName) as Fullname FROM Users WHERE UserId = 1) U on true \n
                                            LEFT JOIN (SELECT * FROM NotificationsBroadcastSeen WHERE UserId = ?) S ON N.NotificationId = S.NotificationId \n
                                            WHERE N.CreationDate > UO.CreationDate \n
                                            ORDER BY N.CreationDate DESC`, [userId, userId])
        // WHERE N.CreationDate > UO.CreationDate - this condition avoids loading broadcast notifications created before user existance.
        return requests
    }

    public async addPeerToPeerNotification(notification: PeerToPeerCrudNotification): Promise<number> {
        return DbPool.insert('Notifications', notification)
    }

    public async addBroadcastNotification(notification: BroadcastCrudNotification): Promise<number> {
        return DbPool.insert('NotificationsBroadcast', notification)
    }

    public deleteNotificationsForPrayer = async (prayerId: number) => {
        return DbPool.delete('Notifications', { column: 'RelatedPostId', value: prayerId })
    }

}