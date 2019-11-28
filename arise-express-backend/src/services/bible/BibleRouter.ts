import { Router } from 'express'
import BibleService from './BibleService'
import Auth from '../../Auth'
import BibleValidator from './BibleValidator'
import { asyncMiddleware } from '../Helper'

const service = new BibleService()
const validator: BibleValidator = new BibleValidator()

const router: Router = Router({ mergeParams: true })
router.get('/', Auth.optional, validator.get, asyncMiddleware(service.getBibleVersion))

export default router