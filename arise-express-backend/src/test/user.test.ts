import { expect } from 'chai'
import * as chai from 'chai'
import { authToken } from './utils/AuthUtil'
import chaiHttp = require('chai-http')
import { createFirebaseUser } from './utils/FirebaseUtil'
const server = require('../server')
chai.use(chaiHttp)

describe('User', () => {

    const baseUrl: string = '/api/v1/users'

    const credentials = (email: string, password: string) => {
        return {
            Email: email,
            Password: password
        }
    }

    const loginRequest = () => {
        return chai.request(server)
            .post(`${baseUrl}/login`)
            .set('content-type', 'application/json')
    }

    describe('GET', () => {
        it('should retrieve user by id', (done) => {
            chai.request(server)
                .get(`${baseUrl}/252`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.data).to.exist
                    expect(res.body.data.User.UserId).to.equal(252)
                    done()
                })
        })

        it('should return error when user with id not found', (done) => {
            chai.request(server)
                .get(`${baseUrl}/999988`)
                .set('authorization', authToken())
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })
    })


    describe('POST', () => {
        it('should create new user with email and password', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .send({
                    Email: 'testuser@arctec.com',
                    Password: 'TestUserArctec',
                    FirstName: 'Daniel',
                    LastName: 'Bot'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    const newUser = res.body.data.User
                    expect(newUser).to.exist
                    expect(newUser.UserId).to.be.a('number')
                    expect(newUser.FirebaseUid).to.be.a('string')
                    expect(newUser.Password).to.not.exist
                    expect(newUser.Email).to.be.equal('testuser@arctec.com')
                    expect(newUser.User).to.be.equal('Daniel Bot')
                    expect(newUser.Language).to.be.equal('ro')
                    done()
                })
        })

        it('should create new user with username, password and language', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .send({
                    Email: 'testuser2@arctec.com',
                    Password: 'TestUserArctec',
                    FirstName: 'Vlad',
                    LastName: 'Crisan',
                    Language: 'en'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    const newUser = res.body.data.User
                    expect(newUser).to.exist
                    expect(newUser.UserId).to.be.a('number')
                    expect(newUser.FirebaseUid).to.be.a('string')
                    expect(newUser.Password).to.not.exist
                    expect(newUser.Email).to.be.equal('testuser2@arctec.com')
                    expect(newUser.User).to.be.equal('Vlad Crisan')
                    expect(newUser.Language).to.be.equal('en')
                    done()
                })
        })

        it('should return error when missing json', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .send({
                    User: 'testuser@arctec',
                    Password: 'TestUserArctec',
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

        it('should return error when wrong data passed', (done) => {
            chai.request(server)
                .post(baseUrl)
                .set('content-type', 'application/json')
                .send({
                    username: 'TestUserArctec',
                    password: 'TestUserArctec',
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    expect(res.body.data).to.not.exist
                    done()
                })
        })
    })

    describe('PUT', () => {
        it('should update user details', (done) => {
            chai.request(server)
                .put(`${baseUrl}/252`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    FirstName: 'Daniel',
                    LastName: 'Bot_update',
                    Mobile: '+40768470127',
                    Language: 'en',
                    Description: 'just me'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Updated).to.be.true
                    done()
                })
        })

        it('should return error when wrong json passed', (done) => {
            chai.request(server)
                .put(`${baseUrl}/249`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    firstname: 'Daniel',
                    LastName: 'Bot'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.data).to.not.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

    })

    describe('Authentication', () => {
        it('should authenticate user with valid email and password', (done) => {
            loginRequest()
                .send(credentials('test@arctec.com', 'test.arctec'))
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.have.header('Authorization')
                    expect(res.body.data).to.exist
                    expect(res.body.data.AccessToken).to.exist
                    expect(res.body.data.AccessToken.Value).to.exist
                    expect(res.body.data.AccessToken.Type).to.be.equal('Bearer')
                    expect(res.body.error).to.not.exist
                    done()
                })
        })

        it('should return error when user not found', (done) => {
            loginRequest()
                .send(credentials('bla123bla987', 'bla123bla987'))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return error when password is invalid', (done) => {
            loginRequest()
                .send(credentials('test_arctec', 'wrong_password'))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })

        it('should return error when sending wrong json in body', (done) => {
            loginRequest()
                .send({
                    User: 'daniel',
                    Password: 'botd'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })
    })

    describe('Password change', () => {

        it('should change user password', (done) => {
            chai.request(server)
                .post(`${baseUrl}/171/changePassword`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    OldPassword: 'test.arctec',
                    NewPassword: 'test@arctec123'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.error).to.not.exist
                    expect(res.body.data).to.exist
                    expect(res.body.data.Updated).to.be.true

                    // verify new password works
                    loginRequest()
                        .send(credentials('test@arctec.com', 'test@arctec123'))
                        .end((err, res) => {
                            expect(res).to.have.status(200)
                            expect(res).to.have.header('Authorization')
                            expect(res.body.data).to.exist
                            expect(res.body.error).to.not.exist
                            done()
                        })
                })
        })

        it('should return 400 bad request when old password is not correct', (done) => {
            chai.request(server)
                .post(`${baseUrl}/171/changePassword`)
                .set('authorization', authToken())
                .set('content-type', 'application/json')
                .send({
                    OldPassword: 'test.arctec_wrong',
                    NewPassword: 'test@arctec123'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.be.equal('auth/wrong-password')
                    expect(res.body.data).to.not.exist
                    done()
                })
        })

    })

    describe('Register user from social apps', () => {

        it('should register social media user', (done) => {
            createFirebaseUser('botdaniel11@gmail.com', 'itdoesntmatter').then((firebaseUser) => {
                chai.request(server)
                    .post(`${baseUrl}/register`)
                    .set('content-type', 'application/json')
                    .send({
                        Email: firebaseUser.email,
                        FirstName: 'Daniel',
                        LastName: 'Bot'
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(201)
                        expect(res.body.error).to.not.exist
                        const newUser = res.body.data.User
                        expect(newUser).to.exist
                        expect(newUser.UserId).to.be.a('number')
                        expect(newUser.FirebaseUid).to.be.equal(firebaseUser.uid)
                        expect(newUser.Password).to.not.exist
                        expect(newUser.Email).to.be.equal('botdaniel11@gmail.com')
                        expect(newUser.User).to.be.equal('Daniel Bot')
                        expect(newUser.Language).to.be.equal('ro')
                        done()
                    })
            }).catch(done)
        })

        it('should return 400 bad request when missing email', (done) => {
            chai.request(server)
                .post(`${baseUrl}/register`)
                .set('content-type', 'application/json')
                .send({
                    FirstName: 'Daniel',
                    LastName: 'Bot'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.data).to.not.exist
                    expect(res.body.error).to.exist
                    expect(res.body.error.message).to.exist
                    done()
                })
        })
    })

})