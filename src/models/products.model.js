const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productSchema = new Schema({
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    code:         { type: String, unique: true, required: true },
    status:       { type: Boolean, default: true },
    price:        { type: Number, precision: 2, required: true },
    stock:        { type: Number, required: true },
    thumbnail:    { type: String, lowercase: true, required: true },
    owner:        { type: String, default: 'admin' }
})

productSchema.plugin(mongoosePaginate)
exports.productModel = model('products', productSchema)