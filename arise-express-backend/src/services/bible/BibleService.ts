import { Request, Response } from 'express'
import logger from '../../log/Logger'
import * as fs from 'fs'
import * as path from 'path'
import { BibleVersion } from './Bible'

export default class BibleService {

    public getBibleVersion = async (req: Request, res: Response) => {
        const version = req.query.version as BibleVersion
        logger.log('info', `Fetching bible version: ${version}`)
        const filePath = path.join(__dirname, '..', '..', '..', 'assets', 'bible-versions', `${version}.json`)
        fs.readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                logger.log('error', `Failed to find bible version ${version}. Stacktrace: ${error.stack}`)
                res.status(500).send(`Failed to find bible version ${version}`)
            } else {
                res.json({ data: { Bible: JSON.parse(data) } })
                logger.log('info', `Bible version ${version} fetched with success`)
            }
        })

    }
}