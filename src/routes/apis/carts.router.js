const { Router } = require('express')
const CartsManager = require('../../managers/cartsManager.js')

const router = Router()

const cartServ = new CartsManager()

router.post('/', async (req, res) => {
    const mensaje = await cartServ.addCart()
    res.send(mensaje)
});

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const card = await cartServ.getCartById(cid)
    if(card){
        return res.json(card)
    }else{
        return res.status(400).send(`no se encontro el producto de id ${cid}`)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const respuesta = await cartServ.addProductToCart(cid, pid)
    res.send(respuesta)
})


module.exports = router