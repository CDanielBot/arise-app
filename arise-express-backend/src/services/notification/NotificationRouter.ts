import { Router } from 'express'
import NotificationService from './NotificationService'
import NotificationValidator from './NotificationValidator'
import Auth from '../../Auth'
import { authorizeByUserId } from '../../Authz'
import { authorizeUpdate } from './NotificationAuthz'
import { asyncMiddleware } from '../Helper'

const service: NotificationService = new NotificationService()
const validator: NotificationValidator = new NotificationValidator()

const router: Router = Router({ mergeParams: true })
/* User notifications: /users/:UserId/notifications */
router.get('/', Auth.required, authorizeByUserId, asyncMiddleware(service.getNotifications))
router.get('/countUnseen', Auth.required, authorizeByUserId, asyncMiddleware(service.countUnseenNotifications))
router.put('/seen', Auth.required, validator.update, authorizeUpdate, asyncMiddleware(service.updateNotificationsAsSeen))

export default router