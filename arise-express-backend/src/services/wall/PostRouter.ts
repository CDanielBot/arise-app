import { Router } from 'express'
import PostService from './PostService'
import ReactionRouter from '../reaction/ReactionRouter'
import CommentRouter from '../comment/CommentRouter'
import { asyncMiddleware } from '../Helper'
import Auth from '../../Auth'
import PostValidator from './PostValidator'

const service: PostService = new PostService()
const validator: PostValidator = new PostValidator()

const router: Router = Router()
/* URL: /api/v1/posts */
router.get('/', Auth.optional, validator.load, asyncMiddleware(service.loadContent))
router.get('/:PostId', Auth.required, asyncMiddleware(service.getPostById))

/* URL: /api/v1/posts/:PostId/... */
router.use('/:PostId/reactions', ReactionRouter)
router.use('/:PostId/comments', CommentRouter)

export default router