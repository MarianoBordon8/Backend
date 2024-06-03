const UserDaoMongo = require("../daos/mongo/user.daomongo")
const { cartsService } = require("../repositories/services")
const { createHash, isValidPassword } = require("../utils/hashpassword")
const { createToken, JWT_PRIVATE_KEY } = require("../utils/jwt")
const { logger } = require("../utils/logger")
const { sendMail } = require("../utils/sendMail")
const jwt = require('jsonwebtoken')

class SessionController{
    constructor(){
        this.users = new UserDaoMongo
        this.carts = cartsService
    }
    registe = async (req, res)=>{
        try {
            const { first_name, last_name, email, password, age} = req.body

            if (first_name ==='' || password === "" || email === '' || age === '') {
                req.session.errorMessageRegister = 'faltan completar campos obligatorios'
                return res.redirect('../../views/register')
            }

            const userFound = await this.users.getBy({email: email})
            if (userFound) {
                req.session.errorMessageRegister = 'Ya existe el user'
                return res.redirect('../../views/register')
            }

            const cart = await this.carts.createCart()

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                cart: cart._id
            }
            const result = await this.users.create(newUser)
            req.session.user  = {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
                cart: newUser.cart
            }
            const token = createToken({id: result._id, role: result.role}, '24h')
            res.cookie('token', token, {
                maxAge: 60*60*1000*24,
                httpOnly: true,
            }).redirect('/views/productos')
        } catch (error) {
            logger.error(error)
                next(error)
        }
    }

    login = async (req, res)=>{
        try {
            const {email , password } = req.body
            if (email === '' || password === '') {
                req.session.errorMessageLogin = 'todos los campos son obligatorios'
                return res.redirect('../../views/login')
            }
    
            const user = await this.users.getBy({email: email})
            if ( !user ){
                req.session.errorMessageLogin = 'email no encontrado';
                return res.redirect('../../views/login')
            }
    
            if(!isValidPassword(password, user)) {
                req.session.errorMessageLogin = 'password equivocada';
                return res.redirect('../../views/login')
            }
    
            if(user.email === 'adminCoder@coder.com' && isValidPassword('adminCod3r123', user)){
                req.session.user = {
                    role: 'admin'
                }
                const cambio = await this.users.update({_id: user._id},{role: 'admin'} )
            }
            const token = createToken({id: user._id, role: user.role}, '24h')
            req.session.user  = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                cart: user.cart._id
            }
            res.cookie('token', token, { maxAge: 60*60*1000*24, httpOnly: true,}).redirect('/views/productos')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    current = (req, res) => {
        try {
            res.send({message: 'info sensible que solo puede ver el admin', reqUser: req.session.user})
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    reestablecer = async (req, res) => {
        try {
            const email = req.body.email;
            const user = await this.users.getBy({email: email})
            if(!user){
                req.session.errorMessageLogin = 'Usuario no Encontrado'
                return res.redirect('../../views/login')
            }
            const token = createToken({id: user._id, role: user.role}, '1h')
            const enviar = {
                email: 'bordon.marianooscar@gmail.com',
                first_name: 'Mariano',
                last_name: 'Bordon'
            }
            const to      = enviar.email
            const subject = 'Esto es un mail de prueba'
            const html    = 'http://localhost:8080/views/newpassword'
            sendMail(to, subject, html)
            req.session.token = token
            res.redirect('../../views/miratumail')
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    newpassword = async (req, res)=>{
        let token = req.session.token
        const {password, passwordsegunda} = req.body
        try {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY)
            const user = await this.users.getBy({_id: decoded.id})
            if (password !== passwordsegunda){
                req.session.passworderror = 'Las contraseñas no coinciden'
                return res.redirect('/views/newpassword')
            }
            if(isValidPassword(password, user)) {
                req.session.passworderror = 'No puede usar la misma contraseña que ya tenia';
                return res.redirect('/views/newpassword')
            }
            const result = await this.users.update({_id: decoded.id}, {password: createHash(password)})
            req.session.errorMessageLogin = 'Su contraseña fue cambiada correctamente';
            return res.redirect('/views/login')
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                req.session.errorMessageLogin = 'El tiempo expiro, intenta de nuevo'
                return res.redirect('/views/login')
            } else {
                logger.error('Error al verificar el token:', error)
                req.session.errorMessageLogin = 'Ocurrio un error, intenta de nuevo'
                return res.redirect('/views/login')
            }
        }
    }
}

module.exports = SessionController