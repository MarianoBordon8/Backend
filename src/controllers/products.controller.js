const { ProductMongo } = require('../daos/mongo/products.daomongo')
//const ProductManager = require('../../daos/file/ProductManager.js')

class ProductsController{
    constructor(){
        this.productsService = new ProductMongo()
        //const productsServ = new ProductManager()
    }

    getProducts = async (req, res) => {
        //const productos = await productsServ.getProducts()
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
    //const producto = await productsServ.getProductById(pid)
    const producto = await this.productsService.getProductsById(pid)
    if(producto){
        return res.json(producto)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${pid}`)
    }
}

    createProduct = async (req, res) => {
        const cuerpo = req.body
        //const mensaje = await productsServ.addProduct(cuerpo)
        const mensaje = await this.productsService.addProduct(cuerpo)
        return res.send(mensaje)
    }

    updateProduct = async (req, res) => {
        const pid = req.params.pid
        const cuerpo = req.body
        //const mensaje = await productsServ.updateProduct(pid, cuerpo)
        const mensaje = await this.productsService.updateProduct(pid, cuerpo)
        return res.send(mensaje)
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        //const mensaje = await productsServ.deleteProduct(pid)
        const mensaje = await this.productsService.deleteProduct(pid)
        return res.send(mensaje)
    }
}

module.exports = ProductsController