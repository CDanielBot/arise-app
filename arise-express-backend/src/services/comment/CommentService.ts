import { Request, Response } from 'express'
import CommentCrud from './CommentCrud'
import Comment, { UpdateCommentReq, CommentVisibility } from './Comment'
import NotificationService from '../notification/NotificationService'
import logger from '../../log/Logger'
import Cache from '../Cache';

export default class CommentService {

    private crud: CommentCrud = new CommentCrud()
    private cache: Cache<Array<Comment>> = new Cache(60)
    private notificationService: NotificationService = new NotificationService()

    private getCacheKey(postId: number): string {
        return `CommentsForPost_${postId}`
    }

    public getComments = async (req: Request, res: Response) => {
        const postId: number = req.params.PostId
        logger.log('info', `Retrieving comments for post ${postId}`)
        const cacheKey = this.getCacheKey(postId)
        const comments: Array<Comment> = await this.cache.get(cacheKey, () => this.crud.findCommentsForPost(postId))
        logger.log('info', `Comments retrieved with succes for post ${postId}`)
        res.json({ data: { Comments: comments } })
    }

    public addComment = async (req: Request, res: Response) => {
        const postId: number = req.params.PostId
        const comment: Comment = new Comment(req.body)
        logger.log('info', `Adding new comment for post ${postId}`, comment)
        comment.RelatedPostId = postId
        comment.Visibility = CommentVisibility.Visible
        const commentId = await this.crud.addComment(comment.toCrudEntity())
        const addedComment = await this.crud.findCommentById(commentId)
        this.cache.del(this.getCacheKey(postId))
        try {
            logger.log('info', `Creating notification for new comment ${commentId}`)
            this.notificationService.createNotificationForComment(addedComment)
        } catch (error) {
            logger.log('error', `Failed to add new comment notification for comment [${commentId}] and post [${postId}]. Stacktrace: ${error.stack}`)
        }

        logger.log('info', `New comment ${commentId} added for post ${postId}`)
        res.json({ data: { Comment: addedComment } })
    }

    public updateComment = async (req: Request, res: Response) => {
        const commentId: number = req.params.CommentId
        const updateCommentReq: UpdateCommentReq = req.body
        logger.log('info', `Updating comment ${commentId}`, updateCommentReq)
        const updatedNo = await this.crud.updateComment(updateCommentReq, commentId)
        if (updatedNo !== 1) {
            logger.log('warn', `There were ${updatedNo} database rows updated when updating comment ${commentId}.`)
        } else {
            logger.log('info', `Comment ${commentId} updated with succes`)
        }
        res.json({ data: { Updated: updatedNo > 0 } })
    }

    public deleteComment = async (req: Request, res: Response) => {
        const commentId: number = req.params.CommentId
        logger.log('info', `Deleting comment ${commentId}. Comment will be made invisible to the user.`)
        const updatedNo = await this.crud.makeCommentNotVisible(commentId)
        if (updatedNo !== 1) {
            logger.log('warn', `There were ${updatedNo} database rows updated when deleting comment ${commentId}.`)
        } else {
            logger.log('info', `Comment ${commentId} deleted with succes`)
        }
        res.json({ data: { Deleted: updatedNo > 0 } })
    }

}