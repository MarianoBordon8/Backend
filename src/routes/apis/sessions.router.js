const {Router } = require('express')
const { authentication } = require('../../middleware/auth.middleware.js')
const { UserMongo } = require('../../daos/mongo/user.daomongo.js')
const { createHash, isValidPassword } = require('../../utils/hashpassword.js')
const passport = require('passport')
const { createToken, authenticationToken } = require('../../utils/jwt.js')

const router = Router()

const users = new UserMongo()

//sesion---------------
router.post('/register', async (req, res)=>{
    const { first_name, last_name, email , password } = req.body

    if (first_name ==='' || password === "" || email === '' ) {
        return res.send('faltan completar campos obligatorios')
    }

    const userFound = await users.getUsersByEmail(email)
    console.log(userFound)
    if (userFound) {
        return res.send({status: 'error', error: 'Ya existe el user'})
    }
    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password)
    }
    const result = await users.addUsers(newUser)
    const token = createToken({id: result._id, role: result.role})
    res.send({
        status: 'success',
        payload: 'usuario creado',
        token
    })
})

router.post('/login', async (req, res)=>{
    const {email , password } = req.body
    if (email === '' || password === '') {
        return res.send('todos los campos son obligatorios')
    }

    const user = await users.getUsersByEmail(email)
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

    res.redirect('/views/products')
})

//passport---------------
//router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}),(req, res)=>{
//    res.json({status: 'success', message: 'user created'})
//
//})
//
//router.get('/failregister', (req, res) => {
//    console.log('Fail strategy')
//    res.send({status: 'error', error: 'Fialed'})
//})
//
//router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res)=>{
//    if(!req.user) return res.status(400).send({status: 'error', error: 'invalid credential'})
//    req.session.user = {
//        email: req.user.email,
//        first_name: req.user.first_name
//    }
//    res.send({status: 'success', message: 'login succcess'})
//})
//
//router.get('/faillogin', (req, res) => {
//    res.send({error: 'failed login'})
//})
//
//
//
//
router.get('/current', authenticationToken, (req, res) => {
    res.send('info sensible que solo puede ver el admin')
})
//
//router.get('/logout', (req, res) => {
//    req.session.destroy((err) => {
//        if (err) return res.send({ status: 'error', error: err });
//    });
//    res.redirect('/');
//});


router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),(req, res)=>{
    req.session.user = req.user
    res.redirect('/api/products')
})


module.exports = router