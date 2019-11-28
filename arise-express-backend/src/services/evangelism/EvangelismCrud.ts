import DbPool from '../../db/DatabasePool'
import EvangelismRequest from './EvangelismRequest'
import { count, Counter, findFirst } from '../../db/DbHelper'

const COLUMNS = 'EvangelismRequestsId AS Id, UserId, ApplicantName, ApplicantPhone, ApplicantEmail, Name, Email, Phone, CreationDate'

export default class EvangelismCrud {

    public async findRequestsByUserId(userId: number): Promise<Array<EvangelismRequest>> {
        const requests = await DbPool.query('SELECT ' + COLUMNS + ' \
                                             FROM EvangelismRequests \
                                             WHERE UserId = ? \
                                             ORDER BY CreationDate DESC', [userId])
        return requests
    }

    public async findRequestById(evangelismRequestId: number): Promise<EvangelismRequest> {
        const requests: Array<EvangelismRequest> = await DbPool.query('SELECT ' + COLUMNS + ' \
                                                FROM EvangelismRequests \
                                                WHERE EvangelismRequestsId = ? ', [evangelismRequestId])
        return findFirst(requests)
    }

    public async countAllEvangelismRequests(): Promise<number> {
        const requests: Array<Counter> = await DbPool.query('SELECT count(EvangelismRequestsId) AS Counter\
                                                             FROM EvangelismRequests')
        return count(requests)
    }

    public async addEvangelismRequest(evangelismRequest: EvangelismRequest): Promise<number> {
        return DbPool.insert('EvangelismRequests', evangelismRequest)
    }

    public deleteEvangelismRequest(evangelismRequestId: number): Promise<number> {
        return DbPool.delete('EvangelismRequests', { column: 'EvangelismRequestsId', value: evangelismRequestId })
    }

}