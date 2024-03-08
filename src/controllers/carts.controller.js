const { ticketModel } = require('../models/ticket.model')
const { cartsService, ProductsService } = require('../repositories/services')
const CustomError = require('../services/errors/CustomError')
const { Errors } = require('../services/errors/enums')
const {generateCartErrorInfo, generateCartRemoveErrorInfo} = require('../services/errors/info')
const { logger } = require('../utils/logger')



class CartController{
    constructor(){
        this.cartsService = cartsService
        this.productService = ProductsService
        this.ticketModel = ticketModel
    }

    getCart = async (req, res) => {
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
        }
    }

    createCart = async (req, res) => {
        try {
            const newCart = req.body
            const mensaje = await this.cartsService.createCart(newCart)
            res.send(mensaje)
        } catch (error) {
            logger.error(error)
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
            res.send({
                status: 'success',
                payload: respuesta
            })
        } catch (error) {
            next(error)
        }
    }

    updateCart = async (req, res) => {
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
        }
    }

    updateProductByCart = async (req, res) => {
        try {
            const {cid, pid} = req.params
            const newCantidad = req.body
            const respuesta = await this.cartsService.updateProductByCart(cid, pid, newCantidad)
            res.send({
                status: 'success',
                payload: respuesta
            })
        } catch (error) {
            logger.error(error)
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
            res.send({
                status: 'success',
                payload: respuesta
            })
        } catch (error) {
            next(error)
        }
    }

    purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params

            const cart = await this.cartsService.getCart(cid)
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found' })
            }
            const productUpdates = []
            const productsNotPurchased = []
            let totalAmount = 0
            for (const item of cart) {
                const id = item.product.toString()
                const productArray = await this.productService.getProduct({_id: id})
                const product = productArray[0]
                const productPrice = product.price
                if (!product) {
                    return res.status(404).json({ status: 'error', message: 'Product not found' })
                }
                if (product.stock < item.quantity) {
                    productsNotPurchased.push(item.product)
                    continue
                }
                product.stock -= item.quantity
                logger.info(product)
                productUpdates.push(this.productService.updateProduct(
                    id,
                    product.title,
                    product.description,
                    product.price,
                    product.thumbnail,
                    product.code,
                    product.stock,
                    product.status,
                    product.category
                ))

                const quantity = item.quantity
                totalAmount += (quantity * productPrice)
            }

            const userEmail = req.session.user.email
            const ticketData = {
                code: 'TICKET-' + Date.now().toString(36).toUpperCase(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userEmail
            }

            const ticket = new this.ticketModel(ticketData)
            await ticket.save()

            try {
                await Promise.all(productUpdates)
                return res.status(200).json({ status: 'success', message: 'Stock updated successfully' })
            } catch (error) {
                return res.status(500).json({ status: 'error', message: 'Failed to update stock' })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).json({ status: 'error', message: 'Server error' })
        }
    }
}

module.exports = CartController