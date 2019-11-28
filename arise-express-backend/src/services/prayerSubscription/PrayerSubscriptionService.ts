import { Request, Response } from 'express'
import PrayerSubscriptionCrud from './PrayerSubscriptionCrud'
import PrayerSubscription from './PrayerSubscription'
import logger from '../../log/Logger'
import * as sanitizer from '../Sanitizer'

export default class PrayerSubscriptionService {

    private crud: PrayerSubscriptionCrud = new PrayerSubscriptionCrud()

    public getSubscriptionsForUser = async (req: Request, res: Response) => {
        const userId = req.params.UserId
        logger.log('info', `Retrieving prayer subscriptions for user ${userId}`)
        let subscriptions: Array<PrayerSubscription> = await this.crud.getPrayerSubscriptions(userId)
        subscriptions = sanitizer.sanitizeArray(subscriptions, this.sanitize)
        logger.log('info', `Prayer subscriptions retrieved with succes for user ${userId}`)
        res.json({ data: { PrayerSubscriptions: subscriptions } })
    }

    private sanitize(subscription: PrayerSubscription): PrayerSubscription {
        subscription.PrayerContent = sanitizer.sanitizeHtmlText(subscription.PrayerContent)
        return subscription
    }

    public userUnsubscribeFromPrayer = async (req: Request, res: Response) => {
        const userId = req.params.UserId
        const subscriptionId = req.params.SubscriptionId
        logger.log('info', `Unsubscribing user ${userId} from prayer subscription ${subscriptionId}`)
        const deletedRows: number = await this.crud.deletePrayerSubscription(subscriptionId)
        if (deletedRows !== 1) {
            logger.log('warn', `${deletedRows} database rows were deleted when unsubscribng user ${userId} from prayer subsription ${subscriptionId}`)
        } else {
            logger.log('info', `User ${userId} unsubscribed successfully from prayer subscription ${subscriptionId}`)
        }
        res.status(200).send({ data: { UnsubscribedNo: deletedRows } })
    }

    public deletePrayerSubscriptions(prayerId: number): Promise<number> {
        return this.crud.deleteSubscriptionsForPrayer(prayerId)
    }

}