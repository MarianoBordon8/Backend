const { Router } = require('express')
const { sendMail } = require('../../utils/sendMail')
const { faker } = require('@faker-js/faker')
const compression = require('express-compression')
const { logger } = require('../../utils/logger')
const UserDaoMongo = require('../../daos/mongo/user.daomongo')



const router = Router()

router.get('/sendmail', (req, res) => {

    const user = {
        email: 'bordon.marianooscar@gmail.com',
        first_name: 'Mariano',
        last_name: 'Bordon'
    }
    const to      = user.email
    const subject = 'Esto es un mail de prueba'
    const html    = `<div>
        <h2>Bienvenido a prueba de email ${user.first_name} ${user.last_name}</h2>
    </div>`
    sendMail(to, subject, html)



    res.send('mail enviado')
})

const generateProduct= (i) => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        status: true,
        price: faker.commerce.price(),
        code: `codigo${i}`,
        stock: faker.string.numeric(),
        thumbnail: faker.image.url(),
        id: faker.database.mongodbObjectId()
    }
}

const  generateUser= () => {
    let products = []
    let numberOfProducts = parseInt(faker.string.numeric(1, {bannerDigits: ['0']}))
    for (let i = 0; i < numberOfProducts; i++) {
        products.push(generateProduct())
    }
    let user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
        cart: products,
        id: faker.database.mongodbObjectId()
    }
    return user
}

router.get('/users', (req, res) => {
    let users = []
    for (let i = 0; i < 100; i++) {
        users.push(generateUser())
    }
    res.send({
        status: 'success',
        payload: users
    })
})

router.use(compression())
router.get('/compresion', (req, res) =>{
    let string = 'Hola esto es un texto de prueba***'
    for (let i = 0; i < 5e4; i++) {
        string += 'Hola esto es un texto de prueba***'
    }

    res.send(string)
})

router.get('/logger', (req, res) => {
    req.logger.debug('Debug message')
    req.logger.http('HTTP message')
    req.logger.info('Info message')
    req.logger.warn('Warning message')
    req.logger.error('Error message')
    res.send('Logging test completed')
})

const users = new UserDaoMongo()
router.get('/updateuser', async (req, res) => {
    const user = await users.getBy({email: 'bordon.marianooscar@gmail.com'})
    console.log('primer user: ' + user)
    const userupdate = await users.update({email: 'bordon.marianooscar@gmail.com'}, {password: '1234'}, {returnNewDocument: true})
    console.log('user update: ' + userupdate)
    const user2 = await users.getBy({email: 'bordon.marianooscar@gmail.com'})
    console.log('segundo user: ' + user2)

    res.send('llego aqui')
})







module.exports = router