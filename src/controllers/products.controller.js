const { faker } = require('@faker-js/faker')
const { ProductsService } = require('../repositories/services')


class ProductsController{
    constructor(){
        this.productsService = ProductsService
    }

    getProducts = async (req, res) => {
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
    }

    getProduct = async (req, res) => {
    const pid = req.params.pid
    const producto = await this.productsService.getProduct({_id: pid})
    if(producto){
        return res.json(producto)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${pid}`)
    }
}

    createProduct = async (req, res) => {
        const cuerpo = req.body
        const mensaje = await this.productsService.createProduct(cuerpo)
        return res.send(mensaje)
    }

    updateProduct = async (req, res) => {
        const pid = req.params.pid
        const cuerpo = req.body
        const mensaje = await this.productsService.updateProduct({_id: pid}, cuerpo)
        return res.send(mensaje)
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        const mensaje = await this.productsService.deleteProduct({_id: pid})
        return res.send(mensaje)
    }

    generateProduct = () => {
        let productsM = []
        for (let i = 0; i < 100; i++) {
            productsM.puch({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                status: true,
                price: faker.commerce.price(),
                code: `codigo${i}`,
                stock: faker.string.numeric(),
                thumbnail: faker.image.url(),
                id: faker.database.mongodbObjectId()
            })
        }
        return res.send({status: 'sucess', payload: productsM})
    }
}

module.exports = ProductsController