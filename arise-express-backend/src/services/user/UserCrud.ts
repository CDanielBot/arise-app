
import DbPool from '../../db/DatabasePool'
import { findFirst } from '../../db/DbHelper'
import User, { UpdateUserReq } from './User'

const COLUMNS = `UserId, FirstName, LastName, Mobile, Email, Password, Description,
                 concat(FirstName, ' ', LastName) AS User, Type, Language, Country, FirebaseUid`

export default class UserCrud {

    public async loadUsers(): Promise<Array<any>> {
        return DbPool.query('SELECT ' + COLUMNS + ' FROM Users')
    }

    public async findUserById(userId: number): Promise<User> {
        if (!userId) {
            return Promise.resolve(undefined)
        }
        const users = await DbPool.query('SELECT ' + COLUMNS + ' FROM Users WHERE UserId = ?', [userId])
        return findFirst(users)
    }

    public async findUserByEmail(email: string): Promise<User> {
        if (!email) {
            return Promise.resolve(undefined)
        }
        const users = await DbPool.query('SELECT ' + COLUMNS + ' FROM Users WHERE Email = ? ', [email])
        return findFirst(users)
    }

    public async findUserByFirebaseUid(firebaseUid: string): Promise<User> {
        if (!firebaseUid) {
            return Promise.resolve(undefined)
        }
        const users = await DbPool.query('SELECT ' + COLUMNS + ' FROM Users WHERE FirebaseUid = ? ', [firebaseUid])
        return findFirst(users)
    }

    public createUser(user: User): Promise<number> {
        return DbPool.insert('Users', user)
    }

    public updateUser(user: UpdateUserReq, userId: number): Promise<number> {
        return DbPool.update('Users', user, { column: 'UserId', value: userId })
    }

    public updatePassword(newPasswordHashed: string, userId: number): Promise<number> {
        return DbPool.update('Users', { Password: newPasswordHashed }, { column: 'UserId', value: userId })
    }

}