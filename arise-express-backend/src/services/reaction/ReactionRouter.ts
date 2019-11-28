import { Router } from 'express'
import ReactionService from './ReactionService'
import ReactionValidator from './ReactionValidator'
import Auth from '../../Auth'
import { asyncMiddleware } from '../Helper'

const service: ReactionService = new ReactionService()
const validator: ReactionValidator = new ReactionValidator()

const router: Router = Router({ mergeParams: true })
/* Reactions to wall posts: /posts/:PostId/reactions */
router.get('/', Auth.required, asyncMiddleware(service.getReactions))
router.post('/', Auth.required, validator.add, asyncMiddleware(service.addReaction))
router.delete('/:ReactionId', Auth.required, asyncMiddleware(service.deleteReaction))

export default router