enum Errors {
    authMissingUser = 'auth/no-account-found',
    authWrongPassword = 'auth/wrong-password',
    userMissingFirebaseUid = 'user/missing-firebase-uid',
    userNotFound = 'user/not-found',
    postNotFound = 'post/not-found',
    userFirebaseNotFound = 'user/firebase-user-not-found',
    notificationNoIds = 'notification/no-valid-user-ids-provided',
    htmlInjection = 'content/invalid-due-to-html-injection'
}

export default Errors