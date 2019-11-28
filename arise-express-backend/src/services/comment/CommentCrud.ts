import DbPool from '../../db/DatabasePool'
import { count, Counter, findFirst } from '../../db/DbHelper'
import Comment, { CommentVisibility, UpdateCommentReq, CommentCrudEntity } from './Comment'
import logger from '../../log/Logger'

const COLUMNS = 'CommentId, Name, UserId, RelatedPostId, RelatedCommentId, Comment, Visibility,  CreationDate'

export default class CommentCrud {

    public async countCommentsForPost(postId: number): Promise<number> {
        if (!postId) {
            logger.log('warn', 'Counting comments for post with undefined postId.')
            return Promise.resolve(0)
        }
        const requests: Array<Counter> = await DbPool.query('SELECT count(CommentId) as Counter \
                                             FROM Comments \
                                             WHERE RelatedPostId = ? \
                                             AND Visiblity = ? ', [postId, CommentVisibility.Visible])
        return count(requests)
    }

    public async findCommentsForPost(postId: number): Promise<Array<Comment>> {
        if (!postId) {
            logger.log('warn', 'Searching comments for post with undefined postId.')
            return Promise.resolve([])
        }
        const requests: Array<Comment> = await DbPool.query('SELECT ' + COLUMNS + ' \
                                             FROM Comments \
                                             WHERE RelatedPostId = ? \
                                             AND Visibility = ? \
                                             ORDER BY CreationDate', [postId, CommentVisibility.Visible])
        return requests
    }

    public async findCommentsForUser(userId: number): Promise<Array<Comment>> {
        if (!userId) {
            return Promise.resolve([])
        }
        const requests: Array<Comment> = await DbPool.query('SELECT ' + COLUMNS + ' \
                                             FROM Comments \
                                             WHERE UserId = ? \
                                             AND Visibility = ? \
                                             ORDER BY CreationDate', [userId, CommentVisibility.Visible])
        return requests
    }

    public async findCommentById(commentId: number): Promise<Comment> {
        if (!commentId) {
            logger.log('warn', 'Searching comment by undefined commentId.')
            return Promise.resolve(undefined)
        }
        const requests: Array<Comment> = await DbPool.query('SELECT ' + COLUMNS + ' \
                            FROM Comments \
                            WHERE CommentId = ? \
                            AND Visibility = ? ', [commentId, CommentVisibility.Visible])
        return findFirst(requests)
    }

    public async addComment(comment: CommentCrudEntity): Promise<number> {
        return DbPool.insert('Comments', comment)
    }

    public async updateComment(comment: UpdateCommentReq, commentId: number): Promise<number> {
        return DbPool.update('Comments', comment, { column: 'CommentId', value: commentId })
    }

    public async updateCommentsForUser(username: string, userId: number): Promise<number> {
        return DbPool.update('Comments', { Name: username }, { column: 'UserId', value: userId })
    }

    public async makeCommentNotVisible(commentId: number): Promise<number> {
        return DbPool.update('Comments',
            { Visibility: CommentVisibility.NotVisible },
            { column: 'CommentId', value: commentId })
    }

}