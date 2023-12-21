const { Schema, model } = require("mongoose")

const cartSchema = new Schema({
    products: { type: Array, default: [] },
    atCreated: { type: Date, default: Date()}
})

exports.cartModel = model('carts', cartSchema)