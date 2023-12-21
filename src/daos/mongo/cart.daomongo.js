const { cartModel } = require("../../models/carts.model.js")

class CartDaoMongo {
    constructor() {
        this.model = cartModel
    }

    async addCart() {
        try {
            return await this.model.create({})
        } catch (error) {
            console.log(error)
        }
    }

    async getCarts() {
        try {
            return await this.model.find({})
        } catch (error) {
            console.log(error)
        }
    }

    async getCartById( cid ) {
        try {
            return await this.model.findOne({_id: cid})
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const Cart = await this.getCartById(cid)
            const newCart = {...Cart._doc}
            const i = newCart.cart.findIndex((elm) => elm.id === pid)

            if (i === -1) {
                newCart.cart.push({
                    id: pid,
                    quantity: 1
                })
            } else {
                newCart.cart[i].quantity++
            }
            return await this.model.updateOne({_id: cid}, newCart)
        } catch (error) {
            console.log(error)
        }
    }
}

exports.CartMongo = CartDaoMongo