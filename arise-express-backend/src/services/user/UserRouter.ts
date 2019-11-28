import { Router } from 'express'
import Auth from '../../Auth'
import UserService from './UserService'
import UserValidator from './UserValidator'
import LoginService from './LoginService'
import LoginValidator from './LoginValidator'
import { asyncMiddleware } from '../Helper'

import EvangelismRouter from '../evangelism/EvangelismRouter'
import PrayerRouter from '../prayer/PrayerRouter'
import NotificationRouter from '../notification/NotificationRouter'
import PrayerSubscriptionsRouter from '../prayerSubscription/PrayerSubscriptionRouter'
import CommentRouter from '../comment/CommentRouter'

const service: UserService = new UserService()
const loginService: LoginService = new LoginService()
const loginValidator: LoginValidator = new LoginValidator()
const userValidator: UserValidator = new UserValidator()

const router: Router = Router()

router.post('/login', Auth.optional, loginValidator.login, asyncMiddleware(loginService.logIn))

router.post('/', Auth.optional, userValidator.add, asyncMiddleware(service.createUser))
router.post('/:UserId/changePassword', Auth.required, userValidator.changePassword, asyncMiddleware(service.changePassword))
router.get('/:UserId', Auth.required, asyncMiddleware(service.getUser))
router.put('/:UserId', Auth.required, userValidator.update, asyncMiddleware(service.updateUser))
router.post('/register', Auth.optional, userValidator.register, asyncMiddleware(service.registerUser))

// Keep things in separate router files
router.use('/:UserId/evangelismRequests', EvangelismRouter)
router.use('/:UserId/prayerRequests', PrayerRouter)
router.use('/:UserId/prayerSubscriptions', PrayerSubscriptionsRouter)
router.use('/:UserId/notifications', NotificationRouter)
router.use('/:UserId/comments', CommentRouter)

export default router