const { Router } = require('express')
const { authentication } = require('../middleware/auth.middleware.js')
const { authorization } = require('../middleware/authorization.js')
const ViewsController = require('../controllers/views.controller.js')

const router = Router()

const {
    register,
    login,
    home,
    realTimeProducts,
    products,
    users,
    carts,
    reestablecer,
    miratuMail,
    newPassword,
    productos,
    newProduct,
    updateProduct,
    deleteProduct,
    carrito,
    premium
} = new ViewsController()

router.get('/register', register)

router.get('/login', login)

router.get('/', home)

router.get('/realtimeproducts',authorization(['PREMIUM']), realTimeProducts)

router.get('/users', authentication, users)

router.get('/carts/:cid', authentication, carts)

router.get('/reestablecer', reestablecer)

router.get('/miratumail', miratuMail)

router.get('/newpassword', newPassword)

router.get('/productos', productos)

router.get('/newproduct', newProduct)

router.get('/update/:pid', updateProduct)

router.get('/delete/:pid', deleteProduct)

router.get('/carrito', carrito)

router.get('/premium', premium)

module.exports = router