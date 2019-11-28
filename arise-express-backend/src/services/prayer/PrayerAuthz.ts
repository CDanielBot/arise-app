import { Request, Response, NextFunction } from 'express'
import PrayerCrud from './PrayerCrud'
import Prayer from './Prayer'
import { authorizeReq } from '../../Authz'

const crud: PrayerCrud = new PrayerCrud()

export function authorize(req: Request, res: Response, next: NextFunction) {
    authorizeReq(req, res, next, async (userId: number, req: Request) => {
        const prayerId = Number.parseInt(req.params.PrayerId)
        const userPrayers: Array<Prayer> = await crud.findPrayersByUserId(userId)
        const prayer = userPrayers.find((prayerReq) => {
            return prayerReq.Id === prayerId
        })
        return prayer ? true : false
    })
}