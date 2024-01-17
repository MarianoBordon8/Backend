const { usersModel } = require('../../models/users.model')

class UserDaoMongo {
    constructor() {
        this.model = usersModel
    }
    getUsersPaginate = async (limit=10, page=1) => await thism.model.paginate({}, {limit, page, lean: true})

    getUsers = async () => await this.model.find({})
    getUserBy = async (filter) => await this.model.findOne(filter)
    getUsersByEmail = async (email) => await this.model.findOne({email: email})
    addUsers = async (newUser) => await this.model.create(newUser)
    updateUsers = async (uid, userUpdate) => await this.model.findOneAndUpdate({_id: uid}, userUpdate)
    deleteUsersById = async (uid) => await this.model.findOneAndDelete({_id: uid})

}

exports.UserMongo = UserDaoMongo