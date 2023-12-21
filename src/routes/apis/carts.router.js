const { Router } = require('express')
//const CartsManager = require('../../daos/file/cartsManager.js')
const { CartMongo } = require('../../daos/mongo/cart.daomongo')

const router = Router()

//const cartServ = new CartsManager()
const cart = new CartMongo()

router.post('/', async (req, res) => {
    //const mensaje = await cartServ.addCart()
    const mensaje = await cart.addCart()
    res.send(mensaje)
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    //const card = await cartServ.getCartById(cid)
    const card = await cart.getCartById(cid)
    if(card){
        return res.json(card)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${cid}`)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    //const respuesta = await cartServ.addProductToCart(cid, pid)
    const respuesta = await cart.addProductToCart(cid, pid)
    res.send(respuesta)
})


module.exports = router