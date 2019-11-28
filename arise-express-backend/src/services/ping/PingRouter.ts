import { Router, Request, Response } from 'express'

export class PingRouter {

    router: Router = Router()

    constructor() {
        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).send('Service is working fine.')
        })
    }

}

export default new PingRouter().router