const express = require('express')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { Server } = require('socket.io')
const { connectdb, configObject } = require('./config/index.js')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const Approuter = require('./routes/index.js')
const cors = require('cors')
const { MessageMongo } = require('./daos/mongo/message.daomongo.js')
const ProductDaoMongo = require('./daos/mongo/products.daomongo.js')
const { handleError } = require('./middleware/error/handleError.js')
const { addLogger, logger } = require('./utils/logger.js')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')


const app = express()

connectdb()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))
app.use(cors())


app.use(session({
    secret: 'p@l@br@secret@',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(cookieParser())
app.use(addLogger)

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de app',
            description: 'Api Docs'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(Approuter)
app.use(handleError)

const PORT = configObject.PORT
const serverHttp = app.listen(PORT, () => {
    logger.info('funciono')
})

//const serverHttp = () => {
//    const PORT = configObject.PORT
//    return app.listen(PORT, err => {
//        if (err) logger.fatal(err)
//        logger.info('funciono')
//    })
//}
//
//module.exports = {serverHttp}

const io = new Server(serverHttp)

const products = new ProductDaoMongo()
const messages = new MessageMongo()


io.on('connection', async socket => {
    logger.info('nuevo cliente conectado')
    io.emit('cargar-productos', products)

    socket.on('enviar-contenido-producto', async (producto) =>{
        const respuesta = await products.addProduct(producto)
        products = await products.getProducts()
        logger.info(respuesta)
        io.emit('cargar-productos', products)
    })

    socket.on('enviar-id-producto', async (id) =>{
        const res = await products.deleteProduct(parseInt(id))
        products = await products.getProducts()
        logger.info(res)
        io.emit('cargar-productos', products)
    })



    socket.on('message', async (data) => {
        const newMessaegs = await messages.addMessage(data)
        socket.emit('messageLogs', newMessaegs)
    })
})
