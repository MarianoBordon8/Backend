const { Router } = require('express')
//const CartsManager = require('../../daos/file/cartsManager.js')
const { CartMongo } = require('../../daos/mongo/cart.daomongo')
const { cartModel } = require('../../models/carts.model')

const router = Router()

//const cartServ = new CartsManager()
const cart = new CartMongo()

router.post('/', async (req, res) => {
    //const mensaje = await cartServ.addCart()
    const newCart = req.body
    const mensaje = await cart.addCart(newCart)
    //const mensaje = await cartModel.create(newCart)
    res.send(mensaje)
})

router.get('/:cid', async (req, res) => {
    const {cid} = req.params
    //const card = await cartServ.getCartById(cid)
    const card = await cart.getCartById(cid)
    if(card){
        return res.send({
            status: 'success',
            payload: card
        })
    }else{
        return res.status(400).send(`no se encontro el producto de id ${cid}`)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    //const respuesta = await cartServ.addProductToCart(cid, pid)
    const respuesta = await cart.addProductToCart(cid, pid)
    res.send({
        status: 'success',
        payload: respuesta
    })
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const respuesta = await cart.deleteProductByCart(cid, pid)
    res.send({
        status: 'success',
        payload: respuesta
    })
})

router.put('/:cid', async (req, res) => {
    const {cid} = req.params
    const data = req.body
    const respuesta = await cart.updateCart(cid, data)
    res.send({
        status: 'success',
        payload: respuesta
    })
})

router.put('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const newCantidad = req.body
    const respuesta = await cart.updateProductByCart(cid, pid, newCantidad)
    res.send({
        status: 'success',
        payload: respuesta
    })
})

router.delete('/:cid', async (req, res) => {
    const {cid} = req.params
    const respuesta = await cart.deleteCart(cid)
    res.send({
        status: 'success',
        payload: respuesta
    })
})


module.exports = router