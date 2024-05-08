const { ticketModel } = require("../../models/ticket.model")

class TicketDaoMongo{
    constructor() {
        this.model = ticketModel
    }

    create = async (newTicket) => await this.model.create(newTicket)

    getBy = async (filter) => await this.model.findOne(filter)

    get = async () => await this.model.find()
}

module.exports = TicketDaoMongo
