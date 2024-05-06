const { ProductsService } = require('../repositories/services')
const CustomError = require('../services/errors/CustomError')
const { Errors } = require('../services/errors/enums')
const {generateProductErrorInfo} = require('../services/errors/info')
const { logger } = require('../utils/logger')




class ProductsController{
    constructor(){
        this.productsService = ProductsService
    }
    getProducts = async (req, res, next) => {
        try {
            const productos = await this.productsService.getProducts()
            const limit = req.query.limit
            if(productos.length !== 0){
                if (!limit){
                    return res.json(productos)
                }else{
                    if(productos.length >= limit){
                        const limitProducts = productos.slice(0, limit)
                        return res.json(limitProducts)
                    }else{
                        return res.send('Fuera de rango')
                    }
                }
            }else{
                return res.send('No existen productos')
            }
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    getProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const producto = await this.productsService.getProduct({_id: pid})
            if(!pid){
                CustomError.createError({
                    name: 'Not found a product',
                    cause: generateProductErrorInfo(producto),
                    message: 'Error, trying to found a product',
                    code: Errors.DATABASES_ERROR
                })
            }
            if(producto){
                return res.json(producto)
            }else{
                return res.status(400).send(`no se encontro el producto de id ${pid}`)
            }
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    createProduct = async (req, res, next) => {
        try {
            const cuerpo = req.body
            if(cuerpo.title && cuerpo.price && cuerpo.code && cuerpo.stock){
                const mensaje = await this.productsService.createProduct(cuerpo)
                res.redirect('/views/productos')
            }
            CustomError.createError({
                name: 'Product creation error',
                cause: generateProductErrorInfo(cuerpo),
                message: 'Error trying to add a product',
                code: Errors.DATABASES_ERROR
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const cuerpo = req.body
            const result = await this.productsService.updateProduct({_id: pid}, cuerpo)
            res.redirect('/views/productos')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }



    deleteProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            //const user = req.session.user
            console.log(pid)
            //if(user.email === producto.owner || user.role === 'admin'){
            const result = await this.productsService.deleteProduct({_id: pid})
            res.redirect('/views/productos')
            //}
            return res.send('No tenes los permisos para eliminar este producto')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    generateProduct = async (req, res, next) => {
        try {
            const productsMock = await this.productsService.mock()
            return res.send(productsMock)
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = ProductsController