const {Router } = require('express')
const { authorization } = require('../../middleware/authorization.js')
const SessionController = require('../../controllers/session.controller.js')

const router = Router()

const {
    registe,
    login,
    current,
    reestablecer,
    newpassword
} = new SessionController()

router.post('/register', registe)

router.post('/login', login)

router.get('/current', authorization(['ADMIN', 'PREMIUM']), current)

router.post('/reestablecer', reestablecer)

router.post('/newpassword', newpassword)

module.exports = router