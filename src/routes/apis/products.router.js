const { Router } = require('express')
//const ProductManager = require('../../daos/file/ProductManager.js')
const { ProductMongo } = require('../../daos/mongo/products.daomongo.js')


const router = Router()
//const productsServ = new ProductManager()
const products = new ProductMongo()


router.get('/', async (req, res) => {
    //const productos = await productsServ.getProducts()
    const productos = await products.getProducts()
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
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    //const producto = await productsServ.getProductById(pid)
    const producto = await products.getProductById(pid)
    if(producto){
        return res.json(producto)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${pid}`)
    }
})

router.post('/', async (req, res) => {
    const cuerpo = req.body
    //const mensaje = await productsServ.addProduct(cuerpo)
    const mensaje = await products.addProduct(cuerpo)
    return res.send(mensaje)
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const cuerpo = req.body
    //const mensaje = await productsServ.updateProduct(pid, cuerpo)
    const mensaje = await products.updateProduct(pid, cuerpo)
    return res.send(mensaje)
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    //const mensaje = await productsServ.deleteProduct(pid)
    const mensaje = await products.deleteProduct(pid)
    return res.send(mensaje)
})

module.exports = router