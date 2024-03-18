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

router.get('/generate/mockingproducts', generateProduct)

router.get('/:pid', getProduct)

router.post('/', createProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid',authorization(['ADMIN', 'PREMIUM']), deleteProduct)


module.exports = router