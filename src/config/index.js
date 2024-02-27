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
    persistence: process.env.PERSISTENCE,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    gh_client_id: '',
    gh_client_secret: '',
    gmail_user_app: process.env.GMAIL_USER_APP,
    gmail_pass_app: process.env.GMAIL_PASS_APP,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_atuh_token: process.env.TWILIO_ATUH_TOKEN,
    twilio_number_phone: process.env.TWILIO_NUMBER_PHONE
}

const connectdb = async () => {
    MongoSingleton.getInstance(process.env.MONGO_URL)
}

module.exports = {
    configObject,
    connectdb
}