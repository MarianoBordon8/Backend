const { Router } = require('express')
const ProductManager = require('../managers/ProductManager.js')

const router = Router()
const productsServ = new ProductManager()


router.get('/', async (req, res) =>{
    const products = await productsServ.getProducts()
    let vacio = true
    if(products.length === 0){
        vacio = false
    }
    res.render('home.hbs', {
        products: products,
        vacio: vacio,
        style: 'home.css'
    })
})
router.get('/realtimeproducts', async (req, res) =>{
    res.render('realTimeProducts.hbs', {
        titulo: 'realTimeProducts',
        style: 'realTimeProducts.css'
    })
})

module.exports = router