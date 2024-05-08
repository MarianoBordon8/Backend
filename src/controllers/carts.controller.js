const { ticketModel } = require('../models/ticket.model')
const { cartsService, ProductsService, ticketService } = require('../repositories/services')
const CustomError = require('../services/errors/CustomError')
const { Errors } = require('../services/errors/enums')
const {generateCartErrorInfo, generateCartRemoveErrorInfo} = require('../services/errors/info')
const { logger } = require('../utils/logger')
const { sendMail } = require('../utils/sendMail')



class CartController{
    constructor(){
        this.cartsService = cartsService
        this.productService = ProductsService
        this.ticketService = ticketService
        this.ticketModel = ticketModel
    }

    getCarts = async (req,res, next)=>{
        try{
            const allCarts = await this.cartsService.getCarts()
            res.json({
                status: 'success',
                payload: allCarts
            })
        }catch(error){
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    getCart = async (req, res, next) => {
        try {
            const {cid} = req.params
            const card = await this.cartsService.getCart({_id: cid})
            if(card){
                return res.send({
                    status: 'success',
                    payload: card
                })
            }else{
                return res.status(400).send(`no se encontro el producto de id ${cid}`)
            }
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    createCart = async (req, res, next) => {
        try {
            const mensaje = await this.cartsService.createCart()
            res.send(mensaje)
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    createProductByCart = async (req, res, next) => {
        try {
            const {cid, pid} = req.params
            if (!cid || !pid) {
                CustomError.createError({
                    name: 'Add product to cart error',
                    cause: generateCartErrorInfo(cid, pid),
                    message: 'Error trying add product to cart',
                    code: Errors.DATABASES_ERROR
                })
            }
            const respuesta = await this.cartsService.createProductByCart(cid, pid)
            res.redirect('/views/productos')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    updateCart = async (req, res, next) => {
        try {
            const {cid} = req.params
            const data = req.body
            const respuesta = await this.cartsService.updateCart(cid, data)
            res.send({
                status: 'success',
                payload: respuesta
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    updateProductByCart = async (req, res, next) => {
        try {
            const {cid, pid} = req.params
            const {newQuantity} = req.body
            const respuesta = await this.cartsService.updateProductByCart(cid, pid, parseInt(newQuantity))
            res.redirect('/views/carrito')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    deleteCart = async (req, res, next) => {
        try {
            const {cid} = req.params
            const respuesta = await this.cartsService.deleteCart(cid)
            res.send({
                status: 'success',
                payload: respuesta
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    deleteProductByCart = async (req, res, next) => {
        try {
            const {cid, pid} = req.params
            if(!cid || !pid){
                CustomError.createError({
                    name: 'Error to remove product from cart',
                    cause: generateCartRemoveErrorInfo(cid, pid),
                    message: 'Cant remove product from cart',
                    code: Errors.DATABASES_ERROR
                })
            }
            const respuesta = await this.cartsService.deleteProductByCart(cid, pid)
            res.redirect('/views/carrito')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    purchaseCart = async (req, res, next) => {
        try {
            const cid = req.session.user.cart
            let total = 0
            const cart = await this.cartsService.getCart({_id: cid})
            const products = await this.productService.getProducts()
            for (let i = 0; i < cart.products.length; i++) {
                const index = products.docs.findIndex((elem) => elem.code === cart.products[i].product.code)
                total += cart.products[i].quantity * products.docs[index].price
                const NuevoStock = {
                    title: products.docs[index].title,
                    description: products.docs[index].description,
                    price: products.docs[index].price,
                    stock: products.docs[index].stock - cart.products[i].quantity,
                    thumbnail: products.docs[index].thumbnail,
                    code: products.docs[index].code
                }
                const updeteProduct = await this.productService.updateProduct({code: products.docs[index].code}, NuevoStock)
                const nuevoCarrito = await this.cartsService.deleteProductByCart(cid, products.docs[index]._id)
            }
            let code = 0
            let purchase_datetime = new Date()
            let amount = total
            let purchaser = req.session.user.email
            const tickets = await this.ticketService.getTickets()
            if(tickets.length === 0){
                code = 1
            }else{
                code = tickets.length + 1
            }
            code = code.toString()
            const resp = await this.ticketService.createTicket({
                code,
                purchase_datetime,
                amount,
                purchaser
            })
            const ticket = await this.ticketService.getTicket({code: code})
            const to = purchaser
            const subject = 'Ticket de compra'
            const html    = `
            <h1>Gracias por tu compra</h1>
            <p>codigo: ${ticket.code}</p>
            <p>fecha: ${ticket.purchase_datetime}</p>
            <p>monto total: ${ticket.amount}</p>
            `
            sendMail(to, subject, html)
            res.redirect('/views/productos')
        } catch (error) {
            logger.error(error)
            res.status(500).json({ status: 'error', message: 'Server error' })
            next(error)
        }
    }
}

module.exports = CartController