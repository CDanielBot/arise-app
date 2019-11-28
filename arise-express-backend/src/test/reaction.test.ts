import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
import { ReactionType } from '../services/reaction/Reaction'
const server = require('../server')
chai.use(chaiHttp)

describe('Reactions to posts', () => {

    const baseUrl: string = '/api/v1/posts/216/reactions'

    describe('POST', () => {
        it('should add reaction to a given post', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    UserId: 526,
                    RelatedPostId: 1145,
                    UserFullName: 'danielbot',
                    ReactionType: ReactionType.like
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Reaction.ReactionId).to.be.a('number')
                    expect(res.body.data.Reaction.ReactionType).to.be.equal('like')
                    done()
                })
        })

        it('should return error when missing post id', (done) => {
            chai.request(server)
                .post('/api/v1/posts//reactions')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })
    })

    describe('DELETE', () => {
        it('should delete reaction from a given post new prayer request for a specific user', (done) => {
            chai.request(server)
                .delete(`${baseUrl}/562`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Deleted).to.be.true
                    done()
                })
        })

    })

})