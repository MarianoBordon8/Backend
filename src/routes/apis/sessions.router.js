const {Router } = require('express')
const { authentication } = require('../../middleware/auth.middleware.js')
const { UserMongo } = require('../../daos/mongo/user.daomongo.js')

const router = Router()

const users = new UserMongo()


router.post('/register', async (req, res)=>{
    const { first_name, last_name, email , password } = req.body
    const mensaje = await users.addUsers({first_name, last_name, email , password})

    if (first_name ==='' || password === "" || email === '' ) {
        return res.send('faltan completar campos obligatorios')
    }

    const userFound = await users.getUsersByEmail(email)
    if (userFound) {
        return res.send({status: 'error', error: 'Ya existe el user'})
    }
    const newUser = {
        first_name,
        last_name,
        email,
        password
    }
    const result = await users.addUsers(newUser)
    res.send({
        status: 'success',
        payload: 'usuario creado'
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
    if ( password !== user.password ){
        return res.send('password equivocada')
    }
    if(user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123'){
        req.session.user = {
            role: 'admin'
        }
    }
    req.session.user  = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
    }

    res.redirect('/views/products')
})

router.get('/current', authentication, (req, res) => {
    res.send('info sensible que solo puede ver el admin')
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send({ status: 'error', error: err });
    });
    res.redirect('/');
});


module.exports = router