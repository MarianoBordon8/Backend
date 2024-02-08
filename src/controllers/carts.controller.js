const { CartMongo } = require('../daos/mongo/cart.daomongo')
//const CartsManager = require('../../daos/file/cartsManager.js')


class CartController{
    constructor(){
        this.cartsService = new CartMongo()
    }

    getCart = async (req, res) => {
        const {cid} = req.params
        //const card = await cartServ.getCartById(cid)
        const card = await this.cartsService.getCartById(cid)
        if(card){
            return res.send({
                status: 'success',
                payload: card
            })
        }else{
            return res.status(400).send(`no se encontro el producto de id ${cid}`)
        }
    }

    createCart = async (req, res) => {
        //const mensaje = await cartServ.addCart()
        const newCart = req.body
        const mensaje = await this.cartsService.addCart(newCart)
        //const mensaje = await cartModel.create(newCart)
        res.send(mensaje)
    }

    createProductByCart = async (req, res) => {
        const {cid, pid} = req.params
        //const respuesta = await cartServ.addProductToCart(cid, pid)
        const respuesta = await this.cartsService.addProductToCart(cid, pid)
        res.send({
            status: 'success',
            payload: respuesta
        })
    }

    updateCart = async (req, res) => {
        const {cid} = req.params
        const data = req.body
        const respuesta = await this.cartsService.updateCart(cid, data)
        res.send({
            status: 'success',
            payload: respuesta
        })
    }
    
    updateProductByCart = async (req, res) => {
        const {cid, pid} = req.params
        const newCantidad = req.body
        const respuesta = await this.cartsService.updateProductByCart(cid, pid, newCantidad)
        res.send({
            status: 'success',
            payload: respuesta
        })
    }

    deleteCart = async (req, res) => {
        const {cid} = req.params
        const respuesta = await this.cartsService.deleteCart(cid)
        res.send({
            status: 'success',
            payload: respuesta
        })
    }

    deleteProductByCart = async (req, res) => {
        const {cid, pid} = req.params
        const respuesta = await this.cartsService.deleteProductByCart(cid, pid)
        res.send({
            status: 'success',
            payload: respuesta
        })
    }
}

module.exports = CartController