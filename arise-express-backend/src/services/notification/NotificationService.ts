import { Request, Response, NextFunction } from 'express'
import Reaction, { ReactionType } from '../reaction/Reaction'
import Comment from '../comment/Comment'
import CommentCrud from '../comment/CommentCrud'
import NotificationCrud from './NotificationCrud'
import Notification, { PeerToPeerNotificationType, NotificationType, NotificationId } from './Notification'
import PostCrud from '../wall/PostCrud'
import { Post } from '../wall/Post'
import logger from '../../log/Logger'
import { SeenType } from './Notification'

export default class NotificationService {

    private crud: NotificationCrud = new NotificationCrud()
    private commentCrud: CommentCrud = new CommentCrud()
    private postCrud: PostCrud = new PostCrud()

    public countUnseenNotifications = async (req: Request, res: Response) => {
        const userId = req.params.UserId
        logger.log('info', `Counting notifications for user ${userId}`)
        const counter: number = await this.crud.countUnseenNotificationsForUser(userId)
        logger.log('info', `Notifications counted with succes for user ${userId}`)
        res.json({ data: { Counter: counter } })
    }

    public updateNotificationsAsSeen = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.UserId
        const notificationIds: Array<NotificationId> = req.body.NotificationIds
        logger.log('info', `Marking notifications ${JSON.stringify(notificationIds)} as seen for user ${userId}`)
        const totalUpdated = await this.crud.updateNotificationsAsSeen(notificationIds, userId)
        if (totalUpdated !== notificationIds.length) {
            logger.log('warn', `There were ${totalUpdated} database rows updated when marking ${notificationIds.length} notifications as seen ${JSON.stringify(notificationIds)}.`)
        } else {
            logger.log('info', `${totalUpdated} notifications ${JSON.stringify(notificationIds)} updated with succes`)
        }
        return res.status(200).json({ data: { Updated: totalUpdated > 0 } })
    }

    public getNotifications = async (req: Request, res: Response) => {
        const userId: number = req.params.UserId
        const notifications = await this.crud.getNotificationsForUser(userId)
        const seenNotifications: Array<Notification> = notifications.filter((notification: Notification) => {
            return notification.Seen === SeenType.Seen
        })
        const unseenNotifications: Array<Notification> = notifications.filter((notification: Notification) => {
            return notification.Seen === SeenType.Unseen
        })
        logger.log('info', `Notifications retrieved with succes for user ${userId}`)
        res.json({ data: { Seen: seenNotifications, Unseen: unseenNotifications } })
    }

    public createNotificationForComment = async (comment: Comment) => {
        const post: Post = await this.postCrud.findPostById(comment.RelatedPostId)
        if (!post) {
            logger.log('warn', `Could not find post with id ${comment.RelatedPostId}`)
            return
        }
        if (post.UserId !== comment.UserId) {
            const notification: Notification = new Notification({
                Type: NotificationType.PeerToPeer,
                ActionMakerUserId: comment.UserId,
                ActionMakerUsername: comment.Name,
                TargetUserId: post.UserId,
                RelatedPostId: post.PostId,
                RelatedEntityId: comment.CommentId,
                Action: PeerToPeerNotificationType.Comment
            })
            this.createNotification(notification)
        }
        if (comment.RelatedCommentId !== 0) {
            const relatedComment: Comment = await this.commentCrud.findCommentById(comment.RelatedCommentId)
            const notification: Notification = new Notification({
                Type: NotificationType.PeerToPeer,
                ActionMakerUserId: comment.UserId,
                ActionMakerUsername: comment.Name,
                TargetUserId: relatedComment.UserId,
                RelatedPostId: post.PostId,
                RelatedEntityId: comment.CommentId,
                Action: PeerToPeerNotificationType.Reply
            })
            this.createNotification(notification)
        }
    }

    public createNotificationForReaction = async (reaction: Reaction) => {
        const post: Post = await this.postCrud.findPostById(reaction.RelatedPostId)
        if (post.UserId === reaction.UserId) {
            logger.log('info', `User ${reaction.UserId} liked his own post ${reaction.RelatedPostId}. Not going to create a notification`)
            return Promise.resolve()
        } else {
            const notification: Notification = new Notification({
                Type: NotificationType.PeerToPeer,
                ActionMakerUserId: reaction.UserId,
                ActionMakerUsername: reaction.UserFullName,
                TargetUserId: post.UserId,
                RelatedPostId: post.PostId,
                RelatedEntityId: reaction.ReactionId,
                Action: reaction.ReactionType == ReactionType.like ? PeerToPeerNotificationType.Like : PeerToPeerNotificationType.Pray
            })
            return this.createNotification(notification)
        }
    }

    public deleteNotificationsForPrayer = async (prayerId: number): Promise<number> => {
        return this.crud.deleteNotificationsForPrayer(prayerId)
    }

    private createNotification = async (notification: Notification): Promise<number> => {
        let notificationId: number
        if (notification.Type == NotificationType.PeerToPeer) {
            notificationId = await this.crud.addPeerToPeerNotification(notification.toPeerToPeerNotification())
        } else {
            notificationId = await this.crud.addBroadcastNotification(notification.toBroadcastNotification())
        }

        logger.log('info', `Notification ${notificationId} created with succes`)
        return Promise.resolve(notificationId)
    }

}