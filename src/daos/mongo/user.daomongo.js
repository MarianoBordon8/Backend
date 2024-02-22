const { usersModel } = require('../../models/users.model')

class UserDaoMongo {
    constructor() {
        this.model = usersModel
    }
    getP = async (limit=10, page=1) => await thism.model.paginate({}, {limit, page, lean: true})

    get = async () => await this.model.find({})
    getBy = async (filter) => await this.model.findOne(filter)
    create = async (newUser) => await this.model.create(newUser)
    update = async (filter, userUpdate) => await this.model.findOneAndUpdate(filter, userUpdate)
    delete = async (filter) => await this.model.findOneAndDelete(filter)

}

exports.UserMongo = UserDaoMongo