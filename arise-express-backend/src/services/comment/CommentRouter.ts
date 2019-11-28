import { Router } from 'express'
import CommentService from './CommentService'
import CommentValidator from './CommentValidator'
import { authorize } from './CommentAuthz'
import Auth from '../../Auth'
import { asyncMiddleware } from '../Helper'

const service: CommentService = new CommentService()

const router: Router = Router({ mergeParams: true })
// Comments for posts: /posts/:PostId/comments
router.get('/', Auth.optional, asyncMiddleware(service.getComments))
router.post('/', Auth.required, CommentValidator.add, asyncMiddleware(service.addComment))


// Comments for users: /users/:UserId/comments
router.put('/:CommentId', Auth.required, authorize, CommentValidator.update, asyncMiddleware(service.updateComment))
router.delete('/:CommentId', Auth.required, authorize, asyncMiddleware(service.deleteComment))

export default router