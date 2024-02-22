const express = require('express')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
//const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')
const { Server } = require('socket.io')
//const ProductManager = require('./daos/file/ProductManager.js')
const { connectdb, configObject } = require('./config/index.js')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const Approuter = require('./routes/index.js')
const cors = require('cors')

const { ProductMongo } = require('./daos/mongo/products.daomongo.js')
const { MessageMongo } = require('./daos/mongo/message.daomongo.js')

const PORT = configObject.PORT
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
//store: MongoStore.create({
    //    mongoUrl: 'mongodb+srv://MarianoBordon:Gabrielito2010.@cluster0.xgzgfd5.mongodb.net/ecommerce?retryWrites=true&w=majority',
    //    mongoOptions: {
        //        useNewUrlParser: true,
        //        useUnifiedTopology: true,
        //    },
        //    ttl: 150000000,
        //}),
    //secret: 'secretCoder',
    //resave: true,
    //saveUninitialized: true
    //}))
    initializePassport()
app.use(passport.initialize())
//app.use(passport.session())

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(cookieParser())

app.use(Approuter)

const serverHttp = app.listen(PORT, () => {
    console.log('funciono')
})

const io = new Server(serverHttp)

//const productsServ = new ProductManager()
const products = new ProductMongo()
const messages = new MessageMongo()


io.on('connection', async socket => {
    //let products = await productsServ.getProducts()
    //let products = await products.getProducts()
    console.log('nuevo cliente conectado')
    io.emit('cargar-productos', products)

    socket.on('enviar-contenido-producto', async (producto) =>{
        //const respuesta = await productsServ.addProduct(producto)
        const respuesta = await products.addProduct(producto)
        //products = await productsServ.getProducts()
        products = await products.getProducts()
        console.log(respuesta)
        io.emit('cargar-productos', products)
    })

    socket.on('enviar-id-producto', async (id) =>{
        //const res = await productsServ.deleteProduct(parseInt(id))
        const res = await products.deleteProduct(parseInt(id))
        //products = await productsServ.getProducts()
        products = await products.getProducts()
        console.log(res)
        io.emit('cargar-productos', products)
    })



    socket.on('message', async (data) => {
        const newMessaegs = await messages.addMessage(data)
        socket.emit('messageLogs', newMessaegs)
    })
})