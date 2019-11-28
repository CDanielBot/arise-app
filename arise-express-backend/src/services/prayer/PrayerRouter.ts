import { Router } from 'express'
import PrayerService from './PrayerService'
import PrayerValidator from './PrayerValidator'
import { authorize } from './PrayerAuthz'
import { authorizeByUserId } from '../../Authz'
import Auth from '../../Auth'
import { asyncMiddleware } from '../Helper'

const service: PrayerService = new PrayerService()

const router: Router = Router({ mergeParams: true })
/* User prayers: /users/:UserId/prayerRequests */
router.get('/', Auth.required, authorizeByUserId, asyncMiddleware(service.getPrayerRequests))
router.post('/', Auth.required, PrayerValidator.add, asyncMiddleware(service.addPrayerRequest))
router.delete('/:PrayerId', Auth.required, authorize, asyncMiddleware(service.deletePrayerRequest))
router.put('/:PrayerId', Auth.required, authorize, PrayerValidator.update, asyncMiddleware(service.updatePrayerRequest))

export default router