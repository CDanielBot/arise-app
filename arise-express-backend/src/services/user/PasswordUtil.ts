import * as bcrypt from 'bcrypt-nodejs'
import logger from '../../log/Logger'

export function verifyPassword(passwordInClear: string, userPasswordInDatabase: string) {
    try {
        const passwordHashNodejs = phpToNodejsFormat(userPasswordInDatabase)
        return bcrypt.compareSync(passwordInClear, passwordHashNodejs)
    } catch (error) {
        logger.log('warn', 'Passwords to compare do not follow format')
        return false
    }
}

// keep password in synch, so both node backend and php backend bcrypt algorithm work fine.
// Node uses $2a$ prefix, while php uses $2y$
export function toPhpFormatPassword(passwordInClear: string) {
    const hashedPassword = bcrypt.hashSync(passwordInClear)
    return hashedPassword.replace('$2a$', '$2y$')
}

function phpToNodejsFormat(userPasswordInDatabase: string) {
    return userPasswordInDatabase.replace(/^\$2y(.+)$/i, '$2a$1')
}
