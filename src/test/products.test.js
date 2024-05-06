const chai = require('chai')

const supertest = require('supertest')

const requester = supertest('http://localhost:8080')
const expect = chai.expect

describe('Product Router Tests', () => {

    it('Get Products', async () => {
        const res = await requester.get('/api/products')
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('docs')
        expect(res.body.docs).to.be.an('array')
    })

    it('Add a new Product', async () => {
        let productMock = {
            title: 'pc gamer',
            description: 'pc gamer',
            price: 580000,
            thumbnail: 'url',
            code: 'codigoPC',
            stock: 2,
            status: true,
            category: 'new-category',
            owner: 'PC@gmail.com'
        }
        const res = await requester.post('/api/products').send(productMock)
        expect(res.status).to.equal(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.docs).to.be.an('array')
    })

    it('Get a Product by ID', async () => {
        const pid = '6584bae39955e99a2da26320'
        const res = await requester.get(`/api/products/${pid}`)
        expect(res).to.have.status(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.payload).to.be.an('object')
    })
})


