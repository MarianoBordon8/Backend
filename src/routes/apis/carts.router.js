const { Router } = require('express')
const CartController = require('../../controllers/carts.controller')

const router = Router()

const {
    getCart,
    createCart,
    createProductByCart,
    updateCart,
    updateProductByCart,
    deleteCart,
    deleteProductByCart,
    purchaseCart
} = new CartController()

router.post('/', createCart)

router.get('/:cid', getCart)

router.post('/:cid/products/:pid', createProductByCart)

router.delete('/:cid/products/:pid', deleteProductByCart)

router.put('/:cid', updateCart)

router.put('/:cid/products/:pid', updateProductByCart)

router.delete('/:cid', deleteCart)

.post('/:cid/purchase', purchaseCart)


module.exports = router