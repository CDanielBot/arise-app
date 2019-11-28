import { Request, Response, NextFunction } from 'express'
import CommentCrud from './CommentCrud'
import Comment from './Comment'
import { authorizeReq } from '../../Authz'

const crud: CommentCrud = new CommentCrud()

export function authorize(req: Request, res: Response, next: NextFunction) {
    authorizeReq(req, res, next, async (userId: number, req: Request) => {
        const commentId = Number.parseInt(req.params.CommentId)
        const comments: Array<Comment> = await crud.findCommentsForUser(userId)
        const prayerRequest = comments.find((comment) => {
            return comment.CommentId === commentId
        })
        return prayerRequest ? true : false
    })
}