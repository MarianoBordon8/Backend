const CartDaoMongo = require("../daos/mongo/Cart.daomongo")
const ProductDaoMongo = require("../daos/mongo/products.daomongo")
const { usersModel } = require("../models/users.model")
const { ProductsService, usersService, cartsService } = require("../repositories/services")
const { logger } = require("../utils/logger")

const products = new ProductDaoMongo()
const carts = new CartDaoMongo()

class ViewsController{
    constructor(){
        this.productsService = ProductsService
        this.userService = usersService
        this.cartService = cartsService
    }

    register = async (req, res) =>{
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    login = async (req, res) =>{
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    home = async (req, res) =>{
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    realTimeProducts = async (req, res) =>{
        try {
            res.render('realTimeProducts.hbs', {
                titulo: 'realTimeProducts',
                style: 'realTimeProducts.css'
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    users = async (req, res) => {
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    carts = async (req, res) => {
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    reestablecer = (req,res) => {
        try {
            res.render('reestablecerContraseña.hbs');
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    
    miratuMail = (req,res) => {
        try {
            res.render('miratumail.hbs')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    newPassword = async(req,res) => {
        try {
            let errorAlIniciar = false
            const passworderror = req.session.passworderror
            if (passworderror) {
                errorAlIniciar = true
            }
            res.render('newpassword.hbs', {
                errorAlIniciar,
                passworderror
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    productos = async (req, res) => {
        try {
            const {numPage=1, limit=4, sort} = req.query
            const cid = req.session.user.cart
            const uid = req.session.user.id
            const user = await this.userService.getUsersBy({_id: uid})
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
                role: (user.role).toUpperCase(),
                uid: uid,
                cid: cid,
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    newProduct = (req,res) => {
        try {
            res.render('newProduct.hbs')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    updateProduct = (req,res) => {
        try {
            const pid = req.params.pid
            res.render('updateProduct.hbs',{
                pid
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    deleteProduct = async (req,res) => {
        try {
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
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    carrito = async (req,res) => {
        try {
            const cid = req.session.user.cart
            const carrito = await this.cartService.getCart({_id: cid})
            let array = []
            let array2 = [{pro: 1},{pro: 2},{pro: 3}]
            for (let i = 0; i < carrito.products.length; i++) {
                array.push({
                    title: carrito.products[i].product.title,
                    quantity: carrito.products[i].quantity,
                    stock: carrito.products[i].product.stock,
                    precioU: carrito.products[i].product.price,
                    _id: carrito.products[i].product._id,
                    total: carrito.products[i].product.price * carrito.products[i].quantity
                })
            }
            res.render('cartsById.hbs',{
                cid: cid,
                carrito: array,
                array: array2
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    premium = async (req,res) => {
        try {
            let role
            const uid = req.session.user.id
            const user = await this.userService.getUsersBy({_id: uid})
            switch (user.role) {
                case 'premium':
                    role = 'user'
                    break;
                case 'user':
                    role = 'premium'
                    break;
                default:
                    break;
                }
            res.render('premium.hbs',{
                role,
                uid
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = ViewsController