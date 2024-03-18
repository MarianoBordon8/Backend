const {Router } = require('express')
const { createHash, isValidPassword } = require('../../utils/hashpassword.js')
const passport = require('passport')
const { createToken, JWT_PRIVATE_KEY } = require('../../utils/jwt.js')
const { passportCall } = require('../../utils/passportCall.js')
const UserDaoMongo = require('../../daos/mongo/user.daomongo.js')
const { sendMail } = require('../../utils/sendMail.js')
const { logger } = require('../../utils/logger.js')
const jwt = require('jsonwebtoken')
const { authorization } = require('../../middleware/authorization.js')

const router = Router()

const users = new UserDaoMongo()

router.post('/register', async (req, res)=>{
    const { first_name, last_name, email, password, age} = req.body

    if (first_name ==='' || password === "" || email === '' || age === '') {
        req.session.errorMessageRegister = 'faltan completar campos obligatorios'
        return res.redirect('../../views/register')
    }

    const userFound = await users.getBy({email: email})
    if (userFound) {
        req.session.errorMessageRegister = 'Ya existe el user'
        return res.redirect('../../views/register')
    }
    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        owner: email
    }
    const result = await users.create(newUser)
    const token = createToken({id: result._id, role: result.role}, '24h')
    res.cookie('token', token, {
        maxAge: 60*60*1000*24,
        httpOnly: true,
    }).redirect('/views/products')
})

router.post('/login', async (req, res)=>{
    const {email , password } = req.body
    if (email === '' || password === '') {
        req.session.errorMessageLogin = 'todos los campos son obligatorios'
        return res.redirect('../../views/login')
    }

    const user = await users.getBy({email: email})
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
        const cambio = await users.update({_id: user._id},{role: 'admin'} )
    }
    const token = createToken({id: user._id, role: user.role}, '24h')
    req.session.user  = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
    }
    res.cookie('token', token, { maxAge: 60*60*1000*24, httpOnly: true,}).redirect('/views/products')
})


router.get('/current', authorization(['ADMIN', 'PREMIUM']), (req, res) => {
    res.send({message: 'info sensible que solo puede ver el admin', reqUser: req.user})
})


router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),(req, res)=>{
    req.session.user = req.user
    res.redirect('/api/products')
})

router.post('/reestablecer', async (req, res) => {
    const email = req.body.email;
    const user = await users.getBy({email: email})
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
    res.redirect('../../views/miratumail');
})


router.post('/newpassword', async (req, res)=>{
    let token = req.session.token
    const {password, passwordsegunda} = req.body
    try {
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY)
        const user = await users.getBy({_id: decoded.id})
        if (password !== passwordsegunda){
            req.session.passworderror = 'Las contraseñas no coinciden'
            return res.redirect('/views/newpassword')
        }
        if(isValidPassword(password, user)) {
            req.session.passworderror = 'No puede usar la misma contraseña que ya tenia';
            return res.redirect('/views/newpassword')
        }
        const result = await users.update({_id: decoded.id}, {password: createHash(password)})
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
})

module.exports = router