const { messageModel} = require('../../models/messages.model.js')
const { logger } = require('../../utils/logger.js')

class MessageDaoMongo {
    constructor (){
        this.model = messageModel
    }

    async addMessage (newMessage){
        await this.model.create(newMessage)
        return await this.getMessages()
    }

    async getMessages (){
        try {
            return await this.model.find({})
        } catch (error) {
            logger.error(error)
        }
    }
}

exports.MessageMongo = MessageDaoMongo