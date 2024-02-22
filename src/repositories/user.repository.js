const { userDto } = require("../dtos/usersDto")


class UserRepository{
    constructor(dao){
        this.dao =  dao
    }

    getUsers = async () => await this.dao.get()
    createUsers = async (newUser)=> {
        const newUserDto = new userDto(newUser)
        return await this.dao.create(newUser)
    }
    updateUsers = async (filter, data) => await this.dao.update(filter, data)
    deleteUsers = async (filter) => await this.dao.delete(filter)
}

module.exports =  {UserRepository}