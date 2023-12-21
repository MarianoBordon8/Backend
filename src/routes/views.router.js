const { Router } = require('express')
//const ProductManager = require('../daos/file/ProductManager.js')
const { ProductMongo } = require('../daos/mongo/products.daomongo')

const router = Router()
//const productsServ = new ProductManager()
const products = new ProductMongo()



router.get('/', async (req, res) =>{
    //const products = await productsServ.getProducts()
    const products = await products.getProducts()
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
router.get('/chat', async (req, res) => {
    res.render('chat', {})
})

module.exports = router