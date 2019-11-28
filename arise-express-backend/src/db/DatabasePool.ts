import * as mysql from 'mysql'
import { MysqlError } from 'mysql'
import { dbConfig } from '../config/config'
import logger from '../log/Logger'

interface Filter {
    column: string,
    value: any
}

class DatabasePool {

    private mysqlPool: mysql.Pool

    public init() {
        if (!this.mysqlPool) {
            this.mysqlPool = mysql.createPool({
                acquireTimeout: dbConfig.query_timeout,
                connectionLimit: dbConfig.pool_size,
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database
            })
        }
    }

    /*
    * Run a select query
    */
    public query(sqlQuery: string, filterValues?: Array<any>): Promise<Array<any>> {
        return this.runQuery(sqlQuery, filterValues)
    }

    /*
    * Run a more complex delete query.
    * For simple delete queries (delete from one table based on a filter column), please use #delete method.
    * Returns number of deleted rows
    */
    public deleteQuery = async (sqlQuery: string, filterValues?: Array<any>): Promise<number> => {
        const { affectedRows } = await this.runQuery(sqlQuery, filterValues)
        return affectedRows
    }

    /*
    * @param valueObject: key: value mapping, where keys are DB columns
    * ex: {name: 'Ana', age: 20}
    * returns id of newly created entity
    */
    public async insert(tableName: string, valueObject: object): Promise<number> {
        const sqlQuery = `INSERT INTO ${tableName} SET ?`
        const { insertId } = await this.runQuery(sqlQuery, valueObject)
        return insertId
    }

    /*
   * @param values: Array of Objects, where each entry's key represents a DB column
   * ex: [{name: 'Ana', age: 20}, {name: 'George', age:43}]
   * returns numer of created entitites
   */
    public async insertBulk(tableName: string, values: Array<object>): Promise<number> {
        if (values.length < 1) {
            return 0
        }
        const tableColumns = Object.keys(values[0])
        const tableEntries = values.map(value => (<any>Object).values(value))
        const sqlQuery = `INSERT INTO ${tableName} (${tableColumns.join()}) VALUES ?`
        const { affectedRows } = await this.runQuery(sqlQuery, [tableEntries])
        return affectedRows
    }

    /*
    * @tableName Name of the table where update query will run
    * @param valueObject: key: value mapping, where keys are DB columns. Here you put the new values to be updated to.
    * @param filter: For filtering rows to be updated. You can pass either number, string or array value to filter
    * @returns number of affected rows
    */
    public update(tableName: string, valueObject: object, filter: Filter): Promise<number> {
        if (!filter.value || (filter.value instanceof Array && filter.value.length == 0)) {
            return Promise.resolve(0)
        }
        let query: string = `UPDATE ${tableName} SET ?`
        query = this.addFilter(filter, query)
        return this.runAffectRowsQuery(query, filter, valueObject)
    }

    /*
    * @tableName Name of the table where delete query will run
    * @param filter: For filtering rows to be deleted. You can pass either number, string or array value to filter
    * @returns number of affected rows
    */
    public delete(tableName: string, filter: Filter): Promise<number> {
        let query = `DELETE FROM ${tableName}`
        query = this.addFilter(filter, query)
        return this.runAffectRowsQuery(query, filter)
    }

    private async runAffectRowsQuery(sqlQuery: string, filter: Filter, valueObject?: object): Promise<number> {
        const queryParams: any = []
        valueObject ? queryParams.push(valueObject) : undefined
        queryParams.push(filter.value)

        const { affectedRows } = await this.runQuery(sqlQuery, queryParams)
        return affectedRows
    }

    /* Central point of running sql queries */
    private runQuery(sqlQuery: string, filterOrValueObject: any): Promise<any> {
        logger.log('debug', `Running sql query: ${sqlQuery}`)
        return new Promise<number>((resolve, reject) => {
            this.mysqlPool.query(sqlQuery, filterOrValueObject, (error: MysqlError, results) => {
                if (error) {
                    logger.log('error', `Failing sql query: ${sqlQuery}, with parameters: `, JSON.stringify(filterOrValueObject))
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
    }

    private addFilter(filter: Filter, query: string) {
        let filterQuery = query + ` WHERE ${filter.column}`
        filterQuery += filter.value instanceof Array ? ' IN (?)' : ' = ?'
        return filterQuery
    }

}

export default new DatabasePool()