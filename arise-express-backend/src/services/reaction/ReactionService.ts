import { Request, Response } from 'express'
import ReactionCrud from './ReactionCrud'
import Reaction from './Reaction'
import NotificationService from '../notification/NotificationService'
import logger from '../../log/Logger'

export default class ReactionService {

    private crud: ReactionCrud = new ReactionCrud()
    private notificationService: NotificationService = new NotificationService()

    public getReactions = async (req: Request, res: Response) => {
        const postId = req.params.PostId
        logger.log('info', `Loading reactions for post ${postId}`)
        const reactionCrudEntities = await this.crud.findReactionsByPostIds([postId])
        const reactions = reactionCrudEntities.map(reactionCrudEntity => new Reaction(reactionCrudEntity))
        logger.log('info', `Reactions loaded successfully for post ${postId}`)
        res.json({ data: { Reactions: reactions } })
    }

    public addReaction = async (req: Request, res: Response) => {
        const postId = req.params.PostId
        const reaction: Reaction = new Reaction(req.body)
        reaction.RelatedPostId = postId
        logger.log('info', `Adding new reaction to post ${postId}`, reaction)
        const reactionId = await this.crud.createReaction(reaction.toCrudEntity())
        const newReactionEntity = await this.crud.findReactionById(reactionId)
        const newReaction = new Reaction(newReactionEntity)
        try {
            logger.log('info', `Creating new notification for reaction ${reactionId} added to post ${postId} by user ${newReaction.UserId}`)
            this.notificationService.createNotificationForReaction(newReaction)
        } catch (error) {
            logger.log('error', `Could not create notification for new reaction ${reactionId} and post ${postId}`, error)
        }
        logger.log('info', `Reaction ${reactionId} added with success for post ${postId}`)
        res.json({ data: { Reaction: newReaction } })
    }

    public deleteReaction = async (req: Request, res: Response) => {
        const postId = req.params.PostId
        const reactionId = req.params.ReactionId
        logger.log('info', `Removing reaction ${reactionId} from post ${postId}`)
        const deletedRows = await this.crud.deleteReaction(reactionId)
        if (deletedRows !== 1) {
            logger.log('warn', `${deletedRows} database rows were deleted when deleting reaction ${reactionId} from post ${postId}`)
        } else {
            logger.log('info', `Reaction ${reactionId} deleted successfully from post ${postId}`)
        }
        res.status(200).send({ data: { Deleted: deletedRows > 0 } })
    }

}