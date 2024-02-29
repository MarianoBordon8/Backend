const { Router } = require('express')
const { sendMail } = require('../../utils/sendMail')
//const { sendSms } = require('../../utils/sendSms')
const { faker } = require('@faker-js/faker')
const compression = require('express-compression')



const router = Router()


//router.get('/sendsms', (req, res) => {
//    sendSms(`Bienvenido`, {first_name: 'Mariano', last_name: 'Bordon', phone: '+543837698538'})
//    res.send('SMS enviado')
//})


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

module.exports = router