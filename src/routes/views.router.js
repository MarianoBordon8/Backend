const { Router } = require('express')
const { usersModel } = require('../models/users.model.js')
const { authentication } = require('../middleware/auth.middleware.js')
const CartDaoMongo = require('../daos/mongo/Cart.daomongo.js')
const ProductDaoMongo = require('../daos/mongo/products.daomongo')
const { logger } = require('../utils/logger.js')
const { authorization } = require('../middleware/authorization.js')

const router = Router()
const products = new ProductDaoMongo()
const carts = new CartDaoMongo()


router.get('/register', async (req, res) =>{
    let errorAlIniciar = false
    const errorMessageRegister = req.session.errorMessageRegister
    delete req.session.errorMessageRegister
    if (errorMessageRegister) {
        errorAlIniciar = true
    }
    res.render('register.hbs', {
        errorAlIniciar,
        errorMessageRegister
    })
})

router.get('/login', async (req, res) =>{
    let errorAlIniciar = false
    const errorMessageLogin = req.session.errorMessageLogin
    delete req.session.errorMessageLogin
    if (errorMessageLogin) {
        errorAlIniciar = true
    }
    res.render('login.hbs', {
        errorAlIniciar,
        errorMessageLogin
    })
})



router.get('/', async (req, res) =>{
    const productos = await products.get()
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

router.get('/realtimeproducts',authorization(['PREMIUM']), async (req, res) =>{
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
    } = await products.get(opcionesPaginacion)
    let vacio = true
    if(docs.length === 0){
        vacio = false
    }
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
    const cartRender = await carts.getBy({_id: cid})
    const arrayNuevo = []

    for (let i = 0; i <= (cartRender.products.length - 1); i++) {
        arrayNuevo.push(cartRender.products[i])
    }

    res.render('cartsByID', {
        carrito: arrayNuevo,
        vacio: true
    })
})

router.get('/reestablecer', (req,res) => {
    res.render('reestablecerContraseña.hbs');
})

router.get('/miratumail', (req,res) => {
    res.render('miratumail.hbs')
})

router.get('/newpassword', async(req,res) => {
    let errorAlIniciar = false
    const passworderror = req.session.passworderror
    if (passworderror) {
        errorAlIniciar = true
    }
    res.render('newpassword.hbs', {
        errorAlIniciar,
        passworderror
    });
})

module.exports = router