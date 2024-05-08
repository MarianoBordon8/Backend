class TicketRepository{
    constructor(dao){
        this.dao =  dao
    }
    getTicket = async (cid) => await this.dao.getBy(cid)
    getTickets = async() => await this.dao.get()
    createTicket = async (newTicket) => await this.dao.create(newTicket)
}

module.exports =  {TicketRepository}