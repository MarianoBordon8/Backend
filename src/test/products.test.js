const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../app')


describe('Product Router Tests', () => {

    it('Get Products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('array')
                done()
            })
    })

    it('Add a new Product', (done) => {
        chai.request(app)
            .post('/api/products')
            .send({
                title: 'pc gamer',
                description: 'pc gamer',
                price: 580000,
                thumbnail: 'url',
                code: 'codigoPC',
                stock: 2,
                status: true,
                category: 'new-category',
                owner: 'PC@gmail.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.message).to.equal('Product added successfully')
                done()
            })
    })

    it('Get a Product by ID', (done) => {

        const pid = '6584bae39955e99a2da26320'

        chai.request(app)
            .get(`/api/products/${pid}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })
})


