const { Router } = require('express')
const CartController = require('../../controllers/carts.controller')

const router = Router()

const {
    createProductByCart,
    updateCart,
    updateProductByCart,
    deleteCart,
    deleteProductByCart,
    purchaseCart
} = new CartController()



router.put('/:cid', updateCart)

router.delete('/:cid', deleteCart)

router.post('/:cid/products/:pid', createProductByCart)

router.post('/del/:cid/products/:pid', deleteProductByCart)

router.post('/up/:cid/products/:pid', updateProductByCart)

router.post('/:cid/purchase', purchaseCart)


module.exports = router