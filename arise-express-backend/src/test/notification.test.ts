import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
import DatabasePool from '../db/DatabasePool'
import { BroadcastNotificationType } from '../services/notification/Notification'
const server = require('../server')
const _ = require('lodash')
chai.use(chaiHttp)

describe('Notifications', () => {

    const baseUrl: string = '/api/v1/users/171/notifications'

    describe('GET', () => {
        it('should retrieve notifications for a specific user', (done) => {
            chai.request(server)
                .get(baseUrl)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Seen).to.be.a('array')
                    expect(res.body.data.Unseen).to.be.a('array')
                    expect(res.body.data.Seen.length).to.be.equal(0)
                    expect(res.body.data.Unseen.length).to.be.greaterThan(0)
                    done()
                })
        })

        it('should not retrieve broadcast notifications created before user existance', (done) => {
            DatabasePool.insert('NotificationsBroadcast', {
                RelatedPostId: 402,
                Action: BroadcastNotificationType.Prayer,
                CreationDate: '2014-03-05 20:02:54'
            }).then((notificationId) => {
                chai.request(server)
                    .get(baseUrl)
                    .set('authorization', authToken())
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200)
                        expect(res.body.data).to.exist
                        expect(res.body.error).to.not.exist
                        expect(res.body.data.Seen).to.be.a('array')
                        expect(res.body.data.Unseen).to.be.a('array')
                        expect(_.some(res.body.data.Unseen, { 'NotificationId': notificationId })).to.be.false
                        done()
                    })
            })
        })

        it('should count unseen notifications for a specific user', (done) => {
            chai.request(server)
                .get(`${baseUrl}/countUnseen`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Counter).to.be.a('number')
                    expect(res.body.data.Counter).to.be.greaterThan(0)
                    done()
                })
        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .get('/api/v1/users//notifications')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.data).to.not.exist
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should fail authorization when loading notifications for other user', (done) => {
            chai.request(server)
                .get('/api/v1/users/156/notifications')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    done()
                })
        })

        it('should fail authorization when counting notifications for other user', (done) => {
            chai.request(server)
                .get('/api/v1/users/156/notifications/countUnseen')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    done()
                })
        })
    })

    describe('PUT', () => {

        it('should not update notifications as seen when some of them belong to other users', (done) => {
            chai.request(server)
                .put(`${baseUrl}/seen`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationIds: [{ Id: 921, Type: 'PeerToPeer' }, { Id: 939, Type: 'PeerToPeer' }] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    done()
                })
        })

        it('should update peer to peer notifications as seen for a specific user', (done) => {
            chai.request(server)
                .put(`${baseUrl}/seen`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationIds: [{ Id: 940, Type: 'PeerToPeer' }, { Id: 939, Type: 'PeerToPeer' }] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Updated).to.be.true
                    done()
                })
        })

        it('should update broadcast notifications as seen for a specific user', (done) => {
            DatabasePool.insert('NotificationsBroadcast', {
                RelatedPostId: 402,
                Action: BroadcastNotificationType.Video
            }).then((notificationId) => {
                chai.request(server)
                    .put(`${baseUrl}/seen`)
                    .set('authorization', authToken())
                    .set('content-type', 'application/json')
                    .send({ NotificationIds: [{ Id: notificationId, Type: 'Broadcast' }] })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200)
                        expect(res.body.error).to.not.exist
                        expect(res.body.data).to.exist
                        expect(res.body.data.Updated).to.be.true
                        done()
                    })
            })

        })

        it('should return error when missing user id', (done) => {
            chai.request(server)
                .put('/api/v1/users//notifications/seen')
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationsIds: [{ Id: '252', Type: 'Broadcast' }] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return error when wrong format for notifications ids', (done) => {
            chai.request(server)
                .put(`${baseUrl}/seen`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationIds: [252, 563, 624] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return error when wrong body sent', (done) => {
            chai.request(server)
                .put(`${baseUrl}/seen`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationIds: [{ Id: 252 }, { Id: 563, Type: 'Broadcast' }] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return error when none of notification ids belong to the user', (done) => {
            chai.request(server)
                .put(`${baseUrl}/seen`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({ NotificationIds: [{ Id: 252, Type: 'PeerToPeer' }, { Id: 563, Type: 'Broadcast' }] })
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    done()
                })
        })
    })
})