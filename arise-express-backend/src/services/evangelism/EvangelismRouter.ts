import { Router } from 'express'
import EvangelismService from './EvangelismService'
import Auth from '../../Auth'
import { authorizeByUserId } from '../../Authz'
import EvangelismValidator from './EvangelismValidator'
import { asyncMiddleware } from '../Helper'
import { authorize } from './EvangelismAuthz'

const service = new EvangelismService()
const validator: EvangelismValidator = new EvangelismValidator()

const router: Router = Router({ mergeParams: true })
/* These map to /users/:UserId/evangelismRequests */
router.get('/', Auth.required, authorizeByUserId, asyncMiddleware(service.getEvangelismRequests))
router.post('/', Auth.required, validator.add, asyncMiddleware(service.addEvangelismRequest))
router.delete('/:EvangelismRequestId', Auth.required, authorize, asyncMiddleware(service.deleteEvangelismRequest))

/* This maps directly to /evangelismRequests */
router.get('/count', Auth.optional, asyncMiddleware(service.countEvangelismRequests))
router.post('/anonymous', Auth.optional, validator.add, asyncMiddleware(service.addAnonymousEvangelismRequest))

export default router