const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../../app')
chai.use(chaiHttp)
const expect = chai.expect

describe('Session', () => {


    describe('register', () => {
        it('Post a new user', (done) => {
            const newUser = {
                first_name: 'Test',
                last_name: 'Session',
                email: 'test@gmail.com',
                password: 'password',
                role: 'user'
            }

            chai.request(app)
                .post('api/sessions/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('status').equal('success')
                    expect(res.body.payload).to.have.property('email').equal(newUser.email)
                    done()
                })
        })
    })

    describe('login', () => {
        it('Login', (done) => {
            const existingUser = {
                email: 'test@gmail.com',
                password: 'password'
            }

            chai.request(app)
                .post('api/sessions/login')
                .send(existingUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.have.cookie('token')
                    done()
                })
        })
    })
})