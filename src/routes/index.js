const { Router } = require('express')
const productsRouter = require('./apis/products.router.js')
const cartRouter = require('./apis/carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionsRouter = require('./apis/sessions.router.js')
const userRouter = require('./apis/user.router.js')
const pruebasRouter = require('./apis/pruebas.router.js')

const router = Router()

router.use('/api/products', productsRouter)
router.use('/api/carts', cartRouter)
router.use('/views', viewsRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api/users', userRouter)
router.use('/api/pruebas', pruebasRouter)

router.use((err, req, res, next)=> {
    console.log(err)
    res.status(500).send(`Error Server ${err}`)
})

module.exports = router