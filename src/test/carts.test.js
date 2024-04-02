const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../app')


describe('Cart Router Tests', () => {
    it('Create Cart', (done) => {
        chai.request(app)
            .post('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })

    it('Get a Cart by ID', (done) => {
        const cid = '658de16ff37f347a0f7a3f31'
        chai.request(app)
            .get(`/api/carts/${cid}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })


    it('Add a Product to a Cart', (done) => {
        const cid = '658de16ff37f347a0f7a3f31'
        const pid = '6584bae39955e99a2da26320'
        
        chai.request(app)
        .put(`/api/carts/${cid}/product/${pid}`)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.equal('success')
            expect(res.body.payload).to.be.an('object')
            done()
        })
    })

    it('Remove a Product from a Cart', (done) => {
        const cid = '658de16ff37f347a0f7a3f31'
        const pid = '6584bae39955e99a2da26320'
        chai.request(app)
            .delete(`/api/carts/${cid}/product/${pid}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                done()
            })
    })
})
