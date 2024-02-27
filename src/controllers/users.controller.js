const { usersService } = require('../repositories/services')


class UserController{
    constructor(){
        this.userService = usersService
    }

    getUsers = async (req, res) =>{
        try {
            const users = await this.userService.getUsers()
            res.send(users)

        } catch (error) {
            console.log(error)
        }
    }

    createUsers = async (req, res) =>{
        try {
            const {first_name, last_name, email} = req.body
            const newUser = {first_name, last_name, email}
            const result = await this.userService.createUsers(newUser)
            res.status(201).send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateUsers = async (req, res) =>{

        const { uid } = req.params
        const userToReplace = req.body
        const result = await this.userService.updateUsers({_id: uid}, userToReplace)
        res.status(201).send({
            status: 'success',
            payload: result
        })
    }

    deleteUsers = async  (req, res)=> {
        const { uid } = req.params

        const result = await this.userService.deleteUsers({_id: uid})
        res.status(200).send({
            status: "success",
            payload: result
        })
    }
}

module.exports = UserController