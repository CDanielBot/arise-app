import DbPool from '../../db/DatabasePool'
import Prayer, { PrayerCrudEntity, UserPrayerReq } from './Prayer'
import { CommentVisibility } from '../comment/Comment'
import { PostType, PostVisibility } from '../wall/Post'

export default class PrayerCrud {
    public async findPrayersByUserId(userId: number): Promise<Array<Prayer>> {
        if (!userId) {
            return Promise.resolve([])
        }
        const requests = await DbPool.query(
            `SELECT P.PostId AS Id, P.UserId, P.CreationDate, P.Title, P.Description, P.Post, P.CreationDate,
                                            concat(U.FirstName, ' ', U.LastName) as Author,
                                            COALESCE(R.ReactionId, 0) AS UserReactionId,
                                            COALESCE(R.ReactionsCounter, 0) AS ReactionsCounter,
                                            COALESCE(C.CommentsCounter, 0) AS CommentsCounter
                                            FROM Posts AS P
                                            LEFT JOIN Users U on U.UserId = P.UserId
                                            LEFT JOIN (SELECT R.RelatedPostId, R.ReactionId, COUNT(1) AS ReactionsCounter
                                                    FROM Reactions R
                                                    GROUP BY R.RelatedPostId) AS R
                                                ON R.RelatedPostId = P.PostId
                                            LEFT JOIN (SELECT C.RelatedPostId, COUNT(1) AS CommentsCounter
                                                    FROM Comments C
                                                    WHERE C.Visibility = ?
                                                    GROUP BY C.RelatedPostId) AS C
                                                ON C.RelatedPostId = P.PostId
                                             WHERE P.UserId = ?
                                             AND P.Visibility = ?
                                             AND P.Type_Mobile = ?
                                             ORDER BY P.CreationDate DESC`, [CommentVisibility.Visible, userId, PostVisibility.Visible, PostType.Prayer])
        return requests
    }

    public async addPrayer(prayerRequest: PrayerCrudEntity): Promise<number> {
        return DbPool.insert('Posts', prayerRequest)
    }

    public async makePrayerNotVisible(prayerRequestId: number): Promise<number> {
        return DbPool.update(
            'Posts',
            { Visibility: PostVisibility.NotVisible },
            { column: 'PostId', value: prayerRequestId }
        )
    }

    public async updatePrayer(prayerRequest: UserPrayerReq, prayerId: number): Promise<number> {
        return DbPool.update('Posts', prayerRequest, { column: 'PostId', value: prayerId })
    }
}
