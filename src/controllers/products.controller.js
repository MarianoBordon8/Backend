const { faker } = require('@faker-js/faker')
const { ProductsService } = require('../repositories/services')
const CustomError = require('../services/errors/CustomError')
const { Errors } = require('../services/errors/enums')
const {generateProductErrorInfo} = require('../services/errors/info')


class ProductsController{
    constructor(){
        this.productsService = ProductsService
    }

    getProducts = async (req, res) => {
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
            next(error)
        }
    }

    getProduct = async (req, res) => {
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
            next(error)
        }
    }

    createProduct = async (req, res) => {
        try {
            const cuerpo = req.body
            if(!cuerpo.title || !cuerpo.price || !cuerpo.code || !cuerpo.stock){
                    CustomError.createError({
                        name: 'Product creation error',
                        cause: generateProductErrorInfo(cuerpo),
                        message: 'Error trying to add a product',
                        code: Errors.DATABASES_ERROR
                    })
                const mensaje = await this.productsService.createProduct(cuerpo)
                return res.send(mensaje)
            }
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res) => {
        try {
            const pid = req.params.pid
            const cuerpo = req.body
            if(!cuerpo.title || !cuerpo.price || !cuerpo.code || !cuerpo.stock){
                CustomError.createError({
                    name: 'Product to update error',
                    cause: generateProductErrorInfo(cuerpo),
                    message: 'Error trying to update a product',
                    code: Errors.DATABASES_ERROR
                })}
            const mensaje = await this.productsService.updateProduct({_id: pid}, cuerpo)
            return res.send(mensaje)
        } catch (error) {
            next(error)
        }
    }



    deleteProduct = async (req, res) => {
        try {
            const pid = req.params.pid
            const mensaje = await this.productsService.deleteProduct({_id: pid})
            return res.send(mensaje)
        } catch (error) {
            next(error)
        }
    }

    generateProduct = async (req, res) => {
        try {
            const productsMock = await this.productsService.mock()
            return res.send(productsMock)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProductsController