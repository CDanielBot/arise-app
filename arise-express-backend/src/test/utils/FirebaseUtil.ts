import * as firebase from 'firebase'
import * as admin from 'firebase-admin'

export function initializeClientSdk() {
    const config = {
        apiKey: 'AIzaSyBK1z22i51mGwUbkCidK_H9AaNP2UQ_EUI',
        authDomain: 'pray-for-evangelism-test.firebaseapp.com',
        databaseURL: 'https://pray-for-evangelism-test.firebaseio.com',
        projectId: 'pray-for-evangelism-test',
        storageBucket: 'pray-for-evangelism-test.appspot.com',
        messagingSenderId: '190051776535'
    }
    firebase.initializeApp(config)
}

export async function signInWithEmail(email: string): Promise<string> {
    const firebaseUid = await getFirebaseUid(email)
    return signIn(firebaseUid)
}

export async function signIn(firebaseUid: string): Promise<string> {
    // recreated sign in logic that happends between backend and mobile app
    const token = await admin.auth().createCustomToken(firebaseUid)
    await firebase.auth().signInWithCustomToken(token)
    const idToken = await firebase.auth().currentUser.getIdToken(true)
    return idToken
}

export async function createFirebaseUser(email: string, password: string): Promise<admin.auth.UserRecord> {
    const createFirebaseUserReq: admin.auth.CreateRequest = {
        displayName: 'Daniel Bot',
        email: email,
        emailVerified: true,
        disabled: false,
        password: password
    }
    const firebaseUser: admin.auth.UserRecord = await admin.auth().createUser(createFirebaseUserReq)
    return firebaseUser
}

export async function getFirebaseUid(email: string): Promise<string> {
    const user = await admin.auth().getUserByEmail(email)
    return user ? user.uid : undefined
}

export function deleteAllUsers() {
    return admin.auth().listUsers(1000, undefined)
        .then(function (listUsersResult) {
            const deleteUserPromises = listUsersResult.users.map((userRecord) => {
                return admin.auth().deleteUser(userRecord.uid)
            })
            return Promise.all(deleteUserPromises)
        })
        .catch(function (error) {
            console.log('Error deleting all users:', error)
            return Promise.reject(error)
        })
}