import DbPool from '../../db/DatabasePool'
import { ReactionCrudEntity } from './Reaction'
import { findFirst } from '../../db/DbHelper'

const COLUMNS = 'ReactionId, UserId, RelatedPostId, RelatedPostTable, Name, Reaction'

export default class ReactionCrud {

    public createReaction(reaction: ReactionCrudEntity): Promise<number> {
        return DbPool.insert('Reactions', reaction)
    }

    public deleteReaction(reactionId: number): Promise<number> {
        return DbPool.delete('Reactions', { column: 'ReactionId', value: reactionId })
    }

    public async findReactionById(reactionId: number): Promise<ReactionCrudEntity> {
        const reactions: Array<ReactionCrudEntity> = await DbPool.query('SELECT ' + COLUMNS + ' \
                                                                    FROM Reactions \
                                                                    WHERE ReactionId = ?', [reactionId])
        return findFirst(reactions)
    }

    public findReactionsByUserId(userId: number): Promise<Array<ReactionCrudEntity>> {
        return DbPool.query('SELECT ' + COLUMNS + ' \
                            FROM Reactions \
                            WHERE UserId = ?', [userId])
    }

    public findReactionsByPostIds(postIds: Array<number>): Promise<Array<ReactionCrudEntity>> {
        return DbPool.query('SELECT ' + COLUMNS + ' \
                            FROM Reactions \
                            WHERE RelatedPostId IN (?)', [postIds])
    }

    public updateReactionsForUser(username: string, userId: number): Promise<number> {
        return DbPool.update('Reactions', { Name: username }, { column: 'UserId', value: userId })
    }

}