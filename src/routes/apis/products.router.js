const { Router } = require('express')
const ProductsController = require('../../controllers/products.controller')
const { authorization } = require('../../middleware/authorization')
const methodOverride = require('method-override')

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    generateProduct
} = new ProductsController()

const router = Router()
router.use(methodOverride('_method'))


router.get('/', getProducts)

router.post('/', createProduct)

router.get('/:pid', getProduct)

router.post('/upd/:pid', updateProduct)

router.post('/del/:pid', deleteProduct)

router.get('/generate/mockingproducts', generateProduct)


module.exports = router