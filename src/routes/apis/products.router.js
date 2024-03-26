const { Router } = require('express')
const ProductsController = require('../../controllers/products.controller')
const { authorization } = require('../../middleware/authorization')
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    generateProduct
} = new ProductsController()

const router = Router()


router.get('/', getProducts)

router.post('/', createProduct)

router.get('/:pid', getProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid',authorization(['ADMIN', 'PREMIUM']), deleteProduct)

router.get('/generate/mockingproducts', generateProduct)


module.exports = router