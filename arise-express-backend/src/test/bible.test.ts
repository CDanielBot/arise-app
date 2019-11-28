import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)

describe('Bible', () => {

    const baseUrl: string = '/api/v1/bible'

    it('should fetch vdcc bible versions', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ version: 'vdcc' })
            .set('authorization', authToken())
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Bible).to.be.a('array')
                expect(res.body.data.Bible.length).to.be.greaterThan(30000)
                done()
            })
    })

    it('should return 400 error when bible version is not supported', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ version: 'bva' })
            .set('authorization', authToken())
            .end((err, res) => {
                expect(res.status).to.be.equal(400)
                expect(res.body.data).to.not.exist
                expect(res.body.error).to.exist
                expect(res.body.error.message).to.exist
                done()
            })
    })

})