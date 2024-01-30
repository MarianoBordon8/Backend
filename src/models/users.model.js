const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const usersCollection = 'users'


const UsersSchema = Schema({
    first_name: {
        type: String,
        index: true,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'user_premium', 'admin'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    age:{
        type: Number,
        required: true
    }
})

UsersSchema.plugin(mongoosePaginate)

UsersSchema.pre('findOne', function(){
    this.populate('carts')
})

const usersModel = model(usersCollection, UsersSchema)

module.exports = {
    usersModel
}