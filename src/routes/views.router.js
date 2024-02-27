const { Router } = require('express')
const { usersModel } = require('../models/users.model.js')
const { authentication } = require('../middleware/auth.middleware.js')
const CartDaoMongo = require('../daos/mongo/Cart.daomongo.js')
const ProductDaoMongo = require('../daos/mongo/products.daomongo')

const router = Router()
const products = new ProductDaoMongo()

const carts = new CartDaoMongo()


router.get('/register', async (req, res) =>{
    res.render('register.hbs', {})
})

router.get('/login', async (req, res) =>{
    res.render('login.hbs', {})
})



router.get('/', async (req, res) =>{
    const productos = await products.getProducts()
    let vacio = true
    if(productos.length === 0){
        vacio = false
    }
    res.render('home.hbs', {
        products: productos,
        vacio: vacio,
        style: 'home.css'
    })
})

router.get('/realtimeproducts', authentication, async (req, res) =>{
    res.render('realTimeProducts.hbs', {
        titulo: 'realTimeProducts',
        style: 'realTimeProducts.css'
    })
})

router.get('/chat', async (req, res) => {
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    const {numPage=1, limit=4, query, sort} = req.query
    const opcionesPaginacion = {
        limit: limit,
        page: numPage,
        lean: true
    }
    if (sort) {
        const ordenacion = sort.startsWith('-') ? 'asc' : 'desc'
        opcionesPaginacion.sort = {['price']:ordenacion}
    }
    const {
        docs, totalDocs, page, hasPrevPage, hasNextPage, prevPage, nextPage
    } = await products.getProducts(opcionesPaginacion)
    let vacio = true
    if(docs.length === 0){
        vacio = false
    }
    console.log(typeof(docs))
    res.render('products.hbs', {
        limit,
        sort,
        productos: docs,
        totalDocs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        vacio: vacio,
    })
    })

router.get('/users', authentication, async (req, res) => {
    const {numPage=1, limit=10, query, sort} = req.query
    const opcionesPaginacion = {
        limit: limit,
        page: numPage,
        lean: true
    }
    if (sort) {
        opcionesPaginacion.sort = sort
    }
    const {
        docs, totalDocs, page, hasPrevPage, hasNextPage, prevPage, nextPage
    } = await usersModel.paginate({}, opcionesPaginacion)
    res.render('user', {users: docs, totalDocs, page, hasPrevPage, hasNextPage, prevPage, nextPage})
})

router.get('/carts/:cid', authentication, async (req, res) => {
    const {cid} = req.params
    const cartRender = await carts.getCartById(cid)
    const arrayNuevo = []

    for (let i = 0; i <= (cartRender.products.length - 1); i++) {
        arrayNuevo.push(cartRender.products[i])
    }
    console.log(arrayNuevo)
    console.log(cartRender.products.length)


    res.render('cartsByID', {
        carrito: arrayNuevo,
        vacio: true
    })
})

module.exports = router