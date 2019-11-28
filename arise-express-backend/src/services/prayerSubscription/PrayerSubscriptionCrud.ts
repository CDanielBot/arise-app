
import DbPool from '../../db/DatabasePool'
import PrayerSubscription from './PrayerSubscription'
import { ReactionType } from '../reaction/Reaction'
import { PostVisibility } from '../wall/Post'
import { CommentVisibility } from '../comment/Comment'

export default class PrayerSubscriptionCrud {

    public async getPrayerSubscriptions(userId: number): Promise<Array<PrayerSubscription>> {
        if (!userId) {
            return Promise.resolve([])
        }
        const subscriptions: Array<PrayerSubscription> = await DbPool.query(
            `SELECT R.ReactionId as SubscriptionId, R.UserId, R.RelatedPostId as PrayerId,
                    P.UserId as PrayerAuthorId, P.Title as PrayerTitle, P.Post as PrayerContent,
                    concat(U.FirstName, ' ', U.LastName) as Author,
                    COALESCE(RC.ReactionsCounter, 0) AS ReactionsCounter,
                    COALESCE(CC.CommentsCounter, 0) AS CommentsCounter
                FROM Reactions R
                LEFT JOIN Posts P on R.RelatedPostId = P.PostId
                LEFT JOIN Users U on U.UserId = P.UserId
                LEFT JOIN (SELECT RR.RelatedPostId, COUNT(1) AS ReactionsCounter
                            FROM Reactions RR
                            GROUP BY RR.RelatedPostId) AS RC
                    ON RC.RelatedPostId = P.PostId
                LEFT JOIN (SELECT C.RelatedPostId, COUNT(1) AS CommentsCounter
                            FROM Comments C
                            WHERE C.Visibility = ?
                            GROUP BY C.RelatedPostId) AS CC
                    ON CC.RelatedPostId = P.PostId
                WHERE R.UserId = ?
                AND R.Reaction = ?
                AND P.Visibility = ?`, [CommentVisibility.Visible, userId, ReactionType.pray, PostVisibility.Visible])
        return subscriptions
    }

    public deletePrayerSubscription(subscriptionId: number): Promise<number> {
        return DbPool.delete('Reactions', { column: 'ReactionId', value: subscriptionId })
    }

    public deleteSubscriptionsForPrayer(prayerId: number): Promise<number> {
        return DbPool.delete('Reactions', { column: 'RelatedPostId', value: prayerId })
    }
}
