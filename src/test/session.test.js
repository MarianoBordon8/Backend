const chai = require('chai')

const supertest = require('supertest')

const requester = supertest('http://localhost:8080')
const expect = chai.expect

describe('Session', () => {

    it('Login', async () => {
        const existingUser = {
            email: 'test@gmail.com',
            password: 'password'
        }
        const res = await requester.post('api/sessions/login').send(existingUser)
        expect(res).to.have.status(200)
        expect(res).to.have.cookie('token')
    })

    it('Post a new user', async () => {
        const newUser = {
            first_name: 'Test',
            last_name: 'Session',
            email: 'test@gmail.com',
            password: 'password',
            role: 'user'
        }
        const res = await requester.post('api/sessions/register').send(productMock)
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('status').equal('success')
        expect(res.body.payload).to.have.property('email').equal(newUser.email)
    })
})
