const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const usersCollection = 'prueba'

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
    gender: String
})

UsersSchema.plugin(mongoosePaginate)
const usersModel = model(usersCollection, UsersSchema)

module.exports = {
    usersModel
}