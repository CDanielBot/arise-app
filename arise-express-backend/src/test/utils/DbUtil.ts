import DatabasePool from '../../db/DatabasePool'

export function deleteTables(): Promise<Array<any>> {
    return Promise.all([
        DatabasePool.query('DROP TABLE IF EXISTS Comments'),
        DatabasePool.query('DROP TABLE IF EXISTS Devices'),
        DatabasePool.query('DROP TABLE IF EXISTS EvangelismRequests'),
        DatabasePool.query('DROP TABLE IF EXISTS Notifications'),
        DatabasePool.query('DROP TABLE IF EXISTS Posts'),
        DatabasePool.query('DROP TABLE IF EXISTS Media'),
        DatabasePool.query('DROP TABLE IF EXISTS Reactions'),
        DatabasePool.query('DROP TABLE IF EXISTS Users'),
        DatabasePool.query('DROP TABLE IF EXISTS NotificationsBroadcast'),
        DatabasePool.query('DROP TABLE IF EXISTS NotificationsBroadcastSeen'),
        DatabasePool.query('DROP TABLE IF EXISTS Contacts'),
        DatabasePool.query('DROP TABLE IF EXISTS Notes'),
        DatabasePool.query('DROP TABLE IF EXISTS migrations')
    ])
}
