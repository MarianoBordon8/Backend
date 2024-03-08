const { usersService } = require('../repositories/services')
const CustomError = require('../services/errors/CustomError')
const { Errors } = require('../services/errors/enums')
const { generateUserErrorInfo } = require('../services/errors/info')
const { logger } = require('../utils/logger')


class UserController{
    constructor(){
        this.userService = usersService
    }

    getUsers = async (req, res) =>{
        try {
            const users = await this.userService.getUsers()
            res.send(users)

        } catch (error) {
            logger.error(error)
        }
    }

    getUsersBy = async (req, res) =>{
        try {
            const users = await this.userService.getUsers()
            res.send(users)

        } catch (error) {
            logger.error(error)
        }
    }

    createUsers = async (req, res, next) =>{
        try {
            const {first_name, last_name, email} = req.body
            const newUser = {first_name, last_name, email}
            if(!first_name || !last_name || !email){
                CustomError.createError({
                    name: 'user reation error',
                    cause: generateUserErrorInfo(newUser),
                    message: 'Error probando la creacion del usuario',
                    code: Errors.INVALID_TYPES
                })
            }
            const result = await this.userService.createUsers(newUser)
            res.status(201).send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            next(error)
        }
    }

    updateUsers = async (req, res, next) =>{
        try {
            const { uid } = req.params
            const {first_name, last_name, email} = req.body
            if(!first_name || !last_name || !email){
                CustomError.createError({
                name: 'user reation error',
                cause: generateUserErrorInfo(newUser),
                message: 'Error probando la creacion del usuario',
                code: Errors.INVALID_TYPES
                })
            }
                const result = await this.userService.updateUsers({_id: uid}, {first_name, last_name, email})
                res.status(201).send({
                    status: 'success',
                    payload: result
            })
        } catch (error) {
            next(error)
        }
    }

    deleteUsers = async  (req, res)=> {
        try {
            const { uid } = req.params
            const result = await this.userService.deleteUsers({_id: uid})
            res.status(200).send({
                status: "success",
                payload: result
            })
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = UserController