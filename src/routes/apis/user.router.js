const { Router } = require('express')
const { authentication } = require('../../middleware/auth.middleware')
const UserController = require('../../controllers/users.controller')

const router = Router()

const {
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    premium
} = new UserController()

router.get('/', getUsers)

router.post('/', createUsers)

router.put('/:uid', updateUsers)

router.delete('/:uid', deleteUsers)

router.post('/premium/:uid', premium)

module.exports = router