const { Router } = require('express')
const ProductsController = require('../../controllers/products.controller')
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

router.get('/:pid', getProduct)

router.post('/', createProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

router.delete('/mockingproducts', generateProduct)

module.exports = router