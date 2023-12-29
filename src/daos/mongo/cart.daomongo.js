const { cartModel } = require("../../models/carts.model.js")

class CartDaoMongo {
    constructor() {
        this.model = cartModel
    }

    async addCart(newCart) {
        try {
            return await this.model.create(newCart)
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
            return await this.model.findOne({_id: cid })
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const Cart = await this.getCartById(cid)
            const newCart = {...Cart._doc}
            const i = newCart.products.findIndex((elm) => elm._id === pid)

            if (i === -1) {
                newCart.products.push({
                    product: pid,
                    quantity: 1
                })
            } else {
                newCart.cart[i].quantity++
            }
            await this.model.updateOne({_id: cid}, newCart)
            return "añadido correctamente"
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProductByCart(cid, pid) {
        try {
            await this.model.updateOne(
                { _id: cid },
                { $pull: {
                    products: { 'product': pid }
                }}
            )
            return "eliminado"
        } catch (error) {
            console.log(error)
        }
    }

    async updateProductByCart(cid, pid, newCantidad) {
        try {
            await this.model.updateOne(
                { _id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': newCantidad } })
            return "actualizado"
        } catch (error) {
            console.log(error)
        }
    }

    async updateCart(cid, data) {
        try {
            await this.model.updateOne(
                { _id: cid},
                { $set: {data} })
            return "actualizado"
        } catch (error) {
            console.log(error)
        }
    }
    async deleteCart(cid) {
        try {
            await this.model.updateOne(
                { _id: cid },
                { $pull: {products}})
            return "actualizado"
        } catch (error) {
            console.log(error)
        }
    }
}

exports.CartMongo = CartDaoMongo