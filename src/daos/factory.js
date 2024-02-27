const { configObject } = require('../config/index.js')


let UserDao
let ProductDao
let CartDao


switch (configObject.persistence) {
    case 'MONGO':
        const UserDaoMongo = require('./mongo/user.daomongo.js')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/products.daomongo.js')
        ProductDao = ProductDaoMongo

        const CartDaoMongo = require('./mongo/Cart.daomongo.js')
        CartDao = CartDaoMongo
        break;

    case 'FILE':
        const CartDaoFile = require('./file/cartsManager.js')
        CartDao = CartDaoFile

        const ProductDaoFile = require('./file/ProductManager.js')
        ProductDao = ProductDaoFile
        break

    default:
        break;
}

module.exports = {
    ProductDao,
    UserDao,
    CartDao
}