const { Router } = require('express')
const productsRouter = require('./apis/products.router.js')
const cartRouter = require('./apis/carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionsRouter = require('./apis/sessions.router.js')
const userRouter = require('./apis/user.router.js')

const router = Router()

router.use('/api/products', productsRouter)
router.use('/api/carts', cartRouter)
router.use('/views', viewsRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api/users', userRouter)

module.exports = router