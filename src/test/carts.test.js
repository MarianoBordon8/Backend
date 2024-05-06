const chai = require('chai')
const supertest = require('supertest')
const requester = supertest('http://localhost:8080')
const expect = chai.expect

describe('Cart Router Tests', () => {

    it('Create Cart', async () => {
        const res = await requester.post('/api/carts')
        expect(res).to.have.status(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.payload).to.be.an('object')
    })

    it('Add a Product to a Cart', async () => {
        const cid = '658de16ff37f347a0f7a3f31'
        const pid = '6584bae39955e99a2da26320'
        const res = await requester.put(`/api/carts/${cid}/product/${pid}`)
        expect(res).to.have.status(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.payload).to.be.an('object')
    })

    it('Get a Cart by ID', async () => {
        const cid = '658de16ff37f347a0f7a3f31'
        const res = await requester.get(`/api/carts/${cid}`)
        expect(res).to.have.status(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.payload).to.be.an('object')
    })
})