const { usersModel } = require('../../models/users.model')

class UserDaoMongo {
    constructor() {
        this.model = usersModel
    }

    getUsers = async () => {
        try {
            return await this.model.find()
        } catch (error) {
            console.log(error)
        }
    }

    getUsersByEmail = async (email) => {
        try {
            return await this.model.findOne({ email: email})
        } catch (error) {
            console.log(error)
        }
    }

    addUsers = async ({ first_name, last_name, email , password }) => {
        try {
            return await this.model.create({first_name, last_name, email , password})
        } catch (error) {
            console.log(error)
        }
    }

    updateUsers = async (uid, data) => {
        try {
            return await this.model.updateOne({_id: uid}, data)
        } catch (error) {
            console.log(error)
        }
    }

    deleteUsersById = async (uid) => {
        try {
            return await this.model.deleteOne({_id: uid})
        } catch (error) {
            console.log(error)
        }
    }
}

exports.UserMongo = UserDaoMongo