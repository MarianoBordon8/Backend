const { UserDao, ProductDao, CartDao, TicketDao} = require("../daos/factory.js")
const { UserRepository }  = require('./user.repository.js')
const { ProductRepository }  = require('./product.repository.js')
const { CartRepository }  = require('./cart.repository.js')
const { TicketRepository } = require("./ticket.repository.js")


const usersService = new UserRepository(new UserDao())
const ProductsService = new ProductRepository(new ProductDao())
const cartsService = new CartRepository(new CartDao())
const ticketService = new TicketRepository(new TicketDao())

module.exports = {
    usersService,
    ProductsService,
    cartsService,
    ticketService
}