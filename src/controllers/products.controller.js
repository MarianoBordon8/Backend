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
            return productos
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
            const email = req.session.user.email
            const role = req.session.user.role
            console.log(role)
            if(role === 'premium' || role === 'PREMIUM'){
                if(cuerpo.title && cuerpo.price && cuerpo.code && cuerpo.stock){
                    const mensaje = await this.productsService.createProduct(cuerpo, email)
                    res.redirect('/views/productos')
                }
            }else{
                logger.error('No eres un usuario premium')
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
            const {title, description, price, stock, thumbnail, code} = req.body
            const email = req.session.user.email
            const product = await this.productsService.getProduct({_id: pid})
            const updatedTitle = title === '' ? product[0].title : title
            const updatedDescription = description === '' ? product[0].description : description
            const updatedPrice = price === '' ? product[0].price : price
            const updatedStock = stock === '' ? product[0].stock : stock
            const updatedThumbnail = thumbnail === '' ? product[0].thumbnail : thumbnail
            const updatedCode = code === '' ? product[0].code : code
            if(product[0].owner === email){
                const result = await this.productsService.updateProduct({_id: pid}, {
                    title: updatedTitle,
                    description: updatedDescription,
                    price: updatedPrice,
                    stock: updatedStock,
                    thumbnail: updatedThumbnail,
                    code: updatedCode
                })
            }else{
                req.session.error = 'no puedes editar un producto que no creaste'
            }
            res.redirect('/views/productos')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }



    deleteProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const email = req.session.user.email
            const product = await this.productsService.getProduct({_id: pid})
            if(product[0].owner === email){
                const result = await this.productsService.deleteProduct({_id: pid})
            }else{
                req.error.update = 'no puedes eliminar un producto que no creaste'
            }
            res.redirect('/views/productos')
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