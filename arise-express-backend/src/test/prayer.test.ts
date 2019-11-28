import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)

describe('Prayer requests', () => {

    const baseUrl: string = '/api/v1/users/171/prayerRequests'

    describe('GET', () => {
        it('should retrieve prayer requests for a specific user', (done) => {
            chai.request(server)
                .get(baseUrl)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.data.PrayerRequests).to.be.a('array')
                    done()
                })
        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .get('/api/v1/users//prayerRequests')
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
        it('should create new prayer request for a specific user', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    Title: 'Pray for my mother',
                    Description: 'Please join in praying for my mother knee as she is suffering.',
                    Post: 'Please join in praying for my mother knee as she is suffering.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.PrayerRequest.Id).to.be.a('number')
                    expect(res.body.data.PrayerRequest.ReactionsCounter).to.be.equal(0)
                    expect(res.body.data.PrayerRequest.CommentsCounter).to.be.equal(0)
                    done()
                })
        })

        it('should return error when missing/wrong json', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    title: 'Pray for my mother',
                    description: 'Please join in praying for my mother knee as she is suffering.',
                    post: 'Please join in praying for my mother knee as she is suffering.'
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
                .post('/api/v1/users//prayerRequests')
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    UserId: 5831,
                    Title: 'Pray for my mother',
                    Description: 'Please join in praying for my mother knee as she is suffering.',
                    Post: 'Please join in praying for my mother knee as she is suffering.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })
    })

    describe('PUT', () => {
        it('should update specific prayer request', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/prayerRequests/210')
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    Post: 'Updated prayer content.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Updated).to.be.true
                    done()
                })
        })

        it('should return error when updating prayer belonging to another user', (done) => {
            chai.request(server)
                .put(`${baseUrl}/267`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    Post: 'Updated prayer content.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return error when passing wrong data', (done) => {
            chai.request(server)
                .put('/api/v1/users/38/prayerRequests/210')
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    content: 'Updated prayer content.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return error when missing data', (done) => {
            chai.request(server)
                .put('/api/v1/users/38/prayerRequests/')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    done()
                })
        })

    })

    describe('DELETE', () => {
        it('should delete specific prayer request', (done) => {
            chai.request(server)
                .delete('/api/v1/users/171/prayerRequests/210')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Deleted).to.be.true
                    done()
                })
        })

        it('should return error when deleting prayer belonging to another user', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/267`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

    })

})