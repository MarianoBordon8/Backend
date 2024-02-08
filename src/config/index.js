const { connect } = require('mongoose')
const { program } = require('commander')



const dotenv = require('dotenv')
const MongoSingleton = require('../utils/mongoSingleton')


const { mode } = program.opts()
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
})

const configObject = {
    PORT: process.env.PORT || 4000,
    mongo_url: process.env.MONGO_URL,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    gh_client_id: '',
    gh_client_secret: ''
}

const connectdb = async () => {
    MongoSingleton.getInstance(process.env.MONGO_URL)
}

module.exports = {
    configObject,
    connectdb
}