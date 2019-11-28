import { expect } from 'chai'
import * as chai from 'chai'
import chaiHttp = require('chai-http')
import { authToken } from './utils/AuthUtil'
import { PostType } from '../services/wall/Post'
const server = require('../server')
chai.use(chaiHttp)

describe('Wall posts', () => {

    const baseUrl: string = '/api/v1/posts?userId=247'

    it('should load wall posts with no filter params sent', (done) => {
        chai.request(server)
            .get(baseUrl)
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.lessThan(11)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                done()
            })
    })

    it('should load batches of 20 posts after a given last post', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ batchSize: 20, lastLoadedPostId: 315 })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.greaterThan(0)
                expect(res.body.data.Posts.length).to.be.lessThan(21)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                done()
            })
    })

    it('should load video urls for media type', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ batchSize: 25, lastLoadedPostId: 311 })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.greaterThan(0)
                expect(res.body.data.Posts.length).to.be.lessThan(26)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                res.body.data.Posts.forEach((element: any) => {
                    if (element.VideoUrl) {
                        expect(element.Type).to.be.equal(PostType.Video)
                        expect(element.Post).to.be.undefined
                        expect(element.VideoUrl.startsWith('https://www.youtube.com/embed/')).to.be.true
                    }
                })
                done()
            })
    })

    it('should load batches of 10 posts after a given incorrect (too big) last post', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ batchSize: 20, lastLoadedPostId: 54321 })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.greaterThan(0)
                expect(res.body.data.Posts.length).to.be.lessThan(21)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                done()
            })
    })

    it('should not load posts when there is no more data to be loaded', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ batchSize: 15, lastLoadedPostId: 10 })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.equal(0)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                done()
            })
    })

    it('should return error when wrong query params passed in', (done) => {
        chai.request(server)
            .get(baseUrl)
            .query({ size: '15' })
            .end((err, res) => {
                expect(res.status).to.be.equal(400)
                expect(res.body.data).to.not.exist
                expect(res.body.error).to.exist
                expect(res.body.error.message).to.exist
                done()
            })
    })

    it('should load post by id', (done) => {
        chai.request(server)
            .get('/api/v1/posts/235')
            .set('authorization', authToken())
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.error).to.not.exist
                expect(res.body.data).to.exist
                expect(res.body.data.Post).to.exist
                expect(res.body.data.Post.PostId).to.be.equal(235)
                done()
            })
    })

    it('should return error when missing authentication token for post retrieval', (done) => {
        chai.request(server)
            .get('/api/v1/posts/235')
            .end((err, res) => {
                expect(res.status).to.be.equal(401)
                done()
            })
    })

    it('should load wall posts for anonymous users as well', (done) => {
        chai.request(server)
            .get('/api/v1/posts')
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.data).to.exist
                expect(res.body.error).to.not.exist
                expect(res.body.data.Posts).to.be.a('array')
                expect(res.body.data.Posts.length).to.be.lessThan(11)
                expect(res.body.data.SkippedPosts).to.be.equal(0)
                done()
            })
    })
})