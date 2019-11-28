import { deleteTables } from './utils/DbUtil'

after(function (done) {
    this.timeout(15000)
    deleteTables().then(() => {
        done()
    }).catch((error) => {
        console.log('Failed to delete all database tables', error)
        done()
    })
})