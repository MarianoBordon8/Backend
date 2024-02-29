const {Router } = require('express')
const { authentication } = require('../../middleware/auth.middleware.js')
const { createHash, isValidPassword } = require('../../utils/hashpassword.js')
const passport = require('passport')
const { createToken, authenticationToken } = require('../../utils/jwt.js')
const { passportCall } = require('../../utils/passportCall.js')
const { authorizationJwt } = require('../../middleware/jwtPassport.middleware.js')
const UserDaoMongo = require('../../daos/mongo/user.daomongo.js')

const router = Router()

const users = new UserDaoMongo()

router.post('/register', async (req, res)=>{
    const { first_name, last_name, email, password, age} = req.body

    if (first_name ==='' || password === "" || email === '' || age === '') {
        return res.send('faltan completar campos obligatorios')
    }

    const userFound = await users.getBy({email: email})
    if (userFound) {
        return res.send({status: 'error', error: 'Ya existe el user'})
    }
    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age
    }
    const result = await users.create(newUser)
    const token = createToken({id: result._id, role: result.role})
    res.cookie('token', token, {
        maxAge: 60*60*1000*24,
        httpOnly: true,
    }).redirect('/views/products')
})

router.post('/login', async (req, res)=>{
    const {email , password } = req.body
    if (email === '' || password === '') {
        return res.send('todos los campos son obligatorios')
    }

    const user = await users.getBy({email: email})
    if ( !user ){
        return res.send('email equivocado')
    }

    if(!isValidPassword(password, {password: user.password})) {
        return res.send('password equivocada')
    }

    if(user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123'){
        req.session.user = {
            role: 'admin'
        }
    }
    const token = createToken({id: user._id, role: user.role})
    req.session.user  = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
    }

    res.cookie('token', token, { maxAge: 60*60*1000*24, httpOnly: true,}).redirect('/views/products')
})


router.get('/current', passportCall('jwt'), authorizationJwt('admin'), (req, res) => {
    res.send({message: 'info sensible que solo puede ver el admin', reqUser: req.user})
})


router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),(req, res)=>{
    req.session.user = req.user
    res.redirect('/api/products')
})

module.exports = router