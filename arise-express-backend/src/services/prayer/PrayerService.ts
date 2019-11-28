import { Request, Response, NextFunction } from 'express'
import PrayerCrud from './PrayerCrud'
import Prayer, { UserPrayerReq } from './Prayer'
import logger from '../../log/Logger'
import prayerEvents from './PrayerEvents'
import postCacheEvents from '../wall/PostCacheEvents'
import Errors from '../Errors'
import * as sanitizer from '../Sanitizer'
import * as boom from 'boom'
import { ReactionCrudEntity } from '../reaction/Reaction'
import ReactionCrud from '../reaction/ReactionCrud'

export default class PrayerService {
  private crud: PrayerCrud = new PrayerCrud()
  private reactionCrud: ReactionCrud = new ReactionCrud()

  public getPrayerRequests = async (req: Request, res: Response) => {
    const userId = req.params.UserId
    logger.log('info', `Retrieving prayer requests for user ${userId}`)
    let prayers: Array<Prayer> = await this.crud.findPrayersByUserId(userId)
    prayers = sanitizer.sanitizeArray(prayers, this.sanitize)
    prayers = await this.loadUserReactions(prayers, userId)
    logger.log('info', `Prayer requests retrieved with success for user ${userId}`)
    res.json({ data: { PrayerRequests: prayers } })
  }

  public addPrayerRequest = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.UserId
    let prayer: Prayer = new Prayer(req.body)
    prayer.UserId = userId
    logger.log('info', `Adding new prayer request for user ${userId}`, prayer)
    try {
      prayer = this.sanitize(prayer)
    } catch (error) {
      logger.log('error', `Failed to sanitize prayer content before saving into database`, prayer)
      return next(boom.badRequest(Errors.htmlInjection))
    }
    const newPrayerId = await this.crud.addPrayer(prayer.toCrudEntity())
    prayer.Id = newPrayerId
    postCacheEvents.triggerInvalidateLatest()
    logger.log('info', `Prayer request ${newPrayerId} added with succes for user ${userId}`)
    return res.json({ data: { PrayerRequest: prayer } })
  }

  private sanitize(prayer: Prayer): Prayer {
    prayer.Post = sanitizer.sanitizeHtmlText(prayer.Post)
    return prayer
  }

  public deletePrayerRequest = async (req: Request, res: Response, next: NextFunction) => {
    const prayerId = req.params.PrayerId
    logger.log('info', `Deleting prayer ${prayerId}`)
    const updatedNo = await this.crud.makePrayerNotVisible(prayerId)
    if (updatedNo !== 1) {
      logger.log(
        'warn',
        `${updatedNo} database rows were updated when marking prayer request ${prayerId} as not visible.`
      )
    } else {
      logger.log('info', `Prayer request ${prayerId} marked as not visible.`)
    }
    prayerEvents.emitDeletePrayerEvent({ prayerId: prayerId })
    return res.json({ data: { Deleted: updatedNo > 0 } })
  }

  public updatePrayerRequest = async (req: Request, res: Response, next: NextFunction) => {
    const prayerId = req.params.PrayerId
    const prayerRequest: UserPrayerReq = req.body
    logger.log('info', `Updating prayer request ${prayerId}`, prayerRequest)
    const updatedNo = await this.crud.updatePrayer(prayerRequest, prayerId)
    if (updatedNo !== 1) {
      logger.log(
        'warn',
        `${updatedNo} database rows were updated when updating prayer request ${prayerId}.`
      )
    } else {
      logger.log('info', `Prayer request ${prayerId} updated with succes.`)
    }
    return res.json({ data: { Updated: updatedNo > 0 } })
  }

  private loadUserReactions = async (
    content: Array<Prayer>,
    userId: number
  ): Promise<Array<Prayer>> => {
    const reactions: Array<ReactionCrudEntity> = await this.reactionCrud.findReactionsByUserId(
      userId
    )

    return content.map(prayer => {
      const reaction = reactions.find(reaction => {
        return reaction.RelatedPostId === prayer.Id
      })
      if (reaction) {
        prayer.UserReaction = reaction.Reaction
        prayer.UserReactionId = <any>reaction.ReactionId
      }

      return prayer
    })
  }
}
