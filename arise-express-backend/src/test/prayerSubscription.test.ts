import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)

describe('Prayer subscriptions', () => {

    const baseUrl: string = '/api/v1/users/171/prayerSubscriptions'

    describe('GET', () => {
        it('should retrieve prayer subscriptions for a specific user', (done) => {
            chai.request(server)
                .get(baseUrl)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.data.PrayerSubscriptions).to.be.a('array')
                    expect(res.body.data.PrayerSubscriptions.length).to.be.greaterThan(3)
                    const subscription = res.body.data.PrayerSubscriptions[0]
                    expect(subscription.SubscriptionId).to.exist
                    expect(subscription.UserId).to.be.equal(171)
                    expect(subscription.ReactionsCounter).to.exist
                    expect(subscription.CommentsCounter).to.exist
                    expect(subscription.PrayerContent).to.exist
                    done()
                })
        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .get('/api/v1/users//prayerSubscriptions')
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

    describe('DELETE', () => {
        it('should delete prayer subscription for a specific user', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/564`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.UnsubscribedNo).to.be.a('number')
                    done()
                })
        })

        it('should return error when missing subscription id', (done) => {
            chai.request(server)
                .delete(baseUrl)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })
    })

})