import { Request, Response, NextFunction } from 'express'
import EvangelismCrud from './EvangelismCrud'
import EvangelismRequest from './EvangelismRequest'
import { authorizeReq } from '../../Authz'

const crud: EvangelismCrud = new EvangelismCrud()

export function authorize(req: Request, res: Response, next: NextFunction) {
    authorizeReq(req, res, next, async (userId: number, req: Request) => {
        const evangelismReqId = Number.parseInt(req.params.EvangelismRequestId)
        const evangelismReqs: Array<EvangelismRequest> = await crud.findRequestsByUserId(userId)
        const userEvangelismReq = evangelismReqs.find((evangelismReq) => {
            return evangelismReq.Id === evangelismReqId
        })
        return userEvangelismReq ? true : false
    })
}