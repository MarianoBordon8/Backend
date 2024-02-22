const { ProductsService } = require('../repositories/services')


class ProductsController{
    constructor(){
        this.productsService = ProductsService
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
    //const producto = await productsServ.getBy(pid)
    const producto = await this.productsService.getBy({_id: pid})
    if(producto){
        return res.json(producto)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${pid}`)
    }
}

    createProduct = async (req, res) => {
        const cuerpo = req.body
        //const mensaje = await productsServ.create(cuerpo)
        const mensaje = await this.productsService.create(cuerpo)
        return res.send(mensaje)
    }

    updateProduct = async (req, res) => {
        const pid = req.params.pid
        const cuerpo = req.body
        //const mensaje = await productsServ.update(pid, cuerpo)
        const mensaje = await this.productsService.update({_id: pid}, cuerpo)
        return res.send(mensaje)
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        //const mensaje = await productsServ.delete(pid)
        const mensaje = await this.productsService.delete({_id: pid})
        return res.send(mensaje)
    }
}

module.exports = ProductsController