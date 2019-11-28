import { Router } from 'express'
import PrayerSubscriptionService from './PrayerSubscriptionService'
import Auth from '../../Auth'
import { authorizeByUserId } from '../../Authz'
import { asyncMiddleware } from '../Helper'

const service: PrayerSubscriptionService = new PrayerSubscriptionService()

const router: Router = Router({ mergeParams: true })
/* User prayer subscription: /users/:UserId/prayerSubscriptions */
router.get('/', Auth.required, authorizeByUserId, asyncMiddleware(service.getSubscriptionsForUser))
router.delete('/:SubscriptionId', Auth.required, asyncMiddleware(service.userUnsubscribeFromPrayer))

export default router