const express = require('express');
const handlebars = require('express-handlebars')
const productsRouter = require('./routes/apis/products.router.js')
const cartRouter = require('./routes/apis/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const { Server } = require('socket.io')
const ProductManager = require('./managers/ProductManager.js')



const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/views', viewsRouter)

const serverHttp = app.listen(8080, () => {
    console.log('funciono');
});

const socketServer = new Server(serverHttp)

const productsServ = new ProductManager()

socketServer.on('connection', async socket => {
    let products = await productsServ.getProducts()
    console.log('nuevo cliente conectado')

    socketServer.emit('cargar-productos', products)

    socket.on('enviar-contenido-producto', async (producto) =>{
        const respuesta = await productsServ.addProduct(producto)
        products = await productsServ.getProducts()
        console.log(respuesta)
        socketServer.emit('cargar-productos', products)
    })

    socket.on('enviar-id-producto', async (id) =>{
        const res = await productsServ.deleteProduct(parseInt(id))
        products = await productsServ.getProducts()
        console.log(res)
        socketServer.emit('cargar-productos', products)
    })
})