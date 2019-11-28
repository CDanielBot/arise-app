import { expect } from 'chai'
import * as chai from 'chai'
import chaiHttp = require('chai-http')
import { authToken } from './utils/AuthUtil'
const server = require('../server')
chai.use(chaiHttp)

describe('Comments', () => {

    const baseUrl: string = '/api/v1/posts/110/comments'

    describe('GET', () => {
        it('should retrieve comments for a post', (done) => {
            chai.request(server)
                .get(baseUrl)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Comments).to.be.a('array')
                    expect(res.body.data.Comments.length).to.be.greaterThan(1)
                    expect(res.body.data.Comments[0].CommentId).to.exist
                    done()
                })
        })
    })

    describe('POST', () => {
        it('should add comment to a given post', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    UserId: 252,
                    Name: 'Arise for Christ',
                    RelatedPostId: 110,
                    Comment: 'Test comment added from automated tests.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Comment.CommentId).to.be.a('number')
                    expect(res.body.data.Comment.Visibility).to.be.equal(1)
                    done()
                })
        })


        it('should add comment as a reply to another comment', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    UserId: 252,
                    Name: 'Arise for Christ',
                    RelatedPostId: 224,
                    RelatedCommentId: 487,
                    Comment: 'Test reply comment added from automated tests.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Comment.CommentId).to.be.a('number')
                    expect(res.body.data.Comment.Visibility).to.be.equal(1)
                    done()
                })
        })

        it('should return error when wrong comment body', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    UserId: 252,
                    RelatedPostId: 110,
                    RelatedCommentId: 0,
                    Content: 'Test comment added from automated tests.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.data).to.not.exist
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return unauthorized when missing auth token', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .send({
                    UserId: 252,
                    RelatedPostId: 110,
                    RelatedCommentId: 0,
                    Comment: 'Test comment added from automated tests.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(401)
                    done()
                })
        })
    })

    describe('PUT', () => {
        it('should update comment content', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/comments/474')
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    Comment: 'Content updated for comment'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Updated).to.be.true
                    done()
                })
        })

        it('should not update comment belonging to another user', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/comments/480')
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    Comment: 'Content updated for comment'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    expect(res.body.error).to.exist
                    done()
                })
        })

        it('should return error when missing comment id', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/comments/')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return error when wrong comment body', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/comments/474')
                .set('content-type', 'application/json')
                .set('authorization', authToken())
                .send({
                    Content: 'It should be Comment not Content'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.data).to.not.exist
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return unauthorized when missing auth token', (done) => {
            chai.request(server)
                .put('/api/v1/users/171/comments/480')
                .set('content-type', 'application/json')
                .send({
                    Comment: 'Test comment added from automated tests.'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(401)
                    done()
                })
        })
    })

    describe('DELETE', () => {
        it('should delete comment', (done) => {
            chai.request(server)
                .delete('/api/v1/users/171/comments/474')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.error).to.not.exist
                    expect(res.body.data.Deleted).to.be.true
                    done()
                })
        })

        it('should not delete comment belonging to another user', (done) => {
            chai.request(server)
                .delete('/api/v1/users/171/comments/480')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(403)
                    expect(res.body.error).to.exist
                    done()
                })
        })

        it('should return error when missing comment id', (done) => {
            chai.request(server)
                .delete('/api/v1/users/171/comments')
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return unauthorized when missing auth token', (done) => {
            chai.request(server)
                .delete('/api/v1/users/171/comments/480')
                .end((err, res) => {
                    expect(res.status).to.be.equal(401)
                    done()
                })
        })
    })

})