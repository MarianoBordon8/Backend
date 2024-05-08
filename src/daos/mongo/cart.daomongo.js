const { cartModel } = require("../../models/carts.model.js")
const CustomError = require("../../services/errors/CustomError.js")
const { Errors } = require("../../services/errors/enums.js")


class CartDaoMongo {
    constructor() {
        this.model = cartModel
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

    async add(cid, pid) {
        const Cart = await this.getBy({_id: cid})
        const existingProductIndex = Cart.products.findIndex((item) => item.product.equals(pid))
        if (existingProductIndex !== -1) {
            if(Cart.products[existingProductIndex].quantity < Cart.products[existingProductIndex].product.stock){
                Cart.products[existingProductIndex].quantity += 1
            }else{
                logger.info('No podes agregar mas productos')
            }
        } else {
            Cart.products.push({
            product: pid,
            quantity: 1,
            })
        }
        await this.model.updateOne({_id: cid}, Cart)
        return "añadido correctamente"
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