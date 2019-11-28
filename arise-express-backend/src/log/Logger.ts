import * as winston from 'winston'
import { config } from '../config/config'

const errorStackFormat = winston.format(info => {
    if (info instanceof Error) {
        return Object.assign({}, info, {
            stack: info.stack,
            message: info.message
        })
    }
    return info
})

const logger = winston.createLogger({
    level: config.isProd ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        errorStackFormat(),
        winston.format.json()
    ),
    transports: [
        // - Write all logs error (and below) to `error.log`.
        // - Write to all logs with level `info` and below to combined.log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})

if (!config.isProd) {
    logger.add(new winston.transports.Console())
}

export default logger