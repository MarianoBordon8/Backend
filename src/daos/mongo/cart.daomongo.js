const { cartModel } = require("../../models/carts.model.js")
const { ProductsService } = require("../../repositories/services.js")
const CustomError = require("../../services/errors/CustomError.js")
const { Errors } = require("../../services/errors/enums.js")

class CartDaoMongo {
    constructor() {
        this.model = cartModel
        this.productService = ProductsService
    }

    async create(newCart) {
            return await this.model.create(newCart)
    }

    async gets() {
        return await this.model.find({})
    }

    async getBy( filter ) {
        return await this.model.findOne(filter)
    }

    async addProductToCart(cid, pid) {
        const user = req.session.user
        const producto = this.productService.getProduct({_id: pid})
        if (!user || !user.cart) {
            CustomError.createError({
                name: 'Add product to cart error',
                cause: generateCartErrorInfo(user, cid),
                message: 'Error trying add product to cart',
                code: Errors.DATABASES_ERROR
            })}
        const Cart = await this.getBy({_id: cid})
        const newCart = {...Cart._doc}
        const i = newCart.products.findIndex((elm) => elm._id === pid)
        if(user.email !== producto.owner){
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
        }else{
            return 'no puedes añadir ese producto ya que tu lo creaste'
        }
    }

    async deleteProductByCart(cid, pid) {
        if(!cid || !pid){
            CustomError.createError({
                name: 'Error to remove product from cart',
                cause: generateCartRemoveErrorInfo(cid, pid),
                message: 'Cant remove product from cart',
                code: Errors.DATABASES_ERROR
            })
        }
        await this.model.updateOne(
            { _id: cid },
            { $pull: {
                products: { 'product': pid }
            }}
        )
        return "eliminado"
    }

    async updateProductByCart(cid, pid, newCantidad) {
        await this.model.updateOne(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': newCantidad } })
        return "actualizado"
    }

    async update(cid, data) {
        await this.model.updateOne(
            { _id: cid},
            { $set: {data} })
        return "actualizado"
    }

    async delete(cid) {
        await this.model.updateOne(
            { _id: cid },
            { $pull: {products}})
        return "actualizado"
    }
}

module.exports = CartDaoMongo