import { Request, Response, NextFunction } from 'express'
import * as joi from 'joi'
import logger from '../log/Logger'
import * as boom from 'boom'


const enum ReqPart {
    body = 'body',
    query = 'query'
}
export const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            if (!err.isBoom) {
                return next(boom.badImplementation(err))
            }
            return next(err)
        })
    }
}

export function validateBody(req: Request, schema: joi.ObjectSchema, next: NextFunction) {
    const { error } = joi.validate(req.body, schema)
    return validate(error, req, next, ReqPart.body)
}

export function validateQueryParams(req: Request, schema: joi.ObjectSchema, next: NextFunction) {
    const { error } = joi.validate(req.query, schema)
    return validate(error, req, next, ReqPart.query)
}

function validate(error: joi.ValidationError, req: Request, next: NextFunction, reqPart: ReqPart) {
    if (error) {
        logger.log('warn', `${reqPart.toString().toUpperCase()} params validation failure for operation ${toRestCallString(req)}. Error message: ${error.message}`)
        return next(boom.badRequest(error.message))
    } else {
        return next()
    }
}

export function toRestCallString(req: Request) {
    return req.method + ' ' + req.baseUrl + req.path
}