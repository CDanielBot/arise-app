import { Request, Response, NextFunction } from 'express'
import PostCrud from './PostCrud'
import { WallPost, Limit, PostType } from './Post'
import ReactionCrud from '../reaction/ReactionCrud'
import { ReactionCrudEntity } from '../reaction/Reaction'
import logger from '../../log/Logger'
import * as sanitizer from '../Sanitizer'
import Errors from '../Errors'
import * as boom from 'boom'
import postsCache from './PostCache'
import User from '../user/User'

export default class PostService {

    private crud: PostCrud = new PostCrud()
    private reactionCrud: ReactionCrud = new ReactionCrud()

    public getPostById = async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.PostId
        const user = res.locals.user as User

        logger.log('info', `Retrieving post with id ${postId}`)
        const dbPost = await this.crud.findWallPostById(postId)
        if (!dbPost) {
            logger.log('warn', `Failed to find post with id ${postId}`)
            return next(boom.badRequest(Errors.postNotFound))
        }
        try {
            logger.log('info', `Sanitizing post with id ${postId}`)
            let wallPost = this.sanitize(dbPost)
            logger.log('info', `Post with id ${postId} sanitized with success`)
            logger.log('info', `Loading user reactions for post ${wallPost.PostId}`)
            wallPost = (await this.loadUserReactions([wallPost], user.UserId))[0]
            return res.json({ data: { Post: wallPost } })
        } catch (error) {
            logger.log('warn', `Failed to sanitize post with id ${dbPost.PostId} and content: ${dbPost.Post}`)
            throw error
        }
    }

    public loadContent = async (req: Request, res: Response) => {
        const userId = req.query.userId
        const limit: Limit = {
            BatchSize: req.query.batchSize ? Number.parseInt(req.query.batchSize) : 10,
            LastLoadedPostId: req.query.lastLoadedPostId ? Number.parseInt(req.query.lastLoadedPostId) : -1
        }
        logger.log('info', `Loading wall content for user ${userId ? userId : 'anonymous'}`, limit)
        const dbWallPosts: Array<WallPost> = await postsCache.get(limit, () => this.crud.loadContent(limit))
        let wallPosts = this.filterPostsFailingSanitization(dbWallPosts)
        wallPosts = this.filterPostsWithBadFormat(wallPosts)
        if (wallPosts.length > 0 && userId) {
            // userId is null for anonymous users
            logger.log('info', `Loading user reactions for user ${userId} wall content`)
            wallPosts = await this.loadUserReactions(wallPosts, userId)
        }

        let logMsg = `Content loaded successfully for user ${userId ? userId : 'anonymous'}.`
        const skippedPosts = dbWallPosts.length - wallPosts.length
        if (skippedPosts > 0) {
            logMsg += `${skippedPosts} elements were skipped as they could not be sanitized properly`
        }
        logger.log('info', logMsg)
        return res.json({ data: { Posts: wallPosts, SkippedPosts: skippedPosts } })
    }

    private filterPostsFailingSanitization(wallPosts: Array<WallPost>): Array<WallPost> {
        return sanitizer.sanitizeArray(wallPosts, this.sanitize)
    }

    private sanitize(wallPost: WallPost): WallPost {
        if (wallPost.Type == PostType.Image || wallPost.Type == PostType.Video) {
            wallPost.Post = undefined
            if (wallPost.Type == PostType.Video) {
                wallPost.VideoUrl = sanitizer.sanitizeVideo(wallPost.VideoUrl)
            }
        } else {
            wallPost.Post = sanitizer.sanitizeHtmlText(wallPost.Post)
        }
        return wallPost
    }

    private filterPostsWithBadFormat(wallPosts: Array<WallPost>): Array<WallPost> {
        return wallPosts.filter(wallPost => {
            if (wallPost.Type == PostType.Video) {
                return wallPost.VideoUrl && wallPost.VideoUrl.length > 0
            } else if (wallPost.Type == PostType.Image) {
                return wallPost.ImageUrl && wallPost.ImageUrl.length > 0
            } else {
                return wallPost.Post && wallPost.Post.length > 0
            }
        })
    }

    private loadUserReactions = async (content: Array<WallPost>, userId: number): Promise<Array<WallPost>> => {
        const reactions: Array<ReactionCrudEntity> = await this.reactionCrud.findReactionsByUserId(userId)

        return content.map((wallPost) => {
            const reaction = reactions.find((reaction) => {
                return reaction.RelatedPostId === wallPost.PostId
            })
            if (reaction) {
                wallPost.UserReaction = reaction.Reaction
                wallPost.UserReactionId = reaction.ReactionId
            }

            return wallPost
        })
    }



}