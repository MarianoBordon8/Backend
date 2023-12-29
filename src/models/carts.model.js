const { Schema, model } = require('mongoose')

const colleciton = 'carts'

const CartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            }
        }]
    }
})

CartSchema.pre('findOne', function(){
    this.populate('products.product')
})

const cartModel = model(colleciton, CartSchema)

module.exports = { cartModel }