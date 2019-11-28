import * as moment from 'moment'

export function findFirst<T>(results: Array<T>): Promise<T> {
    return Promise.resolve(results.length > 0 ? results[0] : undefined)
}

export function count(results: Array<Counter>): Promise<number> {
    return Promise.resolve(results ? results[0].Counter : 0)
}

export function toMysqlDateFormat(date: Date): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}
export interface Counter {
    Counter: number
}