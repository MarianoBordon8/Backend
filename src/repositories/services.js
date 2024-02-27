const { UserDao, ProductDao, CartDao} = require("../daos/factory.js")
const { UserRepository }  = require('./user.repository.js')
const { ProductRepository }  = require('./product.repository.js')
const { CartRepository }  = require('./cart.repository.js')
const UserDaoMongo = require("../daos/mongo/user.daomongo.js")


const usersService = new UserRepository(new UserDao())
const ProductsService = new ProductRepository(new ProductDao())
const cartsService = new CartRepository(new CartDao())

module.exports = {
    usersService,
    ProductsService,
    cartsService
}