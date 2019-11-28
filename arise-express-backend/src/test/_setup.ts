import { deleteAllUsers, createFirebaseUser, signIn, initializeClientSdk } from './utils/FirebaseUtil'
import * as chai from 'chai'
import chaiHttp = require('chai-http')
import store from './utils/Store'
require('custom-env').env('test')
const server = require('../server')
chai.use(chaiHttp)

const registerUser = (email: string): Promise<void> => {
    return chai.request(server)
        .post('/api/v1/users/register')
        .set('content-type', 'application/json')
        .send({
            Email: email,
            FirstName: 'Daniel',
            LastName: 'Bot'
        })
        .then(() => {
            return Promise.resolve()
        })
}

before(async function () {

    this.timeout(25000)

    try {
        initializeClientSdk()
        await deleteAllUsers()
        const firebaseUser = await createFirebaseUser('test@arctec.com', 'test.arctec')
        const token = await signIn(firebaseUser.uid)
        store.set('token', token)
        await registerUser('test@arctec.com')
        return Promise.resolve()
    } catch (error) {
        console.log('error: ' + error.message)
        return Promise.resolve()
    }
})

