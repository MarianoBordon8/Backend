const { UserMongo } = require('../daos/mongo/user.daomongo')


class UserController{
    constructor(){
        this.userService = new UserMongo
    }

    getUsers = async (req, res) =>{
        try {
            const users = await this.userService.getUsersPaginate()
            res.send(users)

        } catch (error) {
            console.log(error)
        }
    }

    createUsers = async (req, res) =>{
        try {
            const {first_name, last_name, email} = req.body
            const result = await this.userService.addUsers({first_name,
                last_name,
                email})
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

        const result = await this.userService.deleteUsersById({_id: uid})
        res.status(200).send({
            status: "success",
            payload: result
        })
    }
}

module.exports = UserController