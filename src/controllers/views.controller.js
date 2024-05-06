const CartDaoMongo = require("../daos/mongo/Cart.daomongo")
const ProductDaoMongo = require("../daos/mongo/products.daomongo")
const { usersModel } = require("../models/users.model")
const { ProductsService, usersService, cartsService } = require("../repositories/services")

const products = new ProductDaoMongo()
const carts = new CartDaoMongo()

class ViewsController{
    constructor(){
        this.productsService = ProductsService
        this.userService = usersService
        this.cartService = cartsService
    }

    register = async (req, res) =>{
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
    }

    login = async (req, res) =>{
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
    }

    home = async (req, res) =>{
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
    }

    realTimeProducts = async (req, res) =>{
        res.render('realTimeProducts.hbs', {
            titulo: 'realTimeProducts',
            style: 'realTimeProducts.css'
        })
    }

    users = async (req, res) => {
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
    }

    carts = async (req, res) => {
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
    }

    reestablecer = (req,res) => {
        res.render('reestablecerContraseña.hbs');
    }

    miratuMail = (req,res) => {
        res.render('miratumail.hbs')
    }

    newPassword = async(req,res) => {
        let errorAlIniciar = false
        const passworderror = req.session.passworderror
        if (passworderror) {
            errorAlIniciar = true
        }
        res.render('newpassword.hbs', {
            errorAlIniciar,
            passworderror
        })
    }

    productos = async (req, res) => {
        const {numPage=1, limit=4, sort} = req.query
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
        } = await this.productsService.getProducts(opcionesPaginacion)
        let vacio = true
        if(docs.length === 0){
            vacio = false
        }
        res.render('productos.hbs', {
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
    }

    newProduct = (req,res) => {
        res.render('newProduct.hbs')
    }

    updateProduct = (req,res) => {
        const pid = req.params.pid
        res.render('updateProduct.hbs',{
            pid
        })
    }

    deleteProduct = async (req,res) => {
        const pid = req.params.pid
        const product = await this.productsService.getProduct({_id: pid})
        res.render('deleteProduct.hbs',{
            pid,
            title: product[0].title,
            description: product[0].description,
            thumbnail: product[0].thumbnail,
            stock: product[0].stock,
            price: product[0].price
        })
    }
}

module.exports = ViewsController