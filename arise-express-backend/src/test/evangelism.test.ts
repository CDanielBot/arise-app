import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)

describe('Evangelism requests', () => {

    const baseUrl: string = '/api/v1/users/171/evangelismRequests'

    describe('GET', () => {
        it('should retrieve evangelism requests for a specific user', (done) => {
            chai.request(server)
                .get(baseUrl)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).not.to.exist
                    expect(res.body.data.EvangelismRequests).to.be.a('array')
                    done()
                })
        })

        it('should count evangelism requests', (done) => {
            chai.request(server)
                .get('/api/v1/evangelismRequests/count')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).not.to.exist
                    expect(res.body.data.Counter).to.be.a('number')
                    expect(res.body.data.Counter).to.be.greaterThan(0)
                    done()
                })
        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .get('/api/v1/users//evangelismRequests')
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

    describe('POST', () => {
        it('should create new evangelism request for a specific user', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    ApplicantName: 'DanielBot',
                    ApplicantEmail: 'daniel@arctec.com',
                    ApplicantPhone: '+40768470127'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.EvangelismRequest.Id).to.be.a('number')
                    expect(res.body.data.EvangelismRequest.ApplicantName).to.be.equal('DanielBot')
                    done()
                })
        })

        it('anonymous user should be able to create evangelism request', (done) => {
            chai.request(server)
                .post('/api/v1/evangelismRequests/anonymous')
                .set('content-type', 'application/json')
                .send({
                    ApplicantName: 'VladCrisan',
                    ApplicantEmail: 'vlad@arctec.com',
                    ApplicantPhone: '+40768470127'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.EvangelismRequest.Id).to.be.a('number')
                    expect(res.body.data.EvangelismRequest.UserId).to.be.equal(0)
                    expect(res.body.data.EvangelismRequest.ApplicantName).to.be.equal('VladCrisan')
                    done()
                })
        })

        it('should return error when missing email', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    ApplicantName: 'DanielBot',
                    ApplicantPhone: '+40768470127'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .post('/api/v1/users//evangelismRequests')
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    UserId: 5831,
                    ApplicantName: 'DanielBot',
                    ApplicantPhone: '+40768470127'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })
    })

    describe('DELETE', () => {
        it('should delete a specific evangelism request', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/68`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Deleted).to.be.true
                    done()
                })
        })

        it('should not delete evangelism request belonging to other user', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/67`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return unauthorized when missing auth token', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/68`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401)
                    done()
                })
        })
    })

})